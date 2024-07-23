import { Table, Typography } from "antd"

type SummaryProps = {
    pageData: readonly ResponseGetTransactions[]
}

export const TableSummary = ({ pageData }: SummaryProps) => {
    let totalTransaction = 0

    pageData.forEach(({ amount, type }) => {
        totalTransaction = type === "income" ? totalTransaction + amount : totalTransaction - amount
    })

    return (
        <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4} align='right' className='font-bold'>Total</Table.Summary.Cell>
            <Table.Summary.Cell index={1} colSpan={4}>
                <Typography.Text className='font-bold'>{`${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalTransaction)}`}</Typography.Text>
            </Table.Summary.Cell>
        </Table.Summary.Row>
    )
}
