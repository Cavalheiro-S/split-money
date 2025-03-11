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
            <div className="flex  w-full justify-between">
                <div className="flex flex-col ">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <span className="text-sm text-muted-foreground">{subtitle}</span>
                </div>
                {/* Modal open Trigger */}
                {children}
            </div>
            <div className="flex flex-col w-full py-4 border-b  border-gray-200">
                <h3 className="text-lg font-semibold">Filtros</h3>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-sm font-semibold">Por mês</label>
                        <MonthPicker onChange={onChange} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransactionTableHeader;
