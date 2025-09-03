import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "../forms/transaction-form";

interface TransactionTableActionModalProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  transaction?: ResponseGetTransactions;
  updateData?: () => Promise<void>;
}

function TransactionActionModal({ trigger, transaction, open, onOpenChange, updateData }: TransactionTableActionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-center sm:text-left">
            {transaction ? "Editar" : "Novo"} lançamento
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground text-center sm:text-left">
            {`Informe os dados abaixo para ${transaction ? "editar" : "criar"} um lançamento.`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <TransactionForm 
            transaction={transaction}
            onOpenChange={onOpenChange}
            updateData={updateData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionActionModal;