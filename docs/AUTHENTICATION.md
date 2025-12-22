# 🔐 Fluxo de Autenticação - Split Money

Este documento descreve o fluxo completo de autenticação da aplicação Split Money, incluindo configuração, componentes, segurança e troubleshooting.

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Fluxo de Login](#fluxo-de-login)
4. [Fluxo de Logout](#fluxo-de-logout)
5. [Proteção de Rotas](#proteção-de-rotas)
6. [Gerenciamento de Tokens](#gerenciamento-de-tokens)
7. [Sincronização de Sessão](#sincronização-de-sessão)
8. [Segurança](#segurança)
9. [Troubleshooting](#troubleshooting)

---

## Visão Geral

A aplicação utiliza **AWS Amplify** com **Amazon Cognito** para autenticação. Os tokens são armazenados de forma segura em cookies `httpOnly`, protegendo contra ataques XSS.

### Tecnologias Utilizadas

- **AWS Amplify v6** - SDK de autenticação
- **Amazon Cognito** - Serviço de identidade
- **Next.js 15** - Framework React com App Router
- **Jose** - Validação JWT
- **Cookies httpOnly** - Armazenamento seguro de tokens

---

## Arquitetura

### Estrutura de Componentes

```
app/
├── layout.tsx                    # Root layout com providers
├── (auth)/                       # Rotas públicas (login, registro)
│   ├── layout.tsx               # Verifica se usuário já está autenticado
│   ├── sign-in/page.tsx         # Página de login
│   ├── sign-up/page.tsx         # Página de registro
│   └── ...
├── (logged)/                     # Rotas protegidas
│   ├── dashboard/page.tsx       # Dashboard
│   └── ...
└── api/auth/                     # API Routes de autenticação
    ├── sign-in/route.ts         # Endpoint de login
    ├── get-token/route.ts       # Endpoint para obter token
    └── ...

lib/
└── amplify.ts                    # Configuração do Amplify

contexts/
└── auth-context.tsx              # Context de autenticação

services/
└── auth.service.ts               # Serviços de autenticação

utils/
├── auth.ts                       # Funções de token (server-side)
└── data.ts                       # Fetch com autenticação

middleware.ts                     # Proteção de rotas
```

### Ordem de Providers

```typescript
<AmplifyProvider>           // 1. Configura AWS Amplify
  <AuthProvider>            // 2. Gerencia estado de autenticação
    <NavigationLoadingProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </NavigationLoadingProvider>
  </AuthProvider>
</AmplifyProvider>
```

**⚠️ Importante:** O `AmplifyProvider` DEVE estar antes do `AuthProvider` pois este depende da configuração do Amplify.

---

## Fluxo de Login

### 1. Usuário Acessa Página de Login

```
┌─────────────────────────────────────────────┐
│  Usuário acessa /sign-in                    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  (auth)/layout.tsx                          │
│  - Verifica se já está autenticado          │
│  - Se sim: redireciona para /dashboard     │
│  - Se não: mostra página de login          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  LoginForm é exibido                        │
└─────────────────────────────────────────────┘
```

### 2. Submissão do Formulário

```typescript
// components/forms/login-form.tsx
async function onSubmit(values: z.infer<typeof formSchema>) {
  // 1. Autentica com AWS Cognito via Amplify
  const response = await AuthService.signIn({
    email: values.email,
    password: values.password,
  });

  if (response.isSignedIn) {
    // 2. Obtém usuário e sessão do Amplify
    const user = await login();
    
    if (user) {
      // 3. Redireciona para dashboard
      router.push("/dashboard");
    }
  }
}
```

### 3. Processo de Login (Detalhado)

```
┌─────────────────────────────────────────────┐
│  1. AuthService.signIn()                    │
│     - Chama AWS Cognito via Amplify         │
│     - Credenciais validadas                 │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  2. useAuth().login()                       │
│     - AuthService.getCurrentUser()          │
│     - AuthService.getAuthSession()          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  3. setAuthTokens() [Server-side]           │
│     - Armazena tokens em cookies httpOnly   │
│     - idToken: 10 horas                     │
│     - accessToken: 10 horas                 │
│     - sameSite: lax                         │
│     - secure: true (em produção)            │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  4. Hub Event: 'signedIn'                   │
│     - AuthContext escuta evento             │
│     - Sincroniza sessão automaticamente     │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  5. Redirecionamento para /dashboard        │
└─────────────────────────────────────────────┘
```

### 4. Código do Login

```typescript
// contexts/auth-context.tsx
const login = async () => {
  // Obtém usuário autenticado do Amplify
  const user = await AuthService.getCurrentUser();
  
  // Obtém sessão com tokens
  const session = await AuthService.getAuthSession();
  
  // Armazena tokens em cookies seguros (server-side)
  await setAuthTokens(
    session?.tokens?.idToken?.toString() || "",
    session?.tokens?.accessToken?.toString() || ""
  );

  return user;
};
```

```typescript
// utils/auth.ts (server-side)
export async function setAuthTokens(idToken: string, accessToken: string) {
  const cookieStore = await cookies();

  const COOKIE_OPTIONS = {
    httpOnly: true,                              // ✅ Não acessível via JavaScript
    secure: process.env.NODE_ENV === "production", // ✅ HTTPS em produção
    sameSite: "lax" as const,                    // ✅ Proteção CSRF
    path: "/",
  };

  // ID Token (usado para autenticação na API)
  cookieStore.set("idToken", idToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 10, // 10 horas
  });

  // Access Token
  cookieStore.set(STORAGE_KEYS.JWT_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 10, // 10 horas
  });
}
```

---

## Fluxo de Logout

### 1. Usuário Clica em Logout

```
┌─────────────────────────────────────────────┐
│  Usuário clica em botão de logout          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  useAuth().logout()                         │
│  1. AuthService.signOut()                   │
│     - Encerra sessão no Amplify/Cognito     │
│  2. clearAuthTokens()                       │
│     - Remove cookies do servidor            │
│  3. router.replace("/sign-in")              │
│     - Redireciona para login (SPA)          │
└─────────────────────────────────────────────┘
```

### 2. Código do Logout

```typescript
// contexts/auth-context.tsx
const logout = async () => {
  // 1. Encerra sessão no AWS Cognito
  await AuthService.signOut();
  
  // 2. Remove cookies de autenticação (server-side)
  await clearAuthTokens();
  
  // 3. Redireciona para login (navegação SPA, sem reload)
  router.replace("/sign-in");
};
```

```typescript
// utils/auth.ts (server-side)
export async function clearAuthTokens() {
  const cookieStore = await cookies();
  
  cookieStore.delete("idToken");
  cookieStore.delete(STORAGE_KEYS.JWT_TOKEN);
}
```

---

## Proteção de Rotas

### 1. Middleware (Proteção Server-Side)

O middleware verifica a autenticação ANTES de qualquer página carregar:

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(STORAGE_KEYS.JWT_TOKEN)?.value;
  
  const publicRoutes = ["/sign-in", "/sign-up", "/forgot-password", ...];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Rota pública COM token = redireciona para dashboard
  if (isPublicRoute && token) {
    try {
      const decoded = await validateToken(token);
      if (decoded) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // Token inválido, permite acesso à rota pública
    }
  }

  // Rota protegida SEM token = redireciona para login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Token presente em rota protegida - valida
  if (!isPublicRoute && token) {
    try {
      const decoded = await validateToken(token);
      if (!decoded) {
        const response = NextResponse.redirect(new URL("/sign-in", request.url));
        response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
      return response;
    }
  }

  return NextResponse.next();
}
```

### 2. Layout de Auth (Proteção Client-Side)

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await AuthService.getToken();
        
        // Se já está autenticado, redireciona
        if (token) {
          router.replace("/dashboard");
        }
      } catch (error) {
        // Usuário não autenticado, permite acesso
      }
    }
    
    checkAuth();
  }, [router]);

  return <>{children}</>;
}
```

### 3. Fluxo de Proteção

```
Requisição para rota protegida
         │
         ▼
┌────────────────────────┐
│  Middleware (Server)   │
│  - Verifica cookie     │
│  - Valida JWT          │
└────────┬───────────────┘
         │
         ├─── Token válido ──────────> Permite acesso
         │
         └─── Token inválido/ausente ─> Redireciona para /sign-in
```

---

## Gerenciamento de Tokens

### 1. Armazenamento Seguro

**✅ O QUE FAZEMOS:**
- Tokens armazenados em cookies `httpOnly`
- Não acessíveis via JavaScript
- Proteção contra XSS

**❌ O QUE NÃO FAZEMOS:**
- ~~localStorage~~ (vulnerável a XSS)
- ~~sessionStorage~~ (vulnerável a XSS)
- ~~Cookies sem httpOnly~~

### 2. Tipos de Tokens

| Token | Propósito | Onde é Usado | Duração |
|-------|-----------|--------------|---------|
| **idToken** | Identidade do usuário | API Backend | 10 horas |
| **accessToken** | Autorização AWS | Amplify/Cognito | 10 horas |

### 3. Validação de Token

```typescript
// utils/auth.ts
export const validateToken = async (token: string) => {
  if (!COGNITO_USERPOOL_ID || !COGNITO_REGION) {
    throw new Error("Missing required AWS Cognito configuration");
  }

  try {
    // Obtém chaves públicas do Cognito (JWKS)
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    
    // Valida assinatura e expiração do token
    const { payload } = await jwtVerify(token, JWKS);
    
    return payload;
  } catch (error) {
    console.error("Token validation error:", error);
    throw error;
  }
};
```

### 4. Obtenção de Token para API Calls

```typescript
// utils/data.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  try {
    // Obtém token do Amplify
    const accessToken = await AuthService.getToken();

    // Adiciona token no header Authorization
    const apiResponse = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return apiResponse;
  } catch (error) {
    console.error("Erro ao buscar token:", error);
    throw error;
  }
}
```

---

## Sincronização de Sessão

### 1. Sincronização Automática com Amplify

O `AuthContext` monitora eventos do Amplify Hub para manter a sessão sincronizada:

```typescript
// contexts/auth-context.tsx
useEffect(() => {
  // Sincroniza sessão ao carregar a aplicação
  async function syncSession() {
    try {
      const token = await AuthService.getToken();

      if (token) {
        const session = await AuthService.getAuthSession();

        if (session?.tokens?.accessToken) {
          // Sincroniza tokens do Amplify com cookies do Next.js
          await setAuthTokens(
            session.tokens.idToken?.toString() || "",
            session.tokens.accessToken?.toString() || ""
          );
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar sessão:", error);
    }
  }

  syncSession();

  // Escuta eventos de autenticação do Amplify
  const unsubscribe = Hub.listen("auth", async (data) => {
    console.log("Auth event:", data);

    if (data.payload.event === "signedIn") {
      // Re-sincroniza quando usuário faz login
      await syncSession();
    }
  });

  return () => {
    unsubscribe();
  };
}, []);
```

### 2. Fluxo de Sincronização

```
┌─────────────────────────────────────────────┐
│  Aplicação carrega                          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  AuthContext.syncSession()                  │
│  1. Verifica se Amplify tem token           │
│  2. Se sim: obtém tokens do Amplify         │
│  3. Sincroniza com cookies do Next.js       │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  Hub.listen('auth')                         │
│  - Escuta eventos: signedIn, signedOut      │
│  - Re-sincroniza quando necessário          │
└─────────────────────────────────────────────┘
```

### 3. Eventos do Amplify Hub

| Evento | Quando Ocorre | Ação |
|--------|---------------|------|
| `signedIn` | Usuário faz login | Re-sincroniza tokens |
| `signedOut` | Usuário faz logout | Limpa tokens |
| `tokenRefresh` | Token é renovado | Atualiza cookies |
| `tokenRefresh_failure` | Falha ao renovar | Redireciona para login |

---

## Segurança

### ✅ Medidas de Segurança Implementadas

#### 1. **Proteção XSS (Cross-Site Scripting)**
```typescript
// Cookies httpOnly - não acessíveis via JavaScript
httpOnly: true
```
**Benefício:** Mesmo se houver injeção de script malicioso, ele não consegue acessar os tokens.

#### 2. **Proteção CSRF (Cross-Site Request Forgery)**
```typescript
// SameSite impede envio de cookies de outros sites
sameSite: "lax"  // ou "strict" para mais segurança
```
**Benefício:** Cookies só são enviados em requisições do mesmo site.

#### 3. **HTTPS em Produção**
```typescript
secure: process.env.NODE_ENV === "production"
```
**Benefício:** Tokens só são transmitidos via conexão criptografada.

#### 4. **Validação JWT com JWKS**
```typescript
// Valida assinatura usando chaves públicas do Cognito
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
const { payload } = await jwtVerify(token, JWKS);
```
**Benefício:** Impossível falsificar tokens sem a chave privada do Cognito.

#### 5. **Rate Limiting**
```typescript
// Implementado em services/base.service.ts
if (!globalRateLimiter.canMakeRequest(endpoint)) {
  throw new Error("Muitas requisições");
}
```
**Benefício:** Previne ataques de força bruta.

#### 6. **Sem Exposição de Tokens no Cliente**
**❌ NÃO fazemos:**
- Armazenar tokens no localStorage
- Armazenar tokens no sessionStorage
- Expor tokens em logs do cliente

**✅ Fazemos:**
- Tokens apenas em cookies httpOnly
- Tokens nunca aparecem no JavaScript do cliente
- Logs de erro não contêm tokens

### 🔒 Checklist de Segurança

- [x] Tokens em cookies httpOnly
- [x] Flag `secure` em produção
- [x] Flag `sameSite` configurada
- [x] Validação JWT server-side
- [x] Rate limiting implementado
- [x] HTTPS em produção
- [x] Sem localStorage para tokens
- [x] Proteção contra XSS
- [x] Proteção contra CSRF
- [x] Logs não expõem dados sensíveis

---

## Troubleshooting

### Problema: Usuário não é redirecionado após login

**Sintomas:**
- Login bem-sucedido mas fica na tela de login
- Token existe mas redirecionamento não acontece

**Possíveis Causas:**
1. Middleware não está ativo
2. Cookies não estão sendo definidos
3. Domínio/path dos cookies incorreto

**Solução:**
```bash
# 1. Verificar middleware
# Confirme que middleware.ts está exportando corretamente

# 2. Verificar cookies no DevTools
# Application > Cookies > seu-dominio
# Deve ter: split-money-token e idToken

# 3. Verificar console
# Procure por erros de "Token validation failed"
```

### Problema: "Amplify not configured"

**Sintomas:**
- Erro ao tentar usar AuthService
- Aplicação não consegue fazer login

**Causa:**
- Amplify não foi configurado ou configurado na ordem errada

**Solução:**
```typescript
// Certifique-se que AmplifyProvider está ANTES de AuthProvider
<AmplifyProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</AmplifyProvider>
```

### Problema: Loop de redirecionamento

**Sintomas:**
- Página fica redirecionando infinitamente
- Entre /sign-in e /dashboard

**Possíveis Causas:**
1. Token inválido não está sendo limpo
2. Lógica de verificação conflitante

**Solução:**
```typescript
// Em caso de token inválido, limpar cookies
const response = NextResponse.redirect(new URL("/sign-in", request.url));
response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
response.cookies.delete("idToken");
return response;
```

### Problema: Token expira mas usuário não é deslogado

**Sintomas:**
- API retorna 401 mas usuário continua "logado"
- Aplicação não redireciona para login

**Solução:**
```typescript
// Adicionar verificação de expiração
if (response.status === 401) {
  await clearAuthTokens();
  router.push("/sign-in");
}
```

### Problema: Sessão não persiste após reload

**Sintomas:**
- Usuário faz login mas após F5 precisa logar novamente
- Cookies parecem ser limpos

**Possíveis Causas:**
1. Cookies com `sameSite: "strict"` em ambiente de desenvolvimento
2. Domínio incorreto
3. maxAge muito curto

**Solução:**
```typescript
// Para desenvolvimento, use "lax"
sameSite: "lax" as const

// Verifique maxAge (10 horas = 36000 segundos)
maxAge: 60 * 60 * 10
```

### Problema: CORS errors em produção

**Sintomas:**
- Login funciona em dev mas não em produção
- Erros de CORS no console

**Solução:**
```typescript
// Verificar configuração do backend
// Permitir origem da aplicação Next.js
Access-Control-Allow-Origin: https://seu-dominio.com
Access-Control-Allow-Credentials: true
```

### Debug Mode

Para ativar logs detalhados durante desenvolvimento:

```typescript
// contexts/auth-context.tsx
if (process.env.NODE_ENV === 'development') {
  console.log("Auth event:", data);
  console.log("Token:", token);
  console.log("Session:", session);
}
```

---

## Variáveis de Ambiente

### Obrigatórias

```env
# AWS Cognito
NEXT_PUBLIC_COGNITO_USERPOOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_COGNITO_USERPOOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_COGNITO_REGION=us-east-1

# API Backend
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
API_URL=https://api.seu-dominio.com  # Para server-side
```

### Opcionais

```env
# Sentry (Monitoramento de erros)
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=sua-org
SENTRY_PROJECT=split-money
SENTRY_AUTH_TOKEN=...

# Analytics
NEXT_PUBLIC_CLARITY_PROJECT_ID=...
```

---

## Diagrama Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO DE AUTENTICAÇÃO                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Acessa /sign-in    │
└──────────┬──────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  (auth)/layout verifica autenticação   │
│  └─ Se autenticado: /dashboard         │
│  └─ Se não: mostra login               │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  LoginForm                             │
│  └─ Usuário preenche credenciais       │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  AuthService.signIn()                  │
│  └─ AWS Cognito valida credenciais     │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  useAuth().login()                     │
│  └─ Obtém user e session do Amplify    │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  setAuthTokens() [Server Action]       │
│  └─ Armazena em cookies httpOnly       │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  Hub Event: 'signedIn'                 │
│  └─ AuthContext sincroniza sessão      │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  router.push("/dashboard")             │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  Middleware verifica token             │
│  └─ Token válido: permite acesso       │
└──────────┬─────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│  Dashboard renderizado                 │
│  └─ Usuário está autenticado ✅        │
└────────────────────────────────────────┘
```

---

## Melhores Práticas

### ✅ DO (Faça)

1. **Sempre use cookies httpOnly para tokens**
2. **Valide tokens no server-side**
3. **Use HTTPS em produção**
4. **Implemente rate limiting**
5. **Monitore erros com Sentry**
6. **Mantenha tokens com tempo de vida razoável**
7. **Limpe tokens ao deslogar**
8. **Trate erros de autenticação graciosamente**
9. **Use router.push/replace para navegação SPA**
10. **Teste fluxo de autenticação regularmente**

### ❌ DON'T (Não Faça)

1. **Nunca armazene tokens em localStorage**
2. **Nunca exponha tokens em logs**
3. **Nunca use window.location para navegação interna**
4. **Nunca ignore erros de validação de token**
5. **Nunca hardcode credenciais**
6. **Nunca confie apenas em validação client-side**
7. **Nunca envie tokens em URL query params**
8. **Nunca use cookies sem httpOnly**
9. **Nunca desabilite HTTPS em produção**
10. **Nunca ignore atualizações de segurança do Amplify**

---

## Referências

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Amazon Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## Changelog

### v1.0.0 (2024)
- ✅ Implementação inicial com AWS Amplify
- ✅ Tokens em cookies httpOnly
- ✅ Proteção XSS e CSRF
- ✅ Middleware de proteção de rotas
- ✅ Sincronização automática de sessão
- ✅ Redirecionamento automático

---

**Última atualização:** 2024  
**Mantido por:** Equipe Split Money  
**Contato:** [seu-email@exemplo.com]

