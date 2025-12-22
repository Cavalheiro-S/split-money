"use client";

import { LoadingLink } from "@/components/loading-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, DollarSign, Loader, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { handleCognitoError } from "@/lib/errors";

const formSchema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
});

type ForgotPasswordFormProps = React.ComponentPropsWithoutRef<"div">;

export function ForgotPasswordForm({
  className,
  ...props
}: ForgotPasswordFormProps) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await AuthService.resetPassword(values.email);

      if (response.isPasswordReset) {
        toast.success("Código de recuperação enviado com sucesso!");
        router.push(`/reset-password?email=${values.email}`);
      }
      throw new Error("Falha ao enviar código de recuperação");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(handleCognitoError(error));
      }
      console.error("Error sending recovery code:", error);
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
          Recupere o acesso à sua conta
        </p>
      </div>

      {/* Card do formulário */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Esqueceu sua senha?
          </h2>
          <p className="text-muted-foreground text-sm">
            Digite seu email e enviaremos um código de recuperação
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
                    <div className="relative">
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        className="h-11 bg-background border-border focus:border-primary focus:ring-primary/20 pl-10"
                        {...field}
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              {form.formState.isLoading || form.formState.isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Enviando código...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar código
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <LoadingLink
              href="/sign-in"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Fazer login
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
              Segurança em primeiro lugar
            </h3>
            <p className="text-xs text-muted-foreground">
              O código de recuperação será enviado para seu email e expira em 15
              minutos. Nunca compartilhe este código com ninguém.
            </p>
          </div>
        </div>
      </div>

      {/* Botão voltar */}
      <div className="mt-6 text-center">
        <LoadingLink
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para login
        </LoadingLink>
      </div>
    </div>
  );
}
