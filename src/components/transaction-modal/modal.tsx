import { Modal } from "components/Modal/Modal"
import { TransactionTableContext } from "contexts/transaction-table-context"
import { useContext } from "react"
import { TransactionModalForm } from "./form"


export const TransactionModal = () => {
    const { open, setOpen, setSelectedRow } = useContext(TransactionTableContext)

    const handleClose = () => {
        setOpen(false)
        setSelectedRow(undefined)
    }
    return (
        <Modal
            closeModal={handleClose}
            openModal={() => setOpen(true)}
            open={open}
            content={<TransactionModalForm />
            }
        />
    )
}