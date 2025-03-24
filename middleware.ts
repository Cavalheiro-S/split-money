import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STORAGE_KEYS } from "./consts/storage";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/confirm-email",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
    const cookiesData = await cookies();
    const token = cookiesData.get(STORAGE_KEYS.JWT_TOKEN)?.value;
    
    const isPublicRoute = publicRoutes.some(route => 
      request.nextUrl.pathname === route
    );
    
    if (token) {
        try {
            return NextResponse.next();
        } catch (error) {
            console.error("Token inválido ou expirado:", error);
        }
    }
    else if (!isPublicRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
