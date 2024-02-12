import { AuthContextProvider } from "@/context/auth-context";
import { AntDesignProvider } from "./AntDesignProvider";
import { QueryClientProvider } from "./QueryClientProvider";

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    return (
        <AntDesignProvider>
            <QueryClientProvider >
                <AuthContextProvider>
                    {children}
                </AuthContextProvider>
            </QueryClientProvider>
        </AntDesignProvider>
    )
}