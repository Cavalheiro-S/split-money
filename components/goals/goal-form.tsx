"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateGoal, useUpdateGoal } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100),
  description: z.string().optional(),
  targetAmount: z.number().positive("Valor deve ser positivo"),
  deadline: z.string().min(1, "Data limite é obrigatória"),
});

type FormValues = z.infer<typeof schema>;

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function GoalForm({ open, onOpenChange, goal }: GoalFormProps) {
  const isEditing = !!goal;
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const [amountDisplay, setAmountDisplay] = useState<string>(
    goal ? formatBRL(goal.targetAmount) : ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: goal
      ? {
          title: goal.title,
          description: goal.description ?? "",
          targetAmount: goal.targetAmount,
          deadline: goal.deadline,
        }
      : undefined,
  });

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numbersOnly = e.target.value.replace(/\D/g, "");
      if (!numbersOnly) {
        setAmountDisplay("");
        setValue("targetAmount", 0, { shouldValidate: true });
        return;
      }
      const reais = parseInt(numbersOnly, 10) / 100;
      setAmountDisplay(formatBRL(reais));
      setValue("targetAmount", reais, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAmountFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => e.target.select(), 0);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (isEditing) {
      await updateGoal.mutateAsync({ id: goal.id, ...values });
    } else {
      await createGoal.mutateAsync(values);
    }
    reset();
    setAmountDisplay("");
    onOpenChange(false);
  };

  const isPending = createGoal.isPending || updateGoal.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Meta" : "Nova Meta"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ex: Carro novo" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea id="description" placeholder="Detalhes da meta..." {...register("description")} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="targetAmount">Valor alvo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                R$
              </span>
              <Input
                id="targetAmount"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                className="pl-9"
                value={amountDisplay}
                onChange={handleAmountChange}
                onFocus={handleAmountFocus}
              />
            </div>
            {errors.targetAmount && (
              <p className="text-xs text-destructive">{errors.targetAmount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="deadline">Data limite</Label>
            <Input id="deadline" type="date" {...register("deadline")} />
            {errors.deadline && (
              <p className="text-xs text-destructive">{errors.deadline.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
