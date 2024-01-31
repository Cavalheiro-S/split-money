'use client'

import { Loading } from '@/components/Loading/Loading';
import { TableRecord } from '@/components/Record/Record';
import { useTransaction } from '@/hooks/use-transaction';
import { useUser } from '@/hooks/use-user';
import { useSelector } from 'react-redux';

export default function Page() {
    const { transactionsQuery } = useTransaction()

    return transactionsQuery.isLoading ? <Loading /> : (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TableRecord data={transactionsQuery.data} hasActions className='w-full h-fit' title='Lançamentos' />
        </div>
    )
}
