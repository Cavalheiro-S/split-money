"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
}

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-50",
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-600" />
              <span className="text-green-600">{change}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricsCardsProps {
  totalIncome: number;
  totalOutcome: number;
  balance: number;
  totalTransactions: number;
  incomeChange?: string;
  outcomeChange?: string;
  className?: string;
}

export function MetricsCards({
  totalIncome,
  totalOutcome,
  balance,
  totalTransactions,
  incomeChange,
  outcomeChange,
  className,
}: MetricsCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <MetricCard
        title="Total de Entradas"
        value={totalIncome.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        change={incomeChange}
        icon={ArrowUp}
        iconColor="text-green-600"
        iconBgColor="bg-green-50 dark:bg-green-950"
      />
      <MetricCard
        title="Total de Saídas"
        value={totalOutcome.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        change={outcomeChange}
        icon={ArrowDown}
        iconColor="text-red-600"
        iconBgColor="bg-red-50 dark:bg-red-950"
      />
      <MetricCard
        title="Saldo"
        value={balance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
        icon={DollarSign}
        iconColor={balance >= 0 ? "text-green-600" : "text-red-600"}
        iconBgColor={balance >= 0 ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"}
      />
      <MetricCard
        title="Total de Transações"
        value={totalTransactions.toString()}
        icon={Receipt}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-50 dark:bg-blue-950"
      />
    </div>
  );
}

