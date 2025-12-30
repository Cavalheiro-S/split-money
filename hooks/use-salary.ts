import { useState, useEffect } from "react";

const SALARY_STORAGE_KEY = "split-money:salary";

export function useSalary() {
  const [salary, setSalaryState] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar salário do localStorage na montagem
    const loadSalary = () => {
      try {
        const storedSalary = localStorage.getItem(SALARY_STORAGE_KEY);
        if (storedSalary) {
          setSalaryState(parseFloat(storedSalary));
        }
      } catch (error) {
        console.error("Erro ao carregar salário do localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalary();
  }, []);

  const setSalary = (newSalary: number) => {
    try {
      localStorage.setItem(SALARY_STORAGE_KEY, newSalary.toString());
      setSalaryState(newSalary);
    } catch (error) {
      console.error("Erro ao salvar salário no localStorage:", error);
      throw error;
    }
  };

  const clearSalary = () => {
    try {
      localStorage.removeItem(SALARY_STORAGE_KEY);
      setSalaryState(null);
    } catch (error) {
      console.error("Erro ao remover salário do localStorage:", error);
      throw error;
    }
  };

  return {
    salary,
    setSalary,
    clearSalary,
    isLoading,
  };
}

