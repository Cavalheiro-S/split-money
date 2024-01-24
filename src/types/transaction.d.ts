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
    type: "income" | "outcome";
    category: string;
    userId: string;
}[]