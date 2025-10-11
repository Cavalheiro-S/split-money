"use client"

import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TransactionService } from "@/services/transaction.service"
import { RecurringTransactionService } from "@/services/recurring-transaction.service"
import { useToast } from "@/hooks/use-toast"

interface BulkDeleteConfirmationModalProps<T = ResponseGetTransactions> {
  selectedIds: string[]
  transactions: T[]
  isOpen: boolean
  onClose: () => void
  onSuccess: () => Promise<void>
}

export function BulkDeleteConfirmationModal<T = ResponseGetTransactions>({
  selectedIds,
  transactions,
  isOpen,
  onClose,
  onSuccess,
}: BulkDeleteConfirmationModalProps<T>) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Função para obter o ID correto (recurrent_transaction_id para transações virtuais)
  const getItemId = (item: T): string => {
    const transaction = item as any; // Type assertion para acessar propriedades opcionais
    return transaction.is_virtual && transaction.recurrent_transaction_id 
      ? transaction.recurrent_transaction_id 
      : transaction.id;
  };

  // Separar transações por tipo baseado nos IDs selecionados
  const getTransactionGroups = () => {
    const recurringIds: string[] = [];
    const regularIds: string[] = [];

    selectedIds.forEach(selectedId => {
      // Encontrar a transação correspondente
      const transaction = transactions.find(t => getItemId(t) === selectedId);
      
      if (transaction) {
        const tx = transaction as any; // Type assertion para acessar propriedades opcionais
        // Se é uma transação virtual ou foi gerada por transação recorrente
        if (tx.is_virtual || tx.is_recurring_generated) {
          recurringIds.push(selectedId);
        } else {
          regularIds.push(selectedId);
        }
      }
    });

    return { recurringIds, regularIds };
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return

    setIsDeleting(true)
    try {
      const { recurringIds, regularIds } = getTransactionGroups();
      let totalSucceeded = 0;
      let totalFailed = 0;
      let totalProcessed = 0;

      // Processar transações recorrentes
      if (recurringIds.length > 0) {
        try {
          const recurringResponse = await RecurringTransactionService.bulkDeleteRecurringTransactions(recurringIds);
          totalSucceeded += recurringResponse.summary.succeeded;
          totalFailed += recurringResponse.summary.failed;
          totalProcessed += recurringResponse.summary.total;
        } catch (error) {
          console.error("Erro ao deletar transações recorrentes:", error);
          totalFailed += recurringIds.length;
          totalProcessed += recurringIds.length;
        }
      }

      // Processar transações regulares
      if (regularIds.length > 0) {
        try {
          const regularResponse = await TransactionService.bulkDeleteTransactions(regularIds);
          totalSucceeded += regularResponse.summary.succeeded;
          totalFailed += regularResponse.summary.failed;
          totalProcessed += regularResponse.summary.total;
        } catch (error) {
          console.error("Erro ao deletar transações regulares:", error);
          totalFailed += regularIds.length;
          totalProcessed += regularIds.length;
        }
      }

      // Mostrar feedback consolidado
      if (totalSucceeded > 0) {
        toast({
          title: "Deleção concluída",
          description: `${totalSucceeded} de ${totalProcessed} transações foram excluídas com sucesso.`,
        })
      }

      if (totalFailed > 0) {
        toast({
          title: "Algumas deleções falharam",
          description: `${totalFailed} transações não puderam ser excluídas. Verifique os detalhes.`,
          variant: "destructive",
        })
      }

      await onSuccess()
      onClose()
    } catch (error) {
      console.error("Erro na deleção em massa:", error)
      toast({
        title: "Erro na deleção",
        description: "Ocorreu um erro ao excluir as transações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getTitle = () => {
    const { recurringIds, regularIds } = getTransactionGroups();
    
    if (recurringIds.length > 0 && regularIds.length > 0) {
      return `Excluir ${selectedIds.length} transações (${recurringIds.length} recorrentes + ${regularIds.length} regulares)?`;
    } else if (recurringIds.length > 0) {
      return `Excluir ${recurringIds.length} transação${recurringIds.length > 1 ? "ões" : ""} recorrente${recurringIds.length > 1 ? "s" : ""}?`;
    } else {
      return `Excluir ${regularIds.length} transação${regularIds.length > 1 ? "ões" : ""}?`;
    }
  };

  const getDescription = () => {
    const { recurringIds, regularIds } = getTransactionGroups();
    
    if (recurringIds.length > 0 && regularIds.length > 0) {
      return `Esta ação irá excluir ${recurringIds.length} transações recorrentes e ${regularIds.length} transações regulares. As transações reais já criadas permanecerão intactas, mas novas transações virtuais não serão mais geradas. Esta ação não pode ser desfeita.`;
    } else if (recurringIds.length > 0) {
      return `Esta ação irá excluir ${recurringIds.length} transação${recurringIds.length > 1 ? "ões" : ""} recorrente${recurringIds.length > 1 ? "s" : ""}. As transações reais já criadas permanecerão intactas, mas novas transações virtuais não serão mais geradas. Esta ação não pode ser desfeita.`;
    } else {
      return `Esta ação irá excluir permanentemente ${regularIds.length} transação${regularIds.length > 1 ? "ões" : ""}. Se alguma transação for a última vinculada a uma transação recorrente, a transação recorrente órfã também será excluída automaticamente. Esta ação não pode ser desfeita.`;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              {getTitle()}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-gray-600 leading-relaxed">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>Atenção:</strong> Esta ação não pode ser desfeita.
          </p>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Excluindo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Excluir
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
