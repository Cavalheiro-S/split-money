"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface GoalCumulativeChartProps {
  contributions: GoalContribution[];
  targetAmount: number;
}

export function GoalCumulativeChart({ contributions, targetAmount }: GoalCumulativeChartProps) {
  if (contributions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Nenhuma contribuição ainda. Adicione a primeira!
      </div>
    );
  }

  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date));
  let cumulative = 0;
  const data = sorted.map((c) => {
    cumulative += Number(c.amount);
    return {
      date: format(parseISO(c.date), "dd/MM/yy", { locale: ptBR }),
      total: cumulative,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11 }}
          width={52}
        />
        <Tooltip
          formatter={(value: number) => [brl(value), "Acumulado"]}
          contentStyle={{ fontSize: 12 }}
        />
        <ReferenceLine
          y={targetAmount}
          stroke="#10b981"
          strokeDasharray="4 4"
          label={{ value: "Meta", position: "right", fontSize: 11, fill: "#10b981" }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#goalGradient)"
          dot={{ r: 3, fill: "#3b82f6" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
