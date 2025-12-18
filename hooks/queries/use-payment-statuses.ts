"use client";

import { PaymentStatusService } from "@/services/payment-status.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./query-keys";

/**
 * Hook para buscar lista de payment statuses
 */
export function usePaymentStatuses() {
  return useQuery({
    queryKey: queryKeys.paymentStatuses.lists(),
    queryFn: () => PaymentStatusService.getPaymentStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutos - mudam raramente
  });
}

/**
 * Hook para criar novo payment status
 */
export function useCreatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestCreatePaymentStatus) =>
      PaymentStatusService.createPaymentStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentStatuses.lists(),
      });
      toast.success("Status de pagamento criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar status de pagamento");
    },
  });
}

/**
 * Hook para atualizar payment status existente
 */
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestUpdatePaymentStatus) =>
      PaymentStatusService.updatePaymentStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentStatuses.lists(),
      });
      toast.success("Status de pagamento atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar status de pagamento");
    },
  });
}

/**
 * Hook para deletar payment status com optimistic update
 */
export function useDeletePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PaymentStatusService.deletePaymentStatus(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.paymentStatuses.lists(),
      });
      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.paymentStatuses.lists(),
      });
      queryClient.setQueriesData(
        { queryKey: queryKeys.paymentStatuses.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((p: PaymentStatus) => p.id !== id),
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
      toast.error(error.message || "Erro ao deletar status de pagamento");
    },
    onSuccess: () => {
      toast.success("Status de pagamento deletado com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.paymentStatuses.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}
