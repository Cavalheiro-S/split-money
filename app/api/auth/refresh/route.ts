import { STORAGE_KEYS } from "@/consts/storage";
import { validateToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookiesData = await cookies();
    const token = cookiesData.get(STORAGE_KEYS.JWT_TOKEN)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 401 }
      );
    }

    const decoded = await validateToken(token);

    if (!decoded) {
      const response = NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );

      response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
      return response;
    }

    const userResponse = await fetch(`${process.env.API_URL}/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();

    return NextResponse.json({
      accessToken: token,
      user: userData.data,
      expiresIn: 24 * 60 * 60,
    });
  } catch (error) {
    console.error("Erro ao renovar token:", error);

    const response = NextResponse.json(
      { error: "Erro ao renovar sessão" },
      { status: 401 }
    );

    response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);

    return response;
  }
}
