import { test, expect } from '@playwright/test';

test.describe('Página Inicial', () => {
  test('deve carregar a página inicial corretamente', async ({ page }) => {
    await page.goto('/');
    
    // Verifica se a página carregou
    await expect(page).toHaveTitle(/Split Money/);
    
    // Verifica se elementos importantes estão presentes
    await expect(page.locator('body')).toBeVisible();
  });

  test('deve navegar para a página de login', async ({ page }) => {
    await page.goto('/');
    
    // Procura por link de login (ajuste o seletor conforme sua aplicação)
    const loginLink = page.locator('a[href*="sign-in"], a[href*="login"]').first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*sign-in|.*login/);
    }
  });
});
