import { TransactionCategoryEnum } from '@/enums/TransactionCategoryEnum';
import { useTransaction } from '@/hooks/use-transaction';
import TableRecord from '@/pages/transaction/_components/Record/TableRecord';
import { zodResolver } from '@hookform/resolvers/zod';
import moment from 'moment';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod'

interface Inputs {
    description: string,
    amount: number,
    date: string,
    type: "income" | "outcome",
    category: string
}

export default function Page() {
    const {
        transactions,
        transactionDeleteMutate,
        transactionUpdateMutate
    } = useTransaction({ page: 1, count: 10 })

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
        defaultValues: initialValues,
        resolver: zodResolver(schema)
    })

    const handleDelete = async (id: string) => {
        try {
            await transactionDeleteMutate.mutateAsync(id)
            toast.success("Transação deletada com sucesso")
        }
        catch (error) {
            console.log(error)
            toast.error("Erro ao deletar a transação")
        }
    }

    const handleEdit = async (data: Transaction) => {
        try {
            const dataMap: RequestUpdateTransaction = {
                id: data.id,
                amount: data.amount,
                category: data.category,
                date: moment(data.date).format("YYYY-MM-DD"),
                description: data.description,
                type: data.type,
            }
            await transactionUpdateMutate.mutateAsync(dataMap, {
                onSuccess: () => {
                    toast.success("Transação atualizada com sucesso")
                }
            })
        }
        catch (error) {
            console.error(error)
            toast.error("Falha ao atualizar a transação")
        }
    }

    return (
        <FormProvider {...methods}>
            <div className='flex justify-center min-h-screen px-10 pt-10'>
                <TableRecord
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    data={transactions}
                    hasActions
                    className='w-full h-fit'
                    title='Lançamentos' />
            </div>
        </FormProvider>
    )
}
