import { TransactionTable } from 'components/transaction-table';
import { Dayjs } from 'dayjs';
import { useTable } from 'hooks/use-table';
import { useTransaction } from 'hooks/use-transaction';
import { SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

export default function Page() {
    const { setPage, setCount, page, count } = useTable()
    const [dateSelected, setDateSelected] = useState(new Date())
    const {
        transactions,
        transactionsLoading,
        transactionDeleteMutate,
    } = useTransaction({ page, count, period: dateSelected })

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

    const handleUpdateDate = (value: Dayjs | null, setData: (value: SetStateAction<Date>) => void) => {
        if (value) {
            const date = value?.toDate()
            setData(date)
        }
    }

    return (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TransactionTable
                onDelete={handleDelete}
                onChangeDate={value => handleUpdateDate(value, setDateSelected)}
                data={transactions}
                handleSetPage={setPage}
                handleSetCount={setCount}
                hasActions
                isLoading={transactionsLoading}
                title='Lançamentos' />
        </div>
    )
}
