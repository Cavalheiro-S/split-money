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
import { useDeleteContribution } from "@/hooks/queries";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface ContributionListProps {
  goalId: string;
  contributions: GoalContribution[];
}

export function ContributionList({ goalId, contributions }: ContributionListProps) {
  const deleteContribution = useDeleteContribution();

  if (contributions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Nenhuma contribuição ainda.
      </p>
    );
  }

  const sorted = [...contributions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="divide-y">
      {sorted.map((c) => (
        <div key={c.id} className="flex items-center justify-between py-3 gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium text-green-600">
              +{brl(c.amount)}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(parseISO(c.date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
            {c.note && (
              <span className="text-xs text-muted-foreground truncate">{c.note}</span>
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover contribuição</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso removerá a contribuição de {brl(c.amount)} do dia{" "}
                  {format(parseISO(c.date), "dd/MM/yyyy", { locale: ptBR })}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => deleteContribution.mutate({ goalId, contribId: c.id })}
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
}
