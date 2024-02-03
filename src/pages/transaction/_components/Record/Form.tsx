import TransactionCategoryTranslate from '@/assets/translate/TransactionCategory.json'
import { TransactionCategoryEnum } from '@/enums/TransactionCategoryEnum'
import { capitalizeFirstLetter } from '@/utils'
import { Button, Form, Input, Select } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { useDispatch, useSelector } from 'react-redux'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"

interface Inputs {
    description: string,
    amount: number,
    date: string,
    type: "income" | "outcome",
    category: string
}

const schema = z.object({
    description: z.string().nonempty({ message: "Descrição deve ter entre 3 e 50 caracteres" }),
    amount: z.coerce.number().min(0, { message: "Valor deve ser maior que 0" }),
    date: z.string(),
    type: z.enum(["income", "outcome"]),
    category: z.string().nonempty({ message: "Categoria é obrigatória" })
})

export const RecordForm = () => {

    const initialValues = {
        description: "",
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
        type: "income",
        category: TransactionCategoryEnum.Others
    } as Inputs

    const [isNewTransaction, setIsNewTransaction] = useState(false)
    const { handleSubmit, setValue, control, reset } = useForm<Inputs>({
        defaultValues: initialValues,
        resolver: zodResolver(schema)
    })
    const [form] = Form.useForm();

    useEffect(() => {
        if (true) {
            const { description, amount, date, type, category } = { ...initialValues }
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
            setIsNewTransaction(false)
        }
        else {
        }

        return () => {
            form.resetFields()
            form.setFieldsValue(initialValues)
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async (data: Inputs) => {

        const transactionData: TransactionWithUserId = {
            amount: Number(data.amount),
            category: data.category,
            date: moment(data.date).toDate(),
            description: data.description,
            type: data.type,
            userId: ""
        }
    }


    const renderCategories = () => {
        const categories = Object.values(TransactionCategoryEnum)
        return categories.map((category, index) => {
            return {
                label: TransactionCategoryTranslate[category as keyof typeof TransactionCategoryTranslate],
                value: category,
                key: category + index.toString()
            }
        })
    }
    return (
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
            <Button className='w-full' size='large' htmlType='submit'>{isNewTransaction ? "Adicionar" : "Atualizar"}</Button>
        </Form>)
}
