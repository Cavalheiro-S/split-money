import { Flex, Pagination, Select, Typography } from "antd";

type PaginationProps = {
    data: {
        data: ResponseGetTransactions[] | undefined;
        total?: number | undefined;
        page?: number | undefined;
        count?: number | undefined;
    } | undefined
    handleSetCount: (value: number) => void
    handleSetPage: (value: number) => void
}

export const TablePagination = ({ data, handleSetCount, handleSetPage }: PaginationProps) => {

    return (
        <Flex className='items-center justify-end '>
            <Typography.Text className='mr-2'>Transações por página:</Typography.Text>
            <Select
                defaultValue={data?.count ?? 5}
                options={[{
                    label: 5,
                    value: 5
                }, {
                    label: 10,
                    value: 10
                }, {
                    label: 25,
                    value: 25
                },
                {
                    label: 50,
                    value: 50
                }]}
                onChange={value => {
                    handleSetCount(value)

                }} />
            <Pagination
                className='py-6'
                current={data?.page ?? 1}
                pageSize={data?.count ?? 10}
                total={data?.total ?? 0}
                showLessItems
                onChange={page => handleSetPage(page)}
            />
        </Flex>
    )
}