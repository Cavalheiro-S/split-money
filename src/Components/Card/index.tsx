import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { Info } from "phosphor-react";
import { ReactNode } from "react";
import { Text } from "../Text";

export type CardColor = "yellow" | "green" | "red" | "gray" | "blue";

interface CardProps {
  title: string,
  titleColor?: CardColor,
  subTitle?: string,
  subTitleColor?: CardColor,
  orientation?: "vertical" | "horizontal",
  children?: ReactNode,
  className?: string,
}

interface CardIconProps {
  children?: ReactNode,
  IconBgColor?: CardColor,
  className?: string,
}

export const CardRoot = ({ title, titleColor = "gray", subTitle, children, className, orientation }: CardProps) => {

  return (
    <div className={clsx('flex hover:shadow-md transition gap-2 rounded border py-4 md:w-72 pl-4 md:p-4', {
      "flex-col": orientation === "vertical",
      "flex-row": orientation === "horizontal",
    }, className)}>
      {children}
      <div className="flex flex-col items-start">
        <Text size="lg" className={clsx("", {
          "text-yellow-700": titleColor === "yellow",
          "text-green-700": titleColor === "green",
          "text-red-700": titleColor === "red",
          "text-gray-700": titleColor === "gray",
          "text-blue-700": titleColor === "blue",
        }
        )}>{title}</Text>
        <Text className="text-neutral-400">{subTitle}</Text>
      </div>
    </div >
  )
}

export const CardIcon = ({ children = <Info />, IconBgColor = "yellow", className }: CardIconProps) => {

  return (
    <div className={
      clsx("h-10 w-10 flex items-center justify-center rounded-full",{
        "bg-yellow-700": IconBgColor === "yellow",
        "bg-green-700": IconBgColor === "green",
        "bg-red-700": IconBgColor === "red",
        "bg-gray-700": IconBgColor === "gray",
        "bg-blue-700": IconBgColor === "blue",
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