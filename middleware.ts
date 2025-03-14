import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STORAGE_KEYS } from "./consts/storage";

export async function middleware(request: NextRequest) {
    const cookiesData = await cookies();
    const token = cookiesData.get(STORAGE_KEYS.JWT_TOKEN)?.value;
    
    const isSignInPage = request.nextUrl.pathname === "/sign-in";
    
    if (token) {
        try {
            return NextResponse.next();
        } catch (error) {
            console.error("Token inválido ou expirado:", error);
        }
    }
    else if (!isSignInPage) {

        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
