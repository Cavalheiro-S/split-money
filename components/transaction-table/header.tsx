import { ChartCandlestick } from "lucide-react";
import { MonthPicker } from "../month-picker";

interface TransactionTableHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    type?: 'income' | 'outcome';
    onChangeDate?: (date: Date) => void;
}

function TransactionTableHeader({ type = "income", title, subtitle, children, onChangeDate }: TransactionTableHeaderProps) {


    return (
        <>
            <div className="flex w-full items-center gap-2">
                <div className="p-3 rounded-full bg-white border">
                    {type === 'income'
                        ? <ChartCandlestick className="w-6 h-6 text-green-500" />
                        : <ChartCandlestick className="w-6 h-6 text-red-500" />}
                </div>
                <div className="flex flex-col mr-auto">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <span className="text-sm text-muted-foreground">{subtitle}</span>
                </div>
                {/* Modal open Trigger */}
                {children}
            </div>
            <div className="flex flex-col w-full py-4 border-b  border-gray-200">
                <h3 className=" font-medium">Filtros</h3>
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-sm">Por mês</label>
                        <MonthPicker onChange={onChangeDate} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransactionTableHeader;
