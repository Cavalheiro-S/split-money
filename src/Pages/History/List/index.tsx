import clsx from 'clsx';
import { Bank, CreditCard } from 'phosphor-react';
import { useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { HistoryContext, ItemProps } from '../../../Context/HistoryContext';

export default function List() {

    const HistoryValue = useContext(HistoryContext);

    const renderTotal = () => {
        let total = 0;

        HistoryValue.ListItems.forEach(item => {
            if (item.type == "Investimento")
                total += item.value
            else
                total -= item.value
        })
        const isPositive = total > 0 ? true : false;
        return (
            <>
                <td className='flex-1 text-end p-2 items-center text-lg'>
                    Total
                </td>
                <td className={clsx('flex-1 font-bold p-2 text-end items-center text-lg', {
                    "text-green-800": isPositive,
                    "text-red-800": !isPositive
                })}>
                    R$ {total}
                </td>
            </>
        );
    }

    const fillDialog = (item: ItemProps) => {
        HistoryValue.setOpen(true)
        HistoryValue.setId(item.id)
        HistoryValue.setName(item.name);
        HistoryValue.setType(item.type);
        HistoryValue.setValue(item.value.toString());
        HistoryValue.setDate(item.date);
    }

    const renderList = (item: ItemProps) => {
        return (
            <tr
                onClick={() => fillDialog(item)}
                key={uuid()}
                className='flex items-center justify-between gap-10 transition hover:bg-gray-100 p-2 border-y border-collapse'>
                <td className='flex gap-5 items-center'>
                    <div className={
                        clsx('flex rounded-full w-10 h-10 items-center justify-center',
                            {
                                "bg-green-100": item.type === "Investimento",
                                "bg-red-100": item.type === "Despesa"
                            }
                        )}>
                        {item.type == "Investimento" ?
                            <Bank className='text-green-800 h-6 w-6' size={24} /> :
                            <CreditCard className='text-red-800 h-6 w-6' size={24} />}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span>{item.name}</span>
                        <span className='text-neutral-500 text-sm'>{item.date.toLocaleDateString("pt-BR")}</span>
                    </div>
                </td>
                <td className={
                    clsx('text-neutral-800 font-semibold text-lg',
                        {
                            "text-green-800": item.type === "Investimento",
                            "text-red-800": item.type === "Despesa"
                        }
                    )}>{item.type == "Investimento" ? "+" : "-"} R$ {item.value}</td>
            </tr>
        )
    }
    return (
        <table className='border-collapse max-h-screen'>
            <thead>
                <tr>
                    <th className='flex-1 p-2 text-left text-lg'>Últimos registros</th>
                </tr>
            </thead>
            <tbody>
                {HistoryValue.ListItems.map(renderList)}
                <tr className='flex justify-between border-b-2'>{renderTotal()}</tr>
            </tbody>
        </table>
    )
}
