import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { STORAGE_KEYS } from "./consts/storage";
import { validateToken } from "./utils/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignora requisições de recursos estáticos e arquivos
  const isStaticAsset = /\.(.*)$/.test(pathname);
  if (isStaticAsset) {
    return NextResponse.next();
  }
  
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
        } else {
          const response = NextResponse.next();
          response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
          response.cookies.delete("idToken");
          return response;
        }
      } catch (error) {
        console.error("Erro ao validar token em rota pública:", error);
        const response = NextResponse.next();
        response.cookies.delete(STORAGE_KEYS.JWT_TOKEN);
        response.cookies.delete("idToken");
        return response;
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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next/data).*)",
  ],
};
