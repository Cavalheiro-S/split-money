import * as Accordion from '@radix-ui/react-accordion';
import clsx from "clsx";
import { Bank, Book, Calculator, CreditCard, Sunglasses } from 'phosphor-react';
import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode, useState } from 'react';
import { Button } from "../../Components/Button";
import { Card } from '../../Components/Card';
import { Input } from '../../Components/Input';
import { v4 as uuid } from 'uuid';
interface MonthRevenueProps {
    className?: string
}

interface CardValueProps {
    value: string,
    name: string,
    iconBGColor?: "yellow" | "green" | "red" | "blue",
    icon?: ReactNode,
    description: string,
}

export default function MonthRevenue({ className }: MonthRevenueProps) {

    const [revenue, setRevenue] = useState<number | string>("");
    const [investimentsValue, setInvestimentsValue] = useState(0);
    const [expensesValue, setExpensesValue] = useState(0);
    const [leisureValue, setLeisureValue] = useState(0);
    const [educationValue, setEducationValue] = useState(0);


    const cardsInfo: CardValueProps[] = [
        {
            value: "R$ " + investimentsValue.toFixed(2),
            name: "Investimentos",
            iconBGColor: "green",
            icon: <Bank />,
            description: "Dinheiro alocado em renda fixa , renda variável , ou guardado em bancos digitais."
        },
        {
            value: "R$ " + expensesValue.toFixed(2),
            name: "Despesas Essenciais",
            iconBGColor: "red",
            icon: <CreditCard />,
            description: "Dinheiro necessário para despesas que não podem ser substituídas ou cortadas."
        },
        {
            value: "R$ " + leisureValue.toFixed(2),
            name: "Lazer",
            iconBGColor: "blue",
            icon: <Sunglasses />,
            description: "Quantia reservada para gastos relacionados a diversão."
        },
        {
            value: "R$ " + educationValue.toFixed(2),
            name: "Educação",
            iconBGColor: "yellow",
            icon: <Book />,
            description: "Destinado a compra de cursos, livros, palestras e outras coisas relacionadas a desenvolvimento pessoal."
        },
    ]

    const handleClick = (event: FormEvent) => {
        console.log("teste");
        calculatePercentage();
    }

    const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter")
            calculatePercentage();
    }

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const fieldValue = event.target.value;
        const regexText = new RegExp(/[A-z;.,<./?]+/g);
        if (!regexText.test(fieldValue))
            setRevenue(Number(fieldValue));
        else
            return;
    }

    const calculatePercentage = () => {
        const INVESTIMENTS_PERCENTAGE = 0.30;
        const ESSENTIALS_EXPENSES_PERCENTAGE = 0.55;
        const LEISURE_PERCENTAGE = 0.10;
        const EDUCATION_PERCENTAGE = 0.05;

        setInvestimentsValue(Number(revenue) * INVESTIMENTS_PERCENTAGE);
        setExpensesValue(Number(revenue) * ESSENTIALS_EXPENSES_PERCENTAGE);
        setLeisureValue(Number(revenue) * LEISURE_PERCENTAGE);
        setEducationValue(Number(revenue) * EDUCATION_PERCENTAGE);
    }

    const renderCards = (card: CardValueProps) => {
        return (
            <Accordion.Root key={uuid()} type="multiple" className="w-full md:w-72">
                <Accordion.Item value="item-1">
                    <Accordion.Header>
                        <Accordion.Trigger className="w-full">
                            <Card.Root className='hover:shadow-md transition' title={card.value} subTitle={card.name}>
                                <Card.Icon IconBGColor={card.iconBGColor} icon={card.icon} />
                            </Card.Root>
                        </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="border-x-2 border-b-2 p-4 md:h-40">
                        <h3 className="font-bold text-neutral-700">Descrição</h3>
                        {card.description}
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>

        )
    }
    return (
        <div className={clsx('my-10 mx-4 md:mx-0 flex flex-col', className)}>
            <h2 className=' md:mx-0 font-bold text-3xl text-neutral-800'>Divida sua renda mensal</h2>
            <h3 className=' md:mx-0 text-neutral-400 text-xl mb-10'>Equilibre sua renda entre investimentos, educação, despesas essenciais e lazer</h3>
            <div className="flex flex-col md:flex md:flex-row md:items-end gap-4">
                <div className='flex flex-col md:m-0'>
                    <label className="mb-2" htmlFor="renda">Renda Mensal:</label>
                    <Input.Root>
                        <Input.Addorn>R$</Input.Addorn>
                        <Input.Input onKeyDown={event => handleEnterKeyDown(event)} step="5" value={revenue} onChange={event => handleChangeInput(event)} id='renda' placeholder='Digite sua renda mensal' />
                    </Input.Root >
                </div>
                <Button.Root className='justify-center' onClick={event => handleClick(event)}>
                    <Button.Icon className='text-xl'>
                        <Calculator />
                    </Button.Icon>
                    Calcular
                </Button.Root>
            </div>
            <div className='flex gap-4 pt-4 flex-wrap md:mx-0'>
                {cardsInfo.map(renderCards)}
            </div>
        </div >
    )
}

