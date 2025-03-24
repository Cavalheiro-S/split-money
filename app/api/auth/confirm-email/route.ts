import { NextResponse } from "next/server";
import { z } from "zod";
import { AuthExceptions } from "@/enums/exceptions/auth";

const schema = z.object({
  email: z.string().email("Email inválido"),
  code: z.string().min(6, "O código deve ter 6 dígitos").max(6, "O código deve ter 6 dígitos"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { success, data, error } = schema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        {
          error: {
            code: AuthExceptions.InvalidInput,
            message: "Dados inválidos",
            details: error
          }
        },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.API_URL + "/confirm-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            code: result.error?.code || AuthExceptions.Default,
            message: result.error?.message || "Erro ao confirmar e-mail",
            details: result.error?.details
          }
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Erro ao confirmar e-mail:", error);
    return NextResponse.json(
      {
        error: {
          code: AuthExceptions.Default,
          message: "Erro interno do servidor",
          details: error instanceof Error ? error.message : "Erro desconhecido"
        }
      },
      { status: 500 }
    );
  }
} 