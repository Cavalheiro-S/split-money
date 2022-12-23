import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
import { PlusCircle } from "phosphor-react"
import React from "react"
import { ReactNode } from "react"

interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode,
    styleType?: "primary" | "secondary",
    className?: string,
}

interface ButtonIconProps {
    children?: ReactNode | string,
    className?: string,
}


export const ButtonIcon = ({ children = <PlusCircle />, className }: ButtonIconProps) => {
    return (
        <Slot className={className}>
            {children}
        </Slot>
    )
}

export const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(({ children, className, styleType = "primary", ...props }, ref) => {

    return (
        <button {...props} ref={ref} className={
            clsx("flex items-center gap-2 justify-center rounded px-4 py-1 font-semibold transition h-10",
                {
                    "bg-primary outline-primary-hover text-white hover:bg-primary-hover": styleType === "primary",
                    "bg-transparent text-primary hover:bg-primary-hover hover:text-white": styleType === "secondary",
                },
                className)
        }>
            {children}
        </button >
    )
})


export const Button = {
    Root: ButtonRoot,
    Icon: ButtonIcon,
}