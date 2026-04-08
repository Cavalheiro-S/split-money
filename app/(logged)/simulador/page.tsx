"use client";

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RateUnit = "anual" | "mensal";
type PeriodUnit = "anos" | "meses";

interface FormValues {
  initialValue: number;
  monthlyValue: number;
  rate: number;
  rateUnit: RateUnit;
  period: number;
  periodUnit: PeriodUnit;
}

interface BreakdownEntry {
  period: string;
  invested: number;
  interest: number;
  total: number;
}

interface CalculationResult {
  totalAccumulated: number;
  totalInvested: number;
  totalInterest: number;
  breakdown: BreakdownEntry[];
}

function calculateCompoundInterest(values: FormValues): CalculationResult {
  const { initialValue, monthlyValue, rate, rateUnit, period, periodUnit } = values;

  const totalMonths = periodUnit === "anos" ? period * 12 : period;
  const monthlyRate =
    rateUnit === "anual" ? Math.pow(1 + rate / 100, 1 / 12) - 1 : rate / 100;

  let balance = initialValue;
  let totalInvested = initialValue;
  const breakdown: BreakdownEntry[] = [];

  // Entrada inicial (período 0) — facilita a leitura do gráfico
  breakdown.push({
    period: periodUnit === "anos" ? "Ano 0" : "Mês 0",
    invested: Math.round(initialValue * 100) / 100,
    interest: 0,
    total: Math.round(initialValue * 100) / 100,
  });

  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyValue;
    totalInvested += monthlyValue;

    const isYearMark = month % 12 === 0;
    const isLastMonth = month === totalMonths;

    // Para período em "meses" → cada mês vira um ponto
    // Para período em "anos" → apenas marcos anuais (e o último mês, caso não fechado)
    const shouldRecord =
      periodUnit === "meses" ? true : isYearMark || isLastMonth;

    if (shouldRecord) {
      const label =
        periodUnit === "anos"
          ? isYearMark
            ? `Ano ${month / 12}`
            : `Mês ${month}`
          : `Mês ${month}`;

      breakdown.push({
        period: label,
        invested: Math.round(totalInvested * 100) / 100,
        interest: Math.round((balance - totalInvested) * 100) / 100,
        total: Math.round(balance * 100) / 100,
      });
    }
  }

  return {
    totalAccumulated: balance,
    totalInvested,
    totalInterest: balance - totalInvested,
    breakdown,
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatYAxis(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return String(value);
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-4 py-3 shadow-md text-sm">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [initialValue, setInitialValue] = useState<number>(0);
  const [monthlyValue, setMonthlyValue] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [rateUnit, setRateUnit] = useState<RateUnit>("anual");
  const [period, setPeriod] = useState<number>(0);
  const [periodUnit, setPeriodUnit] = useState<PeriodUnit>("anos");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    const res = calculateCompoundInterest({
      initialValue,
      monthlyValue,
      rate,
      rateUnit,
      period,
      periodUnit,
    });
    setResult(res);
  };

  const handleClear = () => {
    setInitialValue(0);
    setMonthlyValue(0);
    setRate(0);
    setRateUnit("anual");
    setPeriod(0);
    setPeriodUnit("anos");
    setResult(null);
  };

  // Quando há muitos pontos (meses), reduzimos a quantidade de ticks no eixo X
  // para evitar sobreposição.
  const xAxisInterval = result
    ? Math.max(0, Math.floor(result.breakdown.length / 12))
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Formulário ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-xl">
            Simulador de Juros Compostos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valor inicial */}
            <div className="flex flex-col gap-2">
              <Label>Valor inicial</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                  R$
                </span>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  className="rounded-l-none"
                  placeholder="0,00"
                  value={initialValue || ""}
                  onValueChange={(vals) => setInitialValue(vals.floatValue ?? 0)}
                />
              </div>
            </div>

            {/* Valor mensal */}
            <div className="flex flex-col gap-2">
              <Label>Valor mensal</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                  R$
                </span>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  className="rounded-l-none"
                  placeholder="0,00"
                  value={monthlyValue || ""}
                  onValueChange={(vals) => setMonthlyValue(vals.floatValue ?? 0)}
                />
              </div>
            </div>

            {/* Taxa de juros */}
            <div className="flex flex-col gap-2">
              <Label>Taxa de juros</Label>
              <div className="flex gap-2">
                <div className="flex flex-1">
                  <span className="flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                    %
                  </span>
                  <NumericFormat
                    customInput={Input}
                    decimalSeparator=","
                    decimalScale={4}
                    className="rounded-l-none"
                    placeholder="0"
                    value={rate || ""}
                    onValueChange={(vals) => setRate(vals.floatValue ?? 0)}
                  />
                </div>
                <Select value={rateUnit} onValueChange={(v) => setRateUnit(v as RateUnit)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anual">anual</SelectItem>
                    <SelectItem value="mensal">mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Período */}
            <div className="flex flex-col gap-2">
              <Label>Período</Label>
              <div className="flex gap-2">
                <NumericFormat
                  customInput={Input}
                  decimalScale={0}
                  allowNegative={false}
                  className="flex-1"
                  placeholder="0"
                  value={period || ""}
                  onValueChange={(vals) => setPeriod(vals.floatValue ?? 0)}
                />
                <Select value={periodUnit} onValueChange={(v) => setPeriodUnit(v as PeriodUnit)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anos">ano(s)</SelectItem>
                    <SelectItem value="meses">mês(es)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button onClick={handleCalculate}>Calcular</Button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:underline"
              onClick={handleClear}
            >
              Limpar
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── Resultados ── */}
      {result && (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <p className="text-sm opacity-80">Valor total final</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(result.totalAccumulated)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Valor total investido</p>
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(result.totalInvested)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total em juros</p>
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                  {formatCurrency(result.totalInterest)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-primary">Gráfico:</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <LineChart
                  data={result.breakdown}
                  margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    interval={xAxisInterval}
                  />
                  <YAxis
                    tickFormatter={formatYAxis}
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
                    formatter={(value) => (
                      <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total acumulado"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={
                      result.breakdown.length <= 24
                        ? { r: 4, fill: "hsl(var(--primary))" }
                        : false
                    }
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    name="Valor Investido"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    dot={
                      result.breakdown.length <= 24
                        ? { r: 4, fill: "hsl(var(--foreground))" }
                        : false
                    }
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela de evolução */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolução do patrimônio</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Período</th>
                    <th className="text-right py-2 px-4 font-medium text-muted-foreground">Investido</th>
                    <th className="text-right py-2 px-4 font-medium text-muted-foreground">Juros</th>
                    <th className="text-right py-2 pl-4 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((entry) => (
                    <tr key={entry.period} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2 pr-4">{entry.period}</td>
                      <td className="text-right py-2 px-4">{formatCurrency(entry.invested)}</td>
                      <td className="text-right py-2 px-4 text-green-600 dark:text-green-400">
                        {formatCurrency(entry.interest)}
                      </td>
                      <td className="text-right py-2 pl-4 font-medium">{formatCurrency(entry.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
