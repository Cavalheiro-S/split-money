'use client'

import { Loading } from '@/components/Loading/Loading';
import { TableRecord } from '@/components/Record/Record';
import { useTransaction } from '@/hooks/use-transaction';
import { useUser } from '@/hooks/use-user';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Page() {
    const userState = useSelector((state: RootState) => state.userState)
    const router = useRouter()
    const { user, getUser } = useUser()
    const { transactionsQuery } = useTransaction()
    useEffect(() => {
        if (!userState.user.id) {
            toast.clearWaitingQueue()
            toast.error("Sessão expirada")
            router.replace("/session/login")
            return
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState.user.id])

    return userState.isLoading || transactionsQuery.isLoading ? <Loading /> : (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TableRecord data={transactionsQuery.data} hasActions className='w-full h-fit' title='Lançamentos' />
        </div>
    )
}
