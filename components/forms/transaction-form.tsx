import { TransactionFrequencyEnum } from "@/enums/transaction";
import { cn } from "@/lib/utils";
import { CategoryService } from "@/services/category.service";
import { PaymentStatusService } from "@/services/payment-status.service";
import { TransactionService } from "@/services/transaction.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Info, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
const schema = z.object({
  description: z
    .string({ message: "A descrição é obrigatória" })
    .nonempty("A descrição é obrigatória"),
  type: z
    .enum(["income", "outcome"], { message: "O tipo é obrigatório" }),
  date: z
    .coerce
    .date()
    .default(() => new Date())
  ,
  category: z
    .string({ message: "A categoria é obrigatória" })
    .nonempty("A categoria é obrigatória"),
  amount: z
    .number({ message: "O valor é obrigatório" })
    .positive("O valor deve ser maior que zero")
    .min(0.01, "O valor mínimo é R$ 0,01"),
  recurrent: z
    .object({
      active: z.boolean(),
      frequency: z.string().optional(),
      quantity: z.coerce.number().int().positive().default(1),
    })
    .optional(),
  paymentStatusId: z.string().optional(),
})

export type TransactionFormData = z.infer<typeof schema>;

interface TransactionFormProps {
  transaction?: ResponseGetTransactions;
  isSubmitting?: boolean;
  onOpenChange?: (open: boolean) => void;
  updateData?: () => Promise<void>;
}

export function TransactionForm({ transaction, onOpenChange, updateData }: TransactionFormProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      date: new Date(),
      category: "",
      amount: 0,
      recurrent: {
        active: false,
        frequency: "daily",
        quantity: 1
      },
      paymentStatusId: ""
    },
  });

  const { setValue, reset, watch, formState: { isSubmitting } } = form

  // Carrega os dados da transação quando disponível e quando as listas estão carregadas
  useEffect(() => {
    if (transaction && isDataLoaded) {
      setValue("amount", transaction.amount)
      setValue("category", transaction.categories?.id || "")
      setValue("date", new Date(transaction.date))
      setValue("description", transaction.description)
      setValue("recurrent", { active: false, frequency: "daily", quantity: 1 })
      setValue("type", transaction.type)
      setValue("paymentStatusId", transaction.payment_status?.id || "")
    }
    else if (!transaction) {
      reset()
    }
  }, [transaction, setValue, reset, isDataLoaded])

  const getCategories = async () => {
    try {
      setIsLoading(true)
      const res = await CategoryService.getCategories()
      setCategories(res.data)
    } catch (error) {
      toast.error("Erro ao carregar categorias")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPaymentStatus = async () => {
    try {
      setIsLoading(true)
      const res = await PaymentStatusService.getPaymentStatus()
      setPaymentStatus(res.data)
    }
    catch (error) {
      toast.error("Erro ao carregar status de pagamento")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setIsDataLoaded(false)
    Promise.all([
      getPaymentStatus(),
      getCategories()
    ]).catch((error) => {
      toast.error("Erro ao carregar dados")
      console.error(error)
    }).finally(() => {
      setIsLoading(false)
      setIsDataLoaded(true)
    })
  }, [])

  async function onSubmit(data: TransactionFormData) {
    const action = transaction ? "atualizar" : "criar"
    try {
      setIsLoading(true)
      const mapData: RequestCreateTransaction = {
        ...data,
        amount: data.amount,
        recurrent: data.recurrent?.active
          ? {
            frequency: data.recurrent.frequency ?? TransactionFrequencyEnum.DAILY,
            quantity: data.recurrent.quantity
          }
          : undefined,
        paymentStatusId: data.paymentStatusId || undefined,
        categoryId: data.category || undefined,
      }
      if (transaction) {
        await TransactionService.updateTransaction({ ...mapData, id: transaction.id })
        toast("Transação atualizada com sucesso")
      }
      else {
        await TransactionService.createTransaction(mapData)
        toast("Transação criada com sucesso")
      }
      onOpenChange?.(false)
      await updateData?.()
    }
    catch (error) {
      toast(`Falha ao ${action} transação`)
      console.log({ error });
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Descrição" 
                  disabled={isLoading || isSubmitting}
                  {...field} 
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
              <Select disabled={isLoading || isSubmitting} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de transação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="z-50">
                  <SelectItem key={"income"} value={"income"}>
                    Entrada
                  </SelectItem>
                  <SelectItem key={"outcome"} value={"outcome"}>
                    Saída
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="R$ 0,00"
                  disabled={isLoading || isSubmitting}
                  className="text-left"
                  onValueChange={(values) => {
                    // Atualiza o valor numérico no formulário
                    field.onChange(values.floatValue || 0);
                  }}
                  value={field.value}
                  aria-label="Campo de valor da transação"
                />
              </FormControl>
              <FormDescription>
                Digite o valor da transação em reais
              </FormDescription>
              {fieldState.error && (
                <p className="text-sm font-medium text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da transação</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      disabled={isLoading || isSubmitting}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    locale={ptBR}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Data que a transação foi realizada
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select disabled={isLoading || isSubmitting} value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormLabel>Status de pagamento</FormLabel>
              <Select value={field.value} disabled={isLoading || isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um status de pagamento"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentStatus.map((status) => (
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


        <div className="flex flex-col border-t border-gray-200 pt-4 space-y-4">
          <FormField
            control={form.control}
            name="recurrent.active"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-between">
                <div className="space-y-0.5">
                  <FormLabel>Recorrente</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    disabled={!!transaction || isLoading || isSubmitting}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {
            watch("recurrent.active") && (
              <>
                <FormField
                  control={form.control}
                  name="recurrent.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>Frequência</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-5 h-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Frequência que a ocorrência vai acontecer</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select disabled={isLoading || isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma frequência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TransactionFrequencyEnum).map(([key, value]) => (
                            <SelectItem key={key} value={key.toLowerCase()}>
                              {value}
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
                  name="recurrent.quantity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2 items-center">
                        <FormLabel>Quantidade</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-5 h-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Quantidade de ocorrências da transação</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Quantidade"
                          disabled={isLoading || isSubmitting}
                          {...field}
                          value={field.value ?? 1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )
          }
        </div>

        <div className="flex w-full justify-end">
          <Button disabled={isSubmitting || isLoading} type="submit">
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
