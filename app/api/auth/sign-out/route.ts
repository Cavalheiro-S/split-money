import { STORAGE_KEYS } from "@/consts/storage";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("sign-out");
    
    const cookiesHandler = await cookies()
    cookiesHandler.delete(STORAGE_KEYS.JWT_TOKEN)
    return NextResponse.redirect(new URL("/sign-in", req.url))
}