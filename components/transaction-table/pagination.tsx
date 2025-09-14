import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TransactionTablePaginationProps {
    page: number;
    totalPages: number;
    onChange?: (page: number) => void;
    onChangeLimit?: (limit: number) => void;
    limit?: number;
    filteredDataLength?: number;
    totalItems?: number;
    showAlways?: boolean;
}

function TransactionTablePagination({ page, limit, totalPages, onChange, onChangeLimit, filteredDataLength, totalItems, showAlways = false }: TransactionTablePaginationProps) {
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const showItems = [5, 10, 20, 50];
    
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
            range.push(i);
        }

        if (page - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (page + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (!showAlways && totalPages <= 1) return null;
    if (filteredDataLength !== undefined && filteredDataLength < (limit || 10) && totalPages <= 1) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>
                        Mostrando {filteredDataLength} de {totalItems || filteredDataLength} transações
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Itens por página:</span>
                    <Select
                        onValueChange={(value) => onChangeLimit?.(Number(value))}
                        value={limit?.toString()}
                    >
                        <SelectTrigger className="w-[80px] h-8">
                            <SelectValue />
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
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {filteredDataLength !== undefined && totalItems !== undefined ? (
                    <span>
                        Mostrando {Math.min((page - 1) * (limit || 10) + 1, filteredDataLength)} a {Math.min(page * (limit || 10), filteredDataLength)} de {totalItems} transações
                    </span>
                ) : (
                    <span>
                        Página {page} de {totalPages}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Itens por página:</span>
                <Select
                    onValueChange={(value) => onChangeLimit?.(Number(value))}
                    value={limit?.toString()}
                >
                    <SelectTrigger className="w-[80px] h-8">
                        <SelectValue />
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

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange?.(1)}
                    disabled={!hasPreviousPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange?.(page - 1)}
                    disabled={!hasPreviousPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getVisiblePages().map((pageNum, index) => (
                    pageNum === '...' ? (
                        <span key={index} className="px-2 text-gray-500">...</span>
                    ) : (
                        <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => onChange?.(pageNum as number)}
                            className="h-8 w-8 p-0"
                        >
                            {pageNum}
                        </Button>
                    )
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange?.(page + 1)}
                    disabled={!hasNextPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onChange?.(totalPages)}
                    disabled={!hasNextPage}
                    className="h-8 w-8 p-0"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default TransactionTablePagination;
