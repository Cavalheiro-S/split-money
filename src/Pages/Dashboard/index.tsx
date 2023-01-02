import { SpinnerGap } from "phosphor-react"
import { useEffect, useState } from "react"
import { Heading } from "../../Components/Heading"
import Table from "../../Components/Table"
import { Text } from "../../Components/Text"
import { RegisterProps, RegisterType } from "../../Context/RegisterContext"
import { useRegister } from "../../Hooks/useRegister"
import { useUser } from "../../Hooks/useUser"
import { convertToMoneyString } from "../../Utils/util"
import { CardInfo } from "./CardInfo"

interface DashboardContentProps {
    salary: string;
    investiments: RegisterProps[];
    expenses: RegisterProps[];
    totalInvestiments: string;
    totalExpenses: string;
}

export const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const { getRegisterByType, getValueTotalRegisters } = useRegister();
    const { user, loadUser } = useUser();
    const [dashboardContent, setDashboardContent] = useState<DashboardContentProps>({} as DashboardContentProps);

    useEffect(() => {
        const loadRegisters = async () => {
            setLoading(true);
            const investiments = await getRegisterByType(RegisterType.INVESTIMENT);
            const expenses = await getRegisterByType(RegisterType.EXPENSE);
            const totalInvestiments = await getValueTotalRegisters(RegisterType.INVESTIMENT);
            const totalExpenses = await getValueTotalRegisters(RegisterType.EXPENSE);
            await loadUser();
            const salary = convertToMoneyString(Number(user?.salary) || 0);
            const dashboardContentLoad = {
                salary: salary,
                investiments,
                expenses,
                totalInvestiments,
                totalExpenses
            } as DashboardContentProps;
            setDashboardContent(dashboardContentLoad);
            setLoading(false);
        }
        loadRegisters();
    }, [user])

    const handleLoading = () => {

        if (loading) {
            return (
                <div className="flex justify-center items-center h-screen gap-2">
                    <SpinnerGap className="w-10 h-10 animate-spin text-primary"/>
                    <Text size="lg">Carregando</Text>
                </div>
            )
        }
        return (
            <div className="">
                <Heading size="lg">Dashboard</Heading>
                <Text className="text-gray-500" size="md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</Text>
                <div id="dashboard" className="md:grid md:grid-cols-3 md:pt-6">
                    <div id="cards-main-dashboard" className="flex flex-col md:flex-row md:col-span-3 md:h-24">
                        <CardInfo title={dashboardContent.salary} subTitle="Salário Atual" percentage={-8} />
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

    return handleLoading()
}