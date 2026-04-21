"use client";

import { Card, CardContent } from "@/components/ui/card";
import { addMonths, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, Wallet, CalendarClock, CheckCircle2 } from "lucide-react";

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

function getProjectedDate(
  contributions: { date: string; amount: number }[],
  remaining: number
): string | null {
  if (contributions.length === 0 || remaining <= 0) return null;

  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = parseISO(sorted[0].date);
  const lastDate = parseISO(sorted[sorted.length - 1].date);
  const totalAmount = sorted.reduce((sum, c) => sum + c.amount, 0);

  const monthsDiff =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (lastDate.getMonth() - firstDate.getMonth()) || 1;

  const avgPerMonth = totalAmount / monthsDiff;
  if (avgPerMonth <= 0) return null;

  const monthsNeeded = Math.ceil(remaining / avgPerMonth);
  return format(addMonths(new Date(), monthsNeeded), "MMM yyyy", { locale: ptBR });
}

interface GoalStatsCardsProps {
  goal: Goal;
  contributions: { date: string; amount: number }[];
}

export function GoalStatsCards({ goal, contributions }: GoalStatsCardsProps) {
  const pct = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const projectedDate = getProjectedDate(contributions, remaining);

  const stats = [
    {
      label: "Economizado",
      value: brl(goal.currentAmount),
      icon: Wallet,
      color: "text-green-600",
    },
    {
      label: "Faltam",
      value: brl(remaining),
      icon: TrendingUp,
      color: "text-amber-500",
    },
    {
      label: "Progresso",
      value: `${Math.round(pct)}%`,
      icon: CheckCircle2,
      color: pct >= 100 ? "text-green-600" : "text-primary",
    },
    {
      label: "Previsão de conclusão",
      value: projectedDate ?? "—",
      icon: CalendarClock,
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="p-4 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              {label}
            </div>
            <span className={`text-base font-semibold ${color}`}>{value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
