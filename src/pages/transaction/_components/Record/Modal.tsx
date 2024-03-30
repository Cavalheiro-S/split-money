import TransactionCategoryTranslate from '@/assets/translate/TransactionCategory.json'
import { Modal } from '@/components/Modal/Modal'
import { TransactionCategoryEnum } from '@/enums/TransactionCategoryEnum'
import { useTransaction } from '@/hooks/use-transaction'
import { capitalizeFirstLetter } from '@/utils'
import { Button, Form, Input, Select } from 'antd'
import moment from 'moment'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { toast } from 'react-toastify'
type RecordModalProps = {
    open?: boolean,
    setOpen: (value: boolean) => void,
    transaction?: Transaction
}

interface Inputs {
    description: string,
    amount: number,
    date: string,
    type: "income" | "outcome",
    category: string
}

const RecordModal = ({ open, setOpen, transaction }: RecordModalProps) => {


    const { setValue, reset, control, handleSubmit } = useFormContext<Inputs>()
    const [form] = Form.useForm();
    const { transactionCreateMutate, transactionUpdateMutate } = useTransaction()

    useEffect(() => {
        if (transaction) {
            const { description, amount, date, type, category } = transaction
            setValue('description', description)
            setValue('amount', Number(amount))
            setValue('date', moment(date).format('YYYY-MM-DD'))
            setValue('type', type)
            setValue('category', capitalizeFirstLetter(category))

            const transactionToUpdate = {
                description,
                amount: Number(amount),
                date: moment(date).format('YYYY-MM-DD'),
                type,
                category: capitalizeFirstLetter(category),
            }
            form.setFieldsValue(transactionToUpdate)
        }

        return () => {
            form.resetFields()
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction])

    const onSubmit = async (data: Inputs) => {
        try {
            const dataMap: RequestCreateTransaction = {
                amount: data.amount,
                category: data.category,
                date: moment(data.date).format('YYYY-MM-DD'),
                description: data.description,
                type: data.type,
            }
            if (transaction) {
                await transactionUpdateMutate.mutateAsync({ ...dataMap, id: transaction.id }, {
                    onSuccess: () => {
                        toast.success("Lançamento atualizado com sucesso")
                        setOpen(false)
                    }
                })
                return;
            }
            await transactionCreateMutate.mutateAsync(dataMap, {
                onSuccess: () => {
                    toast.success("Lançamento adicionado com sucesso")
                    setOpen(false)
                }
            })
        }
        catch (error) {
            console.log(error)
        }

    }


    const renderCategories = () => {
        const categories = Object.values(TransactionCategoryEnum)
        return categories.map((category, index) => ({

            label: TransactionCategoryTranslate[category as keyof typeof TransactionCategoryTranslate],
            value: category,
            key: category + index.toString()

        }))
    }

    const renderContent = (
        <Form
            form={form}
            onFinish={handleSubmit(onSubmit)}
            layout='vertical'
            className='p-4 text-gray-800'>
            <FormItem
                label="Descrição"
                name="description"
                shouldUpdate
                control={control}>
                <Input placeholder='Descrição' type="text" />
            </FormItem>
            <FormItem
                label="Data"
                name="date"
                shouldUpdate
                control={control}>
                <Input placeholder='Data' type="date" />
            </FormItem>
            <FormItem
                label="Valor"
                name="amount"
                shouldUpdate
                control={control}>
                <Input addonBefore="R$" type='number' />
            </FormItem>

            <FormItem
                label="Tipo"
                name="type"
                shouldUpdate
                control={control}
            >
                <Select placeholder='Tipo'>
                    <Select.Option value="income">Entrada</Select.Option>
                    <Select.Option value="outcome">Despesa</Select.Option>
                </Select>
            </FormItem>

            <FormItem
                label="Categoria"
                name="category"
                shouldUpdate
                control={control}>
                <Select placeholder='Categoria' options={renderCategories()} />
            </FormItem>
            <Button className='w-full' size='large' htmlType='submit'>{transaction ? "Atualizar" : "Adicionar"}</Button>
        </Form>
    )
    return (
        <Modal
            closeModal={() => setOpen(false)}
            openModal={() => setOpen(true)}
            open={open}
            trigger={<Button>Adicionar</Button>}
            content={renderContent}
        />)
}

export default RecordModal
