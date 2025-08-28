"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/contexts/user-context"
import { AuthExceptions } from "@/enums/exceptions/auth"
import { cn } from "@/lib/utils"
import { UserService } from "@/services/user.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed, GalleryVerticalEnd, Loader } from "lucide-react"
import { LoadingLink } from "@/components/loading-link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z
    .string({ required_error: "Email inválido" })
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha obrigatória" })
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
})

type LoginFormProps = React.ComponentPropsWithoutRef<"div">

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { setUser } = useUser()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/sign-in", {
        body: JSON.stringify(values),
        method: "POST",
      })
      
      const data = await response.json() as ResponseSignIn
      
      if (data.accessToken) {
        const user = await UserService.getMe()
        setUser(user.data)
        router.push("/dashboard")
        return;
      }
      if (data.error?.code === AuthExceptions.InvalidInput) {
        toast({title: "Email ou senha inválidos", variant: "destructive"})
      }
      else {
        toast({title: "Falha ao fazer login", variant: "destructive"})
      }

    }
    catch (error) {
      toast({title: "Falha ao fazer login", variant: "destructive"})
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
              <h1 className="text-xl font-bold">Bem vindo(a) ao Split Money</h1>
              <div className="text-center text-sm">
                Não tem um conta?{" "}
                <LoadingLink href="/sign-up" className="underline underline-offset-4">
                  Cadastre-se
                </LoadingLink>
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
                      <Input placeholder="m@example.com" {...field} />
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
                    <FormLabel>Senha</FormLabel>
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
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Esqueci minha senha
                    </Link>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isLoading || form.formState.isSubmitting}>
                {(form.formState.isLoading || form.formState.isSubmitting) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
