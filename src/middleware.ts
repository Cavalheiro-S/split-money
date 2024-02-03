import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("split.money.token")?.value
    if (!token) {
        return NextResponse.redirect(new URL('session/login', request.url))
    }
}

export const config = {
    matcher: ['/transaction', '/dashboard'],
}