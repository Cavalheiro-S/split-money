import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

interface Props {
    children: React.ReactNode;
    session: Session;
}

export const NextAuthProvider = ({ children, session }: Props) => {

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}