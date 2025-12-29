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
import { useCreateCategory } from "@/hooks/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(1, "Categoria é obrigatória")
    .min(2, "Categoria deve ter pelo menos 2 caracteres")
    .max(50, "Categoria deve ter no máximo 50 caracteres")
    .trim(),
});

export const DialogNewCategory = () => {
  const [open, setOpen] = useState(false);
  const createCategory = useCreateCategory();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    createCategory.mutate(
      { description: data.name },
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
        <Button>Nova Categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar uma nova categoria</DialogTitle>
          <DialogDescription>
            Preencha o campo abaixo para cadastrar uma nova categoria
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alimentação, Transporte, Moradia, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={createCategory.isPending}
              className="w-fit place-self-end"
              type="submit"
            >
              {createCategory.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

