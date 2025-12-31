"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useMemo } from "react";


type DistributionFilter = "category" | "tag" | "payment_status";

interface DistributionChartProps {
  transactions: ResponseGetTransactions[];
  className?: string;
}

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

export function DistributionChart({
  transactions,
  className,
}: DistributionChartProps) {
  const [filter, setFilter] = useState<DistributionFilter>("category");

  const data = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string }> = {};

    transactions.forEach((transaction) => {
      let key: string;
      let name: string;

      switch (filter) {
        case "category":
          key = transaction.categories?.id || "sem-categoria";
          name = transaction.categories?.description || "Sem categoria";
          break;
        case "tag":
          key = transaction.tags?.id || "sem-tag";
          name = transaction.tags?.description || "Sem tag";
          break;
        case "payment_status":
          key = transaction.payment_status?.id || "sem-status";
          name = transaction.payment_status?.description || "Sem status";
          break;
        default:
          return;
      }

      if (!map[key]) {
        map[key] = {
          name,
          value: 0,
          color: COLORS[Object.keys(map).length % COLORS.length],
        };
      }

      map[key].value += transaction.amount;
    });

    const result = Object.values(map);

    if (result.length === 0) {
      return [
        {
          name: "Sem dados",
          value: 0,
          color: COLORS[0],
        },
      ];
    }

    return result;
  }, [transactions, filter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentage = data.map((item) => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
  }));

  const getTitle = () => {
    switch (filter) {
      case "category":
        return "Distribuição por Categoria";
      case "tag":
        return "Distribuição por Tag";
      case "payment_status":
        return "Distribuição por Status";
      default:
        return "Distribuição";
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{getTitle()}</CardTitle>
          <Select value={filter} onValueChange={(value) => setFilter(value as DistributionFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Por Categoria</SelectItem>
              <SelectItem value="tag">Por Tag</SelectItem>
              <SelectItem value="payment_status">Por Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
            />
            <Legend
              formatter={(value) => {
                const item = dataWithPercentage.find((d) => d.name === value);
                return `${value} - ${item?.percentage || "0"}%`;
              }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

