"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionService } from "@/services/transaction.service";
import { DollarSign, Landmark, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteTransactionConfirmationModalProps {
  /** Elemento que vai disparar o modal */
  trigger: React.ReactNode;
  /** Dados da transação a ser excluída */
  transaction: ResponseGetTransactions;
  /** Função chamada após a exclusão bem-sucedida */
  onDeleteSuccess?: () => Promise<void>;
  /** Controla se o modal está aberto externamente */
  open?: boolean;
  /** Função para controlar o estado de abertura externamente */
  onOpenChange?: (open: boolean) => void;
}

export function DeleteTransactionConfirmationModal({
  trigger,
  transaction,
  onDeleteSuccess,
  open,
  onOpenChange,
}: DeleteTransactionConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await TransactionService.deleteTransaction(transaction.id);
      toast.success("Transação excluída com sucesso");
      onOpenChange?.(false);
      await onDeleteSuccess?.();
    } catch (error) {
      toast.error("Erro ao excluir transação");
      console.error("Erro ao excluir transação:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", { 
      style: "currency", 
      currency: "BRL" 
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getTypeIcon = (type: "income" | "outcome") => {
    if (type === "income") {
      return (
        <div className="p-1 bg-green-100 rounded-full w-6 h-6 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-green-500" />
        </div>
      );
    }
    return (
      <div className="p-1 bg-red-100 rounded-full w-6 h-6 flex items-center justify-center">
        <Landmark className="w-4 h-4 text-red-500" />
      </div>
    );
  };

  const getTypeLabel = (type: "income" | "outcome") => {
    return type === "income" ? "Entrada" : "Saída";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Landmark className="w-5 h-5" />
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Você tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Detalhes da transação */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            {getTypeIcon(transaction.type)}
            <div className="flex-1">
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-gray-600">
                {getTypeLabel(transaction.type)} • {formatDate(transaction.date)}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor:</span>
              <span className={`font-medium ${
                transaction.type === "income" ? "text-green-600" : "text-red-600"
              }`}>
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            
            {transaction.categories && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{transaction.categories.description}</span>
              </div>
            )}
            
            {transaction.payment_status && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{transaction.payment_status.description}</span>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
