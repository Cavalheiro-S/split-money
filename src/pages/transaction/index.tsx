import { useTransaction } from '@/hooks/use-transaction';
import TableRecord from '@/pages/transaction/_components/Record/TableRecord';

export default function Page() {
    const { transactions } = useTransaction({ page: 1, count: 10 })

    return (
        <div className='flex justify-center min-h-screen px-10 pt-10'>
            <TableRecord data={transactions} hasActions className='w-full h-fit' title='Lançamentos' />
        </div>
    )
}
