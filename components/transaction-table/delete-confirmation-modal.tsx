"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  useDeleteRecurringTransaction,
  useDeleteTransaction,
} from "@/hooks/queries";
import { errorLogger } from "@/lib/error-logger";
import { DollarSign, Landmark, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteTransactionConfirmationModalProps {
  trigger: React.ReactNode;
  transaction: ResponseGetTransactions;
  onDeleteSuccess?: () => Promise<void>;
  open?: boolean;
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
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();
  const { mutateAsync: deleteRecurringTransaction } =
    useDeleteRecurringTransaction();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (transaction.is_virtual && transaction.recurrent_transaction_id) {
        await deleteRecurringTransaction(transaction.recurrent_transaction_id);
      } else {
        await deleteTransaction(transaction.id);
      }
      await onDeleteSuccess?.();
      onOpenChange?.(false);
    } catch (error) {
      errorLogger.logAPIError(
        error as Error,
        `/${transaction.is_virtual ? "recurring-transaction" : "transaction"}/${transaction.id}`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getTypeIcon = (type: "income" | "outcome") => {
    if (type === "income") {
      return (
        <div className="p-1 bg-green-100 rounded-full w-6 h-6 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    return (
      <div className="p-1 bg-red-100 rounded-full w-6 h-6 flex items-center justify-center">
        <Landmark className="w-4 h-4 text-red-600" />
      </div>
    );
  };

  const getTypeLabel = (type: "income" | "outcome") => {
    return type === "income" ? "Entrada" : "Saída";
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Landmark className="w-5 h-5" />
            Confirmar exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Você tem certeza que deseja excluir esta transação? Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            {getTypeIcon(transaction.type)}
            <div className="flex-1">
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-xs text-gray-600">
                {getTypeLabel(transaction.type)} •{" "}
                {formatDate(transaction.date)}
              </p>
            </div>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor:</span>
              <span
                className={`font-medium ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            {transaction.categories && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">
                  {transaction.categories.description}
                </span>
              </div>
            )}

            {transaction.payment_status && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">
                  {transaction.payment_status.description}
                </span>
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
