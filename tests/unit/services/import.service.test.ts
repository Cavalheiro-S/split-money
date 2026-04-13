import { describe, expect, it } from "vitest";
import { buildExternalId, parseNubankCardCsv, parseNubankOfx, parse99PayCsv } from "@/services/import.service";

function makeFile(name: string, content: string, type = "text/plain"): File {
    return new File([content], name, { type });
}

const NUBANK_OFX = `<OFX>
<BANKTRANLIST>
<STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20240115<TRNAMT>-150.00<FITID>abc123<MEMO>Compra Extra</STMTTRN>
<STMTTRN><TRNTYPE>CREDIT<DTPOSTED>20240120<TRNAMT>2500.00<FITID>xyz789<NAME>Salario</STMTTRN>
</BANKTRANLIST>
</OFX>`;

describe("buildExternalId", () => {
    it("prefixes with native FITID when provided", async () => {
        const id = await buildExternalId("nubank-conta", {
            native: "abc123",
            date: "2024-01-15",
            signedAmount: -150,
            description: "Compra",
        });
        expect(id).toBe("nubank-conta:fitid:abc123");
    });

    it("returns the same hash for the same input (deterministic)", async () => {
        const a = await buildExternalId("99pay", {
            date: "2024-01-15",
            signedAmount: -42.3,
            description: "Padaria",
        });
        const b = await buildExternalId("99pay", {
            date: "2024-01-15",
            signedAmount: -42.3,
            description: "Padaria",
        });
        expect(a).toBe(b);
        expect(a).toMatch(/^99pay:hash:[a-f0-9]{40}$/);
    });

    it("normalizes description whitespace and case", async () => {
        const a = await buildExternalId("99pay", {
            date: "2024-01-15",
            signedAmount: -10,
            description: "Coffee Shop",
        });
        const b = await buildExternalId("99pay", {
            date: "2024-01-15",
            signedAmount: -10,
            description: "  COFFEE   SHOP  ",
        });
        expect(a).toBe(b);
    });

    it("produces different ids for different amounts", async () => {
        const a = await buildExternalId("99pay", {
            date: "2024-01-15",
            signedAmount: -10,
            description: "Coffee",
        });
        const b = await buildExternalId("99pay", {
            date: "2024-01-15",
            signedAmount: -11,
            description: "Coffee",
        });
        expect(a).not.toBe(b);
    });
});

describe("parseNubankOfx", () => {
    it("parses debit and credit rows with correct type and sign", async () => {
        const file = makeFile("extrato.ofx", NUBANK_OFX, "application/x-ofx");
        const result = await parseNubankOfx(file);

        expect(result).toHaveLength(2);

        expect(result[0]).toMatchObject({
            description: "Compra Extra",
            date: "2024-01-15",
            amount: 150,
            type: "outcome",
            source: "ofx",
        });
        expect(result[0].externalId).toBe("nubank-conta:fitid:abc123");

        expect(result[1]).toMatchObject({
            description: "Salario",
            date: "2024-01-20",
            amount: 2500,
            type: "income",
            source: "ofx",
        });
    });

    it("is idempotent: same file twice → same externalIds", async () => {
        const run1 = await parseNubankOfx(makeFile("a.ofx", NUBANK_OFX));
        const run2 = await parseNubankOfx(makeFile("a.ofx", NUBANK_OFX));
        expect(run1.map((t) => t.externalId)).toEqual(run2.map((t) => t.externalId));
    });
});

describe("parseNubankCardCsv", () => {
    it("parses the standard Nubank card CSV format as outcome", async () => {
        const csv = "date,title,amount\n2024-01-15,Farmacia,45.30\n2024-01-16,Uber,22.50\n";
        const result = await parseNubankCardCsv(makeFile("fatura.csv", csv, "text/csv"));

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
            description: "Farmacia",
            date: "2024-01-15",
            amount: 45.3,
            type: "outcome",
            source: "csv",
        });
        expect(result[1]).toMatchObject({
            description: "Uber",
            amount: 22.5,
            type: "outcome",
        });
    });

    it("throws on CSV missing required columns", async () => {
        const csv = "date,title\n2024-01-15,Farmacia\n";
        await expect(parseNubankCardCsv(makeFile("x.csv", csv))).rejects.toThrow(/faltam campos/);
    });

    it("accepts Portuguese headers (Data/Descrição/Valor)", async () => {
        const csv = "Data,Descrição,Valor\n15/01/2024,Padaria,\"12,50\"\n";
        const result = await parseNubankCardCsv(makeFile("x.csv", csv));
        expect(result[0]).toMatchObject({
            date: "2024-01-15",
            description: "Padaria",
            amount: 12.5,
            type: "outcome",
        });
    });
});

describe("parse99PayCsv", () => {
    it("detects income vs outcome by sign", async () => {
        const csv = "Data,Descrição,Valor\n15/01/2024,Cashback,\"5,00\"\n16/01/2024,Pagamento Pix,\"-150,00\"\n";
        const result = await parse99PayCsv(makeFile("99pay.csv", csv));

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
            description: "Cashback",
            amount: 5,
            type: "income",
        });
        expect(result[1]).toMatchObject({
            description: "Pagamento Pix",
            amount: 150,
            type: "outcome",
        });
    });

    it("parses Brazilian-formatted amounts with thousand separators", async () => {
        const csv = "Data,Descrição,Valor\n15/01/2024,Transferência,\"-1.234,56\"\n";
        const result = await parse99PayCsv(makeFile("99pay.csv", csv));
        expect(result[0].amount).toBeCloseTo(1234.56, 2);
        expect(result[0].type).toBe("outcome");
    });
});
