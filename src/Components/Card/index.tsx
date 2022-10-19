import { Info } from "phosphor-react"
import { ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx";

interface CardProps {
  title: string,
  subTitle?: string,
  children?: ReactNode
}

interface CardIconProps {
  icon?: ReactNode,
  IconBGColor?: "yellow" | "green" | "red" | "blue",
}

export const CardRoot = ({ title, subTitle, children }: CardProps) => {

  return (
    <div className='flex rounded border justify-center items-center gap-6 p-6'>
      {children}
      <div className="flex flex-col items-center">
        <span className='font-bold text-neutral-700'>{title}</span>
        <span className="font-bold text-neutral-400">{subTitle}</span>
      </div>
    </div>
  )
}

export const CardIcon = ({ icon = <Info/>, IconBGColor = "yellow" }: CardIconProps) => {
  
  return (
    <div className={
      clsx("h-10 w-10 flex items-center justify-center rounded-full",
        {
          "bg-yellow-500": IconBGColor === "yellow",
          "bg-green-500": IconBGColor === "green",
          "bg-red-500": IconBGColor === "red",
          "bg-blue-500": IconBGColor === "blue"
        })}>
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