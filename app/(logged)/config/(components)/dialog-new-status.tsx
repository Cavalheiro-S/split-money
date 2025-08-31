import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PaymentStatusService } from "@/services/payment-status.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

const schema = z.object({
    status: z.string()
        .min(1, "Status é obrigatório")
        .min(2, "Status deve ter pelo menos 2 caracteres")
        .max(50, "Status deve ter no máximo 50 caracteres")
        .trim(),
});

type DialogNewStatusProps = {
    refreshData: () => void;
}

export const DialogNewStatus = ({ refreshData }: DialogNewStatusProps) => {
    const [open, setOpen] = useState(false);
    
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            status: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await PaymentStatusService.createPaymentStatus(data.status);
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
                <Button> Adicionar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cadastrar um novo status</DialogTitle>
                    <DialogDescription>
                        Preencha o campo abaixo para cadastrar um novo status
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

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
                        <Button disabled={form.formState.isSubmitting} className="w-fit place-self-end" type="submit">
                            {form.formState.isSubmitting ? "Enviando..." : "Enviar"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}