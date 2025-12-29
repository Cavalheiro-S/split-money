"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSalary } from "@/hooks/use-salary";
import { useInvestmentAssets, useInvestmentPercentage } from "@/hooks/use-investment-preferences";
import { TrendingUp, Trash2, Plus, Calculator, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, PieLabelRenderProps } from "recharts";
import { toast } from "sonner";

export default function InvestmentStrategyPage() {
  const { salary: userSalary, isLoading: isSalaryLoading } = useSalary();
  const { percentage: investmentPercentage, isLoading: isPercentageLoading } = useInvestmentPercentage();
  const { assets, setAssets, resetAssets, isLoading: isAssetsLoading } = useInvestmentAssets();
  
  const isLoading = isSalaryLoading || isPercentageLoading || isAssetsLoading;
  
  const [totalInvestment, setTotalInvestment] = useState<string>("0");
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetPercentage, setNewAssetPercentage] = useState("");

  const totalPercentage = assets.reduce((sum, asset) => sum + asset.percentage, 0);

  const handleAddAsset = () => {
    if (!newAssetName || !newAssetPercentage) return;

    const percentage = parseFloat(newAssetPercentage);
    if (isNaN(percentage) || percentage <= 0) return;

    const colors = ["#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];
    const usedColors = assets.map(a => a.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || colors[0];

    const newAsset: Asset = {
      id: Date.now().toString(),
      name: newAssetName,
      percentage,
      color: availableColor,
    };

    const updatedAssets = [...assets, newAsset];
    setAssets(updatedAssets);
    setNewAssetName("");
    setNewAssetPercentage("");
    toast.success("Ativo adicionado com sucesso!");
  };

  const handleRemoveAsset = (id: string) => {
    const updatedAssets = assets.filter(asset => asset.id !== id);
    setAssets(updatedAssets);
    toast.success("Ativo removido com sucesso!");
  };

  const handlePercentageChange = (id: string, value: string) => {
    const percentage = parseFloat(value);
    if (isNaN(percentage)) return;

    const updatedAssets = assets.map(asset =>
      asset.id === id ? { ...asset, percentage } : asset
    );
    setAssets(updatedAssets);
  };

  const handleResetAssets = () => {
    resetAssets();
    toast.success("Ativos resetados para o padrão!");
  };

  const handleUseSalary = () => {
    if (userSalary && investmentPercentage) {
      const calculatedValue = (userSalary * investmentPercentage) / 100;
      setTotalInvestment(calculatedValue.toFixed(2));
      toast.success("Valor calculado com base no salário!");
    }
  };

  const calculateDistribution = (): AssetDistribution[] => {
    const investment = parseFloat(totalInvestment) || 0;
    return assets.map(asset => ({
      name: asset.name,
      value: (investment * asset.percentage) / 100,
      percentage: asset.percentage,
      color: asset.color,
    }));
  };

  const distribution = calculateDistribution();


  useEffect(() => {
    if (userSalary && investmentPercentage) {
      const calculatedValue = (userSalary * investmentPercentage) / 100;
      setTotalInvestment(calculatedValue.toFixed(2));
    }
  }, [userSalary, investmentPercentage]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center w-full gap-10 px-4 md:px-10 bg-gray-100 py-10">
        <div className="flex flex-col gap-10 w-full max-w-7xl bg-white p-5 rounded-lg shadow-sm">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center w-full gap-10 px-4 md:px-10 bg-gray-100 py-10">
      <div className="flex flex-col gap-10 w-full max-w-7xl bg-white p-5 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-10 h-10 text-green-600" />
          <div className="flex flex-col">
            <h3 className="font-semibold text-2xl">Estratégia de Investimento</h3>
            <span className="text-sm text-muted-foreground">
              Defina sua alocação de ativos e calcule a distribuição do seu investimento
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Asset Allocation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <CardTitle>Alocação de Ativos</CardTitle>
              </div>
              <CardDescription>Defina os tipos de ativos e suas porcentagens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Asset List */}
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="flex-1 font-medium">{asset.name}</span>
                  <Input
                    type="number"
                    value={asset.percentage}
                    onChange={(e) => handlePercentageChange(asset.id, e.target.value)}
                    className="w-20 text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAsset(asset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}

              {/* Total */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="font-semibold">Total</span>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    totalPercentage === 100
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {totalPercentage}%
                </div>
              </div>

              {/* Add New Asset */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Adicionar novo ativo</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetAssets}
                    className="text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Resetar
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do ativo"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="%"
                    value={newAssetPercentage}
                    onChange={(e) => setNewAssetPercentage(e.target.value)}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                  <Button onClick={handleAddAsset} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Calculator */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <CardTitle>Calculadora de Distribuição</CardTitle>
              </div>
              <CardDescription>Informe o valor total para calcular a distribuição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investment">Valor do Investimento</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="investment"
                      type="number"
                      value={totalInvestment}
                      onChange={(e) => setTotalInvestment(e.target.value)}
                      className="pl-10"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {userSalary !== null && (
                    <Button
                      variant="outline"
                      onClick={handleUseSalary}
                      className="whitespace-nowrap"
                    >
                      Usar Salário
                    </Button>
                  )}
                </div>
                {(userSalary === null || investmentPercentage === null) && (
                  <p className="text-xs text-muted-foreground">
                    Configure seu salário e porcentagem de investimento em Preferências para usar o botão &quot;Usar Salário&quot;
                  </p>
                )}
                {userSalary !== null && investmentPercentage !== null && (
                  <p className="text-xs text-green-600">
                    Valor calculado: {investmentPercentage}% de R$ {userSalary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} = R$ {((userSalary * investmentPercentage) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              {/* Distribution Results */}
              {distribution.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Distribuição por Ativo</h4>
                  {distribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Visualização da Alocação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={assets}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const asset = assets.find(a => a.name === props.name);
                    return `${props.name}: ${asset?.percentage || 0}%`;
                  }}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {assets.map((asset) => (
                    <Cell key={asset.id} fill={asset.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) => `${value || 0}%`}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value: string) => value}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

