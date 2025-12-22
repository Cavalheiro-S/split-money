"use client";
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/queries";
import { type TransactionFilters } from "@/services/transaction.service";
import { useState } from "react";

export default function Page() {
  const [modalTransactionOpen, setModalTransactionOpen] = useState(false);
  const [transactionSelected, setTransactionSelected] = useState<
    ResponseGetTransactions | undefined
  >(undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  const [filters, setFilters] = useState<TransactionFilters>({
    date: date,
    type: undefined,
    sort: {
      sortBy: "date",
      sortOrder: "desc",
    },
  });

  const { data: transactionsData, isLoading: loading } = useTransactions(
    pagination,
    filters
  );

  const transactions = transactionsData?.data || [];
  const paginationData = transactionsData?.pagination || pagination;

  const handleEdit = (id: string) => {
    setModalTransactionOpen(true);
    const transaction = id
      ? transactions.find((transaction) => transaction.id === id)
      : undefined;
    setTransactionSelected(transaction);
  };

  const handleDeleteSuccess = async () => {
    setSelectedIds([]);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const totalAmount = transactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc - item.amount;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen col-start-2 gap-6">
      <TableTransaction.Container>
        <TableTransaction.Header
          title="Transações"
          subtitle="Gerencie seus lançamentos financeiros"
          totalTransactions={transactions.length}
          totalAmount={totalAmount}
          onChangeDate={(date) => {
            setFilters({ ...filters, date });
            setPagination({ ...pagination, page: 1 });
            setDate(date);
          }}
        >
          <TableTransaction.ActionModal
            transaction={transactionSelected}
            open={modalTransactionOpen}
            onOpenChange={(open) => {
              if (!open) {
                setTransactionSelected(undefined);
              }
              setModalTransactionOpen(open);
            }}
            trigger={
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Adicionar Transação
              </Button>
            }
          />
        </TableTransaction.Header>

        <TableTransaction.StatsCards transactions={transactions} />

        <TableTransaction.BulkActionsBar
          selectedIds={selectedIds}
          transactions={transactions}
          onClearSelection={handleClearSelection}
          onDeleteSuccess={handleDeleteSuccess}
        />

        <TableTransaction.Table
          hasActions
          onEditClick={handleEdit}
          data={transactions}
          loading={loading}
          onDeleteSuccess={handleDeleteSuccess}
          onChangeFilters={(newFilters) => {
            setPagination({ ...pagination, page: 1 });
            setFilters(newFilters);
          }}
          filters={filters}
          showSearch={true}
          enableBulkSelection={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        <TableTransaction.Pagination
          page={paginationData.page}
          totalPages={paginationData.totalPages}
          limit={paginationData.limit}
          totalItems={paginationData.total}
          onChange={(page) => {
            setPagination({ ...paginationData, page });
          }}
          onChangeLimit={(limit) => {
            setPagination({ ...paginationData, limit, page: 1 });
          }}
          filteredDataLength={transactions.length}
          showAlways
        />
      </TableTransaction.Container>
    </div>
  );
}
