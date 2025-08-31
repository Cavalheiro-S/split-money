import { cn } from "@/lib/utils";

interface TransactionTableContainerProps {
    children: React.ReactNode;
    className?: string;
}

function TransactionTableContainer({ children, className }: Readonly<TransactionTableContainerProps>) {
    return (
        <div className={cn("w-full bg-white rounded-lg shadow-md p-4 h-fit", className)}>
            {children}
        </div>
    )
}

export default TransactionTableContainer;