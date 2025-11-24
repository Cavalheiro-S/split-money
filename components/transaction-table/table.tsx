import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TransactionFilters } from "@/services/transaction.service";
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Clock,
  DollarSign,
  Landmark,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
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

  const filteredData = useMemo(
    () =>
      data?.filter(
        (item) =>
          !searchTerm ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [data, searchTerm]
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableIds = filteredData.map((item) => item.id);
      onSelectionChange?.(selectableIds);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (item: ResponseGetTransactions, checked: boolean) => {
    const itemId = item.id;
      
    if (checked) {
      onSelectionChange?.([...selectedIds, itemId]);
    } else {
      onSelectionChange?.(
        selectedIds.filter((selectedId) => selectedId !== itemId)
      );
    }
  };

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

  const renderTypeCell = (type: "income" | "outcome") => {
    if (type === "income") {
      return (
        <div className="p-1 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
      );
    }
    return (
      <div className="p-1 bg-red-100 rounded-full w-8 h-8 flex items-center justify-center">
        <Landmark className="w-5 h-5 text-red-600" />
      </div>
    );
  };

  const renderTableHead = (
    title: string,
    sort: NonNullable<TransactionFilters["sort"]>["sortBy"],
    style?: string
  ) => {
    return (
      <TableHead
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
        className={cn("hover:bg-gray-300/30", style)}
      >
        <div className="flex items-center gap-2">
          {renderSort(sort)}
          {title}
        </div>
      </TableHead>
    );
  };

  const total = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      return item.type === "income" ? acc + item.amount : acc - item.amount;
    }, 0);
  }, [filteredData]);

  if (filteredData.length < 1 && !loading) {
    return (
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
  }

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

      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              {enableBulkSelection && (
                <TableHead className="w-[50px] text-center">
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
                  />
                </TableHead>
              )}
              {renderTableHead("Tipo", "type", "w-[80px]")}
              {renderTableHead("Descrição", "description")}
              {renderTableHead("Data", "date")}
              {renderTableHead("Categoria", "category")}
              {renderTableHead("Status", "payment_status")}
              {renderTableHead("Valor", "amount")}
              {hasActions && (
                <TableHead className="text-center w-[120px]">Ações</TableHead>
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
              : filteredData?.map((item) => (
                  <TableRow
                    className={cn(
                      item.type === "income"
                        ? "hover:bg-green-100/30"
                        : "hover:bg-red-100/30",
                    )}
                    key={item.id}
                  >
                    {enableBulkSelection && (
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleSelectItem(item, checked)
                          }
                          aria-label={`Selecionar transação ${item.description}`}
                        />
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {renderTypeCell(item.type)}
                        {item.is_virtual && (
                          <div title="Transação virtual">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">
                          {item.description}
                        </span>
                        {item.is_virtual && (
                          <Badge variant="secondary" className="text-xs">
                            Futura
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString("pt-br")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.categories?.description ? (
                        <Badge variant="outline" className="text-xs">
                          {item.categories.description}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Sem categoria
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.payment_status?.description ? (
                        <Badge
                          variant={
                            item.payment_status.description === "Pago"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {item.payment_status.description}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Sem status
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-semibold",
                          item.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {item.type === "income" ? "+" : "-"}
                        {item.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </TableCell>
                    {hasActions && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            disabled={loading}
                            onClick={() => {
                              onEditClick?.(item.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50",
                            )}
                            title={"Editar transação"}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <DeleteTransactionConfirmationModal
                            transaction={item}
                            onDeleteSuccess={onDeleteSuccess}
                            trigger={
                              <Button
                                disabled={loading}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50",
                                )}
                                title={"Excluir transação"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            {!loading && (
              <TableRow className="bg-gray-50 border-t-2">
                <TableCell
                  colSpan={
                    enableBulkSelection
                      ? hasActions
                        ? 7
                        : 6
                      : hasActions
                      ? 6
                      : 5
                  }
                  className="text-right font-semibold text-gray-700"
                >
                  Total{" "}
                  {searchTerm
                    ? `(${filteredData.length} de ${data.length})`
                    : `(${data.length})`}
                </TableCell>
                <TableCell className="text-left">
                  <span className="font-bold text-lg">
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
    </div>
  );
}

export default TransactionTable;
