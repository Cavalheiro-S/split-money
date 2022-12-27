import { Info } from "phosphor-react"
import { ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx";
import { Text } from "../Text";

interface CardProps {
  title: string,
  subTitle?: string,
  children?: ReactNode,
  className?: string,
}

interface CardIconProps {
  children?: ReactNode,
  IconBGColor?: "yellow" | "green" | "red" | "blue",
  className?: string,
}

export const CardRoot = ({ title, subTitle, children, className }: CardProps) => {

  return (
    <div className={clsx('flex rounded border justify-center items-center p-4', className)}>
      <div className="flex flex-col w-64 gap-2">
        {children}
        <div className="flex flex-col items-start">
          <Text size="lg" className='text-neutral-700'>{title}</Text>
          <Text className="text-neutral-400">{subTitle}</Text>
        </div>
      </div>
    </div>
  )
}

export const CardIcon = ({ children = <Info />, IconBGColor = "yellow", className }: CardIconProps) => {

  return (
    <div className={
      clsx("h-10 w-10 flex items-center justify-center rounded-full",
        {
          "bg-yellow-700": IconBGColor === "yellow",
          "bg-green-700": IconBGColor === "green",
          "bg-red-700": IconBGColor === "red",
          "bg-blue-700": IconBGColor === "blue"
        }, className)}>
      <Slot className="text-white w-6 h-6">
        {children}
      </Slot>
    </div>
  )
}

export const Card = {
  Root: CardRoot,
  Icon: CardIcon
}