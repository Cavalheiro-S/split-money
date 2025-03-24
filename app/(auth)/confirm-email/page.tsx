import { ConfirmEmailForm } from "@/components/confirm-email-form";
import { Suspense } from "react";

export default function ConfirmEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Carregando...</div>}>
        <ConfirmEmailForm />
      </Suspense>
    </div>
  )
} 