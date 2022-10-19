
import { Bank, Book, CreditCard, Sunglasses } from 'phosphor-react';
import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react';
import { Card } from '../Components/Card';
import { NumberInput, NumberInputAddorn } from '../Components/NumberInput';

export default function MonthRevenue() {

    const [rendaMensal, setRendaMensal] = useState<number | string>("");

    const [investimentosValor, setInvestimentosValor] = useState(0);
    const [despEssenciaisValor, setDespEssenciaisValor] = useState(0);
    const [lazerValor, setLazerValor] = useState(0);
    const [educacaoValor, setEducacaoValor] = useState(0);

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
    return (
        <div className='my-10 mx-[100px] flex flex-col'>
            <div className="flex items-end gap-4">
                <div className='flex flex-col'>
                    <label className="mb-2" htmlFor="renda">Renda Mensal:</label>
                    <NumberInput.Root>
                        <NumberInputAddorn>R$</NumberInputAddorn>
                        <NumberInput.Input onKeyDown={event => handleEnterKeyDown(event)} step="5" value={rendaMensal} onChange={event => handleChangeInput(event)} id='renda' placeholder='Digite sua renda mensal' />
                    </NumberInput.Root >
                </div>
                <button onClick={evento => handleClick(evento)} className='bg-primary font-bold px-3 py-1 h-10 text-white rounded hover:bg-primary-hover transition'>Calcular</button>
            </div>
            <div className='flex gap-4 my-4'>
                <Card.Root title={`R$ ${investimentosValor.toFixed(2)}`} subTitle="Investimentos">
                    <Card.Icon IconBGColor="green" icon={<Bank />} />
                </Card.Root>
                <Card.Root title={`R$ ${educacaoValor.toFixed(2)}`} subTitle="Educação">
                    <Card.Icon IconBGColor="yellow" icon={<Book />} />
                </Card.Root>
                <Card.Root title={`R$ ${despEssenciaisValor.toFixed(2)}`} subTitle="Despesas Essencias">
                    <Card.Icon IconBGColor="red" icon={<CreditCard />} />
                </Card.Root>
                <Card.Root title={`R$ ${lazerValor.toFixed(2)}`} subTitle="Lazer">
                    <Card.Icon IconBGColor="blue" icon={<Sunglasses />} />
                </Card.Root>
            </div>

        </div>
    )
}
