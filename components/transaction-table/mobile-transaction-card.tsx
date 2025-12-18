import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DollarSign, Landmark, Clock, Pencil, Trash2 } from "lucide-react";
import { DeleteTransactionConfirmationModal } from "./delete-confirmation-modal";
import { memo } from "react";

interface MobileTransactionCardProps {
  transaction: ResponseGetTransactions;
  onEditClick?: (id: string) => void;
  onDeleteSuccess?: () => Promise<void>;
  loading?: boolean;
}

/**
 * Componente memoizado de card de transação mobile
 * Evita re-renders desnecessários quando props não mudam
 */
const MobileTransactionCard = memo(
  function MobileTransactionCard({
    transaction,
    onEditClick,
    onDeleteSuccess,
    loading,
  }: MobileTransactionCardProps) {
    const renderTypeIcon = (type: "income" | "outcome") => {
      if (type === "income") {
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
        );
      }
      return (
        <div className="p-2 bg-red-100 rounded-full">
          <Landmark className="w-5 h-5 text-red-600" />
        </div>
      );
    };

    return (
      <Card
        className={cn(
          "border-l-4 transition-all duration-200 hover:shadow-md",
          transaction.type === "income"
            ? "border-l-green-500"
            : "border-l-red-500",
          transaction.is_virtual && "opacity-60"
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {renderTypeIcon(transaction.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </h3>
                  {transaction.is_virtual && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <Badge variant="secondary" className="text-xs">
                        Futura
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>
                    {new Date(transaction.date).toLocaleDateString("pt-br")}
                  </span>

                  {transaction.categories && (
                    <Badge variant="outline" className="text-xs">
                      {transaction.categories.description}
                    </Badge>
                  )}

                  {transaction.payment_status && (
                    <Badge
                      variant={
                        transaction.payment_status.description === "Pago"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {transaction.payment_status.description}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={cn(
                  "font-semibold text-lg",
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {transaction.type === "income" ? "+" : "-"}
                {transaction.amount.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  disabled={loading || transaction.is_virtual}
                  onClick={() => onEditClick?.(transaction.id)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                    transaction.is_virtual && "opacity-50 cursor-not-allowed"
                  )}
                  title={
                    transaction.is_virtual
                      ? "Transações virtuais não podem ser editadas"
                      : "Editar transação"
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <DeleteTransactionConfirmationModal
                  transaction={transaction}
                  onDeleteSuccess={onDeleteSuccess}
                  trigger={
                    <Button
                      disabled={loading || transaction.is_virtual}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50",
                        transaction.is_virtual &&
                          "opacity-50 cursor-not-allowed"
                      )}
                      title={
                        transaction.is_virtual
                          ? "Transações virtuais não podem ser excluídas"
                          : "Excluir transação"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    // Re-renderizar apenas se mudou: transaction, loading, ou os callbacks
    return (
      prevProps.transaction.id === nextProps.transaction.id &&
      prevProps.transaction.description === nextProps.transaction.description &&
      prevProps.transaction.amount === nextProps.transaction.amount &&
      prevProps.transaction.date === nextProps.transaction.date &&
      prevProps.transaction.type === nextProps.transaction.type &&
      prevProps.transaction.is_virtual === nextProps.transaction.is_virtual &&
      prevProps.loading === nextProps.loading &&
      prevProps.onEditClick === nextProps.onEditClick &&
      prevProps.onDeleteSuccess === nextProps.onDeleteSuccess
    );
  }
);

export default MobileTransactionCard;
