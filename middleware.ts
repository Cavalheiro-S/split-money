import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_KEYS } from './consts/storage';

export function middleware(request: NextRequest) {
    const token = request.cookies.get(STORAGE_KEYS.JWT_TOKEN);
    
    // Se o usuário tentar acessar /sign-in e já estiver autenticado, redireciona para /dashboard
    if (token && request.nextUrl.pathname.startsWith('/sign-in')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Aplicar o middleware a todas as rotas
export const config = {
    matcher: ['/:path*'],
};
