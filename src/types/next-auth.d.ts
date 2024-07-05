import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
     */
    interface Session {
        user: {
            id: string;
            name?: string;
            email: string;
            loginMethod: string;
            balance: number;
        } & DefaultSession["user"];
        jwt: string;
    }

    interface User extends DefaultUser {
        id: string;
        name?: string;
        email: string;
        loginMethod: string;
        balance: number;
        jwt: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: User;
        jwt: string
        exp: number
    }
}