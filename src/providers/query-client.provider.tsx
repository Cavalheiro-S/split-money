import { QueryClientProvider as QueryClientProviderBase } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "data/query-client";

interface Props {
    children: React.ReactNode
}

export const QueryClientProvider = ({ children }: Props) => {
    return (
        <QueryClientProviderBase client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            {children}
        </QueryClientProviderBase>
    )
}