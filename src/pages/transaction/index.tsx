import { TransactionTable } from 'components/transaction-table';
import { useTable } from 'hooks/use-table';
import { useTransaction } from 'hooks/use-transaction';
import { toast } from 'react-toastify';

export default function Page() {
    const { setPage, setCount, page, count } = useTable()
    const {
        transactions,
        transactionsLoading,
        transactionDeleteMutate,
    } = useTransaction({ page, count })

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

    return (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TransactionTable
                onDelete={handleDelete}
                data={transactions}
                handleSetPage={setPage}
                handleSetCount={setCount}
                hasActions
                isLoading={transactionsLoading}
                title='Lançamentos' />
        </div>
    )
}
