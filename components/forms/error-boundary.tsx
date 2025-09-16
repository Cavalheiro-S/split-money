"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface FormErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-lg">Erro no formulário</CardTitle>
        <CardDescription>
          Ocorreu um erro ao carregar o formulário. Tente recarregar.
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

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  formName?: string;
}

export const FormErrorBoundary: React.FC<FormErrorBoundaryProps> = ({
  children,
  formName = "formulário",
}) => {
  return (
    <ErrorBoundary
      fallback={FormErrorFallback}
      onError={(error, errorInfo) => {
        console.error(`Form error (${formName}):`, error, errorInfo);
        // Aqui você pode enviar para serviços de monitoramento
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
