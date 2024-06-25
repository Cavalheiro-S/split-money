import { useTransaction } from "@/hooks/use-transaction";
import { Space } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import TableRecord from "../transaction/_components/Record/table-record";

export default function Page() {
    const {
        transactions: transactionsIncome,
        transactionUpdateMutate }
        = useTransaction({ page: 1, count: 10, type: "income" })
    const {
        transactions: transactionsOutcome,
        transactionDeleteMutate
    } = useTransaction({ page: 1, count: 10, type: "outcome" })

    const handleEdit = async (data: Transaction) => {
        try {
            const dataMap: RequestUpdateTransaction = {
                id: data.id,
                amount: data.amount,
                category: data.category,
                date: moment(data.date).format('YYYY-MM-DD'),
                description: data.description,
                type: data.type
            }
            await transactionUpdateMutate.mutateAsync(dataMap, {
                onSuccess: () => {
                    toast.success('Transação atualizada com sucesso')
                }
            })
        } catch (error) {
            console.error(error)
            toast.error('Falha ao atualizar a transação')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await transactionDeleteMutate.mutateAsync(id)
            toast.success('Transação deletada com sucesso')
        } catch (error) {
            console.log(error)
            toast.error('Erro ao deletar a transação')
        }
    }

    return (
        <Space direction="vertical" className="col-start-2 px-10 mt-10">
            <TableRecord
                onEdit={handleEdit}
                onDelete={handleDelete}
                data={transactionsIncome ?? []}
                title="Últimos Lançamentos" />
            <TableRecord
                onEdit={handleEdit}
                onDelete={handleDelete}
                data={transactionsOutcome ?? []}
                title="Últimas Despesas" />
        </Space>
    )
}