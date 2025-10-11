# Funcionalidade de Deleção em Massa - Split Money

Este documento descreve como usar a funcionalidade de deleção em massa implementada no Split Money.

## 📋 Visão Geral

A funcionalidade de deleção em massa permite excluir múltiplas transações ou transações recorrentes em uma única operação, melhorando a eficiência do usuário ao gerenciar grandes volumes de dados.

## 🚀 Funcionalidades Implementadas

### 1. Seleção Múltipla na Tabela de Transações

- **Checkbox de seleção individual**: Cada linha da tabela possui um checkbox para seleção individual
- **Checkbox de seleção geral**: Cabeçalho da tabela possui checkbox para selecionar/desselecionar todas as transações
- **Estado indeterminado**: Quando apenas algumas transações estão selecionadas, o checkbox principal fica em estado indeterminado
- **Seleção universal**: Todas as transações podem ser selecionadas (incluindo transações recorrentes)
- **Lógica inteligente para transações virtuais**: Transações virtuais (`is_virtual: true`) usam o `recurrent_transaction_id` em vez do `id` para seleção

### 2. Barra de Ações em Massa

- **Contador de seleção**: Mostra quantas transações estão selecionadas
- **Botão de exclusão**: Permite excluir todas as transações selecionadas
- **Botão de limpeza**: Limpa a seleção atual
- **Design responsivo**: Adapta-se a diferentes tamanhos de tela

### 3. Modal de Confirmação Inteligente

- **Confirmação detalhada**: Mostra exatamente quantas transações serão excluídas
- **Detecção automática de tipo**: Identifica automaticamente se são transações recorrentes ou regulares
- **Endpoints corretos**: Usa o endpoint apropriado baseado no tipo de transação
- **Deleção mista**: Suporta exclusão simultânea de transações recorrentes e regulares
- **Feedback consolidado**: Mostra resultado unificado de todas as operações
- **Informações contextuais**: Explica o que acontecerá com cada tipo de transação
- **Feedback de progresso**: Mostra estado de carregamento durante a operação
- **Tratamento de erros**: Exibe mensagens de erro amigáveis

## 🔧 Como Usar

### Para Transações Normais

```tsx
import { TableTransaction } from "@/components/transaction-table"

function TransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleDeleteSuccess = async () => {
    // Recarregar dados após exclusão
    await fetchTransactions()
    setSelectedIds([])
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  return (
    <div>
      <TableTransaction.BulkActionsBar
        selectedIds={selectedIds}
        onClearSelection={handleClearSelection}
        onDeleteSuccess={handleDeleteSuccess}
        isRecurring={false}
      />
      
      <TableTransaction.Table
        data={transactions}
        enableBulkSelection={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        // ... outras props
      />
    </div>
  )
}
```

### Para Transações Recorrentes

```tsx
import { RecurringTransactionTable } from "@/components/recurring-transaction-table"
import { BulkActionsBar } from "@/components/transaction-table"

function RecurringTransactionsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <div>
      <BulkActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onDeleteSuccess={handleDeleteSuccess}
        isRecurring={true}
      />
      
      <RecurringTransactionTable
        data={recurringTransactions}
        enableBulkSelection={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        hasActions={true}
        // ... outras props
      />
    </div>
  )
}
```

### Gerenciamento Completo de Transações Recorrentes

```tsx
import { RecurringTransactionActionModal } from "@/components/recurring-transaction-action-modal"
import { RecurringTransactionForm } from "@/components/forms/recurring-transaction-form"

function RecurringTransactionManagement() {
  return (
    <div>
      {/* Modal para criar/editar transações recorrentes */}
      <RecurringTransactionActionModal
        transaction={selectedTransaction}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        updateData={refreshData}
        categories={categories}
        paymentStatuses={paymentStatuses}
        tags={tags}
      />
      
      {/* Formulário standalone */}
      <RecurringTransactionForm
        transaction={transaction}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        categories={categories}
        paymentStatuses={paymentStatuses}
        tags={tags}
      />
    </div>
  )
}
```

## 📡 Integração com API

### Serviços Disponíveis

```typescript
// Para transações normais
TransactionService.bulkDeleteTransactions(ids: string[])

// Para transações recorrentes  
RecurringTransactionService.bulkDeleteRecurringTransactions(ids: string[])
RecurringTransactionService.getRecurringTransactions(pagination, filters)
RecurringTransactionService.createRecurringTransaction(transaction)
RecurringTransactionService.updateRecurringTransaction(transaction)
RecurringTransactionService.deleteRecurringTransaction(id)
RecurringTransactionService.toggleRecurringTransactionStatus(id, isActive)
```

### Tipos TypeScript

```typescript
interface BulkDeleteResponse {
  message: string
  summary: {
    total: number
    succeeded: number
    failed: number
  }
  results: {
    success: string[]
    failed: Array<{
      id: string
      reason: string
    }>
  }
  info?: string
}

interface RecurringTransaction {
  id: string
  description: string
  date: string
  amount: number
  type: "income" | "outcome"
  frequency: string
  quantity: number
  paymentStatusId?: string
  categoryId?: string
  tagId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface RecurringTransactionFilters {
  date?: Date
  type?: "income" | "outcome"
  sort?: {
    sortBy: "description" | "date" | "amount" | "type" | "category" | "payment_status" | "frequency"
    sortOrder: "asc" | "desc"
  }
  status?: string
  isActive?: boolean
}
```

## 🎨 Componentes Disponíveis

### TableTransaction.BulkActionsBar

Barra de ações que aparece quando há transações selecionadas.

**Props:**
- `selectedIds: string[]` - IDs das transações selecionadas
- `onClearSelection: () => void` - Callback para limpar seleção
- `onDeleteSuccess: () => Promise<void>` - Callback após exclusão bem-sucedida
- `isRecurring?: boolean` - Se é para transações recorrentes

### TableTransaction.BulkDeleteModal

Modal de confirmação para exclusão em massa.

**Props:**
- `selectedIds: string[]` - IDs das transações selecionadas
- `isOpen: boolean` - Se o modal está aberto
- `onClose: () => void` - Callback para fechar modal
- `onSuccess: () => Promise<void>` - Callback após exclusão bem-sucedida
- `isRecurring?: boolean` - Se é para transações recorrentes

### TableTransaction.Table

Tabela de transações com suporte a seleção múltipla.

**Props adicionais:**
- `enableBulkSelection?: boolean` - Habilita seleção múltipla
- `selectedIds?: string[]` - IDs das transações selecionadas
- `onSelectionChange?: (selectedIds: string[]) => void` - Callback de mudança de seleção

### RecurringTransactionTable

Tabela específica para transações recorrentes com funcionalidades completas.

**Props:**
- `data: ResponseGetRecurringTransactions[]` - Dados das transações recorrentes
- `enableBulkSelection?: boolean` - Habilita seleção múltipla
- `selectedIds?: string[]` - IDs das transações selecionadas
- `onSelectionChange?: (selectedIds: string[]) => void` - Callback de mudança de seleção
- `hasActions?: boolean` - Mostra coluna de ações
- `onEditClick?: (id: string) => void` - Callback para edição
- `categories?: Category[]` - Lista de categorias
- `paymentStatuses?: PaymentStatus[]` - Lista de status de pagamento
- `tags?: Tag[]` - Lista de tags

### RecurringTransactionActionModal

Modal completo para gerenciar transações recorrentes (criar, editar, excluir, ativar/desativar).

**Props:**
- `transaction?: ResponseGetRecurringTransactions` - Transação para edição
- `open: boolean` - Se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback de mudança de estado
- `updateData: () => Promise<void>` - Callback após operações
- `categories?: Category[]` - Lista de categorias
- `paymentStatuses?: PaymentStatus[]` - Lista de status de pagamento
- `tags?: Tag[]` - Lista de tags

### RecurringTransactionForm

Formulário para criar/editar transações recorrentes.

**Props:**
- `transaction?: ResponseGetRecurringTransactions` - Transação para edição
- `onSuccess: () => Promise<void>` - Callback após sucesso
- `onCancel: () => void` - Callback de cancelamento
- `categories?: Category[]` - Lista de categorias
- `paymentStatuses?: PaymentStatus[]` - Lista de status de pagamento
- `tags?: Tag[]` - Lista de tags

## 🔒 Validações e Limitações

### Limitações da API
- Máximo de **50 IDs** por requisição
- Apenas transações do usuário autenticado podem ser excluídas
- Todas as transações podem ser selecionadas e excluídas

### Validações do Frontend
- Seleção é limpa após operações bem-sucedidas
- Estados de carregamento são exibidos durante operações
- Validação de formulários com Zod

## 🎯 Comportamentos Especiais

### Transações Normais
- Se uma transação deletada for a última vinculada a uma transação recorrente, a transação recorrente órfã também será deletada automaticamente
- Estratégia de "partial success": deleta o que for possível e retorna falhas

### Transações Recorrentes
- As transações reais já criadas permanecem intactas
- Apenas o vínculo com a transação recorrente é removido
- Novas transações virtuais não serão mais geradas
- Estratégia de "partial success": deleta o que for possível e retorna falhas

### Transações Virtuais
- Transações virtuais (`is_virtual: true`) são selecionadas usando o `recurrent_transaction_id`
- Quando uma transação virtual é selecionada, o sistema automaticamente usa o ID da transação recorrente pai
- Isso permite que a exclusão em massa afete a transação recorrente original, não apenas a transação virtual

### Detecção Automática de Endpoints
- **Transações regulares**: Usam o endpoint `/transaction/bulk-delete`
- **Transações recorrentes**: Usam o endpoint `/recurring-transaction/bulk-delete`
- **Detecção automática**: Baseada nos campos `is_virtual` e `is_recurring_generated`
- **Deleção mista**: Quando há ambos os tipos, usa ambos os endpoints automaticamente
- **Feedback unificado**: Mostra resultado consolidado de todas as operações

## 🐛 Tratamento de Erros

### Erros de Validação (400)
- "Maximum 50 IDs allowed per request"
- "Request body must contain an array of IDs"
- "IDs array cannot be empty"
- "All IDs must be strings"

### Erros de Servidor (500)
- "Internal server error" com detalhes do erro
- Request ID para rastreamento

### Feedback ao Usuário
- Toast de sucesso quando operação é concluída
- Toast de erro quando há falhas
- Contadores de sucesso/falha na resposta
- Estados de carregamento durante operações

## 📱 Responsividade

- **Desktop**: Barra de ações horizontal com botões lado a lado
- **Mobile**: Layout adaptado com botões empilhados
- **Tablet**: Layout intermediário otimizado para touch

## 🔄 Estados da Interface

1. **Nenhuma seleção**: Barra de ações oculta
2. **Seleção parcial**: Barra de ações visível com contador
3. **Seleção completa**: Barra de ações visível com contador
4. **Operação em andamento**: Estados de carregamento nos botões
5. **Operação concluída**: Feedback de sucesso/erro e limpeza da seleção

## 🧪 Testes

Para testar a funcionalidade:

1. Acesse a página de transações
2. Selecione algumas transações usando os checkboxes
3. Observe a barra de ações aparecer
4. Clique em "Excluir Selecionadas"
5. Confirme no modal
6. Verifique o feedback de sucesso/erro

## 📝 Notas de Desenvolvimento

- Todos os componentes seguem os padrões do projeto (TypeScript, Tailwind, ShadCN)
- Acessibilidade implementada com `aria-label` e semântica adequada
- Estados de carregamento para melhor UX
- Tratamento robusto de erros
- Código reutilizável e modular
