import TransactionCategoryTranslate from 'assets/translate/TransactionCategory.json'
import { Modal } from 'components/Modal/Modal'
import { TransactionCategoryEnum } from 'enums/transaction-category.enum'
import { useTransaction } from 'hooks/use-transaction'
import { DevTool } from "@hookform/devtools"
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, Select } from 'antd'
import moment from 'moment'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

type RecordModalProps = {
    open?: boolean,
    setOpen: (value: boolean) => void,
    transaction?: ResponseGetTransactions
}

interface Inputs {
    description: string,
    amount: number,
    date: string,
    type: "income" | "outcome",
    category: string
}

const RecordModal = ({ open, setOpen, transaction }: RecordModalProps) => {

    const schema = z.object({
        description: z.string().nonempty({ message: "Descrição deve ter entre 3 e 50 caracteres" }),
        amount: z.coerce.number().min(0, { message: "Valor deve ser maior que 0" }),
        date: z.string(),
        type: z.enum(["income", "outcome"]),
        category: z.string().nonempty({ message: "Categoria é obrigatória" })
    })

    const initialValues = {
        description: "",
        amount: 0,
        date: moment().format("YYYY-MM-DD"),
        type: "income",
        category: TransactionCategoryEnum.Others
    } as Inputs

    const methods = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: initialValues,
        values: {
            description: transaction?.description ?? "",
            amount: transaction?.amount ?? 0,
            date: moment(transaction?.date).format("YYYY-MM-DD") ?? "",
            type: transaction?.type ?? "income",
            category: transaction?.category ?? TransactionCategoryEnum.Others
        }
    })

    const { setValue, reset, control, handleSubmit } = methods
    const { transactionCreateMutate, transactionUpdateMutate } = useTransaction()

    useEffect(() => {
        console.log({ transaction });

    }, [transaction])
    const handleClose = () => {
        reset()
        setOpen(false)
    }

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
                    handleClose()
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
        <FormProvider {...methods}>
            <Form
                onFinish={handleSubmit(onSubmit)}
                layout='vertical'
                className='p-4 text-gray-800'>
                <Form.Item label="Descrição">

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Descrição'
                                type="text"
                            />
                        )}
                    />
                </Form.Item>
                <Form.Item label="Data">
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder='Data'
                                type="date"
                            />
                        )}
                    />
                </Form.Item>
                <Form.Item label="Valor">
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} addonBefore="R$" type='number' />
                        )}
                    />
                </Form.Item>
                <Form.Item label="Tipo">
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} placeholder='Tipo'>
                                <Select.Option value="income">Entrada</Select.Option>
                                <Select.Option value="outcome">Despesa</Select.Option>
                            </Select>
                        )}
                    />

                </Form.Item>
                <Form.Item label="Categoria">
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select {...field} placeholder='Categoria' options={renderCategories()} />
                        )}
                    />
                </Form.Item>
                <Button className='w-full' size='large' htmlType='submit'>{transaction ? "Atualizar" : "Adicionar"}</Button>
            </Form>
        </FormProvider>
    )
    return (
        <>
            <Modal
                closeModal={handleClose}
                openModal={() => setOpen(true)}
                open={open}
                trigger={<Button>Adicionar</Button>}
                content={renderContent}
            />
            <DevTool control={control} />
        </>
    )
}

export default RecordModal
