import { useTransaction } from 'hooks/use-transaction';
import { toast } from 'react-toastify';

import TableRecord from './_components/Record/table-record';

export default function Page() {
    const {
        transactions,
        transactionsLoading,
        transactionDeleteMutate,
        transactionUpdateMutate
    } = useTransaction({ page: 1, count: 10 })

    const handleDelete = async (id: string) => {
        try {
            await transactionDeleteMutate.mutateAsync(id)
            toast.success("Transação deletada com sucesso")
        }
        catch (error) {
            console.log(error)
            toast.error("Erro ao deletar a transação")
        }
    }

    const handleEdit = async (data: ResponseGetTransactions) => {
        try {
            const dataMap: RequestUpdateTransaction = {
                id: data.id,
                amount: data.amount,
                category: data.category,
                date: data.date,
                description: data.description,
                type: data.type,
            }
            await transactionUpdateMutate.mutateAsync(dataMap, {
                onSuccess: () => {
                    toast.success("Transação atualizada com sucesso")
                }
            })
        }
        catch (error) {
            console.error(error)
            toast.error("Falha ao atualizar a transação")
        }
    }

    return (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TableRecord
                onDelete={handleDelete}
                onEdit={handleEdit}
                data={transactions}
                hasActions
                isLoading={transactionsLoading}
                title='Lançamentos' />
        </div>
    )
}
