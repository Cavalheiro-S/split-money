import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Aguarda até que a página esteja completamente carregada
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Preenche um campo de formulário com validação
   */
  async fillField(selector: string, value: string) {
    await this.page.locator(selector).fill(value);
    await this.page.locator(selector).blur();
  }

  /**
   * Clica em um elemento e aguarda navegação
   */
  async clickAndWaitForNavigation(selector: string) {
    await Promise.all([
      this.page.waitForURL('**'),
      this.page.locator(selector).click()
    ]);
  }

  /**
   * Verifica se um toast/notificação aparece
   */
  async expectToast(message?: string) {
    const toast = this.page.locator('[role="alert"], .toast, [data-toast]');
    await expect(toast.first()).toBeVisible();
    
    if (message) {
      await expect(toast.first()).toContainText(message);
    }
  }

  /**
   * Faz login com credenciais de teste
   */
  async login(email: string = 'test@example.com', password: string = 'password123') {
    await this.page.goto('/sign-in');
    
    await this.fillField('input[name="email"]', email);
    await this.fillField('input[name="password"]', password);
    
    await this.page.locator('button[type="submit"]').click();
    
    // Aguarda redirecionamento após login
    await this.page.waitForURL('**/dashboard**');
  }

  /**
   * Verifica se está logado (presença de elementos do dashboard)
   */
  async expectLoggedIn() {
    await expect(this.page.locator('body')).not.toContainText('Sign In');
    await expect(this.page).toHaveURL(/.*dashboard|.*logged/);
  }
}
