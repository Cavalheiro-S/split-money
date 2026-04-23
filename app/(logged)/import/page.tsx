"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { applyCategoryRules } from "@/lib/category-rules";
import { CategoryService } from "@/services/category.service";
import { ImportService, type ImportSource, type ParsedTransaction } from "@/services/import.service";
import { TransactionService } from "@/services/transaction.service";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

// Sentinel used in categoryOverrides to mean "user explicitly cleared the category"
const CLEARED = "__cleared__";

function formatBrl(value: number): string {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ImportPage() {
    const [source, setSource] = useState<ImportSource>("nubank-conta");
    const [file, setFile] = useState<File | null>(null);
    const [parsed, setParsed] = useState<ParsedTransaction[]>([]);
    const [parsing, setParsing] = useState(false);
    const [importing, setImporting] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryOverrides, setCategoryOverrides] = useState<Record<string, string>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [descriptionOverrides, setDescriptionOverrides] = useState<Record<string, string>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentSource = SOURCES.find((s) => s.value === source)!;

    useEffect(() => {
        CategoryService.getCategories()
            .then((res) => setCategories(res.data))
            .catch(() => {});
    }, []);

    const selectedRows = parsed.filter((t) => selected.has(t.externalId));

    const totals = selectedRows.reduce(
        (acc, t) => {
            if (t.type === "income") acc.income += t.amount;
            else acc.outcome += t.amount;
            return acc;
        },
        { income: 0, outcome: 0 }
    );

    const allChecked = parsed.length > 0 && parsed.every((t) => selected.has(t.externalId));
    const someChecked = parsed.some((t) => selected.has(t.externalId));

    function toggleAll() {
        if (allChecked) {
            setSelected(new Set());
        } else {
            setSelected(new Set(parsed.map((t) => t.externalId)));
        }
    }

    function toggleRow(externalId: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(externalId)) next.delete(externalId);
            else next.add(externalId);
            return next;
        });
    }

    function getSuggestedCategory(t: ParsedTransaction): Category | undefined {
        return applyCategoryRules(t.description, categories);
    }

    function getEffectiveCategoryId(t: ParsedTransaction): string | undefined {
        const override = categoryOverrides[t.externalId];
        if (override === CLEARED) return undefined;
        if (override) return override;
        return getSuggestedCategory(t)?.id;
    }

    function setCategoryOverride(externalId: string, value: string | undefined) {
        setCategoryOverrides((prev) => ({
            ...prev,
            [externalId]: value ?? CLEARED,
        }));
    }

    function getEffectiveDescription(t: ParsedTransaction): string {
        return descriptionOverrides[t.externalId] ?? t.description;
    }

    // T6 – editing helpers
    function startEdit(t: ParsedTransaction) {
        setEditingId(t.externalId);
        setEditingValue(getEffectiveDescription(t));
    }

    function commitEdit() {
        if (editingId === null) return;
        if (editingValue.trim()) {
            setDescriptionOverrides((prev) => ({ ...prev, [editingId]: editingValue.trim() }));
        }
        setEditingId(null);
    }

    function cancelEdit() {
        setEditingId(null);
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0];
        if (!picked) return;

        setFile(picked);
        setParsed([]);
        setSelected(new Set());
        setCategoryOverrides({});
        setDescriptionOverrides({});
        setEditingId(null);
        setParsing(true);

        try {
            const rows = await ImportService.parse(source, picked);
            if (rows.length === 0) {
                toast.warning("Nenhuma transação encontrada no arquivo.");
            } else {
                toast.success(`${rows.length} transações lidas. Confira o preview abaixo.`);
            }
            setParsed(rows);
            setSelected(new Set(rows.map((r) => r.externalId)));
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
        setSelected(new Set());
        setCategoryOverrides({});
        setDescriptionOverrides({});
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImport = async () => {
        if (selectedRows.length === 0) return;

        setImporting(true);
        try {
            const payload: BulkCreateTransactionItem[] = selectedRows.map((t) => ({
                description: getEffectiveDescription(t),
                date: t.date,
                amount: t.type === "outcome" ? -Math.abs(t.amount) : Math.abs(t.amount),
                type: t.type,
                source: t.source,
                externalId: t.externalId,
                ...(getEffectiveCategoryId(t) ? { categoryId: getEffectiveCategoryId(t) } : {}),
            }));

            const res = await TransactionService.bulkCreateTransactions(payload);
            const { created, skipped, failed } = res.summary;
            const skippedModified = (res.summary ).skipped_modified ?? 0;

            const parts: string[] = [];
            if (created > 0) parts.push(`${created} criadas`);
            if (skipped > 0) parts.push(`${skipped} já existiam`);
            if (failed > 0) parts.push(`${failed} falharam`);

            toast.success(`Importação concluída: ${parts.join(", ") || "nada a fazer"}.`);

            if (skippedModified > 0) {
                toast.info(
                    `${skippedModified} transação${skippedModified > 1 ? "ões" : ""} já importada${skippedModified > 1 ? "s" : ""} e modificada${skippedModified > 1 ? "s" : ""} por você foram mantidas com suas edições.`
                );
            }

            setFile(null);
            setParsed([]);
            setSelected(new Set());
            setCategoryOverrides({});
            setDescriptionOverrides({});
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
                                {selectedRows.length} de {parsed.length} selecionadas · Entradas:{" "}
                                {formatBrl(totals.income)} · Saídas: {formatBrl(totals.outcome)}
                            </CardDescription>
                        </div>
                        <Button onClick={handleImport} disabled={importing || selectedRows.length === 0}>
                            {importing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importando...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Importar {selectedRows.length} transações
                                </>
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[480px] overflow-auto rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10">
                                            <Checkbox
                                                checked={allChecked ? true : someChecked ? "indeterminate" : false}
                                                onCheckedChange={toggleAll}
                                                aria-label="Selecionar todas"
                                            />
                                        </TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsed.map((t) => {
                                        const effectiveCategoryId = getEffectiveCategoryId(t);
                                        const isEditing = editingId === t.externalId;

                                        return (
                                            <TableRow
                                                key={t.externalId}
                                                data-state={selected.has(t.externalId) ? "selected" : undefined}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selected.has(t.externalId)}
                                                        onCheckedChange={() => toggleRow(t.externalId)}
                                                        aria-label="Selecionar linha"
                                                    />
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap">{t.date}</TableCell>
                                                <TableCell className="max-w-[260px]">
                                                    {isEditing ? (
                                                        <input
                                                            autoFocus
                                                            value={editingValue}
                                                            onChange={(e) => setEditingValue(e.target.value)}
                                                            onBlur={commitEdit}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") commitEdit();
                                                                if (e.key === "Escape") cancelEdit();
                                                            }}
                                                            className="w-full rounded border border-indigo-400 px-1.5 py-0.5 text-sm outline-none ring-2 ring-indigo-200"
                                                        />
                                                    ) : (
                                                        <span
                                                            className="block truncate cursor-text hover:underline hover:decoration-dashed"
                                                            title={getEffectiveDescription(t)}
                                                            onClick={() => startEdit(t)}
                                                        >
                                                            {getEffectiveDescription(t)}
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="min-w-[160px]">
                                                    <Select
                                                        value={effectiveCategoryId ?? ""}
                                                        onValueChange={(val) =>
                                                            setCategoryOverride(
                                                                t.externalId,
                                                                val === "" ? undefined : val
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-7 text-xs">
                                                            <SelectValue placeholder="Sem categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map((c) => (
                                                                <SelectItem key={c.id} value={c.id}>
                                                                    {c.description}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
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
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
