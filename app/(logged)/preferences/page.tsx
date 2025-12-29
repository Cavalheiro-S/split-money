"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalary } from "@/hooks/use-salary";
import { useInvestmentPercentage } from "@/hooks/use-investment-preferences";
import { Settings, DollarSign, Check, Loader2, Percent, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  salary: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Salário deve ser um número válido"),
  investmentPercentage: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Porcentagem deve estar entre 0 e 100"),
});

type FormValues = z.infer<typeof formSchema>;

export default function PreferencesPage() {
  const { salary, setSalary, isLoading: isSalaryLoading } = useSalary();
  const { percentage, setPercentage, isLoading: isPercentageLoading } = useInvestmentPercentage();
  const [isSaving, setIsSaving] = useState(false);
  const [calculatedInvestment, setCalculatedInvestment] = useState<number>(0);

  const isLoading = isSalaryLoading || isPercentageLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: "",
      investmentPercentage: "",
    },
  });

  useEffect(() => {
    if (salary !== null || percentage !== null) {
      form.reset({ 
        salary: salary?.toString() || "",
        investmentPercentage: percentage?.toString() || "30",
      });
    }
  }, [salary, percentage, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const salaryValue = parseFloat(value.salary || "0");
      const percentageValue = parseFloat(value.investmentPercentage || "0");
      setCalculatedInvestment((salaryValue * percentageValue) / 100);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSave = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const newSalary = parseFloat(data.salary);
      const newPercentage = parseFloat(data.investmentPercentage);
      
      setSalary(newSalary);
      setPercentage(newPercentage);
      
      toast.success("Preferências atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar preferências:", error);
      toast.error("Erro ao atualizar preferências");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center w-full gap-10 px-4 md:px-10 bg-gray-100 py-10">
        <div className="flex flex-col gap-10 w-full max-w-4xl bg-white p-5 rounded-lg shadow-sm">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center w-full gap-10 px-4 md:px-10 bg-gray-100 py-10">
      <div className="flex flex-col gap-10 w-full max-w-4xl bg-white p-5 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Settings className="w-10 h-10 text-blue-600" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Preferências</h3>
            <span className="text-sm text-muted-foreground">
              Configure suas preferências e informações financeiras
            </span>
          </div>
        </div>

        {/* Financial Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <CardTitle>Dados Financeiros</CardTitle>
            </div>
            <CardDescription>
              Informe seu salário e a porcentagem que deseja investir mensalmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              {/* Salary Input */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Salário Mensal
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register("salary")}
                    className="pl-10"
                    placeholder="7.500,00"
                  />
                </div>
                {form.formState.errors.salary && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.salary.message}
                  </p>
                )}
              </div>

              {/* Investment Percentage Input */}
              <div className="space-y-2">
                <Label htmlFor="investmentPercentage" className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Porcentagem para Investir
                </Label>
                <div className="relative">
                  <Input
                    id="investmentPercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...form.register("investmentPercentage")}
                    className="pr-8"
                    placeholder="30,00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                {form.formState.errors.investmentPercentage && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.investmentPercentage.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Preferências
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle>Resumo</CardTitle>
            </div>
            <CardDescription>
              Visualize o valor calculado para investimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Salário informado</span>
              <span className="text-lg font-semibold">
                R$ {(salary || 0).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Porcentagem</span>
              <span className="text-lg font-semibold">
                {(percentage || 0).toFixed(2)}%
              </span>
            </div>

            <div className="h-px bg-border" />

            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-green-900">Valor para Investir</span>
              <span className="text-2xl font-bold text-green-700">
                R$ {calculatedInvestment.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Este valor será utilizado na calculadora de distribuição da página de Estratégia quando você clicar em &quot;Usar valor do salário&quot;.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

