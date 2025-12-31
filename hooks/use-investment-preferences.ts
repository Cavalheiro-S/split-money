import { useState, useEffect } from "react";

const ASSETS_STORAGE_KEY = "split-money:investment-assets";
const INVESTMENT_PERCENTAGE_STORAGE_KEY = "split-money:investment-percentage";

const DEFAULT_ASSETS: Asset[] = [
  { id: "1", name: "FII", percentage: 20, color: "#22c55e" },
  { id: "2", name: "Ação", percentage: 20, color: "#a855f7" },
  { id: "3", name: "Renda Fixa", percentage: 55, color: "#3b82f6" },
  { id: "4", name: "Bitcoin", percentage: 5, color: "#f97316" },
];

export function useInvestmentAssets() {
  const [assets, setAssetsState] = useState<Asset[]>(DEFAULT_ASSETS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = () => {
      try {
        const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
        if (storedAssets) {
          setAssetsState(JSON.parse(storedAssets));
        }
      } catch (error) {
        console.error("Erro ao carregar ativos do localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const setAssets = (newAssets: Asset[]) => {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
      setAssetsState(newAssets);
    } catch (error) {
      console.error("Erro ao salvar ativos no localStorage:", error);
      throw error;
    }
  };

  const resetAssets = () => {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(DEFAULT_ASSETS));
      setAssetsState(DEFAULT_ASSETS);
    } catch (error) {
      console.error("Erro ao resetar ativos:", error);
      throw error;
    }
  };

  return {
    assets,
    setAssets,
    resetAssets,
    isLoading,
  };
}

export function useInvestmentPercentage() {
  const [percentage, setPercentageState] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPercentage = () => {
      try {
        const storedPercentage = localStorage.getItem(INVESTMENT_PERCENTAGE_STORAGE_KEY);
        if (storedPercentage) {
          setPercentageState(parseFloat(storedPercentage));
        }
      } catch (error) {
        console.error("Erro ao carregar porcentagem do localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPercentage();
  }, []);

  const setPercentage = (newPercentage: number) => {
    try {
      localStorage.setItem(INVESTMENT_PERCENTAGE_STORAGE_KEY, newPercentage.toString());
      setPercentageState(newPercentage);
    } catch (error) {
      console.error("Erro ao salvar porcentagem no localStorage:", error);
      throw error;
    }
  };

  return {
    percentage,
    setPercentage,
    isLoading,
  };
}

