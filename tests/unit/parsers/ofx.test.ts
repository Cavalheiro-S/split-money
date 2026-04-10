import { describe, expect, it } from "vitest";
import { parseOfx, parseOfxDate } from "@/lib/parsers/ofx";

const SAMPLE_OFX = `OFXHEADER:100
DATA:OFXSGML
VERSION:102

<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <STMTRS>
        <CURDEF>BRL
        <BANKTRANLIST>
          <STMTTRN>
            <TRNTYPE>DEBIT
            <DTPOSTED>20240115
            <TRNAMT>-150.00
            <FITID>abc123
            <MEMO>Compra Extra
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>CREDIT
            <DTPOSTED>20240120
            <TRNAMT>2500.50
            <FITID>xyz789
            <NAME>Salario
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>DEBIT
            <DTPOSTED>20240125120000
            <TRNAMT>-42.30
            <FITID>ccc555
            <MEMO>Padaria
          </STMTTRN>
        </BANKTRANLIST>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>
`;

describe("parseOfxDate", () => {
    it("parses YYYYMMDD", () => {
        expect(parseOfxDate("20240115")).toBe("2024-01-15");
    });

    it("parses YYYYMMDDHHMMSS", () => {
        expect(parseOfxDate("20240125120000")).toBe("2024-01-25");
    });

    it("throws on invalid date", () => {
        expect(() => parseOfxDate("not-a-date")).toThrow();
    });
});

describe("parseOfx", () => {
    it("extracts all STMTTRN entries", () => {
        const result = parseOfx(SAMPLE_OFX);
        expect(result).toHaveLength(3);
    });

    it("preserves amount signs and descriptions", () => {
        const [first, second, third] = parseOfx(SAMPLE_OFX);

        expect(first).toMatchObject({
            fitid: "abc123",
            date: "2024-01-15",
            amount: -150,
            description: "Compra Extra",
        });
        expect(second).toMatchObject({
            fitid: "xyz789",
            date: "2024-01-20",
            amount: 2500.5,
            description: "Salario",
        });
        expect(third).toMatchObject({
            fitid: "ccc555",
            date: "2024-01-25",
            amount: -42.3,
            description: "Padaria",
        });
    });

    it("returns empty array on OFX with no transactions", () => {
        expect(parseOfx("<OFX></OFX>")).toEqual([]);
    });

    it("skips malformed STMTTRN blocks without throwing", () => {
        const broken = `
<OFX><STMTTRN><FITID>only-fitid</STMTTRN></OFX>
`;
        expect(parseOfx(broken)).toEqual([]);
    });
});
