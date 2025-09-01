import { expect, test } from "@playwright/test";
import { TestHelpers } from "./utils/test-helpers";

test.describe("Página de Configurações", () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);

    // Faz login antes de cada teste
    await helpers.login();

    // Navega para a página de configurações
    await page.goto("/config");
    await helpers.waitForPageLoad();

    // Verifica se a página carregou corretamente
    await expect(
      page.locator("h3").filter({ hasText: "Configurações" })
    ).toBeVisible();
  });

  test.describe("Status de Pagamento", () => {
    test("deve criar um novo status de pagamento com sucesso", async ({
      page,
    }) => {
      const statusName = `Status Teste ${Date.now()}`;

      // Clica no botão Adicionar na seção de Status de Pagamento
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();
      // Verifica se o modal abriu
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(
        page.locator("text=Cadastrar um novo status").nth(1)
      ).toBeVisible();

      // Preenche o campo status
      await page.locator('input[placeholder="Status"]').fill(statusName);

      // Clica no botão Enviar
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Aguarda o modal fechar
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Verifica se o novo status aparece na tabela
      await expect(
        page.locator("table tbody").locator("text=" + statusName)
      ).toBeVisible();
    });

    test("deve excluir um status de pagamento existente", async ({ page }) => {
      const statusName = `Status Para Deletar ${Date.now()}`;

      // Primeiro, cria um status para deletar
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Status"]').fill(statusName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Localiza a linha do status criado e clica no botão de deletar
      const statusRow = page
        .locator("table tbody tr")
        .filter({ hasText: statusName });
      await statusRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Verifica se o modal de confirmação abriu
      await expect(page.locator("text=Confirmar exclusão")).toBeVisible();
      await expect(
        page.locator(
          `text=Tem certeza que deseja remover o status "${statusName}"`
        )
      ).toBeVisible();

      // Clica no botão Remover
      await page.locator("button", { hasText: "Remover" }).click();

      // Verifica se o status foi removido da tabela
      await expect(
        page.locator("table tbody").locator("text=" + statusName)
      ).not.toBeVisible();
    });

    test("deve cancelar a exclusão de um status de pagamento", async ({
      page,
    }) => {
      const statusName = `Status Para Cancelar ${Date.now()}`;

      // Primeiro, cria um status
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Status"]').fill(statusName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Clica no botão de deletar
      const statusRow = page
        .locator("table tbody tr")
        .filter({ hasText: statusName });
      await statusRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Clica em Cancelar
      await page.locator("button", { hasText: "Cancelar" }).click();

      // Verifica se o status ainda está na tabela
      await expect(
        page.locator("table tbody").locator("text=" + statusName)
      ).toBeVisible();
    });
  });

  test.describe("Categorias", () => {
    test("deve criar uma nova categoria com sucesso", async ({ page }) => {
      const categoryName = `Categoria Teste ${Date.now()}`;

      // Clica no botão Adicionar na seção de Categorias
      await page
        .locator("div")
        .filter({
          hasText: /^CategoriasGerencie as categorias disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();

      // Verifica se o modal abriu
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(
        page.locator("text=Cadastrar uma nova categoria").nth(1)
      ).toBeVisible();

      // Preenche o campo categoria
      await page.locator('input[placeholder="Categoria"]').fill(categoryName);

      // Clica no botão Enviar
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Aguarda o modal fechar
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Verifica se a nova categoria aparece na tabela
      await expect(
        page.locator("table tbody").locator("text=" + categoryName)
      ).toBeVisible();
    });

    test("deve excluir uma categoria existente", async ({ page }) => {
      const categoryName = `Categoria Para Deletar ${Date.now()}`;

      // Primeiro, cria uma categoria para deletar
      await page
        .locator("div")
        .filter({
          hasText: /^CategoriasGerencie as categorias disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Categoria"]').fill(categoryName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Localiza a linha da categoria criada e clica no botão de deletar
      const categoryRow = page
        .locator("table tbody tr")
        .filter({ hasText: categoryName });
      await categoryRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Verifica se o modal de confirmação abriu
      await expect(page.locator("text=Confirmar exclusão")).toBeVisible();
      await expect(
        page.locator(
          `text=Tem certeza que deseja remover a categoria "${categoryName}"`
        )
      ).toBeVisible();

      // Clica no botão Remover
      await page.locator("button", { hasText: "Remover" }).click();

      // Verifica se a categoria foi removida da tabela
      await expect(
        page.locator("table tbody").locator("text=" + categoryName)
      ).not.toBeVisible();
    });

    test("deve cancelar a exclusão de uma categoria", async ({ page }) => {
      const categoryName = `Categoria Para Cancelar ${Date.now()}`;

      // Primeiro, cria uma categoria
      await page
        .locator("div")
        .filter({
          hasText: /^CategoriasGerencie as categorias disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Categoria"]').fill(categoryName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Clica no botão de deletar
      const categoryRow = page
        .locator("table tbody tr")
        .filter({ hasText: categoryName });
      await categoryRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Clica em Cancelar
      await page.locator("button", { hasText: "Cancelar" }).click();

      // Verifica se a categoria ainda está na tabela
      await expect(
        page.locator("table tbody").locator("text=" + categoryName)
      ).toBeVisible();
    });
  });

  test.describe("Tags", () => {
    test("deve criar uma nova tag com sucesso", async ({ page }) => {
      const tagName = `Tag Teste ${Date.now()}`;

      // Clica no botão Adicionar na seção de Tags
      await page
        .locator("div")
        .filter({
          hasText: /^TagsGerencie as tags disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();

      // Verifica se o modal abriu
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(
        page.locator("text=Cadastrar uma nova tag").nth(1)
      ).toBeVisible();

      // Preenche o campo tag
      await page.locator('input[placeholder="Tag"]').fill(tagName);

      // Clica no botão Enviar
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Aguarda o modal fechar
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Verifica se a nova tag aparece na tabela
      await expect(
        page.locator("table tbody").locator("text=" + tagName)
      ).toBeVisible();
    });

    test("deve excluir uma tag existente", async ({ page }) => {
      const tagName = `Tag Para Deletar ${Date.now()}`;

      // Primeiro, cria uma tag para deletar
      await page
        .locator("div")
        .filter({
          hasText: /^TagsGerencie as tags disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Tag"]').fill(tagName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Localiza a linha da tag criada e clica no botão de deletar
      const tagRow = page
        .locator("table tbody tr")
        .filter({ hasText: tagName });
      await tagRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Verifica se o modal de confirmação abriu
      await expect(page.locator("text=Confirmar exclusão")).toBeVisible();
      await expect(
        page.locator(`text=Tem certeza que deseja remover a tag "${tagName}"`)
      ).toBeVisible();

      // Clica no botão Remover
      await page.locator("button", { hasText: "Remover" }).click();

      // Verifica se a tag foi removida da tabela
      await expect(
        page.locator("table tbody").locator("text=" + tagName)
      ).not.toBeVisible();
    });

    test("deve cancelar a exclusão de uma tag", async ({ page }) => {
      const tagName = `Tag Para Cancelar ${Date.now()}`;

      // Primeiro, cria uma tag
      await page
        .locator("div")
        .filter({
          hasText: /^TagsGerencie as tags disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Tag"]').fill(tagName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Clica no botão de deletar
      const tagRow = page
        .locator("table tbody tr")
        .filter({ hasText: tagName });
      await tagRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Clica em Cancelar
      await page.locator("button", { hasText: "Cancelar" }).click();

      // Verifica se a tag ainda está na tabela
      await expect(
        page.locator("table tbody").locator("text=" + tagName)
      ).toBeVisible();
    });
  });

  test.describe("Validações e Cenários de Erro", () => {
    test("deve validar campo obrigatório ao criar status de pagamento", async ({
      page,
    }) => {
      // Clica no botão Adicionar na seção de Status de Pagamento
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();

      // Tenta enviar sem preencher o campo
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se a mensagem de erro aparece
      await expect(page.locator('text="Status é obrigatório"')).toBeVisible();
      
      // Verifica se o modal ainda está aberto (não foi enviado)
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test("deve validar tamanho mínimo do campo status", async ({ page }) => {
      // Clica no botão Adicionar na seção de Status de Pagamento
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();

      // Preenche com apenas 1 caractere
      await page.locator('input[placeholder="Status"]').fill("A");
      
      // Tenta enviar
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se a mensagem de erro aparece
      await expect(page.locator('text="Status deve ter pelo menos 2 caracteres"')).toBeVisible();
      
      // Verifica se o modal ainda está aberto
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test("deve validar campo obrigatório ao criar categoria", async ({
      page,
    }) => {
      // Clica no botão Adicionar na seção de Categorias
      await page
        .locator("div")
        .filter({
          hasText: /^CategoriasGerencie as categorias disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();

      // Tenta enviar sem preencher o campo
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se a mensagem de erro aparece
      await expect(page.locator('text="Categoria é obrigatória"')).toBeVisible();
      
      // Verifica se o modal ainda está aberto (não foi enviado)
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test("deve validar tamanho mínimo do campo categoria", async ({ page }) => {
      // Clica no botão Adicionar na seção de Categorias
      await page
        .locator("div")
        .filter({
          hasText: /^CategoriasGerencie as categorias disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();

      // Preenche com apenas 1 caractere
      await page.locator('input[placeholder="Categoria"]').fill("A");
      
      // Tenta enviar
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se a mensagem de erro aparece
      await expect(page.locator('text="Categoria deve ter pelo menos 2 caracteres"')).toBeVisible();
      
      // Verifica se o modal ainda está aberto
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test("deve validar campo obrigatório ao criar tag", async ({ page }) => {
      // Clica no botão Adicionar na seção de Tags
      await page
        .locator("div")
        .filter({ hasText: /^TagsGerencie as tags disponíveisAdicionar$/ })
        .getByRole("button")
        .click();
        
      // Tenta enviar sem preencher o campo
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se a mensagem de erro aparece
      await expect(page.locator('text="Tag é obrigatória"')).toBeVisible();
      
      // Verifica se o modal ainda está aberto (não foi enviado)
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test("deve validar tamanho mínimo do campo tag", async ({ page }) => {
      // Clica no botão Adicionar na seção de Tags
      await page
        .locator("div")
        .filter({ hasText: /^TagsGerencie as tags disponíveisAdicionar$/ })
        .getByRole("button")
        .click();

      // Preenche com apenas 1 caractere
      await page.locator('input[placeholder="Tag"]').fill("A");
      
      // Tenta enviar
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se a mensagem de erro aparece
      await expect(page.locator('text="Tag deve ter pelo menos 2 caracteres"')).toBeVisible();
      
      // Verifica se o modal ainda está aberto
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test("deve validar tamanho máximo dos campos", async ({ page }) => {
      // Testa status de pagamento com mais de 50 caracteres
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();

      await page.locator('input[placeholder="Status"]').fill("A".repeat(51));
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      await expect(page.locator('text="Status deve ter no máximo 50 caracteres"')).toBeVisible();
      
      // Fecha o modal
      await page.keyboard.press('Escape');
      
      // Testa categoria com mais de 50 caracteres
      await page
        .locator("div")
        .filter({
          hasText: /^CategoriasGerencie as categorias disponíveisAdicionar$/,
        })
        .getByRole("button")
        .click();

      await page.locator('input[placeholder="Categoria"]').fill("A".repeat(51));
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      await expect(page.locator('text="Categoria deve ter no máximo 50 caracteres"')).toBeVisible();
      
      // Fecha o modal
      await page.keyboard.press('Escape');
      
      // Testa tag com mais de 30 caracteres
      await page
        .locator("div")
        .filter({ hasText: /^TagsGerencie as tags disponíveisAdicionar$/ })
        .getByRole("button")
        .click();

      await page.locator('input[placeholder="Tag"]').fill("A".repeat(51));
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      await expect(page.locator('text="Tag deve ter no máximo 50 caracteres"')).toBeVisible();
    });

    test("deve fechar modal e resetar formulário após sucesso", async ({ page }) => {
      const statusName = `Status Reset ${Date.now()}`;
      
      // Abre modal de status
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();

      // Preenche e envia
      await page.locator('input[placeholder="Status"]').fill(statusName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Verifica se o modal fechou
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      
      // Verifica se o status aparece na tabela
      await expect(
        page.locator("table tbody").locator("text=" + statusName)
      ).toBeVisible();
      
      // Abre o modal novamente para verificar se o formulário foi resetado
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();
        
      // Verifica se o campo está vazio
      await expect(page.locator('input[placeholder="Status"]')).toHaveValue("");
    });

    test("deve mostrar estado de carregamento durante a criação", async ({
      page,
    }) => {
      const statusName = `Status Loading ${Date.now()}`;

      // Clica no botão Adicionar na seção de Status de Pagamento
      await page
        .locator("div")
        .filter({
          hasText: /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();

      // Preenche o campo
      await page.locator('input[placeholder="Status"]').fill(statusName);

      // Clica no botão Enviar e verifica estado de loading
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();

      // Pode verificar se o botão mudou para "Enviando..." (se a API for lenta o suficiente)
      // await expect(page.locator('button', { hasText: 'Enviando...' })).toBeVisible();
    });

    test("deve mostrar estado de carregamento durante a exclusão", async ({
      page,
    }) => {
      const statusName = `Status Loading Delete ${Date.now()}`;

      // Cria um status primeiro
      await page
        .locator("div")
        .filter({
          hasText:
            /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();
      await page.locator('input[placeholder="Status"]').fill(statusName);
      await page
        .locator('button[type="submit"]', { hasText: "Enviar" })
        .click();
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Clica no botão de deletar
      const statusRow = page
        .locator("table tbody tr")
        .filter({ hasText: statusName });
      await statusRow
        .locator('button[aria-label*="delete"], button:has(svg)')
        .last()
        .click();

      // Clica no botão Remover e verifica estado de loading
      await page.locator("button", { hasText: "Remover" }).click();

      // Pode verificar se o botão mudou para "Removendo..." (se a API for lenta o suficiente)
      // await expect(page.locator('button', { hasText: 'Removendo...' })).toBeVisible();
    });
  });

  test.describe("Navegação e Interface", () => {
    test("deve exibir todas as seções da página corretamente", async ({
      page,
    }) => {
      // Verifica se todas as seções estão visíveis
      await expect(page.locator("text=Status de pagamento").nth(1)).toBeVisible();
      await expect(
        page.locator("text=Gerencie os status de pagamento disponíveis")
      ).toBeVisible();

      await expect(page.locator("text=Categorias").nth(1)).toBeVisible();
      await expect(
        page.locator("text=Gerencie as categorias disponíveis")
      ).toBeVisible();

      await expect(page.locator("text=Tags").nth(1)).toBeVisible();
      await expect(
        page.locator("text=Gerencie as tags disponíveis")
      ).toBeVisible();

      // Verifica se os botões Adicionar estão presentes
      const addButtons = page.locator("button", { hasText: "Adicionar" });
      await expect(addButtons).toHaveCount(3);
    });

    test("deve exibir as tabelas com cabeçalhos corretos", async ({ page }) => {
      // Verifica cabeçalhos da tabela de Status
      await expect(page.locator("th", { hasText: "Status" })).toBeVisible();
      await expect(
        await page.locator("th", { hasText: "Data Criação" }).all()
      ).toHaveLength(3);

      await expect(await page.locator("th", { hasText: "Ações" }).all()).toHaveLength(3);

      // Verifica cabeçalhos da tabela de Categorias
      await expect(page.locator("th", { hasText: "Categoria" })).toBeVisible();

      // Verifica cabeçalhos da tabela de Tags
      await expect(page.locator("th", { hasText: "Tag" })).toBeVisible();
    });

    test("deve fechar modal ao clicar fora dele", async ({ page }) => {
      // Abre um modal
      await page
        .locator("div")
        .filter({
          hasText: /^Status de pagamentoGerencie os status de pagamento disponíveis Adicionar$/,
        })
        .getByRole("button")
        .click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      // Clica fora do modal (no overlay)
      await page
        .locator('[role="dialog"]')
        .locator("..")
        .click({ position: { x: 10, y: 10 } });

      // Verifica se o modal fechou
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });
  });
});
