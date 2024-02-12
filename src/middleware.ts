import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("split.money.token")?.value
    const unprotectedRoutes = ["/session/login", "/session/signup"]
    
    if (!token && !unprotectedRoutes.includes(request.nextUrl.pathname) ) {
        return NextResponse.redirect(new URL('session/login', request.url))
    }
    if(token && unprotectedRoutes.includes(request.nextUrl.pathname)){
        return NextResponse.redirect(new URL('/dashboard', request.url))  
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}