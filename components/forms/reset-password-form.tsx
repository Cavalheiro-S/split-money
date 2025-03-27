"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthExceptions } from "@/enums/exceptions/auth"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed, GalleryVerticalEnd, Loader } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
  code: z
    .string({ required_error: "Código é obrigatório" })
    .min(6, { message: "Código deve ter 6 dígitos" })
    .max(6, { message: "Código deve ter 6 dígitos" }),
  password: z
    .string({ required_error: "Senha obrigatória" })
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
  confirmPassword: z
    .string({ required_error: "Confirmação de senha obrigatória" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type ResetPasswordFormProps = React.ComponentPropsWithoutRef<"div">

export function ResetPasswordForm({
  className,
  ...props
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/reset-password", {
        body: JSON.stringify({
          email: email,
          code: values.code,
          newPassword: values.password,
        }),
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Senha alterada com sucesso!")
        router.push("/sign-in")
        return
      }

      switch (data.error?.code) {
        case AuthExceptions.InvalidInput:
          toast.error("Dados inválidos. Verifique as informações e tente novamente.")
          break;
        case AuthExceptions.InvalidConfirmationCode:
          toast.error("Código de recuperação inválido. Verifique e tente novamente.")
          break;
        case AuthExceptions.ExpiredConfirmationCode:
          toast.error("Código de recuperação expirado. Solicite um novo código.")
          break;
        case AuthExceptions.UserNotFound:
          toast.error("Usuário não encontrado.")
          break;
        case AuthExceptions.Default:
          toast.error("Erro ao redefinir senha. Tente novamente mais tarde.")
          break;
        default:
          toast.error(data.message || "Falha ao redefinir senha")
      }
    }
    catch (error) {
      toast.error("Falha ao redefinir senha")
      console.log(error)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 w-[400px]", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a
                href="#"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Split Money</span>
              </a>
              <h1 className="text-xl font-bold">Redefinir Senha</h1>
              <div className="text-center text-sm">
                Digite o código enviado para {email} e sua nova senha
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Recuperação</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="********" type={showPassword ? "text" : "password"} {...field} />
                        {showPassword
                          ? <EyeClosed onClick={() => setShowPassword(false)} className="h-5 w-5 text-muted-foreground right-0 absolute top-0 m-2 cursor-pointer" />
                          : <Eye onClick={() => setShowPassword(true)} className="h-5 w-5 text-muted-foreground right-0 absolute top-0 m-2 cursor-pointer" />
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="********" type={showConfirmPassword ? "text" : "password"} {...field} />
                        {showConfirmPassword
                          ? <EyeClosed onClick={() => setShowConfirmPassword(false)} className="h-5 w-5 text-muted-foreground right-0 absolute top-0 m-2 cursor-pointer" />
                          : <Eye onClick={() => setShowConfirmPassword(true)} className="h-5 w-5 text-muted-foreground right-0 absolute top-0 m-2 cursor-pointer" />
                        }
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isLoading || form.formState.isSubmitting}>
                {(form.formState.isLoading || form.formState.isSubmitting) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Redefinir Senha
              </Button>
              <div className="text-center text-sm">
                Não recebeu o código?{" "}
                <Link href="/forgot-password" className="underline underline-offset-4">
                  Solicitar novamente
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
} 