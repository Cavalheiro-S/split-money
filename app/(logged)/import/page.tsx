"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ImportService, type ImportSource, type ParsedTransaction } from "@/services/import.service";
import { TransactionService } from "@/services/transaction.service";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type SourceOption = {
    value: ImportSource;
    label: string;
    accept: string;
    hint: string;
};

const SOURCES: SourceOption[] = [
    {
        value: "nubank-conta",
        label: "Nubank Conta (OFX)",
        accept: ".ofx,application/x-ofx",
        hint: "No app do Nubank, vá em Conta → Extrato → Exportar → OFX.",
    },
    {
        value: "nubank-cartao",
        label: "Nubank Cartão (CSV)",
        accept: ".csv,text/csv",
        hint: "No app do Nubank, abra a fatura fechada → Exportar → CSV.",
    },
    {
        value: "99pay",
        label: "99Pay (CSV)",
        accept: ".csv,text/csv",
        hint: "No app 99Pay, vá em Extrato → Exportar CSV.",
    },
];

function formatBrl(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ImportPage() {
    const [source, setSource] = useState<ImportSource>("nubank-conta");
    const [file, setFile] = useState<File | null>(null);
    const [parsed, setParsed] = useState<ParsedTransaction[]>([]);
    const [parsing, setParsing] = useState(false);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentSource = SOURCES.find((s) => s.value === source)!;

    const totals = parsed.reduce(
        (acc, t) => {
            if (t.type === "income") acc.income += t.amount;
            else acc.outcome += t.amount;
            return acc;
        },
        { income: 0, outcome: 0 }
    );

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        if (!picked) return;

        setFile(picked);
        setParsed([]);
        setParsing(true);

        try {
            const rows = await ImportService.parse(source, picked);
            if (rows.length === 0) {
                toast.warning("Nenhuma transação encontrada no arquivo.");
            } else {
                toast.success(`${rows.length} transações lidas. Confira o preview abaixo.`);
            }
            setParsed(rows);
        } catch (err) {
            console.error(err);
            toast.error(
                err instanceof Error ? err.message : "Erro ao ler o arquivo. Verifique o formato."
            );
            setFile(null);
            setParsed([]);
        } finally {
            setParsing(false);
        }
    };

    const handleSourceChange = (next: string) => {
        setSource(next as ImportSource);
        setFile(null);
        setParsed([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImport = async () => {
        if (parsed.length === 0) return;

        setImporting(true);
        try {
            const payload: BulkCreateTransactionItem[] = parsed.map((t) => ({
                description: t.description,
                date: t.date,
                amount: t.type === "outcome" ? -Math.abs(t.amount) : Math.abs(t.amount),
                type: t.type,
                source: t.source,
                externalId: t.externalId,
            }));

            const res = await TransactionService.bulkCreateTransactions(payload);
            const { created, skipped, failed } = res.summary;

            const parts: string[] = [];
            if (created > 0) parts.push(`${created} criadas`);
            if (skipped > 0) parts.push(`${skipped} já existiam`);
            if (failed > 0) parts.push(`${failed} falharam`);

            toast.success(`Importação concluída: ${parts.join(", ") || "nada a fazer"}.`);
            setFile(null);
            setParsed([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Erro ao importar transações.");
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 col-start-2">
            <div>
                <h1 className="text-2xl font-semibold">Importar transações</h1>
                <p className="text-sm text-muted-foreground">
                    Suba extratos do Nubank ou 99Pay. Reimportar o mesmo arquivo não duplica lançamentos.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>1. Escolha a fonte e o arquivo</CardTitle>
                    <CardDescription>{currentSource.hint}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 max-w-sm">
                        <label className="text-sm font-medium">Fonte</label>
                        <Select value={source} onValueChange={handleSourceChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SOURCES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Arquivo</label>
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={currentSource.accept}
                                onChange={handleFileChange}
                                disabled={parsing || importing}
                                className="text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {parsing && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        </div>
                        {file && !parsing && (
                            <span className="text-xs text-muted-foreground">
                                {file.name} · {(file.size / 1024).toFixed(1)} KB
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {parsed.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>2. Revise e importe</CardTitle>
                            <CardDescription>
                                {parsed.length} transações · Entradas: {formatBrl(totals.income)} · Saídas:{" "}
                                {formatBrl(totals.outcome)}
                            </CardDescription>
                        </div>
                        <Button onClick={handleImport} disabled={importing}>
                            {importing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importando...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Importar {parsed.length} transações
                                </>
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[480px] overflow-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsed.map((t) => (
                                        <TableRow key={t.externalId}>
                                            <TableCell className="whitespace-nowrap">{t.date}</TableCell>
                                            <TableCell className="max-w-[340px] truncate" title={t.description}>
                                                {t.description}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={
                                                        t.type === "income"
                                                            ? "text-emerald-600 text-xs font-medium"
                                                            : "text-rose-600 text-xs font-medium"
                                                    }
                                                >
                                                    {t.type === "income" ? "Entrada" : "Saída"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                {formatBrl(t.amount)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
