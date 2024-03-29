import { useTransaction } from "@/hooks/use-transaction";
import TableRecord from "@/pages/transaction/_components/Record/TableRecord";
import { Space } from "antd";

export default function Page() {
    const { transactions: transactionsIncome } = useTransaction({ page: 1, count: 10, type: "income" })
    const { transactions: transactionsOutcome } = useTransaction({ page: 1, count: 10, type: "outcome" })

    return (
        <Space direction="vertical" className="col-start-2 px-10 mt-10">
            <TableRecord data={transactionsIncome ?? []} title="Últimos Lançamentos" />
            <TableRecord data={transactionsOutcome ?? []} title="Últimas Despesas" />
        </Space>
    )
}