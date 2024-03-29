import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

interface ExecuteResponse<T> {
    data: T | null,
    success: boolean
}

export const authOptions: AuthOptions = {

    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_SECRET || "",
        })
    ],
}

export default NextAuth(authOptions)