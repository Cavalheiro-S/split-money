'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto - dados considerados frescos
            gcTime: 5 * 60 * 1000, // 5 minutos - tempo no cache após inativo
            retry: 1, // 1 retry em caso de falha
            refetchOnWindowFocus: false, // Não refetch ao focar janela
          },
          mutations: {
            retry: 0, // Não retry mutations automaticamente
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
