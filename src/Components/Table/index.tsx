import clsx from "clsx"
import { ReactNode } from "react"

interface TableProps {
    headers: string[],
    children: ReactNode,
    className: string
}


export function Table({ headers, children, className }: TableProps) {
    return (
        <table className={clsx('table-auto border',className)}>
            <thead className="border-b-2">
                {headers.map(header => {
                    return <th className="text-start text-sm p-2 border-collapse border-x-2 border-x-gray-100">{header}</th>
                })}
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    )
}
