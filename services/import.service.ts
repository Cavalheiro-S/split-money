import { parseOfx, type OfxTransaction } from "@/lib/parsers/ofx";
import { parseCsv, parseBrlAmount, parseBrDate, type CsvRow } from "@/lib/parsers/csv";

export type ImportSource = "nubank-conta" | "nubank-cartao" | "99pay";

export type ParsedTransaction = {
    description: string;
    date: string; // ISO YYYY-MM-DD
    amount: number; // positive number
    type: "income" | "outcome";
    source: "ofx" | "csv";
    externalId: string;
};

/**
 * Build a stable external_id for a parsed transaction. Used for dedupe
 * server-side so reimporting the same file is idempotent.
 *
 * When the source provides a native stable ID (OFX FITID), use it directly.
 * Otherwise hash the composite (date + signed amount + normalized description)
 * so the same row always collapses to the same id.
 */
export async function buildExternalId(
    source: ImportSource,
    input: { native?: string; date: string; signedAmount: number; description: string }
): Promise<string> {
    if (input.native) {
        return `${source}:fitid:${input.native}`;
    }

    const raw = [
        input.date,
        input.signedAmount.toFixed(2),
        input.description.toLowerCase().replace(/\s+/g, " ").trim(),
    ].join("|");

    // Web Crypto is available in modern browsers (the import page is client-side).
    const bytes = new TextEncoder().encode(raw);
    const digest = await crypto.subtle.digest("SHA-1", bytes);
    const hex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return `${source}:hash:${hex}`;
}

function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.readAsText(file);
    });
}

function toSignedType(amount: number): "income" | "outcome" {
    return amount < 0 ? "outcome" : "income";
}

/**
 * Nubank Conta → OFX export.
 * Amounts are already signed (negative = debit/outcome).
 */
export async function parseNubankOfx(file: File): Promise<ParsedTransaction[]> {
    const content = await readFileAsText(file);
    const rows = parseOfx(content);
    return Promise.all(rows.map(async (row) => toParsedFromOfx("nubank-conta", row)));
}

async function toParsedFromOfx(
    source: ImportSource,
    row: OfxTransaction
): Promise<ParsedTransaction> {
    const externalId = await buildExternalId(source, {
        native: row.fitid,
        date: row.date,
        signedAmount: row.amount,
        description: row.description,
    });

    return {
        description: row.description,
        date: row.date,
        amount: Math.abs(row.amount),
        type: toSignedType(row.amount),
        source: "ofx",
        externalId,
    };
}

/**
 * Pick the first row field whose header matches one of the candidate names.
 * Matching is case-insensitive and trims/normalizes accents, so "Data",
 * "data", "DATA" and "DATa" all hit the same field.
 */
function pickField(row: CsvRow, candidates: string[]): string | undefined {
    const normalized: Record<string, string> = {};
    for (const [k, v] of Object.entries(row)) {
        normalized[normalizeHeader(k)] = v;
    }
    for (const name of candidates) {
        const hit = normalized[normalizeHeader(name)];
        if (hit !== undefined && hit !== "") return hit;
    }
    return undefined;
}

function normalizeHeader(h: string): string {
    return h
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/**
 * Nubank Cartão → CSV export from the monthly invoice.
 * Known format: `date,title,amount` with dates in `YYYY-MM-DD` and amounts
 * as positive numbers (everything is a card charge → outcome).
 */
export async function parseNubankCardCsv(file: File): Promise<ParsedTransaction[]> {
    const content = await readFileAsText(file);
    const rows = parseCsv(content);

    return Promise.all(
        rows.map(async (row) => {
            const dateRaw = pickField(row, ["date", "data"]);
            const description = pickField(row, ["title", "descrição", "descricao", "description"]);
            const amountRaw = pickField(row, ["amount", "valor"]);

            if (!dateRaw || !description || !amountRaw) {
                throw new Error(
                    `Linha inválida no CSV do Nubank Cartão: faltam campos obrigatórios (date/title/amount).`
                );
            }

            const date = parseBrDate(dateRaw);
            const rawAmount = parseBrlAmount(amountRaw);
            if (!Number.isFinite(rawAmount)) {
                throw new Error(`Valor inválido no CSV do Nubank Cartão: "${amountRaw}"`);
            }

            // Card charges: store as outcome with positive amount.
            const signed = -Math.abs(rawAmount);

            const externalId = await buildExternalId("nubank-cartao", {
                date,
                signedAmount: signed,
                description,
            });

            return {
                description,
                date,
                amount: Math.abs(rawAmount),
                type: "outcome" as const,
                source: "csv" as const,
                externalId,
            };
        })
    );
}

/**
 * 99Pay → CSV export. Column names vary across exports; we accept the common
 * Portuguese headers ("Data", "Descrição", "Valor") and fall back to English.
 * Values may come Brazilian-formatted ("1.234,56") or signed. If the value is
 * already signed (negative), we trust it; otherwise we treat every row as an
 * outcome — user can edit in the preview before saving.
 */
export async function parse99PayCsv(file: File): Promise<ParsedTransaction[]> {
    const content = await readFileAsText(file);
    const rows = parseCsv(content);

    return Promise.all(
        rows.map(async (row) => {
            const dateRaw = pickField(row, ["data", "date", "data da transacao", "data da transação"]);
            const description = pickField(row, [
                "descricao",
                "descrição",
                "description",
                "historico",
                "histórico",
                "titulo",
                "título",
            ]);
            const amountRaw = pickField(row, ["valor", "amount", "valor (r$)"]);

            if (!dateRaw || !description || !amountRaw) {
                throw new Error(
                    `Linha inválida no CSV do 99Pay: faltam campos obrigatórios (data/descrição/valor).`
                );
            }

            const date = parseBrDate(dateRaw);
            const rawAmount = parseBrlAmount(amountRaw);
            if (!Number.isFinite(rawAmount)) {
                throw new Error(`Valor inválido no CSV do 99Pay: "${amountRaw}"`);
            }

            const type = toSignedType(rawAmount);

            const externalId = await buildExternalId("99pay", {
                date,
                signedAmount: rawAmount,
                description,
            });

            return {
                description,
                date,
                amount: Math.abs(rawAmount),
                type,
                source: "csv" as const,
                externalId,
            };
        })
    );
}

export class ImportService {
    static async parse(source: ImportSource, file: File): Promise<ParsedTransaction[]> {
        switch (source) {
            case "nubank-conta":
                return parseNubankOfx(file);
            case "nubank-cartao":
                return parseNubankCardCsv(file);
            case "99pay":
                return parse99PayCsv(file);
            default:
                throw new Error(`Fonte não suportada: ${source as string}`);
        }
    }
}
