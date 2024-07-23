import { BankOutlined, DeleteOutlined, DollarOutlined, EditFilled, ReadOutlined } from "@ant-design/icons"
import { Popconfirm, Space, Tooltip } from "antd"
import { ColumnsType } from "antd/lib/table"
import { TransactionCategoryEnum } from "enums/transaction-category.enum"
import moment from "moment"
import { capitalizeFirstLetter } from "utils"

export const useColumns = (hasActions: boolean, onEdit: (transaction: ResponseGetTransactions) => void, onDelete: (id: string) => void) => {
    
    const columns: ColumnsType<ResponseGetTransactions> = [
        {
            width: 48,
            className: '!py-1 !px-4',
            render: (_, record) => {
                return (
                    <Space className='flex items-center justify-center w-full h-full'>
                        {record.type === "income"
                            ? <DollarOutlined className='text-xl text-green-500' />
                            : <BankOutlined className='text-xl text-red-500' />}
                    </Space>
                )
            }
        },
        {
            title: 'Descrição',
            className: '!p-2',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Data',
            className: '!p-2',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (text: string) => <p>{moment(text).format("DD/MM/YYYY")}</p>
        },
        {
            title: 'Categoria',
            className: '!p-2',
            dataIndex: 'category',
            key: 'category',
            render: (text: string) => {
                const categoryFirstLetterCapitalize = capitalizeFirstLetter(text)
                return <span>{TransactionCategoryEnum[categoryFirstLetterCapitalize as keyof typeof TransactionCategoryEnum]}</span>
            }
        },
        {
            title: 'Valor',
            className: '!p-2',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: number) => <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(text)}</p>
        },
    ]

    if (hasActions) {
        columns.push({
            title: 'Ações',
            key: 'actions',
            dataIndex: 'id',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip
                        title="Editar"
                        className='cursor-pointer hover:text-blue-600'>
                        <EditFilled onClick={() => onEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        icon={<DeleteOutlined style={{ color: "red" }} />}
                        title="Deletar a transação"
                        okText="Deletar"
                        cancelText="Não"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => onDelete(record.id)}
                        description={`Você tem certeza que deseja deletar a transação ${record.description}?`}>
                        <Tooltip title="Deletar" className='cursor-pointer hover:text-red-600'>
                            <DeleteOutlined />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        })
    }

    return (columns)
}