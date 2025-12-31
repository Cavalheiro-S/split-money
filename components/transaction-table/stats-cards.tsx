import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TransactionFilters } from "@/services/transaction.service";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface StatsCardsProps {
  transactions: ResponseGetTransactions[];
  className?: string;
  onFilterClick?: (filters: Partial<TransactionFilters>) => void;
  activeFilter?: "income" | "outcome" | null;
}

function StatsCards({
  transactions,
  className,
  onFilterClick,
  activeFilter,
}: StatsCardsProps) {
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
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      filterType: "income" as const,
      sign: "+",
    },
    {
      title: "Despesas",
      value: stats.outcome,
      count: stats.outcomeCount,
      icon: ArrowDown,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      filterType: "outcome" as const,
      sign: "",
    },
    {
      title: "Saldo",
      value: balance,
      count: totalTransactions,
      icon: DollarSign,
      color: balance >= 0 ? "text-emerald-600" : "text-rose-600",
      bgColor: balance >= 0 ? "bg-emerald-50" : "bg-rose-50",
      iconColor: balance >= 0 ? "text-emerald-600" : "text-rose-600",
      filterType: null,
      sign: balance >= 0 ? "+" : "",
    },
  ];

  if (totalTransactions === 0) return null;

  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", className)}
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn(
            "border-0 shadow-sm transition-all cursor-pointer hover:shadow-md",
            card.filterType &&
              activeFilter === card.filterType &&
              "ring-2 ring-indigo-500 bg-indigo-50/30",
            card.filterType && "hover:bg-gray-50"
          )}
          onClick={() => {
            if (card.filterType && onFilterClick) {
              if (activeFilter === card.filterType) {
                onFilterClick({ type: undefined });
              } else {
                onFilterClick({ type: card.filterType });
              }
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {card.title}
            </CardTitle>
            <div className={cn("p-1.5 rounded-lg", card.bgColor)}>
              <card.icon className={cn("h-4 w-4", card.iconColor)} />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-1">
              <div
                className={cn(
                  "text-xl font-bold tabular-nums flex items-center gap-1",
                  card.color
                )}
              >
                {card.sign && <span>{card.sign}</span>}
                {card.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsCards;
