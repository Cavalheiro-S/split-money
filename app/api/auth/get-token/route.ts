import { STORAGE_KEYS } from "@/consts/storage";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesData = await cookies();
  const token = cookiesData.get(STORAGE_KEYS.JWT_TOKEN)?.value || null;
  return NextResponse.json({ accessToken: token });
}