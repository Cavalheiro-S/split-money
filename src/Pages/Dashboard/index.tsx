import { Heading } from "../../Components/Heading"
import { Text } from "../../Components/Text"
import Table from "../../Components/Table"
import { CardInfo } from "./CardInfo"
import { useRegister } from "../../Hooks/useRegister"
import { useEffect, useState } from "react"
import { RegisterProps, RegisterType } from "../../Context/RegisterContext"
import { UserProps, useUser } from "../../Hooks/useUser"
import { convertToMoneyString } from "../../Utils/util"

interface DashboardContentProps {
    user: UserProps;
    investiments: RegisterProps[];
    expenses: RegisterProps[];
    totalInvestiments: string;
    totalExpenses: string;
}

export const Dashboard = () => {

    const { getRegisterByType, getValueTotalRegisters } = useRegister();
    const { user } = useUser();
    const [dashboardContent, setDashboardContent] = useState<DashboardContentProps>({} as DashboardContentProps);

    useEffect(() => {
        const loadRegisters = async () => {
            const investiments = await getRegisterByType(RegisterType.INVESTIMENT);
            const expenses = await getRegisterByType(RegisterType.EXPENSE);
            const totalInvestiments = await getValueTotalRegisters(RegisterType.INVESTIMENT);
            const totalExpenses = await getValueTotalRegisters(RegisterType.EXPENSE);

            const dashboardContentLoad = {
                investiments,
                expenses,
                totalInvestiments,
                totalExpenses
            } as DashboardContentProps;
            setDashboardContent(dashboardContentLoad);
        }
        loadRegisters();
    }, [])

    return (
        <div className="">
            <Heading size="lg">Dashboard</Heading>
            <Text className="text-gray-500" size="md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</Text>
            <div id="dashboard" className="md:grid md:grid-cols-3 md:pt-6">
                <div id="cards-main-dashboard" className="flex flex-col md:flex-row md:col-span-3 md:h-24">
                    <CardInfo title={convertToMoneyString(user.salary ?? 0)} subTitle="Salário Atual" percentage={-8} />
                    <CardInfo title={dashboardContent.totalInvestiments} subTitle="Investimentos" percentage={23} />
                    <CardInfo type="negative" title={dashboardContent.totalExpenses} subTitle="Despesas" percentage={8} />
                </div>
                <div className="col-start-1 mt-10" id="investiments">
                    <Text size="lg" className="pb-2">Investimentos</Text>
                    <div className="max-h-72 overflow-y-scroll">
                        <Table registersData={dashboardContent.investiments} className="w-full" />
                    </div>
                </div>
                <div className="col-start-3 mt-10" id="investiments">
                    <Text size="lg" className="pb-2">Despesas</Text>
                    <div className="max-h-72 overflow-y-scroll">
                        <Table registersData={dashboardContent.expenses} className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}