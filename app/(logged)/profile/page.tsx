"use client"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaymentStatusService } from "@/services/payment-status.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    paymentStatus: z.string(),
});

export default function Page() {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus[]>([]);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const getPaymentStatus = async () => {
        try {
            const response = await PaymentStatusService.getPaymentStatus();
            setPaymentStatus(response.data);
        }
        catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await PaymentStatusService.createPaymentStatus(data.paymentStatus);
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPaymentStatus();
    }, []);

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
            <div className="flex flex-col gap-10 w-full bg-white p-5 rounded-lg shadow-sm">
                <h3>Configurações</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">

                        <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status de pagamento</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um tipo de transação" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {paymentStatus.map(({ id, status }) => (
                                                <SelectItem key={id} value={id}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    )
}