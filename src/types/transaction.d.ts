type RequestGetTransactions = {
    userId: string
    page: number
    count: number
}

type ResponseGetTransactions = {
    id: string;
    amount: number;
    description: string;
    date: Date;
    type: TransactionType;
    category: string;
    userId: string;
}[]

type RequestCreateTransaction = {
    amount: number;
    category: string;
    description: string;
    date: string;
    type: TransactionType;
    userId: string;
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