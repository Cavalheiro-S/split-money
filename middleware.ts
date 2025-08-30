import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STORAGE_KEYS } from "./consts/storage";
import { validateToken } from "./utils/auth";

const publicRoutes = [
  "/sign-in",
  "/sign-up", 
  "/forgot-password",
  "/confirm-email",
  "/reset-password",
];

const authApiRoutes = [
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/forgot-password",
  "/api/auth/confirm-email",
  "/api/auth/reset-password",
  "/api/auth/sign-out",
  "/api/auth/get-token",
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const isPublicRoute = publicRoutes.includes(pathname);
    const isAuthApiRoute = authApiRoutes.includes(pathname);
    
    if (isPublicRoute || isAuthApiRoute) {
        return NextResponse.next();
    }

    const cookiesData = await cookies();
    const token = cookiesData.get(STORAGE_KEYS.JWT_TOKEN)?.value;
    
    if (!token) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
        await validateToken(token);
        return NextResponse.next();
    } catch (error) {
        console.error("Token inválido ou expirado:", error);
        const response = NextResponse.redirect(new URL("/sign-in", request.url));
        response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
        return response;
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
        "/api/((?!auth/).+)"
    ],
};
