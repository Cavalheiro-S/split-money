"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentStatusService } from "@/services/payment-status.service";
import { CategoryService } from "@/services/category.service";
import { TagService } from "@/services/tag.service";
import { format } from "date-fns";
import { Cog, LoaderCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogNewStatus } from "./(components)/dialog-new-status";
import { DialogNewCategory } from "./(components)/dialog-new-category";
import { DialogNewTag } from "./(components)/dialog-new-tag";

export default function Page() {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
    const [deletingTagId, setDeletingTagId] = useState<string | null>(null);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openCategoryDialogId, setOpenCategoryDialogId] = useState<string | null>(null);
    const [openTagDialogId, setOpenTagDialogId] = useState<string | null>(null);

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

    const getCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoryService.getCategories();
            setCategories(response.data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const getTags = async () => {
        try {
            setLoading(true);
            const response = await TagService.getTags();
            setTags(response.data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleDeleteStatus = async (id: string) => {
        try {
            setDeletingId(id);
            await PaymentStatusService.deletePaymentStatus(id);
            await getPaymentStatus();
            setOpenDialogId(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            setDeletingCategoryId(id);
            await CategoryService.deleteCategory(id);
            await getCategories();
            setOpenCategoryDialogId(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingCategoryId(null);
        }
    };

    const handleDeleteTag = async (id: string) => {
        try {
            setDeletingTagId(id);
            await TagService.deleteTag(id);
            await getTags();
            setOpenTagDialogId(null);
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingTagId(null);
        }
    };

    useEffect(() => {
        getPaymentStatus();
        getCategories();
        getTags();
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
                    <div className="flex w-full justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="font-semibold">Status de pagamento</h3>
                            <span className="text-sm text-muted-foreground">Gerencie os status de pagamento disponíveis</span>
                        </div>
                        <DialogNewStatus refreshData={getPaymentStatus}/>
                    </div>
                    <div className="mt-6 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data Criação</TableHead>
                                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentStatus?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant="secondary">{item.description}</Badge>
                                        </TableCell>
                                        <TableCell>{format(item.created_at, "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog open={openDialogId === item.id} onOpenChange={(open) => setOpenDialogId(open ? item.id : null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja remover o status &quot;{item.description}&quot;? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={deletingId === item.id}>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => handleDeleteStatus(item.id)} 
                                                            className="bg-red-500 hover:bg-red-600"
                                                            disabled={deletingId === item.id}
                                                        >
                                                            {deletingId === item.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                    Removendo...
                                                                </div>
                                                            ) : (
                                                                "Remover"
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Categories */}
                    <div className="flex w-full justify-between items-center mt-10">
                        <div className="flex flex-col">
                            <h3 className="font-semibold">Categorias</h3>
                            <span className="text-sm text-muted-foreground">Gerencie as categorias disponíveis</span>
                        </div>
                        <DialogNewCategory refreshData={getCategories} />
                    </div>
                    <div className="mt-6 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Data Criação</TableHead>
                                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant="secondary">{item.name}</Badge>
                                        </TableCell>
                                        <TableCell>{format(item.createdAt, "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog open={openCategoryDialogId === item.id} onOpenChange={(open) => setOpenCategoryDialogId(open ? item.id : null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja remover a categoria &quot;{item.name}&quot;? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={deletingCategoryId === item.id}>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteCategory(item.id)}
                                                            className="bg-red-500 hover:bg-red-600"
                                                            disabled={deletingCategoryId === item.id}
                                                        >
                                                            {deletingCategoryId === item.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                    Removendo...
                                                                </div>
                                                            ) : (
                                                                "Remover"
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Tags */}
                    <div className="flex w-full justify-between items-center mt-10">
                        <div className="flex flex-col">
                            <h3 className="font-semibold">Tags</h3>
                            <span className="text-sm text-muted-foreground">Gerencie as tags disponíveis</span>
                        </div>
                        <DialogNewTag refreshData={getTags} />
                    </div>
                    <div className="mt-6 rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tag</TableHead>
                                    <TableHead>Data Criação</TableHead>
                                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tags?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Badge variant="secondary">{item.name}</Badge>
                                        </TableCell>
                                        <TableCell>{format(item.createdAt, "dd/MM/yyyy")}</TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog open={openTagDialogId === item.id} onOpenChange={(open) => setOpenTagDialogId(open ? item.id : null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja remover a tag &quot;{item.name}&quot;? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={deletingTagId === item.id}>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteTag(item.id)}
                                                            className="bg-red-500 hover:bg-red-600"
                                                            disabled={deletingTagId === item.id}
                                                        >
                                                            {deletingTagId === item.id ? (
                                                                <div className="flex items-center gap-2">
                                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                    Removendo...
                                                                </div>
                                                            ) : (
                                                                "Remover"
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>}
            </div>
        </div>
    )
}