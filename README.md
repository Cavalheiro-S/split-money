# 💰 Split Money

> **Aplicação completa de gestão financeira pessoal** desenvolvida com Next.js 15, TypeScript e as melhores práticas de desenvolvimento web.

[![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-00C7B7?style=for-the-badge&logo=vercel)](https://split-money.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 **Demo**

Acesse a aplicação em produção: **[split-money.vercel.app](https://split-money.vercel.app)**

## 📋 **Funcionalidades**

### 🔐 **Sistema de Autenticação Completo**
- ✅ Login/Logout com validação de credenciais
- ✅ Registro de usuários com validação de email
- ✅ Recuperação de senha (esqueci minha senha)
- ✅ Confirmação de email para ativação de conta
- ✅ Redefinição de senha via token
- ✅ Middleware de autenticação para proteção de rotas
- ✅ Gerenciamento de sessão com refresh automático
- ✅ Integração com AWS Amplify e Amazon Cognito
- ✅ Tokens seguros em cookies httpOnly (proteção XSS)
- ✅ Sincronização automática de sessão

> 📚 **[Ver documentação completa de autenticação →](./docs/AUTHENTICATION.md)**

### 💰 **Gestão Avançada de Transações**
- ✅ **CRUD completo** de transações (Create, Read, Update, Delete)
- ✅ **Tipos de transação**: Entradas (income) e Saídas (outcome)
- ✅ **Valores monetários** formatados em Real brasileiro (R$)
- ✅ **Transações recorrentes** com frequências:
  - Diária, Semanal, Mensal, Anual
- ✅ **Categorização** personalizável de transações
- ✅ **Tags** para organização adicional
- ✅ **Status de pagamento** customizáveis
- ✅ **Filtros avançados** por data, tipo, status e ordenação
- ✅ **Paginação** inteligente para grandes volumes
- ✅ **Validação robusta** com mensagens em português

### 📈 **Dashboard Inteligente**
- ✅ **Visão geral** das últimas transações
- ✅ **Separação visual** entre entradas e saídas
- ✅ **Filtros independentes** por data para cada seção
- ✅ **Interface responsiva** e intuitiva

### ⚙️ **Sistema de Configurações**
- ✅ **Gerenciamento de categorias** (criar/deletar)
- ✅ **Gerenciamento de status de pagamento** (criar/deletar)
- ✅ **Gerenciamento de tags** (criar/deletar)
- ✅ **Validações completas** com mensagens de erro
- ✅ **Confirmações** para ações destrutivas

### 👤 **Perfil do Usuário**
- ✅ **Visualização** de dados pessoais
- ✅ **Edição de email** com validação
- ✅ **Alteração de senha**
- ✅ **Interface** limpa e organizada

### 🧪 **Testes Automatizados**
- ✅ **Testes E2E** com Playwright
- ✅ **Cobertura completa** de funcionalidades
- ✅ **Testes** em múltiplos navegadores
- ✅ **Testes responsivos** (mobile/desktop)
- ✅ **Validações** de formulários e cenários de erro

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[React 18](https://react.dev/)** - Biblioteca de interface com Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes acessíveis
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de interface

### **Formulários e Validação**
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integração

### **UI/UX e Acessibilidade**
- **[Lucide React](https://lucide.dev/)** - Ícones
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificações toast
- **[React Number Format](https://s-yadav.github.io/react-number-format/)** - Formatação monetária
- **[Date-fns](https://date-fns.org/)** - Manipulação de datas
- **[React Day Picker](https://react-day-picker.js.org/)** - Seletor de datas

### **HTTP e API**
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[JWT (jose)](https://github.com/panva/jose)** - Autenticação
- **API Routes** - Endpoints do Next.js

### **Testes**
- **[Playwright](https://playwright.dev/)** - Testes E2E
- **Testes** em Chrome, Firefox, Safari
- **Testes responsivos** (mobile/desktop)

### **Ferramentas de Desenvolvimento**
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Turbopack](https://turbo.build/pack)** - Build tool ultra-rápido
- **[Microsoft Clarity](https://clarity.microsoft.com/)** - Analytics

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 18+ 
- npm, yarn, pnpm ou bun

### **Instalação**

1. **Clone o repositório**
```bash
git clone https://github.com/Cavalheiro-S/split-money.git
cd split-money
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# JWT Secret
JWT_SECRET=your-secret-key

# Clarity (opcional)
NEXT_PUBLIC_CLARITY_PROJECT_ID=your-clarity-id
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

5. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🧪 **Testes**

### **Executar testes E2E**
```bash
# Instalar dependências do Playwright
npx playwright install

# Executar testes
npm run test

# Executar com interface
npm run test:ui

# Executar em modo headed
npm run test:headed

# Debug
npm run test:debug

# Ver relatório
npm run test:report
```

### **Linting e Formatação**
```bash
# Linting
npm run lint

# Build
npm run build

# Iniciar produção
npm run start
```

## 📁 **Estrutura do Projeto**

```
split-money/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Rotas de autenticação
│   ├── (logged)/          # Rotas protegidas
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── forms/            # Formulários
│   ├── ui/               # Componentes shadcn/ui
│   └── transaction-table/ # Tabela de transações
├── docs/                  # Documentação
│   ├── AUTHENTICATION.md  # Doc de autenticação
│   └── SENTRY.md         # Configuração Sentry
├── contexts/             # React Contexts
├── hooks/                # Hooks customizados
├── lib/                  # Utilitários e configurações
├── services/             # Serviços de API
├── types/                # Definições TypeScript
├── utils/                # Funções utilitárias
├── tests/                # Testes E2E
└── public/               # Arquivos estáticos
```

## 🎯 **Arquitetura**

- **Server Components** por padrão
- **Client Components** apenas quando necessário
- **Feature-first** organization
- **Middleware** para autenticação
- **Validação** com Zod em todas as entradas
- **Tipagem** TypeScript estrita
- **Acessibilidade** completa (ARIA, navegação por teclado)

## 🌟 **Destaques**

- ✅ **Interface moderna** e responsiva
- ✅ **Acessibilidade** completa
- ✅ **Validação robusta** com mensagens em português
- ✅ **Testes abrangentes** com Playwright
- ✅ **Performance otimizada** com Server Components
- ✅ **Segurança** com JWT e middleware
- ✅ **Código bem estruturado** e tipado
- ✅ **Deploy automático** na Vercel

## 📱 **Responsividade**

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 📱 **Mobile** (iOS/Android)
- 📱 **Tablet** (iPad/Android)
- 💻 **Desktop** (Windows/macOS/Linux)

## 🔒 **Segurança**

- **Autenticação JWT** segura com AWS Cognito
- **Cookies httpOnly** - proteção contra XSS
- **sameSite cookies** - proteção contra CSRF
- **Middleware** de proteção de rotas
- **Validação JWT** com JWKS
- **Validação** de entrada com Zod
- **Sanitização** de dados
- **HTTPS** em produção
- **Rate limiting** implementado

> 🔐 **[Ver documentação de segurança →](./docs/AUTHENTICATION.md#segurança)**

## 📚 **Documentação**

### **Autenticação**
- 📖 [Documentação Completa de Autenticação](./docs/AUTHENTICATION.md) - Guia detalhado
- 🎨 [Diagramas de Fluxo](./docs/AUTHENTICATION_FLOW.md) - Fluxos visuais em Mermaid
- ⚡ [Guia Rápido de Referência](./docs/AUTH_QUICK_REFERENCE.md) - Snippets e exemplos

### **Outras Documentações**
- 🐛 [Configuração do Sentry](./docs/SENTRY.md) - Monitoramento de erros

## 📊 **Analytics**

- **Microsoft Clarity** para insights de uso
- **Métricas** de performance
- **Análise** de comportamento do usuário

## 🤝 **Contribuição**

Contribuições são bem-vindas! Sinta-se à vontade para:

1. **Fork** o projeto
2. **Criar** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abrir** um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 **Autor**

**Cavalheiro-S**
- GitHub: [@Cavalheiro-S](https://github.com/Cavalheiro-S)
- LinkedIn: [Lucas Cavalheiro](https://www.linkedin.com/in/cavalheirolucas/)

⭐ **Se este projeto te ajudou, considere dar uma estrela!** ⭐