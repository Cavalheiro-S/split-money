
import { TransactionCard } from "./_components/transaction-card";

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen col-start-2 gap-4 px-10 mt-10">
            <TransactionCard
                type="income"
                title="Últimos Lançamentos" />
            <TransactionCard
                type="outcome"
                title="Últimas Despesas" />
        </div>
    )
}