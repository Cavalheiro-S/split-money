"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GoalCard } from "@/components/goals/goal-card";
import { GoalForm } from "@/components/goals/goal-form";
import { useGoals } from "@/hooks/queries";
import { Target, Plus } from "lucide-react";
import { useState } from "react";

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Minhas Metas</h1>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Nova Meta
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : !goals || goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <Target className="h-12 w-12 opacity-30" />
          <p className="text-sm">Nenhuma meta criada ainda.</p>
          <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
            Criar primeira meta
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      <GoalForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
