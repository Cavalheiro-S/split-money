interface ApiBase<T> {
    data?: T,
    error?: string,
    message?: string,
    statusCode?: number,
    codeError?: string
}

interface Pagination{
    count: number,
    page: number
}

interface User {
    id: string,
    name?: string,
    email: string,
    password?: string,
    loginMethod: string,
    balance: number,
}

interface Transaction {
    id?: string,
    amount: number,
    description: string,
    date: Date,
    type: "income" | "outcome",
    category: string,
    userId?: string
}

interface TransactionWithUserId extends Transaction {
    userId: string,
}