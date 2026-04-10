
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
    categoryId?: string;
    tagId?: string;
}

type ResponseGetTransactions = {
    id: string;
    description: string;
    date: string;
    amount: number;
    note?: string;
    type: "income" | "outcome";
    payment_status?: Omit<PaymentStatus, "updated_at" | "created_at">;
    categories: Category;
    tags: Tag;
    is_virtual?: boolean;
    is_recurring_generated?: boolean;
    recurrent_transaction_id?: string;
}

type RequestUpdateTransaction = RequestCreateTransaction & {
    id: string;
}

type BulkDeleteRequest = {
    ids: string[];
}

type BulkDeleteFailedItem = {
    id: string;
    reason: string;
}

type BulkDeleteSummary = {
    total: number;
    succeeded: number;
    failed: number;
}

type BulkDeleteResults = {
    success: string[];
    failed: BulkDeleteFailedItem[];
}

type BulkDeleteResponse = {
    message: string;
    summary: BulkDeleteSummary;
    results: BulkDeleteResults;
    info?: string;
}

type BulkDeleteRecurringResponse = BulkDeleteResponse & {
    info: string;
}

type BulkCreateTransactionItem = {
    description: string;
    date: string; // ISO YYYY-MM-DD
    amount: number; // signed: negative = outcome, positive = income
    type: "income" | "outcome";
    note?: string;
    categoryId?: string;
    tagId?: string;
    paymentStatusId?: string;
    source: "ofx" | "csv";
    externalId: string;
}

type BulkCreateRequest = {
    transactions: BulkCreateTransactionItem[];
}

type BulkCreateSummary = {
    total: number;
    created: number;
    skipped: number;
    failed: number;
}

type BulkCreateResults = {
    created: { id: string; external_id?: string }[];
    skipped: string[];
    failed: { externalId: string; reason: string }[];
}

type BulkCreateResponse = {
    message: string;
    summary: BulkCreateSummary;
    results: BulkCreateResults;
}