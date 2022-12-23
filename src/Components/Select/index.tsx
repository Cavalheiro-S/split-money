import clsx from "clsx"
import React from "react"
import { ReactNode, SelectHTMLAttributes } from "react"

interface SelectRootProps {
    children: ReactNode,
    className?: string
}

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> { }

interface SelectOptionProps extends React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement> { }

const SelectRoot = ({ children, className }: SelectRootProps) => {
    return (
        <div className={clsx("bg-gray-100 flex items-center rounded h-10 w-auto focus-within:ring-2 ring-primary group transition", className)}>
            {children}
        </div>
    )
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(({ children, ...props }, ref) => {
    return (
        <select ref={ref} className={clsx("w-full bg-transparent outline-none px-3",)} {...props}>{children}</select>
    )
})

const SelectOptions = React.forwardRef<HTMLOptionElement, SelectOptionProps>(({children, ...props}, ref) => {

    return (
        <option ref={ref} {...props}>{children}</option>
    )
})


export const Select = {
    Root: SelectRoot,
    Input: SelectInput,
    Options: SelectOptions
}