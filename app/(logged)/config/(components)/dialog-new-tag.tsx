import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagService } from "@/services/tag.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
    name: z.string()
        .min(1, "Tag é obrigatória")
        .min(2, "Tag deve ter pelo menos 2 caracteres")
        .max(50, "Tag deve ter no máximo 50 caracteres")
        .trim(),
});

type DialogNewTagProps = {
    refreshData: () => void;
}

export const DialogNewTag = ({ refreshData }: DialogNewTagProps) => {
    const [open, setOpen] = useState(false);
    
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await TagService.createTag(data.name);
            refreshData();
            form.reset();
            setOpen(false);
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Adicionar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar uma nova tag</DialogTitle>
                    <DialogDescription>
                        Preencha o campo abaixo para cadastrar uma nova tag
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tag</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tag" {...field} />
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
