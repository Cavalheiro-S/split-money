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
  ArrowUp,
  Clock,
  DollarSign,
  Landmark,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback, useRef } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DeleteTransactionConfirmationModal } from "./delete-confirmation-modal";
import MobileTransactionCard from "./mobile-transaction-card";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualizedTransactionTableProps {
  data: ResponseGetTransactions[];
  loading?: boolean;
  hasActions?: boolean;
  filters?: TransactionFilters;
  onEditClick?: (id: string) => void;
  onChangeFilters?: (filters: TransactionFilters) => void;
  onDeleteSuccess?: () => Promise<void>;
  enableBulkSelection?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

/**
 * Tabela virtualizada para alta performance com muitas linhas
 * Usa @tanstack/react-virtual para renderizar apenas itens visíveis
 */
export function VirtualizedTransactionTable({
  data,
  onEditClick,
  hasActions,
  loading,
  onChangeFilters,
  filters,
  onDeleteSuccess,
  enableBulkSelection = false,
  selectedIds = [],
  onSelectionChange,
}: VirtualizedTransactionTableProps) {
  const isMobile = useIsMobile();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isMobile ? 180 : 53), // Altura estimada (Card mobile vs Table row)
    overscan: 5,
  });

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

    return (
      <TableHead
        aria-sort={sortOrder}
        className={cn(isSorted && "bg-gray-100", style)}
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
          className="flex items-center gap-2 w-full h-full hover:bg-gray-200/50 p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Ordenar por ${title} ${
            isSorted
              ? filters?.sort?.sortOrder === "asc"
                ? "decrescente"
                : "crescente"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {renderSort(sort)}
            {title}
          </div>
        </button>
      </TableHead>
    );
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

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const selectableIds = data.map((item) => item.id);
        onSelectionChange?.(selectableIds);
      } else {
        onSelectionChange?.([]);
      }
    },
    [data, onSelectionChange]
  );

  const handleSelectItem = useCallback(
    (item: ResponseGetTransactions, checked: boolean) => {
      const itemId = item.id;
      if (checked) {
        onSelectionChange?.([...selectedIds, itemId]);
      } else {
        onSelectionChange?.(selectedIds.filter((id) => id !== itemId));
      }
    },
    [selectedIds, onSelectionChange]
  );

  const isAllSelected =
    data.length > 0 && data.every((item) => selectedIds.includes(item.id));
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < data.length;

  if (isMobile) {
    return (
      <div ref={parentRef} className="h-[600px] overflow-auto w-full">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const item = data[virtualItem.index];
            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  paddingBottom: "12px",
                }}
              >
                <MobileTransactionCard
                  transaction={item}
                  onEditClick={onEditClick}
                  onDeleteSuccess={onDeleteSuccess}
                  loading={loading}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border h-[600px] overflow-hidden flex flex-col">
      <div className="overflow-visible bg-white z-10 border-b">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {enableBulkSelection && (
                <TableHead className="w-[50px] text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(el: HTMLButtonElement | null) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          isIndeterminate;
                    }}
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
        </Table>
      </div>

      <div ref={parentRef} className="overflow-auto flex-1 w-full">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <Table>
            <TableBody>
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const item = data[virtualItem.index];
                return (
                  <TableRow
                    key={item.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      display: "flex",
                      alignItems: "center",
                    }}
                    className={cn(
                      "w-full",
                      item.type === "income"
                        ? "hover:bg-green-100/30"
                        : "hover:bg-red-100/30"
                    )}
                  >
                    {enableBulkSelection && (
                      <TableCell className="text-center w-[50px] flex-shrink-0">
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked: boolean) =>
                            handleSelectItem(item, checked)
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell className="text-center w-[80px] flex-shrink-0">
                      <div className="flex items-center justify-center gap-1">
                        {renderTypeCell(item.type)}
                        {item.is_virtual && (
                          <div title="Transação virtual">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium flex-1">
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
                    <TableCell className="w-[120px] flex-shrink-0">
                      <span className="text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString("pt-br")}
                      </span>
                    </TableCell>
                    <TableCell className="w-[150px] flex-shrink-0">
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
                    <TableCell className="w-[120px] flex-shrink-0">
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
                    <TableCell className="w-[120px] flex-shrink-0">
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
                      <TableCell className="text-center w-[120px] flex-shrink-0">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            disabled={loading}
                            onClick={() => onEditClick?.(item.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            }
                          />
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
