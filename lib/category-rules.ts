type Rule = {
  pattern: RegExp;
  // Substring(s) to match against category.description (case-insensitive)
  categoryHints: string[];
};

const RULES: Rule[] = [
  {
    pattern: /uber|99taxi|99app|cabify|lyft|indriver|rides|singha|taxi/i,
    categoryHints: ["transporte", "transport"],
  },
  {
    pattern: /apple|netflix|spotify|amazon\s*prime|disney|youtube\s*premium|hbo|globoplay|paramount|deezer|assinatura|subscription/i,
    categoryHints: ["assinatura", "subscription"],
  },
  {
    pattern: /tim\b|claro|vivo\b|\boi\b|boleto|contabilizei|conta\s*luz|conta\s*agua|energia|sabesp|enel|copel|cemig|internet/i,
    categoryHints: ["conta", "tributo", "serviço", "servico"],
  },
  {
    pattern: /mercado|pao\s*de\s*acucar|extra\b|carrefour|atacadao|hortifruti|sacolao|feira|supermercado/i,
    categoryHints: ["mercado", "supermercado", "alimentacao", "alimentação"],
  },
  {
    pattern: /ifood|rappi|delivery|mcdonalds|burger\s*king|subway|pizza|restaurante|lanchonete|padaria/i,
    categoryHints: ["alimentacao", "alimentação", "restaurante"],
  },
  {
    pattern: /farmacia|drogaria|ultrafarma|droga\s*raia|pacheco|remedio|medicamento/i,
    categoryHints: ["saude", "saúde", "farmacia", "farmácia"],
  },
  {
    pattern: /posto|combustivel|shell|ipiranga|br\s*distribuidora|gasolina|etanol/i,
    categoryHints: ["transporte", "combustivel", "combustível"],
  },
];

/**
 * Returns the first Category from `categories` whose description matches
 * a known keyword rule for the given transaction description.
 * Returns undefined when no rule matches or no matching category is found.
 */
export function applyCategoryRules(
  description: string,
  categories: Category[]
): Category | undefined {
  for (const rule of RULES) {
    if (!rule.pattern.test(description)) continue;

    const match = categories.find((c) =>
      rule.categoryHints.some((hint) =>
        c.description.toLowerCase().includes(hint.toLowerCase())
      )
    );

    if (match) return match;
  }

  return undefined;
}
