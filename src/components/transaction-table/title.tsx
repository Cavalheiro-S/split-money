import { DatePicker, Space, Typography } from "antd"
import { TransactionModal } from "components/transaction-modal/modal"
import dayjs, { Dayjs } from "dayjs"

type TitleProps = {
    title: string
    onChangeDate?: (value: Dayjs, dateString: string) => void
    hasActions?: boolean
}

export const TableTitle = ({ title, onChangeDate, hasActions}: TitleProps) => {
    return (
        <div className='flex flex-col w-full'>
            <Space className='flex justify-between'>
                <h3 className='font-sans font-semibold text-gray-700'>{title}</h3>
                {hasActions && <TransactionModal />}
            </Space>
            <div className='flex flex-col'>
                {onChangeDate && <>
                    <Typography.Text>Selecione o mês</Typography.Text>
                    <DatePicker
                        defaultValue={dayjs(new Date())}
                        onChange={(value, dateString) => {
                            if (typeof dateString === "string")
                                onChangeDate(value, dateString)
                        }} picker={"month"} format={"MM/YYYY"} className='w-52' placeholder='Selecione o mês' />
                </>}
            </div>
        </div>
    )
}