"use client"

import { useState } from "react"
import { Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BulkDeleteConfirmationModal } from "./bulk-delete-confirmation-modal"

interface BulkActionsBarProps<T = ResponseGetTransactions> {
  selectedIds: string[]
  transactions: T[]
  onClearSelection: () => void
  onDeleteSuccess: () => Promise<void>
}

export function BulkActionsBar<T = ResponseGetTransactions>({
  selectedIds,
  transactions,
  onClearSelection,
  onDeleteSuccess,
}: BulkActionsBarProps<T>) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  if (selectedIds.length === 0) return null

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedIds.length} selecionada{selectedIds.length > 1 ? "s" : ""}
          </Badge>
          <span className="text-sm text-blue-700">
            Transações selecionadas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Excluir Selecionadas
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
            Limpar Seleção
          </Button>
        </div>
      </div>

      <BulkDeleteConfirmationModal
        selectedIds={selectedIds}
        transactions={transactions}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={onDeleteSuccess}
      />
    </>
  )
}
