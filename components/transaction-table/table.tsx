import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TransactionFilters } from "@/services/transaction.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { TransactionAvatar } from "./avatar";
import { DeleteTransactionConfirmationModal } from "./delete-confirmation-modal";
import MobileTransactionCard from "./mobile-transaction-card";

interface TransactionTableProps {
  data: ResponseGetTransactions[];
  loading?: boolean;
  hasActions?: boolean;
  filters?: TransactionFilters;
  onEditClick?: (id: string) => void;
  onChangeFilters?: (filters: TransactionFilters) => void;
  onDeleteSuccess?: () => Promise<void>;
  showSearch?: boolean;
  enableBulkSelection?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}
function TransactionTable({
  data,
  onEditClick,
  hasActions,
  loading,
  onChangeFilters,
  filters,
  onDeleteSuccess,
  showSearch = true,
  enableBulkSelection = false,
  selectedIds = [],
  onSelectionChange,
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredData = useMemo(
    () =>
      data?.filter(
        (item) =>
          !debouncedSearch ||
          item.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      ) || [],
    [data, debouncedSearch]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const selectableIds = filteredData.map((item) => item.id);
        onSelectionChange?.(selectableIds);
      } else {
        onSelectionChange?.([]);
      }
    },
    [filteredData, onSelectionChange]
  );

  const handleSelectItem = useCallback(
    (item: ResponseGetTransactions, checked: boolean) => {
      const itemId = item.id;

      if (checked) {
        onSelectionChange?.([...selectedIds, itemId]);
      } else {
        onSelectionChange?.(
          selectedIds.filter((selectedId) => selectedId !== itemId)
        );
      }
    },
    [selectedIds, onSelectionChange]
  );

  const isAllSelected = useMemo(() => {
    return (
      filteredData.length > 0 &&
      filteredData.every((item) => selectedIds.includes(item.id))
    );
  }, [filteredData, selectedIds]);

  const isIndeterminate = useMemo(() => {
    const selectedCount = filteredData.filter((item) =>
      selectedIds.includes(item.id)
    ).length;
    return selectedCount > 0 && selectedCount < filteredData.length;
  }, [filteredData, selectedIds]);

  const renderSort = (
    sort: NonNullable<TransactionFilters["sort"]>["sortBy"]
  ) => {
    if (filters?.sort?.sortBy !== sort) {
      return null;
    }
    if (filters?.sort?.sortBy === sort && filters.sort.sortOrder === "asc") {
      return <ArrowDown className="w-4 h-4" />;
    }
    if (filters?.sort?.sortBy === sort && filters.sort.sortOrder === "desc") {
      return <ArrowUp className="w-4 h-4" />;
    }
  };

  const renderTableHead = (
    title: string,
    sort: NonNullable<TransactionFilters["sort"]>["sortBy"],
    style?: string
  ) => {
    const isSorted = filters?.sort?.sortBy === sort;
    const sortOrder = isSorted
      ? filters?.sort?.sortOrder === "asc"
        ? "ascending"
        : "descending"
      : "none";

    const isRightAligned = style?.includes("text-right");

    return (
      <TableHead
        aria-sort={sortOrder}
        className={cn(
          isSorted && "bg-gray-100",
          style,
          isRightAligned && "text-right"
        )}
      >
        <button
          type="button"
          onClick={() =>
            onChangeFilters?.({
              ...filters,
              sort: {
                ...filters?.sort,
                sortBy: sort,
                sortOrder: filters?.sort?.sortOrder === "asc" ? "desc" : "asc",
              },
            })
          }
          className={cn(
            "flex items-center gap-2 w-full h-full hover:bg-gray-100/50 p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
            (sort === "amount" || sort === "date") && "justify-end"
          )}
          aria-label={`Ordenar por ${title} ${
            isSorted
              ? filters?.sort?.sortOrder === "asc"
                ? "decrescente"
                : "crescente"
              : ""
          }`}
        >
          {renderSort(sort)}
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </span>
        </button>
      </TableHead>
    );
  };

  const total = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      return item.type === "income" ? acc + item.amount : acc - item.amount;
    }, 0);
  }, [filteredData]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 gap-4">
      <div className="p-4 bg-gray-100 rounded-full">
        <ArrowLeftRight className="w-8 h-8 text-gray-400" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          {searchTerm
            ? "Nenhuma transação encontrada"
            : "Nenhuma transação cadastrada"}
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          {searchTerm
            ? `Não encontramos transações com "${searchTerm}". Tente outro termo de busca.`
            : "Comece adicionando sua primeira transação para ter um controle melhor das suas finanças."}
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        {showSearch && (
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="text-gray-500 hover:text-gray-700"
              >
                Limpar
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <div role="loading" className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div role="contentinfo" className="space-y-3">
            {filteredData.map((transaction) => (
              <MobileTransactionCard
                key={transaction.id}
                transaction={transaction}
                onEditClick={onEditClick}
                onDeleteSuccess={onDeleteSuccess}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 my-4 pb-4 border-b border-gray-200">
          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Filtrar transações por descrição"
            />
          </div>
          {onChangeFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filters?.type === undefined ? "default" : "outline"}
                size="sm"
                onClick={() => onChangeFilters({ ...filters, type: undefined })}
                className={cn(
                  "h-8 text-xs",
                  filters?.type === undefined &&
                    "bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
              >
                Todos
              </Button>
              <Button
                variant={filters?.type === "income" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangeFilters({ ...filters, type: "income" })}
                className={cn(
                  "h-8 text-xs",
                  filters?.type === "income" &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                Receitas
              </Button>
              <Button
                variant={filters?.type === "outcome" ? "default" : "outline"}
                size="sm"
                onClick={() => onChangeFilters({ ...filters, type: "outcome" })}
                className={cn(
                  "h-8 text-xs",
                  filters?.type === "outcome" &&
                    "bg-rose-600 hover:bg-rose-700 text-white"
                )}
              >
                Despesas
              </Button>
            </div>
          )}
        </div>
      )}

      {filteredData.length < 1 && !loading ? (
        renderEmptyState()
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-gray-200">
                  {enableBulkSelection && (
                    <TableHead className="w-[50px] text-center pl-0">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        ref={(el: HTMLButtonElement | null) => {
                          if (el) {
                            (el as HTMLInputElement).indeterminate =
                              isIndeterminate;
                          }
                        }}
                        aria-label="Selecionar todas as transações"
                        className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </TableHead>
                  )}
                  {renderTableHead("Nome / Categoria", "description")}
                  {renderTableHead("Status", "payment_status", "w-[120px]")}
                  {renderTableHead("Data", "date", "w-[180px] text-right")}
                  {renderTableHead("Valor", "amount", "w-[150px] text-right")}
                  {hasActions && (
                    <TableHead className="text-center w-[50px]"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <TableRow
                        role="loading"
                        key={index}
                        className="animate-pulse"
                      >
                        {enableBulkSelection && (
                          <TableCell>
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </TableCell>
                        <TableCell>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </TableCell>
                        {hasActions && (
                          <TableCell>
                            <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  : filteredData?.map((item, index) => (
                      <TableRow
                        className={cn(
                          "hover:bg-gray-50/50 transition-colors",
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                        )}
                        key={item.id}
                      >
                        {enableBulkSelection && (
                          <TableCell className="w-[50px] pl-4">
                            <Checkbox
                              checked={selectedIds.includes(item.id)}
                              onCheckedChange={(checked: boolean) =>
                                handleSelectItem(item, checked)
                              }
                              aria-label={`Selecionar transação ${item.description}`}
                              className="border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 pl-0"
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-3 py-1">
                            <TransactionAvatar name={item.description} />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-gray-900">
                                {item.description}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                {item.categories?.description && (
                                  <span className="text-xs text-gray-500">
                                    {item.categories.description}
                                  </span>
                                )}
                                {item.tags?.description && (
                                  <>
                                    {item.categories?.description && (
                                      <span className="text-xs text-gray-400">
                                        •
                                      </span>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5 px-1.5 border-gray-200 text-gray-600"
                                    >
                                      {item.tags.description}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs font-medium")}
                          >
                            {item.payment_status?.description}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm text-gray-600 tabular-nums">
                            {format(new Date(item.date), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "font-semibold text-sm tabular-nums",
                              item.type === "income"
                                ? "text-emerald-600"
                                : "text-rose-600"
                            )}
                          >
                            {item.type === "income" ? "+" : "-"} R${" "}
                            {item.amount.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </TableCell>

                        {hasActions && (
                          <TableCell className="w-[50px]">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  disabled={loading}
                                >
                                  <MoreHorizontal className="h-4 w-4 text-gray-700" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    onEditClick?.(item.id);
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DeleteTransactionConfirmationModal
                                  transaction={item}
                                  onDeleteSuccess={onDeleteSuccess}
                                  trigger={
                                    <DropdownMenuItem
                                      className="cursor-pointer text-red-600 focus:text-red-600"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </DropdownMenuItem>
                                  }
                                />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                {!loading && (
                  <TableRow className="border-t-2 border-gray-300 font-semibold">
                    <TableCell
                      colSpan={
                        enableBulkSelection
                          ? hasActions
                            ? 4
                            : 3
                          : hasActions
                          ? 3
                          : 2
                      }
                      className="text-right font-semibold text-gray-700 text-sm"
                    >
                      Total{" "}
                      {searchTerm
                        ? `(${filteredData.length} de ${data.length})`
                        : `(${data.length})`}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-lg tabular-nums text-gray-900">
                        {total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </TableCell>
                    {hasActions && <TableCell />}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionTable;
