/**
 * Minimal OFX 1.x (SGML) parser for bank statement imports.
 *
 * OFX files exported by Brazilian banks (Nubank Conta, Itaú, etc.) are small
 * and well-structured, so a regex-based extractor is enough — we don't need a
 * full SGML parser.
 *
 * Extracts STMTTRN (statement transaction) blocks and returns a normalized
 * list. All fields are optional except `date`, `amount` and `description`.
 */

export type OfxTransaction = {
  /** Raw FITID from OFX — stable per-transaction, best source for dedupe. */
  fitid?: string;
  trnType?: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Signed amount. Negative = debit/outcome, positive = credit/income. */
  amount: number;
  description: string;
  memo?: string;
  checkNum?: string;
};

const TAG_RE = (tag: string) =>
  new RegExp(`<${tag}>([^<\\r\\n]*)`, 'i');

const STMTTRN_BLOCK_RE = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;

/** Parse OFX date `YYYYMMDD[HHMMSS[.XXX][\[tz:TZ\]]]` → ISO `YYYY-MM-DD`. */
export function parseOfxDate(raw: string): string {
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!match) {
    throw new Error(`Invalid OFX date: ${raw}`);
  }
  const [, y, m, d] = match;
  return `${y}-${m}-${d}`;
}

function extractTag(block: string, tag: string): string | undefined {
  const m = block.match(TAG_RE(tag));
  if (!m) return undefined;
  return m[1].trim() || undefined;
}

export function parseOfx(content: string): OfxTransaction[] {
  const transactions: OfxTransaction[] = [];
  let match: RegExpExecArray | null;

  // Reset regex state.
  STMTTRN_BLOCK_RE.lastIndex = 0;

  while ((match = STMTTRN_BLOCK_RE.exec(content)) !== null) {
    const block = match[1];

    const dtposted = extractTag(block, 'DTPOSTED');
    const trnamt = extractTag(block, 'TRNAMT');
    if (!dtposted || !trnamt) {
      // Skip malformed entries silently — caller gets a consistent list.
      continue;
    }

    const amount = Number(trnamt);
    if (!Number.isFinite(amount)) {
      continue;
    }

    const memo = extractTag(block, 'MEMO');
    const name = extractTag(block, 'NAME');
    const description = (name || memo || '(sem descrição)').trim();

    transactions.push({
      fitid: extractTag(block, 'FITID'),
      trnType: extractTag(block, 'TRNTYPE'),
      date: parseOfxDate(dtposted),
      amount,
      description,
      memo,
      checkNum: extractTag(block, 'CHECKNUM'),
    });
  }

  return transactions;
}
