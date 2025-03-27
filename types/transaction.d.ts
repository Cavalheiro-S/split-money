
type Transaction = {
    id: string;
    description: string;
    date: string;
    category: string;
    amount: number;
    type: "income" | "outcome";
    recurrent?: {
        frequency: string;
        quantity: number;
    };
    payment_status?: Omit<PaymentStatus, "updatedAt" | "createdAt">;
}

type RequestCreateTransaction = {
    description: string;
    date: Date;
    category: string;
    amount: number;
    type: "income" | "outcome";
    recurrent?: {
        frequency: string;
        quantity: number;
    };
    paymentStatusId?: string;
}

type RequestUpdateTransaction = RequestCreateTransaction & {
    id: string;
}
