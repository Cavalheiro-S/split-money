import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { TransactionCategoryEnum } from "@/enums/transaction-category.enum";
import { ArrowLeftRight, DollarSign, Landmark, Loader2 } from "lucide-react";
import { useState } from "react";

interface TransactionTableProps {
    data: Transaction[];
    hasActions?: boolean;
    onEditClick?: (id: string) => void;
    updateData?: () => Promise<void>;
}
function TransactionTable({ data, onEditClick, hasActions, updateData }: TransactionTableProps) {

    const [loading, setLoading] = useState(false);
    const handleDelete = async (id: string) => {
        try {
            setLoading(true)
            await api.delete(`/transaction/${id}`)
            await updateData?.()
            toast.success("Transação deletada com sucesso")

        }
        catch (error) {
            toast.error("Falha ao deletar transação")
            console.log({ error });
        }
        finally {
            setLoading(false)
        }
    }

    const renderTypeCell = (type: "income" | "outcome") => {
        if (type === "income") {
            return (
                <TableCell className="text-green-500">
                    <div className="p-1 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </TableCell>
            )
        }
        return (
            <TableCell className="text-red-500">
                <div className="p-1 bg-red-100 rounded-full w-8 h-8 flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                </div>
            </TableCell>
        )
    }

    if (!data?.length) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-10 gap-2">
                <ArrowLeftRight />
                <span className="text-muted-foreground">Nenhuma transação encontrada</span>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-10 gap-2">
                < Loader2 className="animate-spin" />
                <span className="text-muted-foreground">Carregando transações</span>
            </div>
        )
    }

    return (
        <Table className="min-w-[900px] mt-4">
            <TableHeader>

                <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="w-[300px]">Descrição</TableHead>
                    <TableHead>Recorrente</TableHead>
                    <TableHead className="w-28">Data</TableHead>
                    <TableHead className="text-left">Categoria</TableHead>
                    <TableHead className="text-left">Valor</TableHead>
                    {hasActions && <TableHead className="text-center">Ações</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item) => (
                    <TableRow className={item.type === "income" ? "hover:bg-green-100/30" : "hover:bg-red-100/30"} key={item.id}>
                        {renderTypeCell(item.type)}
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>{item.recurrent ? "Sim" : "Não"}</TableCell>
                        <TableCell>{new Date(item.date).toLocaleDateString("pt-br")}</TableCell>
                        <TableCell className="text-left">{TransactionCategoryEnum[item.category as keyof typeof TransactionCategoryEnum]}</TableCell>
                        <TableCell className="text-left">{item.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                        {
                            hasActions && (
                                <TableCell className="text-center">
                                    <Button disabled={loading} onClick={() => { onEditClick?.(item.id) }} className="mr-2">Editar</Button>
                                    <Button disabled={loading} onClick={() => { handleDelete(item.id) }} variant="destructive">Excluir</Button>
                                </TableCell>
                            )
                        }
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default TransactionTable;