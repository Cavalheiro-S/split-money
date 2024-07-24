
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { AntDesignProvider } from "./ant-design.provider";
import { QueryClientProvider } from "./query-client.provider";

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    return (
        <AntDesignProvider>
            <QueryClientProvider >
                <ToastContainer limit={3} />
                <SessionProvider>
                    {children}
                </SessionProvider>
            </QueryClientProvider>
        </AntDesignProvider>
    )
}