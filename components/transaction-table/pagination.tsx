import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TransactionTablePaginationProps {
    page: number;
    totalPages: number;
    onChange?: (page: number) => void;
    onChangeLimit?: (limit: number) => void;
    limit?: number;
}

function TransactionTablePagination({ page, limit, totalPages, onChange, onChangeLimit }: TransactionTablePaginationProps) {
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const showItems = Array.from({ length: 5 }).map((_, i) => (i + 1) * 5);
    return (
        <div className="flex gap-2 place-items-center justify-end">
            <ChevronLeft className="w-6 h-6" onClick={() => hasPreviousPage && onChange?.(page - 1)} />
            {Array.from({ length: totalPages }, (_, i) => (
                <button onClick={() => onChange?.(i + 1)} key={i} className={`h-full w-6 rounded ${page === i + 1 ? "bg-primary text-white" : "bg-white"}`}>{i + 1}</button>
            ))}
            <ChevronRight className="w-6 h-6" onClick={() => hasNextPage && onChange?.(page + 1)} />
            <Select
                onValueChange={(value) => onChangeLimit?.(Number(value))}
                value={limit?.toString()}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue>
                        {limit}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {showItems.map(i => (
                        <SelectItem key={i} value={i.toString()}>
                            {i}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default TransactionTablePagination;
