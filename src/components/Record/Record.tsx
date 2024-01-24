import transactionCategory from "@/assets/translate/TransactionCategory.json"
import { TransactionCategoryEnum } from '@/enums/TransactionCategoryEnum'
import { AppDispatch } from '@/store'
import { openModal } from '@/store/features/modal/ModalSlice'
import { deleteTransactionAsync, setTransactionActive } from '@/store/features/transaction/TransactionSlice'
import { capitalizeFirstLetter } from '@/utils'
import { DeleteOutlined } from '@ant-design/icons'
import { CreditCard, Money } from '@phosphor-icons/react'
import { Popconfirm, Space, Table } from "antd"
import { ColumnsType } from "antd/es/table"
import moment from "moment"
import { useRouter } from "next/router"
import { useDispatch } from 'react-redux'
import { twMerge } from 'tailwind-merge'
import { RecordModal } from "./Modal"
interface RecordProps {
  title: string,
  data: Transaction[] | undefined,
  hasActions?: boolean,
  className?: string,
}

export const TableRecord = ({ className, data, hasActions, title }: RecordProps) => {

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const columns: ColumnsType<Transaction> = [
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
          <span className='cursor-pointer hover:text-blue-600' onClick={() => handleEdit(record)}>Editar</span>
          <Popconfirm
            icon={<DeleteOutlined style={{ color: "red" }} />}
            title="Deletar a transação"
            okText="Deletar"
            cancelText="Não"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id ?? "")}
            description={`Você tem certeza que deseja deletar a transação ${record.description}?`}>
            <span className='cursor-pointer hover:text-red-600'>Excluir</span>
          </Popconfirm>
        </Space>
      )
    })


  const handleDelete = async (id: string) => dispatch(deleteTransactionAsync(id))

  const handleEdit = async (transaction: Transaction) => {
    if (transaction.id) {
      dispatch(setTransactionActive(transaction))
      dispatch(openModal())
    }
  }

  const handleRowClick = (record: Transaction) => {
    if (!hasActions) {
      router.push(`/transaction/`)
      dispatch(openModal())
      dispatch(setTransactionActive(record))
    }
  }

  return (
    <Table
      rowKey={record => record.id ?? record.description + record.category}
      dataSource={data}
      className={twMerge(className)}
      columns={columns}
      title={() => (
        <div className='flex items-center justify-between w-full'>
          <h3 className='font-sans font-semibold text-gray-700'>{title}</h3>
          {hasActions && <RecordModal />}
        </div>
      )}
      onRow={record => {
        return {
          onClick: () => handleRowClick(record)
        }
      }} />


  )
}
