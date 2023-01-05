import { Info } from "phosphor-react"
import { ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx";
import { Text } from "../Text";

interface CardProps {
  title: string,
  subTitle?: string,
  orientation?: "vertical" | "horizontal",
  children?: ReactNode,
  className?: string,
}

interface CardIconProps {
  children?: ReactNode,
  IconBGColor?: "yellow" | "green" | "red" | "blue" | "gray",
  className?: string,
}

export const CardRoot = ({ title, subTitle, children, className, orientation }: CardProps) => {

  return (
    <div className={clsx('flex hover:shadow-md transition gap-2 rounded border w-screen py-4 md:w-full pl-4 md:p-4', {
      "flex-col": orientation === "vertical",
      "flex-row": orientation === "horizontal",
    }, className)}>
      {children}
      <div className="flex flex-col items-start">
        <Text size="lg" className='text-neutral-700'>{title}</Text>
        <Text className="text-neutral-400">{subTitle}</Text>
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