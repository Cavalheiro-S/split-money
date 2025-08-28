import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sign-in');
  });

  test('deve exibir formulário de login', async ({ page }) => {
    // Verifica se está na página de login
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Verifica se os campos do formulário estão presentes
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    
    // Verifica se o botão de login está presente
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    // Tenta submeter formulário vazio
    await page.locator('button[type="submit"]').click();
    
    // Aguarda um pouco para as validações aparecerem
    await page.waitForTimeout(500);
    
    // Verifica se mensagens de erro aparecem (ajuste conforme sua implementação)
    const errorMessages = page.locator('[role="alert"], .error, [data-error]');
    await expect(errorMessages.first()).toBeVisible();
  });

  test('deve navegar para página de registro', async ({ page }) => {
    // Procura por link de registro
    const registerLink = page.locator('a[href*="sign-up"], a[href*="register"]').first();
    
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/.*sign-up|.*register/);
    }
  });
});
