"use client"

import { Button } from "@/components/ui/button";
import { User, Pencil, Check, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";
import { UserService } from "@/services/user.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
    email: z.string().email("Email inválido"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const { user, setUser } = useUser();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user?.email || "",
        },
    });

    const handleSaveEmail = async (data: FormValues) => {
        setIsLoading(true);
        try {
            const response = await UserService.updateEmail(data.email);
            if (response.data && user?.id) {
                setUser({ ...user, email: response.data });
            }
            setIsEditingEmail(false);
        } catch (error) {
            console.error("Erro ao atualizar email:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await UserService.getMe();
                setUser(response.data);
                form.reset({ email: response.data.email });
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isPageLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
                <div className="flex flex-col gap-10 w-full bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen items-center w-full gap-10 px-10 bg-gray-100 py-10">
            <div className="flex flex-col gap-10 w-full bg-white p-5 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <User className="w-10 h-10" />
                    <div className="flex flex-col">
                        <h3 className="font-semibold">Perfil</h3>
                        <span className="text-sm text-muted-foreground">Gerencie as informações do seu perfil</span>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold">Nome</h4>
                        <p className="text-sm text-muted-foreground">{user?.name}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold">Email</h4>
                        <div className="flex items-center gap-2">
                            {isEditingEmail ? (
                                <form onSubmit={form.handleSubmit(handleSaveEmail)} className="flex items-center gap-2">
                                    <Input
                                        type="email"
                                        {...form.register("email")}
                                        className="max-w-sm"
                                    />
                                    <Button
                                        type="submit"
                                        variant="ghost"
                                        size="icon"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsEditingEmail(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </form>
                            ) : (
                                <>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsEditingEmail(true)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Alterar senha</Button>
                        <Button variant="destructive">Excluir conta</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}