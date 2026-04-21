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
import { useCreateContribution } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive("Valor deve ser positivo"),
  date: z.string().min(1, "Data é obrigatória"),
  note: z.string().optional(),
});

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

type FormValues = z.infer<typeof schema>;

interface ContributionFormProps {
  goalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContributionForm({ goalId, open, onOpenChange }: ContributionFormProps) {
  const createContribution = useCreateContribution();
  const [amountDisplay, setAmountDisplay] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date: format(new Date(), "yyyy-MM-dd") },
  });

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numbersOnly = e.target.value.replace(/\D/g, "");
      if (!numbersOnly) {
        setAmountDisplay("");
        setValue("amount", 0, { shouldValidate: true });
        return;
      }
      const reais = parseInt(numbersOnly, 10) / 100;
      setAmountDisplay(formatBRL(reais));
      setValue("amount", reais, { shouldValidate: true });
    },
    [setValue]
  );

  const handleAmountFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => e.target.select(), 0);
  }, []);

  const onSubmit = async (values: FormValues) => {
    await createContribution.mutateAsync({ goalId, ...values });
    reset({ date: format(new Date(), "yyyy-MM-dd") });
    setAmountDisplay("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Contribuição</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="amount">Valor</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                R$
              </span>
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                className="pl-9"
                value={amountDisplay}
                onChange={handleAmountChange}
                onFocus={handleAmountFocus}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note">Observação (opcional)</Label>
            <Textarea id="note" placeholder="Ex: Bônus de dezembro..." {...register("note")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createContribution.isPending}>
              {createContribution.isPending ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
