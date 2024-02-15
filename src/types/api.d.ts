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
}

interface TransactionWithUserId extends Transaction {
    userId: string,
}

interface AccessToken {
    access_token: string,
    expiresIn: number
}

interface AccessTokenPayload{
    id: string,
    email: string
    exp: number
}