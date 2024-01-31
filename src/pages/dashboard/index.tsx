import { Loading } from "@/components/Loading/Loading";
import { TableRecord } from "@/components/Record/Record";
import { useTransaction } from "@/hooks/use-transaction";
import { Space } from "antd";

export default function Page() {
    const { transactionsQuery } = useTransaction()

    return transactionsQuery.isLoading ? <Loading /> : (
        <Space direction="vertical" className="col-start-2 px-10 mt-10">
            <TableRecord data={transactionsQuery.data} title="Últimos Lançamentos" />
            <TableRecord data={transactionsQuery.data} title="Últimas Despesas" />
        </Space>
    )
}