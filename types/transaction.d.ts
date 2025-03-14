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

type RequestCreateTransaction = {
    description: string;
    date: Date;
    category: string;
    amount: number;
    type: "income" | "outcome";
    recurrent?: {
        frequency: TransactionFrequencyEnum;
        quantity: number;
    };
}

type RequestUpdateTransaction = RequestCreateTransaction & {
    id: string;
}
