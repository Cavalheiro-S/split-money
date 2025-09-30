# Testes - Split Money

Este projeto utiliza duas ferramentas de teste diferentes para cobrir diferentes aspectos da aplicação:

## 🧪 Testes Unitários (Vitest)

Testes unitários para componentes, funções e lógica de negócio isolada.

### Comandos disponíveis:

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:unit:watch

# Interface gráfica para testes unitários
npm run test:unit:ui

# Executar testes com relatório de cobertura
npm run test:unit:coverage

# Executar testes uma vez (sem watch mode)
npm run test:unit:run
```

### Localização dos testes:
- `tests/unit/` - Testes unitários
- `tests/setup.ts` - Configuração global dos testes

### Convenções:
- Arquivos de teste devem terminar com `.test.ts` ou `.test.tsx`
- Use `describe()` para agrupar testes relacionados
- Use `it()` ou `test()` para testes individuais

## 🎭 Testes E2E (Playwright)

Testes end-to-end para validar fluxos completos da aplicação.

### Comandos disponíveis:

```bash
# Executar todos os testes e2e
npm run test:e2e

# Interface gráfica para testes e2e
npm run test:e2e:ui

# Executar testes com navegador visível
npm run test:e2e:headed

# Modo debug para testes e2e
npm run test:e2e:debug

# Visualizar relatório de testes
npm run test:e2e:report

# Instalar navegadores do Playwright
npm run test:e2e:install
```

### Localização dos testes:
- `tests/e2e/` - Testes end-to-end
- `tests/utils/` - Utilitários para testes

### Convenções:
- Arquivos de teste devem terminar com `.spec.ts`
- Use `test.describe()` para agrupar testes relacionados
- Use `test()` para testes individuais

## 🔄 Executar todos os testes

```bash
# Executar todos os testes (unit + e2e)
npm run test:all
```

## 📁 Estrutura de pastas

```
tests/
├── unit/           # Testes unitários
├── e2e/            # Testes end-to-end
├── utils/          # Utilitários compartilhados
├── setup.ts        # Configuração global
└── README.md       # Este arquivo
```

## 🚀 Comandos rápidos

```bash
# Desenvolvimento - executar testes unitários em watch mode
npm run test:unit:watch

# CI/CD - executar todos os testes
npm run test:all

# Debug - executar testes e2e em modo debug
npm run test:e2e:debug
```
