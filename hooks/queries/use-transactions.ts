"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TransactionService,
  TransactionFilters,
} from "@/services/transaction.service";
import { queryKeys } from "./query-keys";
import { toast } from "sonner";

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
 * Hook para deletar transação com optimistic update
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TransactionService.deleteTransaction(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.transactions.lists(),
      });
      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.transactions.lists(),
      });
      queryClient.setQueriesData(
        { queryKey: queryKeys.transactions.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((t: ResponseGetTransactions) => t.id !== id),
          };
        }
      );

      return { previousData };
    },
    onError: (error: Error, _, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
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
 * Hook para deletar múltiplas transações
 */
export function useBulkDeleteTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      TransactionService.bulkDeleteTransactions(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.transactions.lists(),
      });

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.transactions.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.transactions.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter(
              (t: ResponseGetTransactions) => !ids.includes(t.id)
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (error: Error, ids, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error(error.message || "Erro ao deletar transações");
    },
    onSuccess: (response) => {
      const { succeeded: successful, failed } = response.summary;
      if (successful > 0) {
        toast.success(`${successful} transação(ões) deletada(s) com sucesso!`);
      }
      if (failed > 0) {
        toast.warning(`${failed} transação(ões) não puderam ser deletadas`);
      }
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
      // Invalida ambas as listas
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
