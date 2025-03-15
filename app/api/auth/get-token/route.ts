import { STORAGE_KEYS } from "@/consts/storage";
import { validateToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const cookiesData = await cookies();
    const token = cookiesData.get(STORAGE_KEYS.JWT_TOKEN)?.value || null;
    if(!token) {
      throw new Error();
    }
    await validateToken(token);
    return NextResponse.json({ accessToken: token });
  }
  catch {
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}