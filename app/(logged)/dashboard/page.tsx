"use client";

import { TableTransaction } from "@/components/transaction-table";
import { useTransactions } from "@/hooks/queries";
import { useState } from "react";

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

  return (
    <>
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
    </>
  );
}
