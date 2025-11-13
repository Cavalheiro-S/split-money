"use client";

import { TableTransaction } from "@/components/transaction-table";
import { TransactionService } from "@/services/transaction.service";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [incomes, setIncomes] = useState<ResponseGetTransactions[]>([]);
  const [outcomes, setOutcomes] = useState<ResponseGetTransactions[]>([]);
  const [loadingIncome, setLoadingIncome] = useState(false);
  const [loadingOutcome, setLoadingOutcome] = useState(false);
  const [dateIncome, setDateIncome] = useState<Date>(new Date());
  const [dateOutcome, setDateOutcome] = useState<Date>(new Date());
  const [paginationIncome, setPaginationIncome] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });
  const [paginationOutcome, setPaginationOutcome] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const getIncomes = useCallback(
    async (paginationIncome: Pagination, dateIncome: Date) => {
      try {
        setLoadingIncome(true);
        const data = await TransactionService.getTransactions(
          paginationIncome,
          {
            date: dateIncome,
            type: "income",
          }
        );
        setIncomes(data.data);
        setPaginationIncome(data.pagination);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoadingIncome(false);
      }
    },
    []
  );

  const getOutcomes = useCallback(
    async (paginationOutcome: Pagination, dateOutcome: Date) => {
      try {
        setLoadingOutcome(true);
        const data = await TransactionService.getTransactions(
          paginationOutcome,
          {
            date: dateOutcome,
            type: "outcome",
          }
        );
        setOutcomes(data.data);
        setPaginationOutcome(data.pagination);
      } catch (error) {
        console.log({ error });
      } finally {
        setLoadingOutcome(false);
      }
    },
    []
  );

  useEffect(() => {
    getIncomes(paginationIncome, dateIncome);
  }, []);

  useEffect(() => {
    getOutcomes(paginationOutcome, dateOutcome);
  }, []);

  return (
    <>
      <TableTransaction.Container>
        <TableTransaction.Header
          onChangeDate={(date) => {
            getIncomes(paginationIncome, date);
            setDateIncome(date);
          }}
          title="Últimos lançamentos"
          subtitle="Aqui você pode ver os seus lançamentos recentes"
        />
        <TableTransaction.Table loading={loadingIncome} data={incomes} />
        <TableTransaction.Pagination
          page={paginationIncome.page}
          totalPages={paginationIncome.totalPages}
          limit={paginationIncome.limit}
          totalItems={paginationIncome.total}
          onChange={(page) => {
            const newPagination = { ...paginationIncome, page };
            getIncomes(newPagination, dateIncome);
          }}
          onChangeLimit={(limit) => {
            const newPagination = { ...paginationIncome, limit };
            getIncomes(newPagination, dateIncome);
          }}
          filteredDataLength={incomes.length}
          showAlways
        />
      </TableTransaction.Container>

      <TableTransaction.Container>
        <TableTransaction.Header
          onChangeDate={(date) => {
            getOutcomes(paginationOutcome, date);
            setDateOutcome(date);
          }}
          type="outcome"
          title="Últimas despesas"
          subtitle="Aqui você pode ver os suas despesas recentes"
        />
        <TableTransaction.Table loading={loadingOutcome} data={outcomes} />
        <TableTransaction.Pagination
          page={paginationOutcome.page}
          totalPages={paginationOutcome.totalPages}
          limit={paginationOutcome.limit}
          totalItems={paginationOutcome.total}
          onChange={(page) => {
            const newPagination = { ...paginationOutcome, page };
            getOutcomes(newPagination, dateOutcome);
          }}
          onChangeLimit={(limit) => {
            const newPagination = { ...paginationOutcome, limit };
            getOutcomes(newPagination, dateOutcome);
          }}
          filteredDataLength={outcomes.length}
          showAlways
        />
      </TableTransaction.Container>
    </>
  );
}
