type Transaction = {
    id: string;
    description: string;
    recurrent: boolean;
    date: string;
    category: string;
    amount: number;
    type: "income" | "outcome";
}