'use client'

import { Loading } from '@/components/Loading/Loading';
import { useTransaction } from '@/hooks/use-transaction';
import { TableRecord } from '@/pages/transaction/_components/Record/Record';

export default function Page() {
    const { transactionsQuery } = useTransaction()

    return transactionsQuery.isLoading ? <Loading /> : (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TableRecord data={transactionsQuery.data} hasActions className='w-full h-fit' title='Lançamentos' />
        </div>
    )
}
