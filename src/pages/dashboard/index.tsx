import { Loading } from "@/components/Loading/Loading";
import { TableRecord } from "@/components/Record/Record";
import { useTransaction } from "@/hooks/use-transaction";
import { AppDispatch, RootState } from "@/store";
import { getUserByEmail } from "@/store/features/user/UserSlice";
import { Space } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
    const dispatch = useDispatch<AppDispatch>()
    const { transactionsQuery } = useTransaction()
    const userState = useSelector((state: RootState) => state.userState)

    const loadData = async () => {
        if (userState.user?.id)
            await dispatch(getUserByEmail(userState.user.email))
    }
    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState.user?.id])

    return userState.isLoading || transactionsQuery.isLoading ? <Loading /> : (
        <Space direction="vertical" className="col-start-2 px-10 mt-10">
            <TableRecord data={transactionsQuery.data} title="Últimos Lançamentos" />
            <TableRecord data={transactionsQuery.data} title="Últimas Despesas" />
        </Space>
    )
}