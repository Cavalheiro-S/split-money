import { ResetPasswordForm } from "@/components/reset-password-form"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
} 