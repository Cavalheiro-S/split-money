import { SpinnerGap } from "phosphor-react"
import { useEffect, useState } from "react"
import { Heading } from "../../Components/Heading"
import { Text } from "../../Components/Text"
import { RegisterProps, RegisterType } from "../../Context/RegisterContext"
import { useRegister } from "../../Hooks/useRegister"
import { useUser } from "../../Hooks/useUser"
import { convertToMoneyString } from "../../Utils/util"
import { InfoLastMounth } from "./InfoLastMounth"

export interface DashboardContentProps {
    salary: string;
    incomings: RegisterProps[];
    expenses: RegisterProps[];
    totalIncomings: string;
    totalExpenses: string;
}

export const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const { firestore: { get } } = useRegister();
    const { user } = useUser();
    const [dashboardContent, setDashboardContent] = useState<DashboardContentProps>({} as DashboardContentProps);

    useEffect(() => {
        const loadRegisters = async () => {
            setLoading(true);

            const totalIncomings = await get.RegistersTotalValue(RegisterType.INCOMING);
            const totalExpenses = await get.RegistersTotalValue(RegisterType.EXPENSE);
            const salary = convertToMoneyString(Number(user?.salary) || 0);
            const dashboardContentLoad = {
                salary: salary,
                totalIncomings,
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
                </div>
            </div>
        )
    }

    return handleLoading()
}