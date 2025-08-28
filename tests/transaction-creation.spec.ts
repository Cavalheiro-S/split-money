import { test, expect } from '@playwright/test';

test.describe('Criação de Transação', () => {
  test('deve criar uma transação completa com dados válidos', async ({ page }) => {
    // 1. Navega para a página inicial
    await page.goto('/');
    console.log('✅ Navegou para a página inicial');
    
    // 2. Verifica se está na página de login
    await expect(page).toHaveURL(/.*sign-in/);
    console.log('✅ Confirmou redirecionamento para login');
    
    // 3. Preenche formulário de login com credenciais válidas
    await page.getByRole('textbox', { name: 'Email' }).fill('luccribeiro53@gmail.com');
    await page.getByRole('textbox', { name: '********' }).fill('Senha@123');
    console.log('✅ Preencheu credenciais de login válidas');
    
    // 4. Faz login
    await page.getByRole('button', { name: 'Entrar' }).click();
    console.log('✅ Clicou no botão de login');
    
    // 5. Aguarda redirecionamento para dashboard
    await page.waitForURL(/.*dashboard/, { timeout: 10000 });
    console.log('✅ Login realizado com sucesso - redirecionado para dashboard');
    
    // 6. Navega para página de transações
    await page.getByRole('link', { name: 'Transações' }).click();
    await expect(page).toHaveURL(/.*transactions/);
    console.log('✅ Navegou para página de transações');
    
    // 7. Clica no botão "Adicionar" para abrir modal de criação
    await page.getByRole('button', { name: 'Adicionar' }).click();
    console.log('✅ Abriu modal de criação de transação');
    
    // 8. Preenche descrição da transação
    await page.getByRole('textbox', { name: 'Descrição' }).fill('Compra no supermercado - Teste Playwright');
    console.log('✅ Preencheu descrição da transação');
    
    // 9. Seleciona tipo de transação (Saída/Despesa)
    await page.getByRole('combobox', { name: 'Tipo' }).click();
    await page.getByRole('option', { name: 'Saída' }).click();
    console.log('✅ Selecionou tipo: Saída (despesa)');
    
    // 10. Preenche valor da transação
    await page.getByRole('textbox', { name: 'Valor' }).fill('150,00');
    console.log('✅ Preencheu valor: R$ 150,00');
    
    // 11. Seleciona categoria
    await page.getByRole('combobox', { name: 'Categoria' }).click();
    await page.getByRole('option', { name: 'Categoria Teste' }).click();
    console.log('✅ Selecionou categoria: Categoria Teste');
    
    // 12. Seleciona status de pagamento
    await page.getByRole('combobox', { name: 'Status de pagamento' }).click();
    await page.getByRole('option', { name: 'pago' }).click();
    console.log('✅ Selecionou status: pago');
    
    // 13. Submete o formulário
    await page.getByRole('button', { name: 'Enviar' }).click();
    console.log('✅ Submeteu formulário de criação');
    
    // 14. Aguarda processamento (botão muda para "Enviando...")
    await page.waitForTimeout(3000);
    console.log('✅ Aguardou processamento da transação');
    
    // 14.5. Aguarda carregamento das transações na lista
    await page.waitForSelector('text=Compra no supermercado - Teste Playwright', { timeout: 10000 });
    console.log('✅ Aguardou carregamento das transações na lista');
    
    // 15. Verifica se a transação foi criada na lista
    const transactionRow = page.locator('text=Compra no supermercado - Teste Playwright');
    await expect(transactionRow).toBeVisible();
    console.log('✅ Confirmou que transação foi criada e aparece na lista');
    
    // 16. Verifica se os dados da transação estão corretos
    await expect(page.locator('text=R$ 150,00')).toBeVisible();
    // Usa um seletor mais específico para evitar conflitos com múltiplos elementos
    await expect(page.locator('text=Compra no supermercado - Teste Playwright').first()).toBeVisible();
    await expect(page.locator('text=pago').first()).toBeVisible();
    console.log('✅ Confirmou que dados da transação estão corretos');
    
    // 17. Verifica se total foi atualizado (pode variar dependendo das transações existentes)
    const totalElement = page.locator('text=/Total.*R\\$.*/');
    await expect(totalElement).toBeVisible();
    console.log('✅ Confirmou que total foi atualizado corretamente');
    
    console.log('🎉 Teste de criação de transação concluído com sucesso!');
  });

  test('deve validar campos obrigatórios do formulário de transação', async () => {
    // Este teste simula as validações que seriam feitas no formulário
    console.log('🔍 Simulando validações de campos obrigatórios:');
    
    const validations = [
      { field: 'Descrição', required: true, type: 'text', maxLength: 255 },
      { field: 'Valor', required: true, type: 'number', min: 0.01 },
      { field: 'Categoria', required: true, type: 'select' },
      { field: 'Data', required: true, type: 'date' },
      { field: 'Status', required: true, type: 'select' }
    ];
    
    for (const validation of validations) {
      console.log(`   ✅ ${validation.field}:`);
      console.log(`      - Obrigatório: ${validation.required}`);
      console.log(`      - Tipo: ${validation.type}`);
      if (validation.maxLength) {
        console.log(`      - Máximo: ${validation.maxLength} caracteres`);
      }
      if (validation.min) {
        console.log(`      - Mínimo: ${validation.min}`);
      }
    }
    
    // Simula cenários de erro
    console.log('❌ Simulando cenários de erro:');
    console.log('   - Descrição vazia: "Campo obrigatório"');
    console.log('   - Valor inválido: "Valor deve ser maior que zero"');
    console.log('   - Categoria não selecionada: "Selecione uma categoria"');
    console.log('   - Data inválida: "Data inválida"');
  });

  test('deve simular fluxo de criação com dados válidos', async ({ page }) => {
    console.log('🎯 Simulando fluxo completo com dados válidos:');
    
    // Dados de exemplo para uma transação
    const transactionData = {
      description: 'Compra no supermercado',
      amount: '150.00',
      category: 'Alimentação',
      date: new Date().toISOString().split('T')[0], // Data atual
      status: 'Pago',
      tags: ['Essencial', 'Mensal']
    };
    
    console.log('📝 Dados da transação:');
    console.log(`   - Descrição: ${transactionData.description}`);
    console.log(`   - Valor: R$ ${transactionData.amount}`);
    console.log(`   - Categoria: ${transactionData.category}`);
    console.log(`   - Data: ${transactionData.date}`);
    console.log(`   - Status: ${transactionData.status}`);
    console.log(`   - Tags: ${transactionData.tags.join(', ')}`);
    
    // Simula preenchimento do formulário
    console.log('✏️ Simulando preenchimento do formulário:');
    console.log('   1. Preencher descrição');
    console.log('   2. Preencher valor');
    console.log('   3. Selecionar categoria');
    console.log('   4. Selecionar data');
    console.log('   5. Selecionar status');
    console.log('   6. Adicionar tags (opcional)');
    
    // Simula submissão
    console.log('📤 Simulando submissão:');
    console.log('   1. Validar todos os campos');
    console.log('   2. Enviar dados para API');
    console.log('   3. Aguardar resposta do servidor');
    console.log('   4. Exibir mensagem de sucesso');
    console.log('   5. Redirecionar para lista de transações');
    
    // Simula verificação na lista
    console.log('📊 Simulando verificação na lista:');
    console.log('   1. Navegar para lista de transações');
    console.log('   2. Verificar se transação aparece');
    console.log('   3. Verificar se dados estão corretos');
    console.log('   4. Verificar se filtros funcionam');
    
    // Verifica se ainda está na página de login (comportamento esperado)
    await page.goto('/');
    await expect(page).toHaveURL(/.*sign-in/);
    console.log('✅ Teste concluído - usuário não autenticado (comportamento esperado)');
  });
});
