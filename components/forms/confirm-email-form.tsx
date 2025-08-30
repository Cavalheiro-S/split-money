"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthExceptions } from "@/enums/exceptions/auth"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, DollarSign, Mail, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { LoadingLink } from "@/components/loading-link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
  code: z
    .string({ required_error: "Código é obrigatório" })
    .min(6, { message: "Código deve ter 6 dígitos" })
    .max(6, { message: "Código deve ter 6 dígitos" })
})

type ConfirmEmailFormProps = React.ComponentPropsWithoutRef<"div">

export function ConfirmEmailForm({
  className,
  ...props
}: ConfirmEmailFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/confirm-email", {
        body: JSON.stringify({
          email: email,
          code: values.code,
        }),
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("E-mail confirmado com sucesso!")
        router.push("/sign-in")
        return
      }

      switch (data.error?.code) {
        case AuthExceptions.InvalidInput:
          toast.error("Dados inválidos. Verifique as informações e tente novamente.")
          break;
        case AuthExceptions.InvalidConfirmationCode:
          toast.error("Código de confirmação inválido. Verifique e tente novamente.")
          break;
        case AuthExceptions.ExpiredConfirmationCode:
          toast.error("Código de confirmação expirado. Solicite um novo código.")
          break;
        case AuthExceptions.UserNotFound:
          toast.error("Usuário não encontrado.")
          break;
        case AuthExceptions.Default:
          toast.error("Erro ao confirmar e-mail. Tente novamente mais tarde.")
          break;
        default:
          toast.error(data.message || "Falha ao confirmar e-mail")
      }
    }
    catch (error) {
      toast.error("Falha ao confirmar e-mail")
      console.log(error)
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      {/* Header com logo e branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 shadow-sm">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Split Money
        </h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Confirme seu email para ativar sua conta
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
            Verifique seu email
          </h2>
          <p className="text-muted-foreground text-sm text-center">
            Enviamos um código de 6 dígitos para
          </p>
          <p className="text-foreground text-sm font-medium text-center mt-1">
            {email || "seu email"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Código de confirmação
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="000000" 
                      className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20 text-center text-lg font-mono tracking-widest"
                      maxLength={6}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors mt-6"
              disabled={form.formState.isLoading || form.formState.isSubmitting}
            >
              {(form.formState.isLoading || form.formState.isSubmitting) ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar email
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Não recebeu o código?
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="text-primary border-primary/20 hover:bg-primary/5"
            onClick={() => {
              // Aqui você pode implementar a lógica para reenviar o código
              toast.success("Código reenviado!");
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reenviar código
          </Button>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              Quase lá!
            </h3>
            <p className="text-xs text-muted-foreground">
              Após confirmar seu email, você poderá fazer login e começar a usar o Split Money.
            </p>
          </div>
        </div>
      </div>

      {/* Botão voltar */}
      <div className="mt-6 text-center">
        <LoadingLink 
          href="/sign-up"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para cadastro
        </LoadingLink>
      </div>
    </div>
  )
} 