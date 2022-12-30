import clsx from 'clsx';
import moment from 'moment';
import { Bank, CreditCard } from 'phosphor-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomComponentProps } from '..';
import { RegisterProps } from '../../Context/RegisterContext';
import { useRegister } from '../../Hooks/useRegister';
import { useWindowDimensions } from '../../Hooks/useWindowDimensions';
import { DialogOpenProps } from '../../Pages/Record';
import { Heading } from '../Heading';
import { Text } from '../Text';

interface TableProps extends CustomComponentProps {
    registersData?: RegisterProps[],
    title?: string,
    setDialogOpen?: React.Dispatch<React.SetStateAction<DialogOpenProps>>
}

export default function Table({ title, className, setDialogOpen, registersData }: TableProps) {

    const { registers } = useRegister();
    const { width } = useWindowDimensions();
    const navigate = useNavigate();''

    const renderTableData = () => {
        if (registersData) {
            return registersData.map((item) => {
                return renderList(item)
            })
        }
        return registers.map((item) => {
            return renderList(item)
        })
    }
    const renderTotal = () => {
        const registersValue = registersData ?? registers;
        let total = registersValue.reduce((acumulator, item) => {
            if (item.type === "investiment") {
                return acumulator + Number(item.value);
            } else {
                return acumulator - Number(item.value);
            }
        }, 0);
        if (total < 0) {
            total = total * -1;
            return <Text className='text-red-800' size='lg'>- R$ {total.toFixed(2)}</Text>;
        }
        return <Text className='text-green-800'>R$ {total.toFixed(2)}</Text>
    }

    const renderList = (item: RegisterProps) => {

        return (
            <tr
                key={item.id}
                onClick={() => {
                    if (setDialogOpen) {
                        navigate("/record")
                        setDialogOpen({ open: true, register: item });
                        console.log(setDialogOpen);

                    }

                }}
                className='flex items-center justify-between gap-10 transition hover:bg-gray-100 p-2 border-y border-collapse'>
                <td className='flex gap-5 items-center'>
                    <div className={
                        clsx('flex rounded-full w-10 h-10 items-center justify-center',
                            {
                                "bg-green-100": item.type === "investiment",
                                "bg-red-100": item.type === "expense"
                            }
                        )}>
                        {item.type == "investiment" ?
                            <Bank className='text-green-800 h-6 w-6' size={24} /> :
                            <CreditCard className='text-red-800 h-6 w-6' size={24} />}
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Text>{item.name}</Text>
                        <Text className='text-neutral-500'>{moment(item.date ?? new Date()).format("DD/MM/YYYY")}</Text>
                    </div>
                </td>
                <td>
                    <Text size={width > 768 ? "lg" : "md"} className={
                        clsx("",
                            {
                                "text-green-800": item.type === "investiment",
                                "text-red-800": item.type === "expense"
                            }
                        )}>
                        {item.type == "investiment" ? "+\t" : "-\t"}
                        R$ {Number(item.value).toFixed(2)}
                    </Text>
                </td>
            </tr>
        )
    }
    return (
        <table className={clsx('border-collapse', className)}>
            <thead>
                <tr>
                    <th className='flex-1 p-2 text-left text-lg'>
                        <Heading size='sm'>{title}</Heading>
                    </th>
                </tr>
            </thead>
            <tbody>
                {registers.length > 0 ? renderTableData() : (
                    <tr className='flex justify-between border-b-2'>
                        <td className='flex-1 p-2 text-center'>
                            <Text size='lg'>Nenhum registro encontrado</Text>
                        </td>
                    </tr>)}
                <tr className='flex justify-between border-b-2'>
                    <td className='flex-1 p-2 text-center text-lg'>
                        <Text size='lg'>Total</Text>
                    </td>
                    <td className='p-2 '>
                        {renderTotal()}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
