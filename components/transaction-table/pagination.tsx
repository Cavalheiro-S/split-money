import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionTablePaginationProps {
    page: number;
    totalPages: number;
    limit?: number;
}

function TransactionTablePagination({ page, totalPages }: TransactionTablePaginationProps) {

    return (
        <div>
            <ChevronLeft className="w-6 h-6" />
            {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} className={`w-6 h-6 ${page === i ? "bg-primary" : "bg-white"}`}>{i + 1}</button>
            ))}
            <ChevronRight className="w-6 h-6" />
        </div>
    )
}

export default TransactionTablePagination;