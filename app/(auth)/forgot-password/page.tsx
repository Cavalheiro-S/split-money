import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  )
} 