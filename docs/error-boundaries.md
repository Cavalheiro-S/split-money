# Sistema de Error Boundaries - Split Money

Este documento explica como usar o sistema de error boundaries implementado na aplicação Split Money.

## Visão Geral

O sistema de error boundaries foi criado para capturar e tratar erros de forma elegante, proporcionando uma melhor experiência do usuário e facilitando o debug em desenvolvimento.

## Componentes Principais

### 1. ErrorBoundary Principal (`components/error-boundary.tsx`)

Componente base que captura erros em toda a árvore de componentes React.

```tsx
import { ErrorBoundaryWrapper } from "@/components/error-boundary";

function MyComponent() {
  return (
    <ErrorBoundaryWrapper>
      <SomeComponentThatMightError />
    </ErrorBoundaryWrapper>
  );
}
```

### 2. Error Boundaries Específicos

#### TransactionTableErrorBoundary
Para erros na tabela de transações:

```tsx
import { TransactionTableErrorBoundary } from "@/components/transaction-table/error-boundary";

<TransactionTableErrorBoundary>
  <TransactionTable />
</TransactionTableErrorBoundary>
```

#### FormErrorBoundary
Para erros em formulários:

```tsx
import { FormErrorBoundary } from "@/components/forms/error-boundary";

<FormErrorBoundary formName="transaction-form">
  <TransactionForm />
</FormErrorBoundary>
```

#### DashboardErrorBoundary
Para erros no dashboard:

```tsx
import { DashboardErrorBoundary } from "@/components/dashboard/error-boundary";

<DashboardErrorBoundary>
  <Dashboard />
</DashboardErrorBoundary>
```

## Arquivos de Erro por Rota

### 1. `app/error.tsx` - Erro Global
Captura erros em toda a aplicação.

### 2. `app/(logged)/error.tsx` - Erro na Área Logada
Captura erros específicos da área protegida.

### 3. `app/(auth)/error.tsx` - Erro na Autenticação
Captura erros durante o processo de autenticação.

### 4. `app/not-found.tsx` - Página Não Encontrada
Página para rotas que não existem.

## Sistema de Logging

### ErrorLogger (`lib/error-logger.ts`)

Sistema centralizado de logging de erros com categorização:

```tsx
import { errorLogger } from "@/lib/error-logger";

// Log de erro de UI
errorLogger.logUIError(error, errorInfo);

// Log de erro de API
errorLogger.logAPIError(error, endpoint);

// Log de erro de autenticação
errorLogger.logAuthError(error);

// Log de erro de dados
errorLogger.logDataError(error, operation);

// Log de erro de rede
errorLogger.logNetworkError(error, url);
```

### Hook useErrorHandler (`hooks/use-error-handler.ts`)

Hook para tratamento de erros com toast automático:

```tsx
import { useErrorHandler } from "@/hooks/use-error-handler";

function MyComponent() {
  const { handleError, handleAPIError } = useErrorHandler();

  const handleAsyncOperation = async () => {
    try {
      await someAsyncOperation();
    } catch (error) {
      handleAPIError(error, '/api/endpoint');
    }
  };
}
```

## Configuração

### Configuração do ErrorLogger

```tsx
// lib/error-logger.ts
export const errorLogger = new ErrorLogger({
  enableConsoleLog: process.env.NODE_ENV === 'development',
  enableRemoteLogging: process.env.NODE_ENV === 'production',
  enableUserTracking: true,
  enableSessionTracking: true,
  remoteEndpoint: 'https://your-logging-service.com/api/errors',
});
```

## Boas Práticas

### 1. Uso em Layouts
Sempre envolva layouts principais com error boundaries:

```tsx
// app/(logged)/layout.tsx
import { ErrorBoundaryWrapper } from "@/components/error-boundary";

export default function LoggedLayout({ children }) {
  return (
    <ErrorBoundaryWrapper>
      <Sidebar />
      <main>{children}</main>
    </ErrorBoundaryWrapper>
  );
}
```

### 2. Uso em Componentes Críticos
Envolva componentes que fazem chamadas de API:

```tsx
import { FormErrorBoundary } from "@/components/forms/error-boundary";

<FormErrorBoundary formName="transaction-form">
  <TransactionForm onSubmit={handleSubmit} />
</FormErrorBoundary>
```

### 3. Tratamento de Erros em Hooks
Use o hook `useErrorHandler` para tratamento consistente:

```tsx
function useTransactions() {
  const { handleAPIError } = useErrorHandler();
  
  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAll();
      return response.data;
    } catch (error) {
      handleAPIError(error, '/api/transactions');
      throw error;
    }
  };
}
```

## Monitoramento em Produção

### Integração com Sentry (Exemplo)

```tsx
// lib/error-logger.ts
import * as Sentry from '@sentry/nextjs';

private async logToRemote(errorLog: ErrorLog) {
  if (!this.config.enableRemoteLogging) return;

  try {
    Sentry.captureException(new Error(errorLog.message), {
      tags: {
        category: errorLog.category,
        severity: errorLog.severity,
      },
      extra: {
        componentStack: errorLog.componentStack,
        userAgent: errorLog.userAgent,
        url: errorLog.url,
        userId: errorLog.userId,
        sessionId: errorLog.sessionId,
      },
    });
  } catch (remoteError) {
    console.error('Failed to send error to Sentry:', remoteError);
  }
}
```

## Estrutura de Arquivos

```
components/
├── error-boundary.tsx              # ErrorBoundary principal
├── error-boundary-examples.tsx     # Exemplos de uso
├── forms/
│   └── error-boundary.tsx          # ErrorBoundary para formulários
├── transaction-table/
│   └── error-boundary.tsx          # ErrorBoundary para tabela
└── dashboard/
    └── error-boundary.tsx          # ErrorBoundary para dashboard

app/
├── error.tsx                       # Erro global
├── not-found.tsx                   # Página não encontrada
├── (auth)/
│   └── error.tsx                   # Erro na autenticação
└── (logged)/
    └── error.tsx                   # Erro na área logada

lib/
└── error-logger.ts                 # Sistema de logging

hooks/
└── use-error-handler.ts            # Hook para tratamento de erros
```

## Testes

Para testar error boundaries, você pode usar o seguinte padrão:

```tsx
// Teste de error boundary
function TestErrorComponent() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error('Test error for error boundary');
  }
  
  return (
    <button onClick={() => setShouldError(true)}>
      Trigger Error
    </button>
  );
}

// Envolva com error boundary para testar
<ErrorBoundaryWrapper>
  <TestErrorComponent />
</ErrorBoundaryWrapper>
```

Este sistema garante que erros sejam capturados e tratados de forma consistente em toda a aplicação, melhorando a experiência do usuário e facilitando o debug e monitoramento.
