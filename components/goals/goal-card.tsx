"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteGoal } from "@/hooks/queries";
import { format, differenceInDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GoalForm } from "./goal-form";
import { GoalProgressGauge } from "./goal-progress-gauge";

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteGoal = useDeleteGoal();

  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const daysLeft = differenceInDays(parseISO(goal.deadline), new Date());

  return (
    <>
      <Card className="flex flex-col hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2 flex-1 pr-2">
            {goal.title}
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar meta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso removerá a meta "{goal.title}" e todas as contribuições. Ação irreversível.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteGoal.mutate(goal.id)}
                  >
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-4">
            <GoalProgressGauge currentAmount={goal.currentAmount} targetAmount={goal.targetAmount} />
            <div className="flex flex-col gap-1 text-sm min-w-0">
              <span className="text-muted-foreground text-xs">Economizado</span>
              <span className="font-semibold text-green-600">{brl(goal.currentAmount)}</span>
              <span className="text-muted-foreground text-xs">Faltam</span>
              <span className="font-semibold">{brl(remaining)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
            <span>
              Meta: {brl(goal.targetAmount)}
            </span>
            <span className={daysLeft < 0 ? "text-destructive" : daysLeft < 30 ? "text-amber-500" : ""}>
              {daysLeft < 0
                ? "Prazo vencido"
                : daysLeft === 0
                ? "Vence hoje"
                : `${daysLeft}d restantes`}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Prazo: {format(parseISO(goal.deadline), "dd/MM/yyyy", { locale: ptBR })}
          </div>

          <Link
            href={`/goals/${goal.id}`}
            className="mt-auto flex items-center justify-end text-xs text-primary hover:underline gap-0.5"
          >
            Ver detalhes <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>

      <GoalForm open={editOpen} onOpenChange={setEditOpen} goal={goal} />
    </>
  );
}
