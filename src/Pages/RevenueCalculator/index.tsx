import * as Accordion from '@radix-ui/react-accordion';
import clsx from "clsx";
import { Bank, Book, Calculator, CreditCard, Sunglasses } from 'phosphor-react';
import { FormEvent, ReactNode, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button } from "../../Components/Button";
import { Card } from '../../Components/Card';
import { Heading } from '../../Components/Heading';
import { Input } from '../../Components/Input';
import { Text } from '../../Components/Text';
interface RevenueCalculatorProps {
    className?: string
}

interface CardValueProps {
    value: string,
    name: string,
    iconBGColor?: "yellow" | "green" | "red" | "blue",
    icon?: ReactNode,
    description: string,
}

interface RevenueCalculatorValues {
    investiments: number,
    expenses: number,
    leisure: number,
    education: number,
}

interface Inputs {
    revenue: number,
}

export default function RevenueCalculator({ className }: RevenueCalculatorProps) {

    const [revenue, setRevenue] = useState<number>(0);
    const [revenueCalculatorValues, setRevenueCalculatorValues] = useState<RevenueCalculatorValues>({
        investiments: 0,
        expenses: 0,
        leisure: 0,
        education: 0,
    } as RevenueCalculatorValues);

    const { register, handleSubmit, getValues } = useForm<Inputs>();


    const onSubmit: SubmitHandler<Inputs> = async data => {
        calculatePercentage();
    }
    const cardsInfo: CardValueProps[] = [
        {
            value: "R$ " + revenueCalculatorValues.investiments.toFixed(2),
            name: "Investimentos",
            iconBGColor: "green",
            icon: <Bank />,
            description: "Dinheiro alocado em renda fixa , renda variável , ou guardado em bancos digitais."
        },
        {
            value: "R$ " + revenueCalculatorValues.expenses.toFixed(2),
            name: "Despesas Essenciais",
            iconBGColor: "red",
            icon: <CreditCard />,
            description: "Dinheiro necessário para despesas que não podem ser substituídas ou cortadas."
        },
        {
            value: "R$ " + revenueCalculatorValues.leisure.toFixed(2),
            name: "Lazer",
            iconBGColor: "blue",
            icon: <Sunglasses />,
            description: "Quantia reservada para gastos relacionados a diversão."
        },
        {
            value: "R$ " + revenueCalculatorValues.education.toFixed(2),
            name: "Educação",
            iconBGColor: "yellow",
            icon: <Book />,
            description: "Destinado a compra de cursos, livros, palestras e outras coisas relacionadas a desenvolvimento pessoal."
        },
    ]

    const calculatePercentage = () => {
        const INVESTIMENTS_PERCENTAGE = 0.30;
        const ESSENTIALS_EXPENSES_PERCENTAGE = 0.55;
        const LEISURE_PERCENTAGE = 0.10;
        const EDUCATION_PERCENTAGE = 0.05;

        setRevenueCalculatorValues({
            investiments: getValues("revenue") * INVESTIMENTS_PERCENTAGE,
            expenses: getValues("revenue") * ESSENTIALS_EXPENSES_PERCENTAGE,
            leisure: getValues("revenue") * LEISURE_PERCENTAGE,
            education: getValues("revenue") * EDUCATION_PERCENTAGE
        })

    }

    const renderCards = (card: CardValueProps) => {
        return (
            <Accordion.Root key={uuid()} type="multiple" className="w-full md:w-72">
                <Accordion.Item value="item-1">
                    <Accordion.Header>
                        <Accordion.Trigger className="w-full">
                            <Card.Root className='w-full md:w-72 gap-4' title={card.value} subTitle={card.name}>
                                <Card.Icon IconBGColor={card.iconBGColor}>
                                    {card.icon}
                                </Card.Icon>
                            </Card.Root>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="border-x-2 border-b-2 p-4 md:h-40">
                        <Text size='lg'>Descrição</Text><br />
                        <Text className='text-gray-500'>{card.description}</Text>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>

        )
    }
    return (
        <div className={clsx('md:mx-0 flex flex-col', className)}>
            <Heading size='lg' className='md:mx-0'>Divida sua renda mensal</Heading>
            <Text size='lg' className=' md:mx-0 text-neutral-400 mb-10'>Equilibre sua renda entre investimentos, educação, despesas essenciais e lazer</Text>
            <div className="flex flex-col md:flex md:flex-row md:items-end gap-4">
                <form onSubmit={handleSubmit(onSubmit)} className='flex items-end gap-4 md:m-0'>
                    <Text className='flex flex-col gap-2' size='lg' asChild>
                        <label htmlFor="renda">Renda Mensal:
                            <Input.Root>
                                <Input.Addorn>R$</Input.Addorn>
                                <Input.Input {...register("revenue")} type="number" id='renda' placeholder='Digite sua renda mensal' />
                            </Input.Root >
                        </label>
                    </Text>
                    <Button.Root type='submit'>
                        <Button.Icon className='text-xl'>
                            <Calculator />
                        </Button.Icon>
                        Calcular
                    </Button.Root>
                </form>
            </div>
            <div className='flex gap-4 pt-4 flex-wrap md:mx-0'>

                {cardsInfo.map(renderCards)}
            </div>
        </div >
    )
}

