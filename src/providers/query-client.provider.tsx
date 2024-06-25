import { QueryClient, QueryClientProvider as QueryClientProviderBase } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface Props {
    children: React.ReactNode
}

export const QueryClientProvider = ({ children }: Props) => {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProviderBase client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
        </QueryClientProviderBase>
    )
}