import { TransactionFrequencyEnum } from "@/enums/transaction";

type Transaction = {
    id: string;
    description: string;
    date: string;
    category: string;
    amount: number;
    type: "income" | "outcome";
    recurrent?: {
        frequency: TransactionFrequencyEnum;
        quantity: number;
    };
}