import { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export const Layout = ({ children }: Props) => {
    return (
        <>
            {children}
        </>
    )
}