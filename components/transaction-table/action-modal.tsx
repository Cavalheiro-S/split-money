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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar" : "Novo"} lançamento</DialogTitle>
          <DialogDescription>
            {`Informe os dados abaixo para ${transaction ? "editar" : "criar"} um lançamento.`}
          </DialogDescription>
        </DialogHeader>
        <div>
          <TransactionForm 
            transaction={transaction}
            onOpenChange={onOpenChange}
            updateData={updateData}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionActionModal;