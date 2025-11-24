"use client";
import { TableTransaction } from "@/components/transaction-table";
import { Button } from "@/components/ui/button";
import {
  type TransactionFilters,
  TransactionService,
} from "@/services/transaction.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [transactions, setTransactions] = useState<ResponseGetTransactions[]>(
    []
  );
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

  const [loading, setLoading] = useState(true);

  const getTransactions = async (
    pagination: Pagination,
    filters: TransactionFilters
  ) => {
    try {
      setLoading(true);
      const data = await TransactionService.getTransactions(
        pagination,
        filters
      );
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Falha ao buscar transações");
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    setModalTransactionOpen(true);
    const transaction = id
      ? transactions.find((transaction) => transaction.id === id)
      : undefined;
    setTransactionSelected(transaction);
  };

  const handleDeleteSuccess = async () => {
    await getTransactions(pagination, filters);
    setSelectedIds([]);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  useEffect(() => {
    getTransactions(pagination, filters);
  }, []);

  useEffect(() => {
    if (!modalTransactionOpen) {
      setTransactionSelected(undefined);
    }
  }, [modalTransactionOpen]);

  const totalAmount = transactions.reduce((acc, item) => {
    return item.type === "income" ? acc + item.amount : acc - item.amount;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen col-start-2 gap-6 px-6 lg:px-10 mt-6 lg:mt-10 bg-gray-50 py-6 lg:py-10">
      <TableTransaction.Container>
        <TableTransaction.Header
          title="Transações"
          subtitle="Gerencie seus lançamentos financeiros"
          totalTransactions={transactions.length}
          totalAmount={totalAmount}
          onChangeDate={(date) => {
            const newFilters = { ...filters, date };
            const newPagination = { ...pagination, page: 1 };
            getTransactions(newPagination, newFilters);
            setPagination(newPagination);
            setDate(date);
          }}
        >
          <TableTransaction.ActionModal
            transaction={transactionSelected}
            open={modalTransactionOpen}
            onOpenChange={(open) => setModalTransactionOpen(open)}
            updateData={() => getTransactions(pagination, filters)}
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
          onChangeFilters={(filters) => {
            const newPagination = { ...pagination, page: 1 };
            setPagination(newPagination);
            setFilters(filters);
            getTransactions(newPagination, filters);
          }}
          filters={filters}
          showSearch={true}
          enableBulkSelection={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
        <TableTransaction.Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          totalItems={pagination.total}
          onChange={(page) => {
            const newPagination = { ...pagination, page };
            setPagination(newPagination);
            getTransactions(newPagination, filters);
          }}
          onChangeLimit={(limit) => {
            const newPagination = { ...pagination, limit };
            setPagination(newPagination);
            getTransactions(newPagination, filters);
          }}
          filteredDataLength={transactions.length}
          showAlways
        />
      </TableTransaction.Container>
    </div>
  );
}
