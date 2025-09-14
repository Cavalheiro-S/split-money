import { ChartCandlestick, Filter } from "lucide-react";
import { MonthPicker } from "../month-picker";
import { Badge } from "../ui/badge";

interface TransactionTableHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
    type?: 'income' | 'outcome';
    onChangeDate?: (date: Date) => void;
    totalTransactions?: number;
    totalAmount?: number;
}

function TransactionTableHeader({ 
    type = "income", 
    title, 
    subtitle, 
    children, 
    onChangeDate, 
    totalTransactions,
    totalAmount
}: TransactionTableHeaderProps) {

    return (
        <>
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-white border shadow-sm">
                        {type === 'income'
                            ? <ChartCandlestick className="w-6 h-6 text-green-600" />
                            : <ChartCandlestick className="w-6 h-6 text-red-600" />}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <span className="text-sm text-gray-600">{subtitle}</span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-auto">
                    {totalTransactions !== undefined && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {totalTransactions} transações
                            </Badge>
                        </div>
                    )}
                    
                    
                    {children}
                </div>
            </div>
            
            <div className="flex flex-col w-full py-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-gray-900">Filtros</h3>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Período</label>
                        <MonthPicker onChange={onChangeDate} />
                    </div>
                    
                    {totalAmount !== undefined && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Total do período</label>
                            <div className="text-lg font-semibold text-gray-900">
                                {totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default TransactionTableHeader;
