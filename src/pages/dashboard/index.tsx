'use client'

import { Loading } from "@/components/Loading/Loading";
import { useTransaction } from "@/hooks/use-transaction";
import { TableRecord } from "@/pages/transaction/_components/Record/TableRecord";
import { Space } from "antd";

export default function Page() {
    const { transactions, transactionsLoading } = useTransaction()

    return transactionsLoading ? <Loading /> : (
        <Space direction="vertical" className="col-start-2 px-10 mt-10">
            <TableRecord data={transactions ?? []} title="Últimos Lançamentos" />
            <TableRecord data={transactions ?? []} title="Últimas Despesas" />
        </Space>
    )
}