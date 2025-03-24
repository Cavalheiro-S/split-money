import { NextResponse } from "next/server"
import { z } from "zod"
import { AuthExceptions } from "@/enums/exceptions/auth"

const schema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().min(6, "Código deve ter 6 dígitos").max(6, "Código deve ter 6 dígitos"),
  newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = schema.parse(body)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            code: data.error?.code || AuthExceptions.Default,
            message: data.error?.message || "Erro ao redefinir senha",
          },
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: AuthExceptions.InvalidInput,
            message: "Dados inválidos",
            details: error.errors,
          },
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: {
          code: AuthExceptions.Default,
          message: error instanceof Error ? error.message : "Erro desconhecido",
        },
      },
      { status: 500 },
    )
  }
} 