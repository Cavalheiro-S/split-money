import { ConfirmEmailForm } from "@/components/forms/confirm-email-form";
import { Suspense } from "react";

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ConfirmEmailForm />
    </Suspense>
  )
} 