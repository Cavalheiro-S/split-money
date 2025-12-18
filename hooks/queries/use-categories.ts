"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";
import { queryKeys } from "./query-keys";
import { toast } from "sonner";

/**
 * Hook para buscar lista de categorias
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => CategoryService.getCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutos - categorias mudam raramente
  });
}

/**
 * Hook para criar nova categoria
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestCreateCategory) =>
      CategoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.lists(),
      });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar categoria");
    },
  });
}

/**
 * Hook para atualizar categoria existente
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestUpdateCategory) =>
      CategoryService.updateCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.lists(),
      });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar categoria");
    },
  });
}

/**
 * Hook para deletar categoria com optimistic update
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.deleteCategory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.categories.lists(),
      });
      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.categories.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.categories.lists() },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((c: Category) => c.id !== id),
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
      toast.error(error.message || "Erro ao deletar categoria");
    },
    onSuccess: () => {
      toast.success("Categoria deletada com sucesso!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactions.lists(),
      });
    },
  });
}
