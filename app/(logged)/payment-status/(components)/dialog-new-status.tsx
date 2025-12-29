import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreatePaymentStatus } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  status: z
    .string()
    .min(1, "Status é obrigatório")
    .min(2, "Status deve ter pelo menos 2 caracteres")
    .max(50, "Status deve ter no máximo 50 caracteres")
    .trim(),
});

export const DialogNewStatus = () => {
  const [open, setOpen] = useState(false);
  const createPaymentStatus = useCreatePaymentStatus();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    createPaymentStatus.mutate(
      { description: data.status },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Status</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar um novo status</DialogTitle>
          <DialogDescription>
            Preencha o campo abaixo para cadastrar um novo status
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={createPaymentStatus.isPending}
              className="w-fit place-self-end"
              type="submit"
            >
              {createPaymentStatus.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

