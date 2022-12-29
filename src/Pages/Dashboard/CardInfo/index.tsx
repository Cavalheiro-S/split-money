import clsx from "clsx"
import { ArrowDown } from "phosphor-react"
import { CustomComponentProps } from "../../../Components"
import { Heading } from "../../../Components/Heading"
import { Text } from "../../../Components/Text"

interface CardInfoProps extends CustomComponentProps {
    title: string,
    subTitle?: string,
    percentage?: number,

}

export const CardInfo = ({ title, subTitle = "", percentage = 0, className }: CardInfoProps) => {

    return (
        <div id="card-1" className={clsx("flex border-r border-r-gray-300 gap-4 w-fit py-4 px-10", { className })}>
            <div className="flex items-center">
                <ArrowDown className={clsx("w-6 h-6", {
                    "transform rotate-180": percentage > 0,
                    "transform rotate-0": percentage < 0,
                    "text-red-700": percentage < 0,
                    "text-green-700": percentage > 0,
                })} />
                <Text size="lg" className={clsx({
                    "text-red-700": percentage < 0,
                    "text-green-700": percentage > 0,
                })}>{percentage < 0 ? percentage * -1 : percentage }%</Text>
            </div>
            <div className="flex flex-col gap-1">
                <Heading size="sm">{title}</Heading>
                <Text className="text-gray-500">{subTitle}</Text>
            </div>
        </div>
    )
}