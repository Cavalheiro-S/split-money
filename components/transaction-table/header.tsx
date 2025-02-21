import { MonthPicker } from "../month-picker";



interface TransactionTableHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    onChange?: (date: Date) => void;
}

function TransactionTableHeader({ title, subtitle, children, onChange }: TransactionTableHeaderProps) {


    return (
        <>
            <div className="flex w-full justify-between">
                <div className="flex flex-col ">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <span className="text-sm text-muted-foreground">{subtitle}</span>
                </div>
                {/* Modal open Trigger */}
                {children}
            </div>
            <div className="flex gap-4 items-center justify-center">
                <label className="text-sm ">Filtrar por mês</label>
                <MonthPicker onChange={onChange} />
            </div>
        </>
    )
}

export default TransactionTableHeader;
