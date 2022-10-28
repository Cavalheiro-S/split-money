import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
import { PlusCircle } from "phosphor-react"
import { ReactNode } from "react"

interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode,
    className?: string,
}

interface ButtonIconProps {
    children?: ReactNode,
    className?: string,
}


export const ButtonIcon = ({ children = <PlusCircle />, className }: ButtonIconProps) => {
    return (
        <Slot className={className}>
            {children}
        </Slot>
    )
}

export const ButtonRoot = ({ children, className }: ButtonRootProps) => {

    return (
        <button className={clsx("flex items-center gap-2 bg-primary text-white rounded px-4 py-1  font-semibold hover:bg-primary-hover transition h-10", className)}>
            {children}
        </button>)
}


export const Button = {
    Root: ButtonRoot,
    Icon: ButtonIcon,
}