import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { JWT_TOKEN_COOKIE } from './global.config'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(JWT_TOKEN_COOKIE)?.value   
    const unprotectedRoutes = ["/session/login", "/session/signup"]
    if(!token && !unprotectedRoutes.includes(request.nextUrl.pathname)){
        return NextResponse.redirect(new URL('session/login', request.url))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}