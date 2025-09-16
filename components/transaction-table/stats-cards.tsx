import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface StatsCardsProps {
    transactions: ResponseGetTransactions[];
    className?: string;
}

function StatsCards({ transactions, className }: StatsCardsProps) {
    const stats = transactions.reduce(
        (acc, transaction) => {
            if (transaction.type === "income") {
                acc.income += transaction.amount;
                acc.incomeCount += 1;
            } else {
                acc.outcome += transaction.amount;
                acc.outcomeCount += 1;
            }
            return acc;
        },
        { income: 0, outcome: 0, incomeCount: 0, outcomeCount: 0 }
    );

    const balance = stats.income - stats.outcome;
    const totalTransactions = stats.incomeCount + stats.outcomeCount;

    const cards = [
        {
            title: "Receitas",
            value: stats.income,
            count: stats.incomeCount,
            icon: ArrowUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Despesas",
            value: stats.outcome,
            count: stats.outcomeCount,
            icon: ArrowDown,
            color: "text-red-600",
            bgColor: "bg-red-50",
            iconColor: "text-red-600",
        },
        {
            title: "Saldo",
            value: balance,
            count: totalTransactions,
            icon: DollarSign,
            color: balance >= 0 ? "text-green-600" : "text-red-600",
            bgColor: balance >= 0 ? "bg-green-50" : "bg-red-50",
            iconColor: balance >= 0 ? "text-green-600" : "text-red-600",
        },
    ];

    if (totalTransactions === 0) return null;

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", className)}>
            {cards.map((card) => (
                <Card key={card.title} className="border-0 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {card.title}
                        </CardTitle>
                        <div className={cn("p-2 rounded-full", card.bgColor)}>
                            <card.icon className={cn("h-4 w-4", card.iconColor)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <div className={cn("text-2xl font-bold", card.color)}>
                                {card.value.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {card.count} {card.count === 1 ? "transação" : "transações"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default StatsCards;
