import { AuthContextProvider } from "@/context/auth-context";
import { AntDesignProvider } from "./AntDesignProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { ToastContainer } from "react-toastify";

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    return (
        <AntDesignProvider>
            <QueryClientProvider >
                <AuthContextProvider>
                    <ToastContainer />
                    {children}
                </AuthContextProvider>
            </QueryClientProvider>
        </AntDesignProvider>
    )
}