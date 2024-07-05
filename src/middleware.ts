import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const unprotectedRoutes = ["/session/login", "/session/signup"]
    if (!token && !unprotectedRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('session/login', req.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}