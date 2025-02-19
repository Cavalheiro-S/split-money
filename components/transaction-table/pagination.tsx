
type PaginationProps = {
    total: number;
    perPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}
function TransactionPagination({ total, perPage, currentPage, onPageChange }: PaginationProps) {

    return (

        <div className="flex gap-2">
            {total > 0 &&
                Array.from({ length: Math.max(1, Math.ceil(total / perPage)) }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-label={`Página ${page}`}
                        className={`w-8 h-8 flex items-center justify-center rounded-md transition 
                    ${currentPage === page ? 'bg-primary text-white' : 'text-primary hover:bg-gray-200'}`}
                    >
                        {page}
                    </button>
                ))
            }
        </div>

    )
}

export default TransactionPagination