import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TransactionFilters } from "@/services/transaction.service";
import { ArrowDown, ArrowLeftRight, ArrowUp, DollarSign, Landmark, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface TransactionTableProps {
    data: ResponseGetTransactions[];
    loading?: boolean;
    hasActions?: boolean;
    filters?: TransactionFilters;
    onEditClick?: (id: string) => void;
    onDeleteClick?: (id: string) => void;
    onChangeFilters?: (filters: TransactionFilters) => void;
}
function TransactionTable({ data, onEditClick, hasActions, onDeleteClick, loading, onChangeFilters, filters }: TransactionTableProps) {

    const renderSort = (sort: NonNullable<TransactionFilters["sort"]>["sortBy"]) => {

        if( filters?.sort?.sortBy !== sort) {
            return null;
        }
        if (filters?.sort?.sortBy === sort && filters.sort.sortOrder === "asc") {
            return <ArrowDown className="w-4 h-4" />
        }
        if (filters?.sort?.sortBy === sort && filters.sort.sortOrder === "desc") {
            return <ArrowUp className="w-4 h-4" />
        }
    }

    const renderTypeCell = (type: "income" | "outcome") => {
        if (type === "income") {
            return (
                <div className="p-1 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-500" />
                </div>
            )
        }
        return (
            <div className="p-1 bg-red-100 rounded-full w-8 h-8 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-red-500" />
            </div>
        )
    }

    if (data && data.length < 1 && !loading) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-10 gap-2">
                <ArrowLeftRight />
                <span className="text-muted-foreground">Nenhuma transação encontrada</span>
            </div>
        )
    }

    const renderTableHead = (title: string, sort: NonNullable<TransactionFilters["sort"]>["sortBy"], style?: string) => {
        return (
            <TableHead
                onClick={() => onChangeFilters?.({
                    ...filters,
                    sort: {
                        ...filters?.sort,
                        sortBy: sort,
                        sortOrder: filters?.sort?.sortOrder === "asc" ? "desc" : "asc"
                    }
                })}
                className={cn("hover:bg-gray-300/30", style)}>
                <div className="flex items-center gap-2">
                    {renderSort(sort)}
                    {title}
                </div>
            </TableHead>
        )
    }

    return (
        <Table className="min-w-[900px] mt-4">
            <TableHeader>
                <TableRow className="hover:bg-white">
                    {renderTableHead("Tipo", "type", "w-[80px]")}
                    {renderTableHead("Descrição", "description")}
                    {renderTableHead("Data", "date")}
                    {renderTableHead("Categoria", "category")}
                    {renderTableHead("Status de pagamento", "payment_status")}
                    {renderTableHead("Valor", "amount")}
                    {hasActions && <TableHead className="text-center">Ações</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6}>
                            <div className="p-6 flex items-center justify-center gap-2">
                                < Loader2 className="animate-spin" />
                                Carregando transações
                            </div>
                        </TableCell>
                    </TableRow>
                ) : data?.map((item) => (
                    <TableRow className={item.type === "income" ? "hover:bg-green-100/30" : "hover:bg-red-100/30"} key={item.id}>

                        <TableCell className="text-center">
                            {renderTypeCell(item.type)}
                        </TableCell>
                        <TableCell className="font-medium gap-2">
                            {item.description}
                        </TableCell>
                        {/* <TableCell>{item.recurrent ? "Sim" : "Não"}</TableCell> */}
                        <TableCell>{new Date(item.date).toLocaleDateString("pt-br")}</TableCell>
                        <TableCell className="text-left">{item.categories?.description ?? "Sem categoria"}</TableCell>
                        <TableCell className="text-left">{item.payment_status?.description ?? "Sem status"}</TableCell>
                        <TableCell className="text-left">{item.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                        {
                            hasActions && (
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            disabled={loading}
                                            onClick={() => { onEditClick?.(item.id) }}
                                            variant="ghost"
                                            size="icon"
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            disabled={loading}
                                            onClick={() => { onDeleteClick?.(item.id) }}
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            )
                        }
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell colSpan={5} className="text-right font-semibold">Total</TableCell>
                    <TableCell className="text-left font-semibold">{data.reduce((acc, item) => {
                        return item.type === "income" ? acc + item.amount : acc - item.amount
                    }, 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default TransactionTable;