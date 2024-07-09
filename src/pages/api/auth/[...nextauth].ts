import axios from "axios";
import { api } from "data/axios";
import jwt from 'jsonwebtoken';
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {

    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await api.post<ApiBase<AccessToken>>("/auth/login", {
                        email: credentials?.email,
                        password: credentials?.password
                    })
                    const { data } = response.data
                    if (data?.access_token) {
                        const { data: dataUser } = await axios.get<ApiBase<User>>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
                            headers: {
                                Authorization: `Bearer ${data.access_token}`
                            }
                        })
                        if (dataUser && dataUser.data) {
                            const user = dataUser.data

                            return { ...user, jwt: data.access_token }
                        }
                    }
                    return null
                }
                catch (error) {
                    console.log('Login error', error)
                    return null
                }
            },
        },
        )
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (token.accessToken) {
                const jwtDecoded = jwt.decode(token.accessToken) as { id: string, email: string, exp: number }
                token.exp = jwtDecoded.exp
                token.accessTokenExpires = jwtDecoded.exp
            }
            if (user) {
                token.user = user
                token.accessToken = user.jwt
            }
            return token
        },
        async session({ session, token }) {
            session.user = token.user;
            session.accessToken = token.accessToken
            session.expires = new Date(token.accessTokenExpires * 1000).toISOString();
            return session;
        },
    },
    pages: {
        signIn: "/session/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 7
    }
}

export default NextAuth(authOptions)