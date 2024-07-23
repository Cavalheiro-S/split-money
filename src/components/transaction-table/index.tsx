import { TransactionTableContextProvider } from "contexts/transaction-table-context"
import { TransactionTableProps, TransactionTableRoot } from "./table"

export const TransactionTable = (props: TransactionTableProps) => {
    return (
        <TransactionTableContextProvider>
            <TransactionTableRoot {...props} />
        </TransactionTableContextProvider>
    )
}