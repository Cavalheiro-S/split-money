import { createContext, useState } from "react";

type TransactionTableContextProps = {
    open: boolean
    setOpen: (value: boolean) => void
    selectedRow?: ResponseGetTransactions | undefined
    setSelectedRow: (value: ResponseGetTransactions | undefined) => void
}

export const TransactionTableContext = createContext({} as TransactionTableContextProps)

export const TransactionTableContextProvider = ({ children }: { children: JSX.Element }) => {

    const [open, setOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<ResponseGetTransactions>()

    const value = {
        open,
        setOpen,
        selectedRow,
        setSelectedRow
    }

    return (
        <TransactionTableContext.Provider value={value}>
            {children}
        </TransactionTableContext.Provider>
    )
}