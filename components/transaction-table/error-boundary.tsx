"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface TransactionTableErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const TransactionTableErrorFallback: React.FC<TransactionTableErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-lg">Erro na tabela de transações</CardTitle>
        <CardDescription>
          Não foi possível carregar as transações. Tente recarregar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.env.NODE_ENV === "development" && (
          <details className="rounded-md bg-gray-50 p-3">
            <summary className="cursor-pointer text-sm font-medium text-gray-700">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}
        
        <Button onClick={resetError} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
};

interface TransactionTableErrorBoundaryProps {
  children: React.ReactNode;
}

export const TransactionTableErrorBoundary: React.FC<TransactionTableErrorBoundaryProps> = ({
  children,
}) => {
  return (
    <ErrorBoundary
      fallback={TransactionTableErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Transaction table error:", error, errorInfo);
        // Aqui você pode enviar para serviços de monitoramento
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
