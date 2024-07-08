import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {

    interface User extends DefaultUser {
        id: string;
        name?: string;
        email: string;
        loginMethod: string;
        balance: number;
        jwt: string;
    }

    interface Session {
        user: {
            id: string;
            name?: string;
            email: string;
            loginMethod: string;
            balance: number;
        }
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: User;
        accessToken: string
        exp: number
    }
}