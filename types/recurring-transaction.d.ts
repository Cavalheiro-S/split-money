type RecurringTransaction = {
    id: string;
    description: string;
    date: string;
    amount: number;
    type: "income" | "outcome";
    frequency: string;
    quantity: number;
    paymentStatusId?: string;
    categoryId?: string;
    tagId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

type RequestCreateRecurringTransaction = {
    description: string;
    date: Date;
    amount: number;
    type: "income" | "outcome";
    frequency: string;
    quantity: number;
    paymentStatusId?: string;
    categoryId?: string;
    tagId?: string;
}

type RequestUpdateRecurringTransaction = RequestCreateRecurringTransaction & {
    id: string;
}

type ResponseGetRecurringTransactions = {
    id: string;
    description: string;
    date: string;
    amount: number;
    note?: string;
    type: "income" | "outcome";
    frequency: string;
    quantity: number;
    isActive: boolean;
    payment_status?: Omit<PaymentStatus, "updated_at" | "created_at">;
    categories: Category;
    tags: Tag;
    createdAt: string;
    updatedAt: string;
}
