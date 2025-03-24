"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthExceptions } from "@/enums/exceptions/auth"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { GalleryVerticalEnd, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

const formSchema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
})

type ForgotPasswordFormProps = React.ComponentPropsWithoutRef<"div">

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        body: JSON.stringify(values),
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Código de recuperação enviado com sucesso!")
        router.push(`/reset-password?email=${values.email}`)
        return
      }

      switch (data.error?.code) {
        case AuthExceptions.InvalidInput:
          toast.error("Dados inválidos. Verifique as informações e tente novamente.")
          break;
        case AuthExceptions.UserNotFound:
          toast.error("Usuário não encontrado.")
          break;
        case AuthExceptions.Default:
          toast.error("Erro ao enviar código de recuperação. Tente novamente mais tarde.")
          break;
        default:
          toast.error(data.message || "Falha ao enviar código de recuperação")
      }
    }
    catch (error) {
      toast.error("Falha ao enviar código de recuperação")
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
              <h1 className="text-xl font-bold">Recuperar Senha</h1>
              <div className="text-center text-sm">
                Digite seu email para receber um código de recuperação
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isLoading || form.formState.isSubmitting}>
                {(form.formState.isLoading || form.formState.isSubmitting) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Código
              </Button>
              <div className="text-center text-sm">
                Lembrou sua senha?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Fazer login
                </a>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
} 