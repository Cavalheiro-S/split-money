// Códigos de erro para conflitos de exclusão
export const DELETE_CONFLICT_CODES = {
  // Categoria
  CATEGORY_HAS_DEPENDENT_TRANSACTIONS: "CATEGORY_HAS_DEPENDENT_TRANSACTIONS",

  // Status de Pagamento
  PAYMENT_STATUS_HAS_DEPENDENT_TRANSACTIONS:
    "PAYMENT_STATUS_HAS_DEPENDENT_TRANSACTIONS",

  // Tags
  TAG_HAS_DEPENDENT_TRANSACTIONS: "TAG_HAS_DEPENDENT_TRANSACTIONS",
} as const;

// Mensagens em português para os códigos de erro
export const DELETE_CONFLICT_MESSAGES: Record<string, string> = {
  [DELETE_CONFLICT_CODES.CATEGORY_HAS_DEPENDENT_TRANSACTIONS]:
    "Não é possível excluir esta categoria pois existem transações que a utilizam. Remova ou altere as transações antes de excluir a categoria.",

  [DELETE_CONFLICT_CODES.PAYMENT_STATUS_HAS_DEPENDENT_TRANSACTIONS]:
    "Não é possível excluir este status de pagamento pois existem transações que o utilizam. Remova ou altere as transações antes de excluir o status de pagamento.",

  [DELETE_CONFLICT_CODES.TAG_HAS_DEPENDENT_TRANSACTIONS]:
    "Não é possível excluir esta tag pois existem transações que a utilizam. Remova ou altere as transações antes de excluir a tag.",
};

// Tipo para erros de conflito de exclusão
export interface DeleteConflictError {
  message: string;
  code: keyof typeof DELETE_CONFLICT_CODES;
}
