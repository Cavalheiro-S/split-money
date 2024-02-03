import { AntDesignProvider } from "./AntDesignProvider";
import { QueryClientProvider } from "./QueryClientProvider";

interface Props {
    children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
    return (
        <AntDesignProvider>
            <QueryClientProvider>
                {children}
            </QueryClientProvider>
        </AntDesignProvider>
    )
}