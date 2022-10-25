import { ReactNode } from "react"

interface TableProps {
    headers: string[],
    children: ReactNode,
}


export function Table({ headers, children }: TableProps) {
    return (
        <table className='table-auto'>
            <thead className="border-b-2">
                {headers.map(header => {
                    return <th className="p-4">{header}</th>
                })}
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    )
}
