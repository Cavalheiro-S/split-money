"use client";

import { TableTransaction } from "@/components/transaction-table";
import { useTransactions } from "@/hooks/queries";
import { useState, useMemo } from "react";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { EvolutionChart } from "@/components/dashboard/evolution-chart";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { subMonths, format } from "date-fns";

export default function Page() {
  const [dateIncome, setDateIncome] = useState<Date>(new Date());
  const [dateOutcome, setDateOutcome] = useState<Date>(new Date());
  const [paginationIncome, setPaginationIncome] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [paginationOutcome, setPaginationOutcome] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });

  const { data: incomesData, isLoading: loadingIncome } = useTransactions(
    paginationIncome,
    {
      date: dateIncome,
      type: "income",
    }
  );

  const { data: outcomesData, isLoading: loadingOutcome } = useTransactions(
    paginationOutcome,
    {
      date: dateOutcome,
      type: "outcome",
    }
  );

  const incomes = incomesData?.data || [];
  const incomePagination = incomesData?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  };

  const outcomes = outcomesData?.data || [];
  const outcomePagination = outcomesData?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  };

  const metrics = useMemo(() => {
    const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
    const totalOutcome = outcomes.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalOutcome;
    const totalTransactions = incomes.length + outcomes.length;
    
    return {
      totalIncome,
      totalOutcome,
      balance,
      totalTransactions,
    };
  }, [incomes, outcomes]);

  const evolutionData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    const incomeByMonth: Record<string, number> = {};
    const outcomeByMonth: Record<string, number> = {};
    
    incomes.forEach((t) => {
      const monthKey = format(new Date(t.date), "yyyy-MM");
      incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + t.amount;
    });
    
    outcomes.forEach((t) => {
      const monthKey = format(new Date(t.date), "yyyy-MM");
      outcomeByMonth[monthKey] = (outcomeByMonth[monthKey] || 0) + t.amount;
    });
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthKey = format(monthDate, "yyyy-MM");
      months.push({
        month: monthKey,
        income: incomeByMonth[monthKey] || 0,
        outcome: outcomeByMonth[monthKey] || 0,
      });
    }
    
    return months;
  }, [incomes, outcomes]);

  const allTransactions = useMemo(() => {
    return [...incomes, ...outcomes];
  }, [incomes, outcomes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Acompanhe suas entradas e saídas
        </p>
      </div>

      {/* Cards de Métricas */}
      <MetricsCards
        totalIncome={metrics.totalIncome}
        totalOutcome={metrics.totalOutcome}
        balance={metrics.balance}
        totalTransactions={metrics.totalTransactions}
      />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EvolutionChart data={evolutionData} />
        <DistributionChart transactions={allTransactions} />
      </div>

      {/* Tabelas de Transações */}
      <TableTransaction.Container>
        <TableTransaction.Header
          onChangeDate={(date) => {
            setDateIncome(date);
            setPaginationIncome({ ...paginationIncome, page: 1 });
          }}
          title="Últimos lançamentos"
          subtitle="Aqui você pode ver os seus lançamentos recentes"
        />
        <TableTransaction.Table loading={loadingIncome} data={incomes} />
        <TableTransaction.Pagination
          page={incomePagination.page}
          totalPages={incomePagination.totalPages}
          limit={incomePagination.limit}
          totalItems={incomePagination.total}
          onChange={(page) => {
            setPaginationIncome({ ...paginationIncome, page });
          }}
          onChangeLimit={(limit) => {
            setPaginationIncome({ ...paginationIncome, limit, page: 1 });
          }}
          filteredDataLength={incomes.length}
          showAlways
        />
      </TableTransaction.Container>

      <TableTransaction.Container>
        <TableTransaction.Header
          onChangeDate={(date) => {
            setDateOutcome(date);
            setPaginationOutcome({ ...paginationOutcome, page: 1 });
          }}
          type="outcome"
          title="Últimas despesas"
          subtitle="Aqui você pode ver os suas despesas recentes"
        />
        <TableTransaction.Table loading={loadingOutcome} data={outcomes} />
        <TableTransaction.Pagination
          page={outcomePagination.page}
          totalPages={outcomePagination.totalPages}
          limit={outcomePagination.limit}
          totalItems={outcomePagination.total}
          onChange={(page) => {
            setPaginationOutcome({ ...paginationOutcome, page });
          }}
          onChangeLimit={(limit) => {
            setPaginationOutcome({ ...paginationOutcome, limit, page: 1 });
          }}
          filteredDataLength={outcomes.length}
          showAlways
        />
      </TableTransaction.Container>
    </div>
  );
}
