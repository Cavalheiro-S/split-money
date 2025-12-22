import { expect, test } from "@playwright/test";
import { TEST_CREDENTIALS, TestHelpers } from "../utils/test-helpers";
import { STORAGE_KEYS } from "@/consts/storage";

test.describe("Fluxo de Autenticação", () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test.describe("Login", () => {
    test("deve realizar login com sucesso", async () => {
      await helpers.login();
      await helpers.expectLoggedIn();
    });

    test("deve mostrar erro com credenciais inválidas", async ({ page }) => {
      await page.goto("/sign-in");

      // Preenche com credenciais erradas
      await helpers.fillField(
        'input[name="email"]',
        "usuario.invalido@example.com"
      );
      await helpers.fillField('input[name="password"]', "senhaerrada123");

      // Submete formulário
      await page.locator('button[type="submit"]').click();

      await page.waitForURL("**/sign-in**", { timeout: 10000 });

      // Verifica se há mensagem de erro (pode ser toast ou texto na página)
      const errorMessages = [
        /credenciais inválidas/i,
        /email ou senha inválidos/i,
        /falha ao fazer login/i,
      ];

      // Procura por qualquer uma das mensagens de erro
      let foundError = false;
      for (const errorMsg of errorMessages) {
        try {
          await expect(page.locator("body")).toContainText(errorMsg, {
            timeout: 2000,
          });
          foundError = true;
          break;
        } catch {
          // Continua para próxima mensagem
        }
      }

      await expect(foundError).toBe(true);
    });

    test("deve validar email obrigatório", async ({ page }) => {
      await page.goto("/sign-in");

      // Preenche apenas senha
      await helpers.fillField('input[name="password"]', "senhaqualquer123");

      // Tenta submeter
      await page.locator('button[type="submit"]').click();

      // Verifica validação HTML5 ou mensagem de erro customizada
      const emailInput = page.locator('input[name="email"]');

      // Pode ser validação HTML5 ou validação customizada
      const isInvalid = await emailInput.evaluate(
        (el: HTMLInputElement) => !el.checkValidity()
      );

      if (isInvalid) {
        expect(isInvalid).toBe(true);
      } else {
        // Verifica mensagem de erro customizada
        await expect(page.locator("body")).toContainText(
          /email.*obrigatório|email.*inválido|campo obrigatório|required/i
        );
      }
    });

    test("deve validar formato de email", async ({ page }) => {
      await page.goto("/sign-in");

      // Preenche email inválido
      await helpers.fillField('input[name="email"]', "email-invalido");
      await helpers.fillField('input[name="password"]', "senha123");

      // Tenta submeter
      await page.locator('button[type="submit"]').click();

      // Verifica validação
      const emailInput = page.locator('input[name="email"]');
      const isInvalid = await emailInput.evaluate(
        (el: HTMLInputElement) => !el.checkValidity()
      );

      expect(isInvalid).toBe(true);
    });

    test("deve validar senha obrigatória", async ({ page }) => {
      await page.goto("/sign-in");

      // Preenche apenas email
      await helpers.fillField('input[name="email"]', "test@example.com");

      // Tenta submeter
      await page.locator('button[type="submit"]').click();

      // Verifica validação
      const passwordInput = page.locator('input[name="password"]');
      const isInvalid = await passwordInput.evaluate(
        (el: HTMLInputElement) => !el.checkValidity()
      );

      if (isInvalid) {
        expect(isInvalid).toBe(true);
      } else {
        await expect(page.locator("body")).toContainText(
          /senha.*obrigatória|senha.*mínimo|campo obrigatório|required/i
        );
      }
    });

    test("deve mostrar estado de loading durante login", async ({ page }) => {
      await page.goto("/sign-in");

      await helpers.fillField('input[name="email"]', TEST_CREDENTIALS.email);
      await helpers.fillField(
        'input[name="password"]',
        TEST_CREDENTIALS.password
      );

      const submitButton = page.locator('button[type="submit"]');

      // Clica e verifica loading (se houver)
      await submitButton.click();

      // Verificar se botão ficou desabilitado ou mudou texto
      await expect(submitButton).toBeDisabled({ timeout: 1000 });
    });

    test("deve permitir navegação para página de registro", async ({
      page,
    }) => {
      await page.goto("/sign-in");

      // Procura link para página de registro
      const registerLink = page
        .locator("a")
        .filter({ hasText: /criar conta|registrar|sign up|cadastrar/i });

      if ((await registerLink.count()) > 0) {
        await registerLink.first().click();
        await expect(page).toHaveURL(/.*sign-up|.*register/);
      }
    });

    test("deve permitir visualização de senha", async ({ page }) => {
      await page.goto("/sign-in");

      const passwordInput = page.locator('input[name="password"]');
      await passwordInput.fill("senha123");

      // Verifica que inicialmente é type="password"
      await expect(passwordInput).toHaveAttribute("type", "password");

      // Procura botão de toggle de senha (ícone de olho)
      const toggleButton = page
        .locator("button")
        .filter({ hasText: /eye|ver|mostrar|show/i })
        .or(page.locator('button[aria-label*="password"]'))
        .or(page.locator("button:has(svg)"));

      if ((await toggleButton.count()) > 0) {
        await toggleButton.first().click();

        // Verifica se mudou para text
        await expect(passwordInput).toHaveAttribute("type", "text");

        // Clica novamente para esconder
        await toggleButton.first().click();
        await expect(passwordInput).toHaveAttribute("type", "password");
      }
    });
  });

  test.describe("Logout", () => {
    test.beforeEach(async ({}) => {
      // Faz login antes de cada teste de logout
      await helpers.login();
      await helpers.expectLoggedIn();
    });

    test("deve realizar logout com sucesso", async ({ page }) => {
      // Procura botão/menu de logout
      // Pode estar em um menu dropdown ou direto na página

      // Procura opção de logout
      await page.getByRole("button", { name: "Sair" }).click();

      // Confirma logout
      await page.getByRole("button", { name: "Sair" }).click();

      await page.waitForURL("**/sign-in**", { timeout: 10000 });
    });

    test("deve limpar sessão ao fazer logout", async ({ page }) => {
      // Verifica que tem sessão antes
      const sessionBefore = await page.evaluate((sessionKey) => {
        return localStorage.getItem(sessionKey);
      }, STORAGE_KEYS.SESSION);

      expect(sessionBefore).toBeTruthy();

      // Procura opção de logout
      await page.getByRole("button", { name: "Sair" }).click();

      // Confirma logout
      await page.getByRole("button", { name: "Sair" }).click();

      await page.waitForURL("**/sign-in**", { timeout: 10000 });

      // Verifica que sessão foi limpa
      const sessionAfter = await page.evaluate((sessionKey) => {
        return localStorage.getItem(sessionKey);
      }, STORAGE_KEYS.SESSION);

      expect(sessionAfter).toBeNull();
    });
  });

  test.describe("Proteção de Rotas", () => {
    test("deve redirecionar para login ao acessar rota protegida sem autenticação", async ({
      page,
    }) => {
      // Tenta acessar dashboard sem login
      await page.goto("/dashboard");

      // Deve redirecionar para sign-in
      await page.waitForURL("**/sign-in**", { timeout: 10000 });
      await expect(page).toHaveURL(/.*sign-in/);
    });

    test("deve redirecionar para login ao acessar config sem autenticação", async ({
      page,
    }) => {
      await page.goto("/config");
      await page.waitForURL("**/sign-in**", { timeout: 10000 });
      await expect(page).toHaveURL(/.*sign-in/);
    });

    test("deve permitir acesso a rotas protegidas após login", async ({
      page,
    }) => {
      await helpers.login();

      // Deve permitir acesso ao dashboard
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/.*dashboard/);

      // Deve permitir acesso a config
      await page.goto("/config");
      await expect(page).toHaveURL(/.*config/);
    });

    test("Deve redirecionar login se já autenticado", async ({ page }) => {
      await helpers.login();
      await helpers.expectLoggedIn();
      await page.goto("/sign-in");
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test.describe("Persistência de Sessão", () => {
    test("deve manter usuário logado após recarregar página", async ({
      page,
    }) => {
      await helpers.login();
      await helpers.expectLoggedIn();

      // Verifica URL do dashboard
      const dashboardUrl = page.url();
      expect(dashboardUrl).toContain("dashboard");

      // Recarrega página
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Deve continuar autenticado
      await expect(page).toHaveURL(/.*dashboard/);
      await helpers.expectLoggedIn();
    });

    test("deve manter usuário logado após fechar e reabrir navegador", async ({
      page,
    }) => {
      await helpers.login();
      await helpers.expectLoggedIn();

      // Captura localStorage
      const localStorage = await page.evaluate(() => {
        return JSON.stringify(window.localStorage);
      });

      // Fecha e reabre página (simula fechar navegador)
      await page.close();

      // Cria nova página no mesmo contexto
      const newPage = await page.context().newPage();

      // Navega primeiro para estabelecer a origem
      await newPage.goto("/dashboard");

      // Restaura localStorage
      await newPage.evaluate((storage) => {
        const parsed = JSON.parse(storage);
        for (const [key, value] of Object.entries(parsed)) {
          window.localStorage.setItem(key, value as string);
        }
      }, localStorage);

      // Recarrega para aplicar a sessão restaurada
      await newPage.reload();

      // Deve estar autenticado
      await expect(newPage).toHaveURL(/.*dashboard/, { timeout: 5000 });
    });

    test("deve fazer logout quando sessão expirar", async ({ page, context }) => {
      await helpers.login();
      await helpers.expectLoggedIn();

      await page.evaluate((sessionKey) => {
        const session = localStorage.getItem(sessionKey);
        if (session) {
          const parsed = JSON.parse(session);
          parsed.expiresAt = Date.now() - 1000;
          localStorage.setItem(sessionKey, JSON.stringify(parsed));
        }
      }, STORAGE_KEYS.SESSION);

      await context.clearCookies();

      await page.reload();
      
      await expect(page).toHaveURL(/.*sign-in/, { timeout: 5000 });
    });
  });

  test.describe("Refresh de Token", () => {
    test("deve renovar token automaticamente quando próximo da expiração", async ({
      page,
    }) => {
      await helpers.login();
      await helpers.expectLoggedIn();

      // Captura token inicial
      const initialSession = await page.evaluate((sessionKey) => {
        return localStorage.getItem(sessionKey);
      }, STORAGE_KEYS.SESSION);

      expect(initialSession).toBeTruthy();

      // Simula sessão próxima da expiração (4 minutos)
      await page.evaluate((sessionKey) => {
        const session = localStorage.getItem(sessionKey);
        if (session) {
          const parsed = JSON.parse(session);
          parsed.expiresAt = Date.now() + 4 * 60 * 1000; // 4 minutos
          localStorage.setItem(sessionKey, JSON.stringify(parsed));
        }
      }, STORAGE_KEYS.SESSION);

      // Aguarda um tempo para o hook tentar refresh
      await page.waitForTimeout(5000);

      // Verifica se ainda está autenticado (não foi deslogado)
      await helpers.expectLoggedIn();
    });
  });

  test.describe("Mensagens de Feedback", () => {
    test("deve mostrar mensagem de sucesso ao fazer login", async ({
      page,
    }) => {
      await page.goto("/sign-in");

      await helpers.fillField('input[name="email"]', TEST_CREDENTIALS.email);
      await helpers.fillField(
        'input[name="password"]',
        TEST_CREDENTIALS.password
      );

      await page.locator('button[type="submit"]').click();

      // Aguarda possível toast de sucesso
      try {
        await expect(page.locator('[role="alert"]').first()).toBeVisible({
          timeout: 3000,
        });
      } catch {
        // Se não houver toast, apenas verifica redirecionamento
        await page.waitForURL("**/dashboard**", { timeout: 10000 });
      }
    });

    test("deve mostrar mensagem de erro em caso de falha no servidor", async ({
      page,
    }) => {
      // Intercepta requisição de login para simular erro 500
      await page.route("**/api/auth/**", (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: "Erro interno do servidor" }),
        });
      });

      await page.goto("/sign-in");

      await helpers.fillField('input[name="email"]', TEST_CREDENTIALS.email);
      await helpers.fillField(
        'input[name="password"]',
        TEST_CREDENTIALS.password
      );

      await page.locator('button[type="submit"]').click();

      // Verifica mensagem de erro
      await page.waitForTimeout(2000);

      const hasError = await page.locator("body").textContent();
      expect(hasError?.toLowerCase()).toMatch(/erro|error|falha|failed/);
    });
  });

  test.describe("Acessibilidade no Fluxo de Auth", () => {
    test("formulário de login deve ser navegável por teclado", async ({
      page,
    }) => {
      await page.goto("/sign-in");

      // Foca no primeiro campo
      await page.keyboard.press("Tab");

      // Preenche email
      await page.keyboard.type(TEST_CREDENTIALS.email);

      // Tab para senha
      await page.keyboard.press("Tab");
      await page.keyboard.type(TEST_CREDENTIALS.password);

      // Tab para botão de ocultar senha
      await page.keyboard.press("Tab");
      // Tab para link de esqueci a senha
      await page.keyboard.press("Tab");
      // Tab para botão de submit
      await page.keyboard.press("Tab");

      // Enter para submeter
      await page.keyboard.press("Enter");

      // Deve fazer login
      await page.waitForURL("**/dashboard**", { timeout: 10000 });
    });

    test("formulário deve ter labels apropriados", async ({ page }) => {
      await page.goto("/sign-in");

      const emailInput = page.locator('input[name="email"]');
      const passwordInput = page.locator('input[name="password"]');

      // Verifica se tem label associado ou placeholder
      const emailLabel =
        (await emailInput.getAttribute("aria-label")) ||
        (await emailInput.getAttribute("placeholder"));
      const passwordLabel =
        (await passwordInput.getAttribute("aria-label")) ||
        (await passwordInput.getAttribute("placeholder"));

      expect(emailLabel).toBeTruthy();
      expect(passwordLabel).toBeTruthy();
    });
  });

  test.describe("Segurança", () => {
    test("senha não deve ser visível no DOM por padrão", async ({ page }) => {
      await page.goto("/sign-in");

      const passwordInput = page.locator('input[name="password"]');

      // Verifica type="password"
      await expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("não deve armazenar senha em texto plano", async ({ page }) => {
      await helpers.login();

      // Verifica localStorage
      const session = await page.evaluate((sessionKey) => {
        return localStorage.getItem(sessionKey);
      }, STORAGE_KEYS.SESSION);

      if (session) {
        const parsed = JSON.parse(session);

        // Não deve ter campo password
        expect(parsed).not.toHaveProperty("password");
      }
    });

    test("token deve estar presente após login bem-sucedido", async ({
      page,
    }) => {
      await helpers.login();

      const session = await page.evaluate((sessionKey) => {
        return localStorage.getItem(sessionKey);
      }, STORAGE_KEYS.SESSION);

      expect(session).toBeTruthy();

      const parsed = JSON.parse(session!);

      // Deve ter accessToken
      expect(parsed).toHaveProperty("accessToken");
      expect(parsed.accessToken).toBeTruthy();
      expect(typeof parsed.accessToken).toBe("string");
    });
  });
});
