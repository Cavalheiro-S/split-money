import transactionCategory from "assets/translate/TransactionCategory.json"
import { TransactionCategoryEnum } from "enums/transaction-category.enum"
import { capitalizeFirstLetter } from 'utils'
import { DeleteOutlined } from '@ant-design/icons'
import { CreditCard, Money } from '@phosphor-icons/react'
import { Popconfirm, Space, Table } from "antd"
import { ColumnsType } from "antd/es/table"
import moment from "moment"
import { useEffect, useState } from "react"
import { twMerge } from 'tailwind-merge'
import RecordModal from "./modal"

interface RecordProps {
  title: string,
  data: ResponseGetTransactions[] | undefined,
  onCreate?: (transaction: ResponseGetTransactions) => Promise<void>,
  onDelete: (id: string) => Promise<void>
  onEdit: (transaction: ResponseGetTransactions) => Promise<void>
  hasActions?: boolean,
  className?: string,
}

const TableRecord = ({ className, data, onCreate, onDelete, onEdit, hasActions, title }: RecordProps) => {
  const [selectedRow, setSelectedRow] = useState<ResponseGetTransactions | undefined>()
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    if (!open) {
      setSelectedRow(undefined)
    }
  }, [open])

  const columns: ColumnsType<ResponseGetTransactions> = [
    {
      render: (_, record) => {
        if (record.type === "income")
          return <Money className='w-8 h-8 text-green-500' />
        return <CreditCard className='w-8 h-8 text-red-500' />
      }
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
      render: (text: Date) => <p>{moment(text).format('DD/MM/YYYY')}</p>
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => {
        const categoryFirstLetterCapitalize = capitalizeFirstLetter(text)
        return <span>{transactionCategory[categoryFirstLetterCapitalize as TransactionCategoryEnum]}</span>
      }
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(text)}</p>
    },
  ]

  if (hasActions)
    columns.push({
      title: 'Ações',
      key: 'actions',
      dataIndex: 'id',
      render: (_, record) => (
        <Space>
          <span className='cursor-pointer hover:text-blue-600'
            onClick={() => {
              setSelectedRow(record)
              setOpen(true)
            }}>Editar</span>
          <Popconfirm
            icon={<DeleteOutlined style={{ color: "red" }} />}
            title="Deletar a transação"
            okText="Deletar"
            cancelText="Não"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id ?? "")}
            description={`Você tem certeza que deseja deletar a transação ${record.description}?`}>
            <span className='cursor-pointer hover:text-red-600'>Excluir</span>
          </Popconfirm>
        </Space>
      )
    })

  return (
    <Table
      rowKey={record => record.id ?? record.description + record.category}
      dataSource={data}
      className={twMerge(className)}
      columns={columns}
      title={() => (
        <div className='flex items-center justify-between w-full'>
          <h3 className='font-sans font-semibold text-gray-700'>{title}</h3>
          {hasActions && <RecordModal open={open} setOpen={setOpen} transaction={selectedRow} />}
        </div>
      )}
      onRow={record => {
        return {
          ...(onCreate && { onClick: () => onCreate(record) })
        }
      }} />


  )
}

export default TableRecord