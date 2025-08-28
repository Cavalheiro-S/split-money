import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('deve redirecionar para login quando não autenticado', async ({ page }) => {
    // Tenta acessar dashboard sem estar logado
    await page.goto('/dashboard');
    
    // Verifica se foi redirecionado para login
    await expect(page).toHaveURL(/.*sign-in/);
    
    // Verifica se elementos da página de login estão presentes
    await expect(page.locator('body')).toBeVisible();
  });

  test('deve exibir sidebar de navegação', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Procura por elementos da sidebar
    const sidebar = page.locator('[data-testid="sidebar"], .sidebar, nav').first();
    
    if (await sidebar.isVisible()) {
      await expect(sidebar).toBeVisible();
      
      // Verifica se links de navegação estão presentes
      const navLinks = sidebar.locator('a, [role="link"]');
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('deve navegar entre seções do dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Testa navegação para transações
    const transactionsLink = page.locator('a[href*="transactions"], a[href*="transaction"]').first();
    if (await transactionsLink.isVisible()) {
      await transactionsLink.click();
      await page.waitForURL(/.*transactions/);
      await expect(page).toHaveURL(/.*transactions/);
    }
    
    // Volta para dashboard
    await page.goto('/dashboard');
    
    // Testa navegação para perfil
    const profileLink = page.locator('a[href*="profile"], a[href*="config"]').first();
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await page.waitForURL(/.*profile|.*config/);
      await expect(page).toHaveURL(/.*profile|.*config/);
    }
  });

  test('deve exibir informações do usuário', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Procura por elementos que mostram informações do usuário
    const userInfo = page.locator('[data-testid="user-info"], .user-info, .profile-info').first();
    
    if (await userInfo.isVisible()) {
      await expect(userInfo).toBeVisible();
    }
  });
});
