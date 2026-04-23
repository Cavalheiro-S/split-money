import { describe, expect, it } from "vitest";
import { applyCategoryRules } from "@/lib/category-rules";

const makeCategory = (id: string, description: string): Category => ({
    id,
    description,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
});

const CATEGORIES: Category[] = [
    makeCategory("cat-1", "Transporte"),
    makeCategory("cat-2", "Assinaturas"),
    makeCategory("cat-3", "Conta & Tributos"),
    makeCategory("cat-4", "Alimentação"),
    makeCategory("cat-5", "Saúde"),
];

describe("applyCategoryRules", () => {
    it("matches Uber → Transporte", () => {
        const result = applyCategoryRules("DL*Uberrides", CATEGORIES);
        expect(result?.id).toBe("cat-1");
    });

    it("matches Apple → Assinaturas", () => {
        const result = applyCategoryRules("Apple.Com/Bill", CATEGORIES);
        expect(result?.id).toBe("cat-2");
    });

    it("returns undefined when no rule matches", () => {
        const result = applyCategoryRules("XPTO Desconhecido", CATEGORIES);
        expect(result).toBeUndefined();
    });

    it("returns undefined when rule matches but no category found", () => {
        // Uber matches transport rule but no matching category in the list
        const result = applyCategoryRules("Uber", [makeCategory("cat-x", "Outros")]);
        expect(result).toBeUndefined();
    });

    it("matches Netflix → Assinaturas", () => {
        const result = applyCategoryRules("NETFLIX.COM", CATEGORIES);
        expect(result?.id).toBe("cat-2");
    });

    it("matches Claro → Conta & Tributos", () => {
        const result = applyCategoryRules("Claro Fatura", CATEGORIES);
        expect(result?.id).toBe("cat-3");
    });

    it("matches iFood → Alimentação", () => {
        const result = applyCategoryRules("IFOOD*Pedido", CATEGORIES);
        expect(result?.id).toBe("cat-4");
    });

    it("is case-insensitive on description", () => {
        const result = applyCategoryRules("UBER TECHNOLOGIES", CATEGORIES);
        expect(result?.id).toBe("cat-1");
    });

    it("returns undefined with empty categories list", () => {
        const result = applyCategoryRules("Uber", []);
        expect(result).toBeUndefined();
    });
});
