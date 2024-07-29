import { Flex, Table } from "antd"
import { TransactionTableContext } from 'contexts/transaction-table-context'
import { Dayjs } from 'dayjs'
import { useContext } from "react"
import { twMerge } from 'tailwind-merge'
import { useColumns } from './hooks/use-columns'
import { TablePagination } from './pagination'
import { TableSummary } from './summary'
import { TableTitle } from './title'

export type TransactionTableProps = {
    title: string,
    data: {
        data: ResponseGetTransactions[] | undefined;
        total?: number | undefined;
        page?: number | undefined;
        count?: number | undefined;
    } | undefined,
    onDelete: (id: string) => Promise<void>
    handleSetPage: (value: number) => void,
    handleSetCount: (value: number) => void,
    onCreate?: (transaction: ResponseGetTransactions) => Promise<void>,
    onChangeDate?: ((value: Dayjs | null, dateString: string) => void) | undefined
    hasActions?: boolean,
    className?: string,
    isLoading?: boolean
}

export const TransactionTableRoot = ({
    className,
    data,
    hasActions,
    title,
    isLoading,
    onCreate,
    onDelete,
    onChangeDate,
    handleSetCount,
    handleSetPage
}: TransactionTableProps) => {

    const { setSelectedRow, setOpen } = useContext(TransactionTableContext)

    const onEdit = (transaction: ResponseGetTransactions) => {
        setSelectedRow(transaction)
        setOpen(true)
    }
    const columns = useColumns(hasActions ?? false, onEdit, onDelete)
    
    return (
        <Flex className='flex-col w-full p-2 py-1 bg-white border-2 border-gray-200 border-solid rounded-lg h-fit'>
            <Table
                loading={isLoading}
                rowKey={record => record.id ?? record.description + record.category}
                dataSource={data?.data}
                className={twMerge(className, 'w-full')}
                columns={columns}
                pagination={false}
                summary={(data) => <TableSummary pageData={data} />}
                title={() =>
                    <TableTitle
                        title={title}
                        hasActions={hasActions}
                        onChangeDate={onChangeDate}
                    />}
                onRow={record => onCreate ? { onClick: () => onCreate(record) } : {}} />
            <TablePagination data={data} handleSetCount={handleSetCount} handleSetPage={handleSetPage} />
        </Flex>
    )
}