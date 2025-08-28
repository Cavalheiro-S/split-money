import { defineConfig } from '@playwright/test';

/**
 * Configurações de ambiente para testes
 */
export default defineConfig({
  use: {
    // Configurações específicas para ambiente de teste
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Timeout para ações
    actionTimeout: 10000,
    navigationTimeout: 15000,
    
    // Configurações de viewport
    viewport: { width: 1280, height: 720 },
    
    // Configurações de vídeo e screenshot
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    
    // Configurações de trace
    trace: 'on-first-retry',
  },
  
  // Configurações globais
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  
  // Configurações de retry
  retries: process.env.CI ? 2 : 0,
  
  // Configurações de workers
  workers: process.env.CI ? 1 : undefined,
});
