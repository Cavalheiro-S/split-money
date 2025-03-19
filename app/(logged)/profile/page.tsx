"use client"


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentStatusService } from "@/services/payment-status.service";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { DialogNewStatus } from "./(components)/dialog-new-status";
import { Cog, LoaderCircle } from "lucide-react";



export default function Page() {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus[]>([]);
    const [loading, setLoading] = useState(true);

    const getPaymentStatus = async () => {
        try {
            setLoading(true);
            const response = await PaymentStatusService.getPaymentStatus();
            setPaymentStatus(response.data);
        }
        catch (error) {
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    };



    useEffect(() => {
        getPaymentStatus();
    }, []);

    const LoadingComponent = () => <div className="flex justify-center items-center w-full h-full"> 
        <LoaderCircle className="animate-spin"/>
    </div>

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
            <div className="flex flex-col gap-10 w-full bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <Cog className="w-10 h-10" />
                    <div className="flex flex-col">
                        <h3 className="font-semibold">Configurações</h3>
                        <span className="text-sm text-muted-foreground">Gerencie as configurações do seu perfil</span>
                    </div>
                </div>
                {loading ? <LoadingComponent/> : <div>
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col mr-auto">
                            <h3 className="font-semibold">Status de pagamento</h3>
                            <span className="text-sm text-muted-foreground">Cadastre novos status de pagamento para aparecerem aqui</span>
                        </div>
                        <DialogNewStatus refreshData={getPaymentStatus}/>
                    </div>
                    <Table className="min-w-[900px] mt-4">

                        <TableHeader>

                            <TableRow>
                                <TableHead className="w-[350px]">id</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data Criação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentStatus?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{format(item.createdAt, "dd/MM/yyyy")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>}


            </div>
        </div>
    )
}