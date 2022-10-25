import * as HoverCard from "@radix-ui/react-hover-card"
import * as Select from '@radix-ui/react-select';
import * as Accordion from '@radix-ui/react-accordion';
import { Bank, Book, CreditCard, Sunglasses } from 'phosphor-react';
import { ChangeEvent, FormEvent, KeyboardEvent, ReactNode, useState } from 'react';
import { Card } from '../Components/Card';
import { NumberInput, NumberInputAddorn } from '../Components/NumberInput';
import clsx from "clsx";

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

    const [rendaMensal, setRendaMensal] = useState<number | string>("");

    const [investimentosValor, setInvestimentosValor] = useState(0);
    const [despEssenciaisValor, setDespEssenciaisValor] = useState(0);
    const [lazerValor, setLazerValor] = useState(0);
    const [educacaoValor, setEducacaoValor] = useState(0);


    const cardsInfo: CardValueProps[] = [
        {
            value: "R$ " + investimentosValor.toFixed(2),
            name: "Investimentos",
            iconBGColor: "green",
            icon: <Bank />,
            description: "Dinheiro alocado em renda fixa , renda variável , ou guardado em bancos digitais."
        },
        {
            value: "R$ " + despEssenciaisValor.toFixed(2),
            name: "Despesas Essenciais",
            iconBGColor: "red",
            icon: <CreditCard />,
            description: "Dinheiro necessário para despesas que não podem ser substituídas ou cortadas."
        },
        {
            value: "R$ " + lazerValor.toFixed(2),
            name: "Lazer",
            iconBGColor: "blue",
            icon: <Sunglasses />,
            description: "Quantia reservada para gastos relacionados a diversão."
        },
        {
            value: "R$ " + educacaoValor.toFixed(2),
            name: "Educação",
            iconBGColor: "yellow",
            icon: <Book />,
            description: "Destinado a compra de cursos, livros, palestras e outras coisas relacionadas a desenvolvimento pessoal."
        },
    ]

    const handleClick = (event: FormEvent) => {
        event.preventDefault();
        calcularPorcentagens();
    }

    const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter")
            calcularPorcentagens();
    }

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const fieldValue = event.target.value;
        const regexText = new RegExp(/[A-z;.,<./?]+/g);
        if (!regexText.test(fieldValue))
            setRendaMensal(Number(fieldValue));
        else
            return;
    }

    const calcularPorcentagens = () => {
        const PORCENTAGEM_INVESTIMENTOS = 0.30;
        const PORCENTAGEM_DESPESAS_ESSENCIAIS = 0.55;
        const PORCENTAGEM_LAZER = 0.10;
        const PORCENTAGEM_EDUCACAO = 0.05;

        setInvestimentosValor(Number(rendaMensal) * PORCENTAGEM_INVESTIMENTOS);
        setDespEssenciaisValor(Number(rendaMensal) * PORCENTAGEM_DESPESAS_ESSENCIAIS);
        setLazerValor(Number(rendaMensal) * PORCENTAGEM_LAZER);
        setEducacaoValor(Number(rendaMensal) * PORCENTAGEM_EDUCACAO);
    }

    const renderCards = (card: CardValueProps) => {
        return (
            <Accordion.Root type="multiple" className="w-full md:w-72">
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
        <div className={clsx('my-10 mx-4 flex flex-col xl:w-3/6', className)}>
            <h2 className=' md:mx-0 font-bold text-3xl text-neutral-800'>Divida sua renda mensal</h2>
            <h3 className=' md:mx-0 text-neutral-400 text-xl mb-10'>Equilibre sua renda entre investimentos, educação, despesas essenciais e lazer</h3>
            <div className="flex flex-col md:flex md:flex-row md:items-end gap-4">
                <div className='flex flex-col  md:m-0'>
                    <label className="mb-2" htmlFor="renda">Renda Mensal:</label>
                    <NumberInput.Root>
                        <NumberInputAddorn>R$</NumberInputAddorn>
                        <NumberInput.Input onKeyDown={event => handleEnterKeyDown(event)} step="5" value={rendaMensal} onChange={event => handleChangeInput(event)} id='renda' placeholder='Digite sua renda mensal' />
                    </NumberInput.Root >
                </div>
                <button onClick={evento => handleClick(evento)} className='bg-primary font-bold md:w:fit px-3 py-1 h-10 text-white rounded hover:bg-primary-hover transition'>Calcular</button>
            </div>
            <div className='flex gap-4 pt-4 flex-wrap md:mx-0'>
                {cardsInfo.map(renderCards)}
            </div>

        </div >
    )
}
