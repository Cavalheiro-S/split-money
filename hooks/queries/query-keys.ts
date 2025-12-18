/**
 * Query Keys Factory
 * 
 * Centraliza todas as query keys do projeto seguindo padrão hierárquico.
 * Facilita invalidação e gerenciamento de cache.
 */

export const queryKeys = {
  // Transactions
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.transactions.lists(), filters] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
    stats: () => [...queryKeys.transactions.all, 'stats'] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // Tags
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.tags.lists(), filters] as const,
    details: () => [...queryKeys.tags.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tags.details(), id] as const,
  },

  // Payment Status
  paymentStatuses: {
    all: ['payment-statuses'] as const,
    lists: () => [...queryKeys.paymentStatuses.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.paymentStatuses.lists(), filters] as const,
  },

  // Recurring Transactions
  recurringTransactions: {
    all: ['recurring-transactions'] as const,
    lists: () => [...queryKeys.recurringTransactions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.recurringTransactions.lists(), filters] as const,
    details: () => [...queryKeys.recurringTransactions.all, 'detail'] as const,
    detail: (id: string) => 
      [...queryKeys.recurringTransactions.details(), id] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
} as const
