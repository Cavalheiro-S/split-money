import { Heading } from "../../Components/Heading"
import { Text } from "../../Components/Text"
import Table from "../../Components/Table"
import { CardInfo } from "./CardInfo"

export const Dashboard = () => {
    return (
        <div className="">
            <Heading size="lg">Dashboard</Heading>
            <Text className="text-gray-500" size="md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</Text>
            <div id="dashboard" className="grid grid-cols-3 pt-6">
                <div id="cards-main-dashboard" className="flex col-span-3 h-24">
                    <CardInfo title="R$ 1.000,00" subTitle="Salário Atual" percentage={-8} />
                    <CardInfo title="R$ 341,40" subTitle="Investimentos" percentage={23} />
                    <CardInfo title="R$ 12,39" subTitle="Despesas" percentage={8} />
                </div>
                <div className="col-start-1 mt-10" id="investiments">
                    <Text size="lg" className="pb-2">Investimentos</Text>
                    <div className="max-h-72 overflow-y-scroll">
                        <Table className="w-full" />
                    </div>
                </div>
                <div className="col-start-3 mt-10" id="investiments">
                    <Text size="lg" className="pb-2" >Despesas</Text>
                    <div className="max-h-72 overflow-y-scroll">
                        <Table className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}