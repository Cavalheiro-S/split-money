import { Info } from "phosphor-react"
import { ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx";

interface CardProps {
  title: string,
  subTitle?: string,
  children?: ReactNode,
  className?: string,
}

interface CardIconProps {
  icon?: ReactNode,
  IconBGColor?: "yellow" | "green" | "red" | "blue",
  className?: string,
}

export const CardRoot = ({ title, subTitle, children, className }: CardProps) => {

  return (
    <div className={clsx('flex rounded border justify-center items-center p-6', className)}>
      <div className="flex w-64 items-center gap-6">
        {children}
        <div className="flex flex-col items-start">
          <span className='font-bold text-neutral-700'>{title}</span>
          <span className="font-bold text-neutral-400">{subTitle}</span>
        </div>
      </div>
    </div>
  )
}

export const CardIcon = ({ icon = <Info />, IconBGColor = "yellow", className }: CardIconProps) => {

  return (
    <div className={
      clsx("h-10 w-10 flex items-center justify-center rounded-full",
        {
          "bg-yellow-500": IconBGColor === "yellow",
          "bg-green-500": IconBGColor === "green",
          "bg-red-500": IconBGColor === "red",
          "bg-blue-500": IconBGColor === "blue"
        }, className)}>
      <Slot className="text-white w-7 h-7">
        {icon}
      </Slot>
    </div>
  )
}

export const Card = {
  Root: CardRoot,
  Icon: CardIcon
}