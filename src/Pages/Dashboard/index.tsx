import { SpinnerGap } from "phosphor-react"
import { useEffect, useState } from "react"
import { Heading } from "../../Components/Heading"
import Table from "../../Components/Table"
import { Text } from "../../Components/Text"
import { RegisterProps, RegisterType } from "../../Context/RegisterContext"
import { useRegister } from "../../Hooks/useRegister"
import { useUser } from "../../Hooks/useUser"
import { convertToMoneyString } from "../../Utils/util"
import { InfoLastMounth } from "./InfoLastMounth"

export interface DashboardContentProps {
    salary: string;
    investiments: RegisterProps[];
    expenses: RegisterProps[];
    totalInvestiments: string;
    totalExpenses: string;
}

export const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const { firestore: { get } } = useRegister();
    const { user, loadUser } = useUser();
    const [dashboardContent, setDashboardContent] = useState<DashboardContentProps>({} as DashboardContentProps);

    useEffect(() => {
        const loadRegisters = async () => {
            setLoading(true);

            const investiments = await get.RegisterByType(RegisterType.INVESTIMENT);
            const expenses = await get.RegisterByType(RegisterType.EXPENSE);
            console.log(investiments);
            
            const totalInvestiments = await get.RegistersTotalValue(RegisterType.INVESTIMENT);
            const totalExpenses = await get.RegistersTotalValue(RegisterType.EXPENSE);
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
                    <SpinnerGap className="w-10 h-10 animate-spin text-primary" />
                    <Text size="lg">Carregando</Text>
                </div>
            )
        }
        return (
            <div className="">
                <Heading size="lg">Dashboard</Heading>
                <Text className="text-gray-500" size="md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</Text>
                <div id="dashboard" className="md:grid md:grid-cols-3 md:pt-6">
                    <InfoLastMounth dashboardContent={dashboardContent} />
                    <div className="col-start-1 mt-10" id="investiments">
                        <Text size="lg" className="pb-2">Investimentos</Text>
                        <div className="max-h-72 overflow-y-scroll scroll">
                            <Table className="w-full" />
                        </div>
                    </div>
                    <div className="col-start-3 mt-10" id="investiments">
                        <Text size="lg" className="pb-2">Despesas</Text>
                        <div className="max-h-72 overflow-y-scroll">
                            <Table className="w-full" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return handleLoading()
}