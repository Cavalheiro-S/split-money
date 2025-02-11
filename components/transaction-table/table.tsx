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

interface TransactionTableProps {
    data: Transaction[];
    onEditClick?: (id: string) => void;
}
function TransactionTable({ data, onEditClick }: TransactionTableProps) {

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/transaction/${id}`)
            toast.success("Transação deletada com sucesso")

        }
        catch (error) {
            toast.error("Falha ao deletar transação")
            console.log({ error });
        }
    }

    return (
        <>

            {/* Table */}
            <Table className="min-w-[900px] mt-4">
                <TableHeader>

                    <TableRow>
                        <TableHead className="w-[300px]">Descrição</TableHead>
                        <TableHead>Recorrente</TableHead>
                        <TableHead className="w-28">Data</TableHead>
                        <TableHead className="text-right">Categoria</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{item.recurrent ? "Sim" : "Não"}</TableCell>
                            <TableCell>{new Date(item.date).toLocaleDateString("pt-br")}</TableCell>
                            <TableCell className="text-right">{TransactionCategoryEnum[item.category as keyof typeof TransactionCategoryEnum]}</TableCell>
                            <TableCell className="text-right">{item.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</TableCell>
                            <TableCell className="text-center">
                                <Button onClick={() => { onEditClick?.(item.id) }} className="mr-2">Editar</Button>
                                <Button onClick={() => { handleDelete(item.id) }} variant="destructive">Excluir</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default TransactionTable;