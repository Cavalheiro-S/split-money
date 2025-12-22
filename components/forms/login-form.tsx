"use client";

import { LoadingLink } from "@/components/loading-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { errorLogger } from "@/lib/error-logger";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DollarSign,
  Eye,
  EyeClosed,
  Loader,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const formSchema = z.object({
  email: z.string({ required_error: "Email inválido" }).email("Email inválido"),
  password: z
    .string({ required_error: "Senha obrigatória" })
    .min(8, { message: "Senha deve ter no mínimo 8 caracteres" }),
});

type LoginFormProps = React.ComponentPropsWithoutRef<"div">;

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = useMemo(
    () => form.formState.isLoading || form.formState.isSubmitting,
    [form.formState.isLoading, form.formState.isSubmitting]
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await AuthService.signIn({
        email: values.email,
        password: values.password,
      });

      if (response.isSignedIn) {
        const user = await login();
        if (user) {
          toast.success("Login realizado com sucesso");
          router.push("/dashboard");
          return;
        }
        toast.error("Falha ao fazer login");
        errorLogger.logAuthError(new Error("Falha ao fazer login"));
        return;
      }
    } catch (error) {
      toast.error("Falha ao fazer login");
      errorLogger.logAuthError(error as Error);
      errorLogger.logAuthError(new Error("Falha ao fazer login"));
      return;
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} {...props}>
      {/* Header com logo e branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 shadow-sm">
          <DollarSign className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Split Money</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Gerencie suas despesas compartilhadas de forma simples
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Bem-vindo de volta
          </h2>
          <p className="text-muted-foreground text-sm">
            Entre na sua conta para continuar
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        placeholder="Digite sua senha"
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

            <div className="flex justify-end">
              <LoadingLink
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Esqueceu a senha?
              </LoadingLink>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <LoadingLink
              href="/sign-up"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Cadastre-se
            </LoadingLink>
          </p>
        </div>
      </div>

      {/* Features destacadas */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Compartilhe
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Controle
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 group">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Economize
          </span>
        </div>
      </div>
    </div>
  );
}
