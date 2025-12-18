# Variáveis de Ambiente - Sentry

Para habilitar o Sentry, adicione as seguintes variáveis ao seu `.env.local`:

## Variáveis Obrigatórias

```env
# Sentry DSN (disponível no dashboard do Sentry)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123456.ingest.sentry.io/123456

# Organização e Projeto (para upload de source maps)
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug

# Auth Token (para upload de source maps durante build)
SENTRY_AUTH_TOKEN=your-auth-token
```

## Como Obter as Credenciais

1. Acesse https://sentry.io e crie uma conta
2. Crie um novo projeto Next.js
3. Copie o DSN fornecido
4. Vá em Settings → Projects → [seu-projeto] para ver org e project slugs
5. Crie um Auth Token em Settings → Auth Tokens

## Verificação

Para testar se o Sentry está funcionando:

```typescript
// Em qualquer componente ou página
throw new Error("Test Sentry Error");
```

Ou force um erro na aplicação e verifique no dashboard do Sentry.

## Source Maps

Para produção, os source maps são automaticamente enviados durante o build se as variáveis estiverem configuradas.

**Nota:** Em desenvolvimento, o Sentry está desabilitado por padrão para evitar poluir o dashboard com erros de dev.
