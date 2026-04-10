/**
 * Minimal CSV parser — handles quoted fields, escaped quotes and CRLF/LF.
 * Zero-dependency intentionally; we only need to read well-formed extracts
 * from Nubank and 99Pay.
 */

export type CsvRow = Record<string, string>;

/** Parse a CSV string into an array of row objects keyed by header. */
export function parseCsv(content: string): CsvRow[] {
  const rows = parseRawCsv(content);
  if (rows.length === 0) return [];

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map(h => h.trim());

  return dataRows
    .filter(row => row.some(cell => cell.trim() !== ''))
    .map(row => {
      const obj: CsvRow = {};
      headers.forEach((h, i) => {
        obj[h] = (row[i] ?? '').trim();
      });
      return obj;
    });
}

function parseRawCsv(content: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = '';
  let inQuotes = false;

  // Normalize line endings so CRLF and LF behave the same.
  const text = content.replace(/\r\n?/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      current.push(field);
      field = '';
      continue;
    }
    if (ch === '\n') {
      current.push(field);
      rows.push(current);
      current = [];
      field = '';
      continue;
    }
    field += ch;
  }

  // Flush trailing field/row if the file didn't end in newline.
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  return rows;
}

/**
 * Parse a Brazilian-formatted number string: "1.234,56" → 1234.56.
 * Also handles plain "1234.56" and leading "R$".
 */
export function parseBrlAmount(raw: string): number {
  const cleaned = raw
    .replace(/R\$\s*/gi, '')
    .replace(/\s/g, '')
    .trim();

  if (!cleaned) return NaN;

  // If it contains both '.' and ',', assume Brazilian format.
  if (cleaned.includes(',') && cleaned.includes('.')) {
    return Number(cleaned.replace(/\./g, '').replace(',', '.'));
  }
  // Only comma: "1234,56" → 1234.56.
  if (cleaned.includes(',')) {
    return Number(cleaned.replace(',', '.'));
  }
  // Plain number.
  return Number(cleaned);
}

/**
 * Parse a date string in one of the common Brazilian formats:
 *   - "2024-01-15" (ISO)
 *   - "15/01/2024" (DD/MM/YYYY)
 *   - "15-01-2024"
 * Returns ISO `YYYY-MM-DD`.
 */
export function parseBrDate(raw: string): string {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }
  const m = trimmed.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo}-${d}`;
  }
  throw new Error(`Invalid date: ${raw}`);
}
