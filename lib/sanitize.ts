import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitiza uma string removendo conteúdo HTML/scripts perigosos
 * @param input - String potencialmente perigosa
 * @returns String sanitizada
 */
export function sanitizeInput(input: string): string {
  if (!input) return input

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove todas as tags HTML
    ALLOWED_ATTR: [], // Remove todos os atributos
  })
}

/**
 * Sanitiza todos os campos string de um objeto
 * @param data - Objeto com dados a serem sanitizados
 * @returns Objeto com strings sanitizadas
 */
export function sanitizeFormData<T extends Record<string, unknown>>(
  data: T
): T {
  const sanitized = {} as T

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Sanitiza recursivamente objetos aninhados
      sanitized[key as keyof T] = sanitizeFormData(value as Record<string, unknown>) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value as T[keyof T]
    }
  }

  return sanitized
}

/**
 * Sanitiza HTML permitindo apenas tags seguras (para rich text)
 * @param html - HTML a ser sanitizado
 * @returns HTML sanitizado com tags permitidas
 */
export function sanitizeHTML(html: string): string {
  if (!html) return html

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  })
}
