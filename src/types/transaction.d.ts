type ResponseGetTransactions = {
    id: string;
    amount: number;
    description: string;
    date: Date;
    type: TransactionType;
    category: string;
}[]

type RequestCreateTransaction = {
    amount: number;
    category: string;
    description: string;
    date: string;
    type: TransactionType;
}

type RequestUpdateTransaction = RequestCreateTransaction & {
    id: string
}

type ResponseCreateTransaction = {
    id: string
    amount: number
    description: string
    date: Date
    type: TransactionType
    category: string
    userId: string
}

type TransactionType = "income" | "outcome"

type FilterTransaction = Pagination & {
    type?: TransactionType
}