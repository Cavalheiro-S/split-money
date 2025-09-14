import { cn } from "@/lib/utils";

interface TransactionTableContainerProps {
    children: React.ReactNode;
    className?: string;
}

function TransactionTableContainer({ children, className }: Readonly<TransactionTableContainerProps>) {
    return (
        <div className={cn("w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", className)}>
            <div className="p-6">
                {children}
            </div>
        </div>
    )
}

export default TransactionTableContainer;