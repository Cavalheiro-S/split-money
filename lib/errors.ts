// Estrutura de resposta de erro da API
export interface ApiErrorResponse {
  message: string;
  code?: string;
}

// Classe personalizada para erros de API com código
export class ApiConflictError extends Error {
  public code: string;
  public userMessage: string;

  constructor(code: string, userMessage: string, originalMessage?: string) {
    super(originalMessage || userMessage);
    this.name = "ApiConflictError";
    this.code = code;
    this.userMessage = userMessage;
  }
}
