import { STORAGE_KEYS } from "@/consts/storage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const responseApi = await fetch(`${process.env.API_URL}/sign-in`, {
            body: JSON.stringify(data),
            method: "POST",
        });
        console.log({ responseApi });

        const { accessToken } = await responseApi.json();
        const response = NextResponse.json({
            message: "Login successful",
            accessToken,
        }, { status: 200 });

        response.cookies.set(STORAGE_KEYS.JWT_TOKEN, accessToken);
        return response;
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Login failed"
        }, { status: 500 });
    }
}