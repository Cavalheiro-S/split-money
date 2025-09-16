"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, TrendingUp } from "lucide-react";

interface DashboardErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const DashboardErrorFallback: React.FC<DashboardErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg">Erro no dashboard</CardTitle>
          <CardDescription>
            Não foi possível carregar os dados do dashboard. Tente recarregar.
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
      
      {/* Placeholder para manter layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Carregando...
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Dados indisponíveis
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
}

export const DashboardErrorBoundary: React.FC<DashboardErrorBoundaryProps> = ({
  children,
}) => {
  return (
    <ErrorBoundary
      fallback={DashboardErrorFallback}
      onError={(error, errorInfo) => {
        console.error("Dashboard error:", error, errorInfo);
        // Aqui você pode enviar para serviços de monitoramento
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
