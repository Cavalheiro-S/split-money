import { STORAGE_KEYS } from "@/consts/storage";
import { validateToken } from "@/utils/auth";
import { fromUnixTime } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const responseApi = await fetch(`${process.env.API_URL}/sign-in`, {
            body: JSON.stringify(data),
            method: "POST",
        });
        const { accessToken, error } = await responseApi.json() as ResponseSignIn;

        if (!responseApi.ok) {
            return NextResponse.json({
                message: "Login failed",
                error: error
            }, { status: 400 });
        }
        const response = NextResponse.json({
            message: "Login successful",
            accessToken: accessToken
        }, { status: 200 });

        const payload = await validateToken(accessToken);
        const exp = payload.exp || 0
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const expireDate = fromUnixTime(exp);
        const localDate = toZonedTime(expireDate, timeZone);

        const cookiesData = await cookies();
        cookiesData.set(STORAGE_KEYS.JWT_TOKEN, accessToken, {
            httpOnly: true, // Segurança extra (não acessível pelo JavaScript no cliente)
            secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
            sameSite: "strict", // Proteção contra CSRF
            path: "/", // Disponível em toda a aplicação
            expires: localDate, // Expira em expiresIn segundos
        })
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Login failed"
        }, { status: 500 });
    }
}