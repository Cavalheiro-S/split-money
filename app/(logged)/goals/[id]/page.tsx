"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContributionForm } from "@/components/goals/contribution-form";
import { ContributionList } from "@/components/goals/contribution-list";
import { GoalCumulativeChart } from "@/components/goals/goal-cumulative-chart";
import { GoalForm } from "@/components/goals/goal-form";
import { GoalStatsCards } from "@/components/goals/goal-stats-cards";
import { GoalProgressGauge } from "@/components/goals/goal-progress-gauge";
import { useGoalContributions, useGoals } from "@/hooks/queries";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: contributions = [], isLoading: contribLoading } = useGoalContributions(id);

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const goal = useMemo(() => goals?.find((g) => g.id === id), [goals, id]);

  if (goalsLoading || contribLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground p-6">
        <p>Meta não encontrada.</p>
        <Link href="/goals">
          <Button variant="outline" size="sm">
            Voltar para metas
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/goals">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold truncate">{goal.title}</h1>
          {goal.description && (
            <p className="text-sm text-muted-foreground">{goal.description}</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="h-3.5 w-3.5 mr-1" />
          Editar
        </Button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: chart + contributions */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Evolução das contribuições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GoalCumulativeChart contributions={contributions} targetAmount={goal.targetAmount} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Histórico de contribuições
              </CardTitle>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <ContributionList goalId={goal.id} contributions={contributions} />
            </CardContent>
          </Card>
        </div>

        {/* Right: stats */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-3">
              <GoalProgressGauge
                currentAmount={goal.currentAmount}
                targetAmount={goal.targetAmount}
              />
              <div className="text-center text-xs text-muted-foreground">
                <div className="font-medium text-sm text-foreground">
                  Prazo: {format(parseISO(goal.deadline), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>
            </CardContent>
          </Card>

          <GoalStatsCards goal={goal} contributions={contributions} />

          <Button onClick={() => setAddOpen(true)} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Adicionar contribuição
          </Button>
        </div>
      </div>

      <GoalForm open={editOpen} onOpenChange={setEditOpen} goal={goal} />
      <ContributionForm goalId={goal.id} open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
