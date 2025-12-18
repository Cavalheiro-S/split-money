"use client";

import { TagService } from "@/services/tag.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./query-keys";

/**
 * Hook para buscar lista de tags
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.lists(),
    queryFn: () => TagService.getTags(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar nova tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestCreateTag) => TagService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.lists(),
      });
      toast.success("Tag criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar tag");
    },
  });
}

/**
 * Hook para atualizar tag existente
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestUpdateTag) => TagService.updateTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.lists(),
      });
      toast.success("Tag atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar tag");
    },
  });
}

/**
 * Hook para deletar tag com optimistic update
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TagService.deleteTag(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tags.lists(),
      });

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.tags.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.tags.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((t: Tag) => t.id !== id),
          };
        }
      );

      return { previousData };
    },
    onError: (error: Error, id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error(error.message || "Erro ao deletar tag");
    },
    onSuccess: () => {
      toast.success("Tag deletada com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tags.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}
