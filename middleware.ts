import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { STORAGE_KEYS } from "./consts/storage";
import { validateToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(STORAGE_KEYS.JWT_TOKEN)?.value;
  
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/confirm-email",
  ];
  
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    if (token) {
      try {
        const decoded = await validateToken(token);
        if (decoded) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.error("Erro ao validar token:", error);
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const decoded = await validateToken(token);
    
    if (!decoded) {
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
      return response;
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Erro ao validar token no middleware:", error);
    
    const response = NextResponse.redirect(new URL("/sign-in", request.url));
    response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
