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

export const handleCognitoError = (error: Error) => {
  switch (error.name) {
    case "UserNotFoundException":
      return "Usuário não encontrado";

    case "UsernameExistsException":
      return "Usuário já existe";

    case "NotAuthorizedException":
      return "E-mail ou senha inválidos";

    case "UserNotConfirmedException":
      return "Usuário não confirmado. Verifique seu email";

    case "PasswordResetRequiredException":
      return "É necessário redefinir a senha";

    case "InvalidParameterException":
      return "Parâmetros inválidos";

    case "TooManyRequestsException":
      return "Muitas tentativas. Tente novamente mais tarde";

    case "LimitExceededException":
      return "Limite excedido. Tente novamente mais tarde";

    case "CodeMismatchException":
      return "Código de verificação inválido";

    case "ExpiredCodeException":
      return "Código de verificação expirado";

    default:
      console.error("Falha ao se conectar com o Cognito:", error);
      return "Falha ao se conectar com o servidor. Tente novamente mais tarde";
  }
};
