import { PlusOutlined } from "@ant-design/icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Form, Input, Select, Space, Switch } from "antd"
import { TransactionTableContext } from "contexts/transaction-table-context"
import { TransactionCategoryEnum } from "enums/transaction-category.enum"
import { TransactionRecurrenceIntervalEnum } from "enums/transaction-recurrence-interval"
import { useTransaction } from "hooks/use-transaction"
import moment from "moment"
import { useContext, useEffect } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { getFirstEnumKey } from "utils"
import * as z from 'zod'

export const TransactionModalForm = () => {

    const { open, setOpen, selectedRow: transaction, setSelectedRow } = useContext(TransactionTableContext)

    const schema = z.object({
        description: z.string().nonempty({ message: "Descrição deve ter entre 3 e 50 caracteres" }),
        amount: z.coerce.number().min(0, { message: "Valor deve ser maior que 0" }),
        date: z.string(),
        type: z.enum(["income", "outcome"]),
        category: z.string().nonempty({ message: "Categoria é obrigatória" }),
        recurrent: z.object({
            active: z.boolean().default(false),
            interval: z.string().optional(),
            occurrences: z.coerce.number().optional()
        })
    })


    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            date: moment().format("yyyy-MM-DD"),
            type: "income",
            category: getFirstEnumKey(TransactionCategoryEnum),
            recurrent: {
                active: false
            },
            amount: 0,
            description: "",
        },
    })

    const { reset, control, handleSubmit, watch, setValue, formState: { isDirty } } = methods
    const { transactionCreateMutate, transactionUpdateMutate } = useTransaction()

    useEffect(() => {
        if (transaction) {
            setValue("description", transaction.description ?? "");
            setValue("amount", transaction.amount ?? 0);
            setValue("date", moment(transaction.date).format("YYYY-MM-DD") ?? moment().format("YYYY-MM-DD"));
            setValue("type", transaction.type ?? "income");
            setValue("category", transaction.category ?? getFirstEnumKey(TransactionCategoryEnum));
            setValue("recurrent.active", transaction.recurrent ?? false);
        }
    }, [transaction, setValue]);

    useEffect(() => {
        if (!open) {
            reset()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handleClose = () => {
        reset()
        setSelectedRow(undefined)
        setOpen(false)
    }

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            const recurrence: RequestCreateTransaction["recurrence"] =
            {
                interval: data.recurrent.interval || "",
                occurrences: data.recurrent.occurrences || 0
            }
            const dataMap: RequestCreateTransaction = {
                amount: data.amount,
                category: data.category,
                date: data.date,
                description: data.description,
                type: data.type,
                recurrent: data.recurrent.active,
                ...(data.recurrent.active && { recurrence })
            }
            if (transaction) {
                await transactionUpdateMutate.mutateAsync({ ...dataMap, id: transaction.id, recurrent: false }, {
                    onSuccess: () => {
                        toast.success("Lançamento atualizado com sucesso")
                        handleClose()
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
        const categories = Object.entries(TransactionCategoryEnum)
        return categories.map(([key, label], index) => ({

            label: label,
            value: key,
            key: key + index.toString()

        }))
    }

    const renderRecurrent = () => {
        const recurrenceInterval = Object.entries(TransactionRecurrenceIntervalEnum)
        return recurrenceInterval.map(([key, label], index) => ({
            label: label,
            value: key,
            key: key + index.toString()
        }))
    }

    return (
        <FormProvider {...methods}>
            <Form
                onFinish={handleSubmit(onSubmit)}
                layout='vertical'
                className='grid grid-cols-2 p-4 text-gray-800 gap-x-2'>
                <Form.Item label="Descrição" className="col-span-2" >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, }) => (
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
                <Form.Item label="Valor">
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} addonBefore="R$" type='number' />
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
                <Form.Item label="Recorrente">
                    <Controller
                        name="recurrent.active"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                disabled={transaction ? true : false}
                                defaultChecked={false}
                                value={field.value}
                                checked={field.value}
                                checkedChildren={<>Habilitado</>}
                                unCheckedChildren={<>Desabilitado</>}
                                onChange={(e) => { field.onChange(e) }} />
                        )}
                    />
                </Form.Item>
                {(watch("recurrent.active") && !transaction)
                    ? <>
                        <Form.Item
                            label="Intervalo"
                            tooltip={{ title: "Intervalo entre a recorrência dessa transação" }}>
                            <Controller
                                name="recurrent.interval"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} options={renderRecurrent()} />
                                )}
                            />
                        </Form.Item>
                        <Form.Item label="Frequencia" tooltip={{ title: "Quantidade de ocorrências dessa transação" }}>
                            <Controller
                                name="recurrent.occurrences"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} type='number' min={1} />
                                )}
                            />
                        </Form.Item>
                    </> : null}
                <Space className="flex justify-between col-span-2">
                    <Button
                        size='large'
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="primary"
                        size='large'
                        icon={<PlusOutlined />}
                        disabled={!isDirty}
                        loading={transactionCreateMutate.isPending || transactionUpdateMutate.isPending}
                        htmlType='submit'>
                        {transaction ? "Atualizar" : "Adicionar"}
                    </Button>
                </Space>
            </Form>
        </FormProvider>
    )
}