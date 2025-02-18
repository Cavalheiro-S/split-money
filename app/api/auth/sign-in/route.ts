import { STORAGE_KEYS } from "@/consts/storage";
import { decodeJwtPayload } from "@/utils/auth";
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

        const payload = await decodeJwtPayload(accessToken);
        response.cookies.set(STORAGE_KEYS.JWT_TOKEN, accessToken, {
            expires: payload?.exp,
            path: "/",

        });
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Login failed"
        }, { status: 500 });
    }
}