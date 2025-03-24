import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { success, data, error } = schema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          error: error.issues
        },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.API_URL + "/create-user", {
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
          message: result.message || "Erro ao criar usuário",
          error: result.error
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
        error
      },
      { status: 500 }
    );
  }
} 