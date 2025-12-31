"use client";

import { RecurringTransactionService } from "@/services/recurring-transaction.service";
import {
  TransactionFilters,
  TransactionService,
} from "@/services/transaction.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./query-keys";

/**
 * Hook para buscar lista de transações com paginação e filtros
 */
export function useTransactions(
  pagination: Pagination,
  filters?: TransactionFilters
) {
  return useQuery({
    queryKey: queryKeys.transactions.list({ ...pagination, ...filters }),
    queryFn: () => TransactionService.getTransactions(pagination, filters),
    staleTime: 30 * 1000, // 30 segundos
  });
}

/**
 * Hook para criar nova transação
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestCreateTransaction) =>
      TransactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
      toast.success("Transação criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar transação");
    },
  });
}

/**
 * Hook para atualizar transação existente
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestUpdateTransaction) =>
      TransactionService.updateTransaction(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.detail(variables.id),
      });
      toast.success("Transação atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar transação");
    },
  });
}

/**
 * Hook para deletar transação
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar transação");
    },
    onSuccess: () => {
      toast.success("Transação deletada com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}

/**
 * Hook para deletar transação recorrente
 */
export function useDeleteRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      RecurringTransactionService.deleteRecurringTransaction(id),
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar transação recorrente");
    },
    onSuccess: () => {
      toast.success("Transação recorrente deletada com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}

/**
 * Hook para deletar múltiplas transações
 */
export function useBulkDeleteTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      TransactionService.bulkDeleteTransactions(ids),
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar transações");
    },
    onSuccess: () => {
      toast.success("Transações deletadas com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}

/**
 * Hook para deletar múltiplas transações recorrentes
 */
export function useBulkDeleteRecurringTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      TransactionService.bulkDeleteRecurringTransactions(ids),
    onSuccess: (response) => {
      const { succeeded: successful, failed } = response.summary;
      if (successful > 0) {
        toast.success(
          `${successful} transação(ões) recorrente(s) deletada(s)!`
        );
      }
      if (failed > 0) {
        toast.warning(
          `${failed} transação(ões) recorrente(s) não puderam ser deletadas`
        );
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurringTransactions.lists(),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar transações recorrentes");
    },
  });
}
