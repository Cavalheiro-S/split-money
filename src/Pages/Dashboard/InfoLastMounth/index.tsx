import { SpinnerGap } from "phosphor-react";
import { useEffect, useState } from "react";
import { DashboardContentProps } from "..";
import { Heading } from "../../../Components/Heading"
import { Text } from "../../../Components/Text";
import { RegisterType } from "../../../Context/RegisterContext";
import { useRegister } from "../../../Hooks/useRegister";
import { convertToMoneyNumber } from "../../../Utils/util";
import { CardInfo } from "../CardInfo"

interface InfoLastMounthProps {
    dashboardContent: DashboardContentProps;
}

export const InfoLastMounth = ({ dashboardContent }: InfoLastMounthProps) => {

    const [percentageInvestiments, setPercentageInvestiments] = useState(0);
    const [percentageExpenses, setPercentageExpenses] = useState(0);
    const { getValueTotalRegisters } = useRegister();

    useEffect(() => {
        const loadInfoLastMounth = async () => await calculatePercentUseSalary();
        loadInfoLastMounth();

    }, [dashboardContent])

    const calculatePercentUseSalary = async () => {
        await calculatePercentUse(setPercentageInvestiments, RegisterType.INVESTIMENT);
        await calculatePercentUse(setPercentageExpenses, RegisterType.EXPENSE);
    }

    const calculatePercentUse = async (setValue: React.Dispatch<React.SetStateAction<number>>, type: RegisterType) => {
        const totalRegister = Number(await getValueTotalRegisters(type, false));
        const salary = convertToMoneyNumber(dashboardContent.salary ?? "0");
        const percent = (totalRegister / salary) * 100;
        setValue(percent);
    }

    const handleLoading = () => {
        if (dashboardContent)
            return (
                <>
                    <CardInfo title={dashboardContent.salary} subTitle="Salário Atual" />
                    <CardInfo title={dashboardContent.totalInvestiments} subTitle="Investimentos" percentage={percentageInvestiments} />
                    <CardInfo type="negative" title={dashboardContent.totalExpenses} subTitle="Despesas" percentage={percentageExpenses} />
                </>
            )
        return (
            <div className="flex justify-center items-center h-screen gap-2">
                <SpinnerGap className="w-10 h-10 animate-spin text-primary" />
                <Text size="lg">Carregando</Text>
            </div>
        )
    }

    return (
        <>
            <Heading size="sm" className="mb-2">Informações dos últimos meses</Heading>
            <div id="cards-main-dashboard" className="flex flex-col md:flex-row md:col-span-3 md:h-24">
                {handleLoading()}
            </div>
        </>
    )
}