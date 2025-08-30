"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthExceptions } from "@/enums/exceptions/auth"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed, Loader, DollarSign, UserPlus, Shield, CheckCircle } from "lucide-react"
import { LoadingLink } from "@/components/loading-link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z
    .string({ required_error: "Email inválido" })
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha obrigatória" })
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
  confirmPassword: z
    .string({ required_error: "Confirmação de senha obrigatória" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterFormProps = React.ComponentPropsWithoutRef<"div">

export function RegisterForm({
  className,
  ...props
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/sign-up", {
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
        method: "POST",
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast.success("Conta criada com sucesso! Verifique seu e-mail.")
        router.push(`/confirm-email?email=${encodeURIComponent(values.email)}`)
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
          toast.error("Erro ao criar conta. Tente novamente mais tarde.")
          break;
        default:
          toast.error(data.message || "Falha ao criar conta")
      }
    }
    catch (error) {
      toast.error("Falha ao criar conta")
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
          Comece a gerenciar suas despesas compartilhadas hoje
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Criar sua conta
          </h2>
          <p className="text-muted-foreground text-sm">
            Preencha os dados abaixo para começar
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Nome completo
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu nome completo" 
                      className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      type="email"
                      className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
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
                    Senha
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
                    Confirmar senha
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
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar conta
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <LoadingLink 
              href="/sign-in" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Fazer login
            </LoadingLink>
          </p>
        </div>
      </div>

      {/* Benefícios do cadastro */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-primary" />
          </div>
          <span className="text-muted-foreground">Controle total das suas despesas</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <span className="text-muted-foreground">Dados seguros e criptografados</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-primary" />
          </div>
          <span className="text-muted-foreground">Compartilhe com amigos e família</span>
        </div>
      </div>
    </div>
  )
} 