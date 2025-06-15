import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategoryService } from "@/services/category.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    name: z.string(),
});

type DialogNewCategoryProps = {
    refreshData: () => void;
}

export const DialogNewCategory = ({ refreshData }: DialogNewCategoryProps) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await CategoryService.createCategory(data.name);
            refreshData();
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Adicionar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar uma nova categoria</DialogTitle>
                    <DialogDescription>
                        Preencha o campo abaixo para cadastrar uma nova categoria
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Categoria" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={form.formState.isSubmitting} className="w-fit place-self-end" type="submit">
                            {form.formState.isSubmitting ? "Enviando..." : "Enviar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
