import { describe, expect, it } from "vitest";
import { parseBrDate, parseBrlAmount, parseCsv } from "@/lib/parsers/csv";

describe("parseCsv", () => {
    it("parses a basic CSV with header row", () => {
        const result = parseCsv("date,title,amount\n2024-01-15,Coffee,12.50\n2024-01-16,Lunch,42.30\n");
        expect(result).toEqual([
            { date: "2024-01-15", title: "Coffee", amount: "12.50" },
            { date: "2024-01-16", title: "Lunch", amount: "42.30" },
        ]);
    });

    it("handles quoted fields with commas", () => {
        const result = parseCsv(`date,title,amount\n2024-01-15,"Restaurante, SP",55.00\n`);
        expect(result).toEqual([{ date: "2024-01-15", title: "Restaurante, SP", amount: "55.00" }]);
    });

    it("handles escaped double quotes", () => {
        const result = parseCsv(`h1,h2\na,"b ""quoted"" c"\n`);
        expect(result[0].h2).toBe('b "quoted" c');
    });

    it("handles CRLF line endings", () => {
        const result = parseCsv("a,b\r\n1,2\r\n3,4\r\n");
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ a: "1", b: "2" });
    });

    it("skips empty rows", () => {
        const result = parseCsv("a,b\n1,2\n\n3,4\n");
        expect(result).toHaveLength(2);
    });

    it("returns empty array on empty input", () => {
        expect(parseCsv("")).toEqual([]);
    });
});

describe("parseBrlAmount", () => {
    it("parses Brazilian format with thousand separator", () => {
        expect(parseBrlAmount("1.234,56")).toBe(1234.56);
    });

    it("parses simple comma-decimal", () => {
        expect(parseBrlAmount("42,30")).toBe(42.3);
    });

    it("parses plain dot-decimal", () => {
        expect(parseBrlAmount("12.50")).toBe(12.5);
    });

    it("strips R$ prefix", () => {
        expect(parseBrlAmount("R$ 99,90")).toBe(99.9);
    });

    it("handles negative values", () => {
        expect(parseBrlAmount("-150,00")).toBe(-150);
    });

    it("returns NaN on empty string", () => {
        expect(Number.isNaN(parseBrlAmount(""))).toBe(true);
    });
});

describe("parseBrDate", () => {
    it("parses ISO YYYY-MM-DD", () => {
        expect(parseBrDate("2024-01-15")).toBe("2024-01-15");
    });

    it("parses DD/MM/YYYY", () => {
        expect(parseBrDate("15/01/2024")).toBe("2024-01-15");
    });

    it("parses DD-MM-YYYY", () => {
        expect(parseBrDate("15-01-2024")).toBe("2024-01-15");
    });

    it("truncates ISO with time component", () => {
        expect(parseBrDate("2024-01-15T10:00:00Z")).toBe("2024-01-15");
    });

    it("throws on invalid format", () => {
        expect(() => parseBrDate("nope")).toThrow();
    });
});
