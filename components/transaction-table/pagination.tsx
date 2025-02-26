import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionTablePaginationProps {
    page: number;
    totalPages: number;
    onChange?: (page: number) => void;
    limit?: number;
}

function TransactionTablePagination({ page, totalPages, onChange }: TransactionTablePaginationProps) {

    return (
        <div className="flex gap-2 items-center justify-center">
            <ChevronLeft className="w-6 h-6" onClick={() => onChange?.(page - 1)} />
            {Array.from({ length: totalPages }, (_, i) => (
                <button onClick={() => onChange?.(i + 1)} key={i} className={`w-6 h-6 rounded ${page === i + 1 ? "bg-primary text-white" : "bg-white"}`}>{i + 1}</button>
            ))}
            <ChevronRight className="w-6 h-6" />
        </div>
    )
}

export default TransactionTablePagination;
