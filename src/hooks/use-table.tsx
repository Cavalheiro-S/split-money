import { useState } from "react"

export const useTable = () => {
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(5)

    const handleSetPage = (value: number) => {
        setPage(value)
    }

    return {
        page,
        count,
        setPage,
        setCount,
        handleSetPage
    }
}