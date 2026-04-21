"use client";

import { GoalsService } from "@/services/goals.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "./query-keys";

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.goals.lists(),
    queryFn: () => GoalsService.getGoals().then((r) => r.data),
    staleTime: 30 * 1000,
  });
}

export function useGoalContributions(goalId: string) {
  return useQuery({
    queryKey: queryKeys.goals.contributions(goalId),
    queryFn: () => GoalsService.getContributions(goalId).then((r) => r.data),
    staleTime: 30 * 1000,
    enabled: !!goalId,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalPayload) => GoalsService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.lists() });
      toast.success("Meta criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar meta");
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGoalPayload) => GoalsService.updateGoal(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.detail(variables.id) });
      toast.success("Meta atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar meta");
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => GoalsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.lists() });
      toast.success("Meta deletada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar meta");
    },
  });
}

export function useCreateContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContributionPayload) => GoalsService.createContribution(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.contributions(variables.goalId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.lists() });
      toast.success("Contribuição adicionada!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao adicionar contribuição");
    },
  });
}

export function useDeleteContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, contribId }: { goalId: string; contribId: string }) =>
      GoalsService.deleteContribution(goalId, contribId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.contributions(variables.goalId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.lists() });
      toast.success("Contribuição removida!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover contribuição");
    },
  });
}
