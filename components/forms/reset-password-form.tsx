"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthExceptions } from "@/enums/exceptions/auth"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed, Loader, DollarSign, Key, Shield, CheckCircle, ArrowLeft } from "lucide-react"
import { LoadingLink } from "@/components/loading-link"
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
          Defina uma nova senha para sua conta
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto">
            <Key className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
            Redefinir senha
          </h2>
          <p className="text-muted-foreground text-sm text-center">
            Digite o código enviado para
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
                    Código de recuperação
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Nova senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Mínimo 8 caracteres" 
                        type={showPassword ? "text" : "password"} 
                        className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20 pr-10"
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeClosed className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
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
                  <FormLabel className="text-sm font-medium text-foreground">
                    Confirmar nova senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Digite a senha novamente" 
                        type={showConfirmPassword ? "text" : "password"} 
                        className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20 pr-10"
                        {...field} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeClosed className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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
                  Redefinindo...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Redefinir senha
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Não recebeu o código?{" "}
            <LoadingLink 
              href="/forgot-password" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Solicitar novamente
            </LoadingLink>
          </p>
        </div>
      </div>

      {/* Informações de segurança */}
      <div className="mt-8 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              Dicas para uma senha segura
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use pelo menos 8 caracteres</li>
              <li>• Combine letras, números e símbolos</li>
              <li>• Evite informações pessoais óbvias</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botão voltar */}
      <div className="mt-6 text-center">
        <LoadingLink 
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </LoadingLink>
      </div>
    </div>
  )
} 