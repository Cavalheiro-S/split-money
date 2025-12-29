"use client";

import {
  AlertDialog,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories, useDeleteCategory } from "@/hooks/queries";
import { format } from "date-fns";
import { FolderOpen, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { DialogNewCategory } from "./(components)/dialog-new-category";

export default function Page() {
  const [openCategoryDialogId, setOpenCategoryDialogId] = useState<
    string | null
  >(null);

  const { data: categoriesData, isLoading: loadingCategories } =
    useCategories();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.data || [];

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => {
        setOpenCategoryDialogId(null);
      },
    });
  };

  const LoadingComponent = () => (
    <div className="flex justify-center items-center w-full h-full min-h-[400px]">
      <LoaderCircle className="animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
      <div className="flex flex-col gap-10 w-full bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-10 h-10" />
          <div className="flex flex-col">
            <h3 className="font-semibold">Categorias</h3>
            <span className="text-sm text-muted-foreground">
              Gerencie as categorias disponíveis para suas transações
            </span>
          </div>
        </div>
        {loadingCategories ? (
          <LoadingComponent />
        ) : (
          <div>
            <div className="flex w-full justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-semibold">Lista de Categorias</h3>
                <span className="text-sm text-muted-foreground">
                  {categories.length}{" "}
                  {categories.length === 1
                    ? "categoria cadastrada"
                    : "categorias cadastradas"}
                </span>
              </div>
              <DialogNewCategory />
            </div>
            <div className="mt-6 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-10"
                      >
                        Nenhuma categoria cadastrada. Clique em &quot;Nova Categoria&quot;
                        para adicionar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="secondary">{item.description}</Badge>
                        </TableCell>
                        <TableCell>
                          {format(item.created_at, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog
                            open={openCategoryDialogId === item.id}
                            onOpenChange={(open) =>
                              setOpenCategoryDialogId(open ? item.id : null)
                            }
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar exclusão
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover a categoria
                                  &quot;{item.description}&quot;? Esta ação não
                                  pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  disabled={deleteCategory.isPending}
                                >
                                  Cancelar
                                </AlertDialogCancel>
                                <Button
                                  onClick={() => handleDeleteCategory(item.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                  disabled={deleteCategory.isPending}
                                >
                                  {deleteCategory.isPending ? (
                                    <div className="flex items-center gap-2">
                                      <LoaderCircle className="h-4 w-4 animate-spin" />
                                      Removendo...
                                    </div>
                                  ) : (
                                    "Remover"
                                  )}
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
