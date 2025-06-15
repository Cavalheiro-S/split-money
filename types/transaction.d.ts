
type Transaction = {
    id: string;
    description: string;
    date: string;
    amount: number;
    type: "income" | "outcome";
    recurrent?: {
        frequency: string;
        quantity: number;
    };
    payment_status?: Omit<PaymentStatus, "updated_at" | "created_at">;
}

type RequestCreateTransaction = {
    description: string;
    date: Date;
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
