'use client';

import { InvestmentForm } from '@/components/forms/investment-form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { InvestmentService } from '@/services/investment.service';
import { Investment } from '@/types/investment';
import { Loader2, Plus, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CardInvestiment } from './(components)/card-investiment';

export default function InvestmentsPage() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchInvestments = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await InvestmentService.getAll();
            setInvestments(data);
        } catch {
            toast({
                title: 'Erro',
                description: 'Não foi possível carregar os investimentos',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const handleDeleteInvestiment = async (id: string) => {
        setIsDeleting(true);
        try {
            await InvestmentService.delete(id);
            toast({
                title: 'Sucesso',
                description: 'Investimento excluído com sucesso',
            });
            fetchInvestments();
        } catch {
            toast({
                title: 'Erro',
                description: 'Não foi possível excluir o investimento',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
            setInvestmentToDelete(null);
        }
    };
    useEffect(() => {
        fetchInvestments();
    }, []);

    const handleInvestmentCreated = () => {
        setIsDialogOpen(false);
        fetchInvestments();
    };

    const totalInvestments = investments.reduce((acc, investment) => {
        return acc + (investment.quantity * investment.purchasePrice);
    }, 0);

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
            <div className='bg-white w-full p-4 rounded-md mb-6'>
                <div className="flex justify-between items-center mb-6 w-full">
                    <div className="flex w-full items-center gap-2">
                        <div className="p-3 rounded-full bg-white border">
                            <Wallet className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="flex flex-col mr-auto">
                            <h3 className="text-lg font-semibold">Investimentos</h3>
                            <span className="text-sm text-muted-foreground">Cadastre seus investimentos e observe seus rendimentos</span>
                            {investments.length > 0 && (
                                <span className="text-sm font-semibold text-green-600 mt-1">
                                    Total investido: R$ {totalInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            )}
                        </div>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Investimento
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : investments.length === 0 ? (
                    <Card className="p-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-600 mb-2">Nenhum investimento encontrado</h2>
                            <p className="text-gray-500 mb-4">Comece adicionando seu primeiro investimento!</p>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Investimento
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {investments.map(investiment =>
                            <CardInvestiment
                                key={investiment.id}
                                investment={investiment}
                                setInvestmentToDelete={setInvestmentToDelete}
                                isDeleting={isDeleting} />)}
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <InvestmentForm open={isDialogOpen} onSuccess={handleInvestmentCreated} />
                </Dialog>

                <AlertDialog open={!!investmentToDelete} onOpenChange={() => setInvestmentToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tem certeza que deseja excluir este investimento? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => investmentToDelete && handleDeleteInvestiment(investmentToDelete)}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Excluir'
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
