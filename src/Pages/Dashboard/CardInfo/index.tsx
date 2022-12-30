import clsx from "clsx"
import { ArrowDown } from "phosphor-react"
import { CustomComponentProps } from "../../../Components"
import { Text } from "../../../Components/Text"

interface CardInfoProps extends CustomComponentProps {
    title: string,
    subTitle?: string,
    percentage?: number,
    type?: "positive" | "negative"
}

export const CardInfo = ({ title, subTitle = "", percentage = 0, type = "positive", className }: CardInfoProps) => {

    const logicalTextRed = () => {
        if((percentage > 0 && type === "negative") || (percentage < 0 && type === "positive")) {
            return true
        }
        return false
    }

    const logicalTextGreen = () => {
        if((percentage < 0 && type === "negative") || (percentage > 0 && type === "positive")) {
            return true
        }
        return false
    }

    return (
        <div id="card-1" className={clsx("flex border-r border-r-gray-300 gap-4 w-fit py-4 px-10", { className })}>
            <div className="flex items-center">
                <ArrowDown className={clsx("w-6 h-6", {
                    "transform rotate-180": percentage > 0,
                    "transform rotate-0": percentage < 0,
                    "text-red-700": logicalTextRed(),
                    "text-green-700": logicalTextGreen(),
                })} />
                <Text size="lg" className={clsx({
                    "text-red-700": logicalTextRed(),
                    "text-green-700": logicalTextGreen()
                })}>{percentage < 0 ? percentage * -1 : percentage}%</Text>
            </div>
            <div className="flex flex-col gap-1">
                <Text className="font-semibold text-font" size="lg">{title}</Text>
                <Text className="text-gray-500">{subTitle}</Text>
            </div>
        </div>
    )
}