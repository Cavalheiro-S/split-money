/**
 * Rate Limiter client-side para prevenir abuso de API
 * Limita número de requisições por janela de tempo
 */

interface RateLimiterOptions {
  maxRequests: number // Máximo de requisições permitidas
  windowMs: number // Janela de tempo em milissegundos
}

export class ClientRateLimiter {
  private requests = new Map<string, number[]>()
  private maxRequests: number
  private windowMs: number

  constructor(options: Partial<RateLimiterOptions> = {}) {
    this.maxRequests = options.maxRequests || 10
    this.windowMs = options.windowMs || 60000 // 1 minuto padrão
  }

  /**
   * Verifica se pode fazer uma requisição para o endpoint
   * @param key - Identificador único (geralmente endpoint)
   * @returns true se pode fazer requisição, false se excedeu limite
   */
  canMakeRequest(key: string): boolean {
    const now = Date.now()
    const timestamps = this.requests.get(key) || []

    // Remove timestamps fora da janela de tempo
    const validTimestamps = timestamps.filter(
      (ts) => now - ts < this.windowMs
    )

    if (validTimestamps.length >= this.maxRequests) {
      return false
    }

    // Adiciona timestamp atual
    validTimestamps.push(now)
    this.requests.set(key, validTimestamps)
    return true
  }

  /**
   * Retorna quantas requisições ainda podem ser feitas
   * @param key - Identificador único (geralmente endpoint)
   * @returns Número de requisições restantes
   */
  getRemainingRequests(key: string): number {
    const now = Date.now()
    const timestamps = this.requests.get(key) || []

    const validTimestamps = timestamps.filter(
      (ts) => now - ts < this.windowMs
    )

    return Math.max(0, this.maxRequests - validTimestamps.length)
  }

  /**
   * Retorna tempo em ms até a próxima requisição disponível
   * @param key - Identificador único (geralmente endpoint)
   * @returns Milissegundos até poder fazer nova requisição, ou 0 se já pode
   */
  getTimeUntilReset(key: string): number {
    const timestamps = this.requests.get(key) || []
    
    if (timestamps.length === 0) return 0

    const now = Date.now()
    const validTimestamps = timestamps.filter(
      (ts) => now - ts < this.windowMs
    )

    if (validTimestamps.length < this.maxRequests) {
      return 0
    }

    // Tempo até o timestamp mais antigo sair da janela
    const oldestTimestamp = validTimestamps[0]
    return Math.max(0, this.windowMs - (now - oldestTimestamp))
  }

  /**
   * Limpa histórico de requisições para um endpoint
   * @param key - Identificador único (geralmente endpoint)
   */
  clear(key: string): void {
    this.requests.delete(key)
  }

  /**
   * Limpa todo o histórico
   */
  clearAll(): void {
    this.requests.clear()
  }
}

// Instância global com valores padrão
export const globalRateLimiter = new ClientRateLimiter({
  maxRequests: 20,
  windowMs: 60000, // 20 requisições por minuto
})
