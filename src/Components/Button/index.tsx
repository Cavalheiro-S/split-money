import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
import { PlusCircle } from "phosphor-react"
import React from "react"
import { ReactNode } from "react"

interface ButtonRootProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode,
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

export const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>((props, ref) => {

    return (
        <button {...props} ref={ref} className={clsx("flex items-center gap-2 bg-primary outline-primary-hover text-white rounded px-4 py-1  font-semibold hover:bg-primary-hover transition h-10", props.className)}>
            {props.children}
        </button>
    )
})


export const Button = {
    Root: ButtonRoot,
    Icon: ButtonIcon,
}