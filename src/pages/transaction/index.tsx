'use client'

import { Loading } from '@/components/Loading/Loading';
import { useTransaction } from '@/hooks/use-transaction';
import { TableRecord } from '@/pages/transaction/_components/Record/TableRecord';

export default function Page() {
    const { transactions, transactionsLoading, transactionCreateMutate } = useTransaction()

    const handleAddTransaction = () => {
        
    }

    return transactionsLoading ? <Loading /> : (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TableRecord data={transactions} hasActions className='w-full h-fit' title='Lançamentos' />
        </div>
    )
}
