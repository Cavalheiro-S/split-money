import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionCategoryEnum } from "@/enums/transaction-category.enum";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const schema = z.object({
  description: z.string().nonempty(),
  type: z.enum(["income", "outcome"]),
  recurrent: z.boolean(),
  date: z.coerce.date(),
  category: z.string().nonempty(),
  amount: z.coerce.number().nonnegative(),
})

interface TransactionTableActionModalProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  transaction?: Transaction;
  updateData?: () => Promise<void>;
}


function TransactionActionModal({ trigger, transaction, open, onOpenChange, updateData }: TransactionTableActionModalProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      recurrent: false,
      date: new Date(),
      category: "",
      amount: 0,
    },
  });

  const { setValue, reset, formState: { isSubmitting } } = form

  async function onSubmit(data: z.infer<typeof schema>) {
    const action = transaction ? "atualizar" : "criar"
    try {
      if (transaction) {
        await api.patch(`/transaction/${transaction.id}`, data)
        toast("Transação atualizada com sucesso")
      }
      else {
        await api.post("/transaction", data)
        toast("Transação criada com sucesso")
      }
      onOpenChange?.(false)
      await updateData?.()
    }
    catch (error) {
      toast(`Falha ao ${action} transação`)
      console.log({ error });

    }
  }

  useEffect(() => {
    if (transaction) {
      setValue("amount", transaction.amount)
      setValue("category", transaction.category)
      setValue("date", new Date(transaction.date))
      setValue("description", transaction.description)
      setValue("recurrent", transaction.recurrent || false)
      setValue("type", transaction.type)
    }
    else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction])

  useEffect(() => {
    if (!open) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  console.log({ errors: form.formState.errors });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar" : "Novo"} lançamento</DialogTitle>
          <DialogDescription>
            {`Informe os dados abaixo para ${transaction ? "editar" : "criar"} um lançamento.`}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição" {...field} />
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
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input placeholder="Valor" {...field} />
                    </FormControl>
                    <FormMessage />
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
                            date > new Date() || date < new Date("1900-01-01")
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de transação" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(TransactionCategoryEnum).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full justify-end">

                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionActionModal;