import { QueryClientProvider } from "@tanstack/react-query";
import { AntDesignProvider } from "./AntDesignProvider";
import { queryClient } from "@/data/query-client";

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    return (
        <AntDesignProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AntDesignProvider>
    )
}