# Refatoração do Sistema de Autenticação

## 📋 Visão Geral

Refatoração completa do sistema de autenticação para resolver problemas críticos de arquitetura, duplicação de lógica e race conditions.

## 🎯 Problemas Resolvidos

### 1. **Duplicação de Lógica de Sessão** ✅
**Antes:** Dois sistemas gerenciando sessão simultaneamente:
- `hooks/use-session.ts`
- `utils/data.ts` (token cache)
- `contexts/user-context.tsx`

**Depois:** Um único `AuthContext` como fonte única de verdade.

### 2. **Race Conditions** ✅
**Antes:** `UserContext` lia diretamente do localStorage enquanto `useSession` também gerenciava estado, causando condições de corrida.

**Depois:** Toda a lógica de sessão está centralizada no `AuthContext` com inicialização controlada.

### 3. **Validação de Token no Middleware** ✅
**Antes:** Middleware apenas verificava se o token existia, não validava se estava expirado.

**Depois:** Middleware valida o token usando `validateToken()` e remove cookies inválidos.

### 4. **Token Refresh Automático** ✅
**Antes:** Polling manual a cada 10 segundos consumindo recursos.

**Depois:** Token refresh agendado automaticamente 5 minutos antes da expiração usando `setTimeout`.

### 5. **Redirecionamentos Hard** ✅
**Antes:** Uso de `window.location.href` causando reload completo.

**Depois:** Uso de `router.push()` para navegação client-side do Next.js.

### 6. **Persistência Duplicada** ✅
**Antes:** `saveSession()` salvava no localStorage duas vezes.

**Depois:** Uma única chamada para salvar sessão.

## 🏗️ Nova Arquitetura

```
┌─────────────────┐
│   Middleware    │ ← Valida token + expiração (server-side)
└────────┬────────┘
         │
┌────────▼────────┐
│  AuthContext    │ ← Única fonte de verdade (client-side)
│  (Provider)     │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼──┐  ┌───▼────┐
│useAuth│ │Components│
└──────┘  └────────┘
```

## 📁 Arquivos Criados

### 1. `contexts/auth-context.tsx`
**Responsabilidades:**
- Gerenciamento centralizado de sessão
- Login/Logout
- Token refresh automático
- Verificação periódica de expiração (30s)
- Persistência em localStorage

**Hooks exportados:**
- `useAuth()` - Hook principal para acessar autenticação

**Funções:**
- `login(accessToken, user, expiresIn)` - Faz login e agenda refresh
- `logout()` - Faz logout e limpa sessão
- `refreshSession()` - Renova token manualmente

### 2. `app/api/auth/refresh/route.ts`
**Responsabilidades:**
- Valida token atual
- Busca dados atualizados do usuário
- Retorna novo token (ou mesmo token com dados atualizados)
- Remove cookie se inválido

## 🔄 Arquivos Modificados

### 1. `middleware.ts`
- Adicionado validação de token com `validateToken()`
- Remove cookie inválido automaticamente
- Valida antes de redirecionar de rotas públicas

### 2. `components/forms/login-form.tsx`
- Substituído `useUser()` e `useSession()` por `useAuth()`
- Usa `login()` do AuthContext
- Simplificado fluxo de login

### 3. `app/api/auth/sign-in/route.ts`
- Adicionado busca de dados do usuário
- Retorna `user` e `expiresIn` na resposta

### 4. `app/layout.tsx`
- Substituído `UserProvider` por `AuthProvider`

### 5. `app/(logged)/layout.tsx`
- Substituído `useAuthGuard()` por `useAuth()`
- Usa `router.push()` ao invés de redirecionamento automático

### 6. `components/sidebar/items.tsx`
- Substituído `useUser()` por `useAuth()`
- Logout agora é async

### 7. `types/auth.d.ts`
- Adicionado `user`, `expiresIn` ao `ResponseSignIn`

### 8. `tests/e2e/auth.spec.ts`
- Ajustado timeout para teste de sessão expirada

## 🔑 Principais Melhorias

### 1. **Token Refresh Inteligente**
```typescript
// Agenda refresh 5 minutos antes da expiração
const timeUntilRefresh = expiresAt - Date.now() - SESSION_REFRESH_THRESHOLD;
refreshTimeoutRef.current = setTimeout(() => {
  refreshSession();
}, timeUntilRefresh);
```

### 2. **Verificação Periódica Eficiente**
```typescript
// Verifica a cada 30 segundos (ao invés de 10s)
// Apenas quando há usuário logado
checkIntervalRef.current = setInterval(() => {
  const currentSession = getStoredSession();
  if (!isSessionValid(currentSession)) {
    clearSession();
    router.push('/sign-in');
  }
}, SESSION_CHECK_INTERVAL);
```

### 3. **Middleware com Validação**
```typescript
// Valida token antes de permitir acesso
const decoded = await validateToken(token);
if (!decoded) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
  return response;
}
```

### 4. **Inicialização Controlada**
```typescript
// Verifica sessão válida no localStorage primeiro
const storedSession = getStoredSession();
if (storedSession && isSessionValid(storedSession)) {
  setSession(storedSession);
  setUser(storedSession.user);
  
  // Verifica se precisa renovar
  if (shouldRefreshSession(storedSession)) {
    await refreshSession();
  }
}
```

## 📊 Comparação Antes/Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Fontes de verdade** | 3 (useSession, UserContext, data.ts) | 1 (AuthContext) |
| **Verificação de sessão** | Polling 10s | Agendado + 30s check |
| **Validação middleware** | Apenas existência | Token + expiração |
| **Redirecionamentos** | window.location | router.push() |
| **Token refresh** | Manual/polling | Automático agendado |
| **Race conditions** | Sim | Não |
| **Persistência duplicada** | Sim | Não |

## 🧪 Testes

### Testes E2E Atualizados:
- ✅ Login com sucesso
- ✅ Logout com sucesso
- ✅ Sessão expirada redireciona para login
- ✅ Persistência após reload
- ✅ Proteção de rotas

### Próximos Passos para Testes:
1. Testar token refresh automático
2. Testar múltiplas abas
3. Testar offline/online

## 🚀 Como Usar

### Login:
```typescript
const { login } = useAuth();

// Após receber resposta da API
login(accessToken, user, expiresIn);
router.push('/dashboard');
```

### Logout:
```typescript
const { logout } = useAuth();

await logout(); // Redireciona automaticamente
```

### Verificar Autenticação:
```typescript
const { isAuthenticated, isLoading, user } = useAuth();

if (isLoading) return <Loading />;
if (!isAuthenticated) return <Login />;

return <Dashboard user={user} />;
```

### Refresh Manual:
```typescript
const { refreshSession } = useAuth();

await refreshSession();
```

## ⚠️ Breaking Changes

### Para Componentes:
- Substituir `useUser()` por `useAuth()`
- Substituir `useSession()` por `useAuth()`
- `logout()` agora é async

### Para APIs:
- `/api/auth/sign-in` agora retorna `user` e `expiresIn`
- Nova rota `/api/auth/refresh` para renovação de token

## 🔮 Melhorias Futuras

1. **Refresh Token Real**
   - Implementar refresh token no backend
   - Separar access token (curta duração) de refresh token (longa duração)

2. **Telemetria**
   - Log de sessões expiradas
   - Métricas de renovação de token
   - Monitoramento de falhas de auth

3. **Sincronização Multi-Tab**
   - Usar BroadcastChannel para sincronizar logout entre abas
   - Compartilhar token refresh entre abas

4. **Offline Support**
   - Detectar quando está offline
   - Queue de ações para quando voltar online

## 📝 Notas de Migração

### Arquivos que podem ser removidos (após validação):
- ❌ `hooks/use-session.ts` (substituído por AuthContext)
- ❌ `hooks/use-auth-guard.ts` (lógica movida para AuthContext)
- ❌ `contexts/user-context.tsx` (substituído por AuthContext)
- ❌ `utils/data.ts` (token cache não é mais necessário)
- ❌ `components/session-initializer.tsx` (se existir)

### Verificar uso antes de remover:
- `utils/session.ts` - Pode ter funções úteis
- `services/user.service.ts` - Ainda necessário para buscar dados do usuário

## ✅ Checklist de Validação

- [x] AuthContext criado e funcionando
- [x] Middleware validando tokens
- [x] Token refresh automático implementado
- [x] Login atualizado para usar AuthContext
- [x] Logout atualizado para usar AuthContext
- [x] Layout protegido usando AuthContext
- [x] Sidebar usando AuthContext
- [x] Redirecionamentos usando router.push()
- [x] Testes E2E ajustados
- [ ] Remover código legado
- [ ] Validar em produção
- [ ] Documentar para equipe

## 🎉 Resultado

Sistema de autenticação:
- ✅ Mais simples e manutenível
- ✅ Sem duplicação de lógica
- ✅ Sem race conditions
- ✅ Mais seguro (validação no middleware)
- ✅ Mais eficiente (refresh agendado)
- ✅ Melhor UX (navegação client-side)

