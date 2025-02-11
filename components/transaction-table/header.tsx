interface TransactionTableHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

function TransactionTableHeader({ title, subtitle, children }: TransactionTableHeaderProps) {
    return (
        <div className="flex w-full justify-between">
            <div className="flex flex-col ">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className="text-sm text-muted-foreground">{subtitle}</span>
            </div>
            {/* Modal open Trigger */}
            {children}
        </div>
    )
}

export default TransactionTableHeader;
