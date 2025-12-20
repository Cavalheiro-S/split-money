"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RecurringTransactionService } from "@/services/recurring-transaction.service"
import { useState } from "react"
import { toast } from "sonner"
import { errorLogger } from "@/lib/error-logger"

const recurringTransactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  type: z.enum(["income", "outcome"], {
    required_error: "Tipo é obrigatório",
  }),
  frequency: z.string().min(1, "Frequência é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1"),
  paymentStatusId: z.string().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
})

type RecurringTransactionFormValues = z.infer<typeof recurringTransactionSchema>

interface RecurringTransactionFormProps {
  transaction?: ResponseGetRecurringTransactions
  onSuccess: () => Promise<void>
  onCancel: () => void
  categories?: Category[]
  paymentStatuses?: PaymentStatus[]
  tags?: Tag[]
}

export function RecurringTransactionForm({
  transaction,
  onSuccess,
  onCancel,
  categories = [],
  paymentStatuses = [],
  tags = [],
}: RecurringTransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<RecurringTransactionFormValues>({
    resolver: zodResolver(recurringTransactionSchema),
    defaultValues: {
      description: transaction?.description || "",
      amount: transaction?.amount || 0,
      type: transaction?.type || "outcome",
      frequency: transaction?.frequency || "",
      quantity: transaction?.quantity || 1,
      paymentStatusId: transaction?.payment_status?.id || "",
      categoryId: transaction?.categories?.id || "",
      tagId: transaction?.tags?.id || "",
    },
  })

  const onSubmit = async (values: RecurringTransactionFormValues) => {
    setIsSubmitting(true)
    try {
      if (transaction) {
        await RecurringTransactionService.updateRecurringTransaction({
          id: transaction.id,
          ...values,
          date: new Date(transaction.date),
        })
        toast.success("Transação recorrente atualizada com sucesso!")
      } else {
        await RecurringTransactionService.createRecurringTransaction({
          ...values,
          date: new Date(),
        })
        toast.success("Transação recorrente criada com sucesso!")
      }
      await onSuccess()
    } catch (error) {
      toast.error("Erro ao salvar transação recorrente. Tente novamente.")
      errorLogger.logAPIError(error as Error, "/api/recurring-transactions")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Salário mensal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="outcome">Despesa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequência</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentStatusId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status de Pagamento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma tag" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : transaction ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
