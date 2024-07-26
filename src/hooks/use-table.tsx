import { useState } from "react"

export const useTable = (pageDefault = 1, countDefault = 15) => {
    const [page, setPage] = useState(pageDefault)
    const [count, setCount] = useState(countDefault)

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