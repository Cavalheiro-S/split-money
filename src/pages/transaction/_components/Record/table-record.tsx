import { BankOutlined, DeleteOutlined, DollarOutlined, EditFilled } from '@ant-design/icons'
import { DatePicker, Flex, Popconfirm, Space, Table, Tooltip, Typography } from "antd"
import { ColumnsType } from "antd/es/table"
import transactionCategory from "assets/translate/TransactionCategory.json"
import dayjs, { Dayjs } from 'dayjs'
import { TransactionCategoryEnum } from "enums/transaction-category.enum"
import moment from 'moment'
import { useEffect, useState } from "react"
import { twMerge } from 'tailwind-merge'
import { capitalizeFirstLetter } from 'utils'
import { RecordModal } from './modal'


interface RecordProps {
  title: string,
  data: ResponseGetTransactions[] | undefined,
  onCreate?: (transaction: ResponseGetTransactions) => Promise<void>,
  onDelete: (id: string) => Promise<void>
  onEdit: (transaction: ResponseGetTransactions) => Promise<void>
  onChangeDate?: ((value: Dayjs | null, dateString: string) => void) | undefined
  hasActions?: boolean,
  className?: string,
  isLoading?: boolean
}

const TableRecord = ({
  className,
  data,
  hasActions,
  title,
  isLoading,
  onCreate,
  onDelete,
  onChangeDate,
  onEdit
}: RecordProps) => {
  const [selectedRow, setSelectedRow] = useState<ResponseGetTransactions | undefined>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setSelectedRow(undefined)
    }
  }, [open])

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
        return <span>{transactionCategory[categoryFirstLetterCapitalize as TransactionCategoryEnum]}</span>
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

  if (hasActions)
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
            <EditFilled
              onClick={() => {
                setSelectedRow(record)
                setOpen(true)
              }} />
          </Tooltip>
          <Popconfirm
            icon={<DeleteOutlined style={{ color: "red" }} />}
            title="Deletar a transação"
            okText="Deletar"
            cancelText="Não"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(record.id ?? "")}
            description={`Você tem certeza que deseja deletar a transação ${record.description}?`}>
            <Tooltip title="Deletar" className='cursor-pointer hover:text-red-600'>
              <DeleteOutlined />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    })

  return (
    <Flex className='w-full p-2 py-1 bg-white rounded-lg h-fit'>

      <Table
        loading={isLoading}
        rowKey={record => record.id ?? record.description + record.category}
        dataSource={data}
        className={twMerge(className, 'w-full')}
        columns={columns}
        summary={(pageData) => {
          let totalTransaction = 0

          pageData.forEach(({ amount, type }) => {
            totalTransaction = type === "income" ? totalTransaction + amount : totalTransaction - amount
          })

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align='right' className='font-bold'>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={4}>
                  <Typography.Text className='font-bold'>{`${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalTransaction)}`}</Typography.Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )
        }}
        title={() => (
          <div className='flex flex-col w-full'>
            <Space className='flex justify-between'>
              <h3 className='font-sans font-semibold text-gray-700'>{title}</h3>
              {hasActions && <RecordModal open={open} setOpen={setOpen} transaction={selectedRow} />}
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
        )}
        onRow={record => onCreate ? { onClick: () => onCreate(record) } : {}} />
    </Flex>
  )
}

export default TableRecord