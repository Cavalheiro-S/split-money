import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { XCircle } from 'phosphor-react'
import { FormEvent, useState } from 'react'
import { Button } from '../Components/Button'
import { Input } from '../Components/Input'
import { Table } from '../Components/Table'

interface TableProps {
    name: string,
    type: "Investimento" | "Despesa",
    value: number,
    date: string
}

export default function History() {

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [type, setType] = useState<"Investimento" | "Despesa">("Investimento")
    const [value, setValue] = useState("")
    const [date, setDate] = useState(new Date().toLocaleDateString("pt-br"))
    const [tableData, setTableData] = useState<TableProps[]>(
        [
            {
                name: "Teste",
                type: "Investimento",
                value: 100,
                date: new Date().toLocaleDateString("pt-br")
            }
        ]

    );


    const tableHeader = ["Nome", "Data", "Tipo", "Valor"]


    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const data: TableProps = {
            name,
            type,
            value: Number(value),
            date
        }
        setOpen(false);
        setTableData([...tableData, data])
        setName("")
        setType("Investimento")
        setValue("")
    }

    const renderRow = (row: TableProps) => {
        return (
            <tr className='border-b-2 border-b-neutral-200'>
                <td className='p-4 text-sm border-x-neutral-100 border-x-2'>{row.name}</td>
                <td className='p-4 text-sm border-x-2 text-neutral-500 w-1/6'>{row.date}</td>
                <td className='p-4 text-sm border-x-neutral-100 border-x-2 w-1/6'>
                    <span className={
                        clsx({
                            'text-green-800 bg-green-100 py-1 px-2 rounded font-bold': row.type === "Investimento",
                            'text-red-800 bg-red-100 py-1 px-2 rounded font-bold': row.type === "Despesa"
                        })
                    }>
                        {row.type}
                    </span>
                </td>
                <td className='p-4 text-sm border-x-neutral-100 border-x-2 font-bold'>R$ {row.value}</td>
            </tr>
        )
    }

    const renderTotal = () => {
        let total = 0;
        tableData.forEach(data => {
            if (data.type == "Investimento")
                total += data.value
            else
                total -= data.value
        })
        return (
            <td className={clsx('text-end py-4 pr-10', {
                "text-green-800": total > 0,
                "text-red-800": total < 0
            })} colSpan={2}>
                R$ {total}
            </td>
        );
    }

    return (
        <div className='flex flex-col my-10 mx-4'>
            <div className='flex flex-col gap-2 md:flex-row md:items-end mb-10'>
                <div>
                    <h2 className='text-3xl font-bold text-gray-800 text-start'>Histórico</h2>
                    <span className='md:mx-0 text-neutral-400 text-xl mb-10'>Adicione aqui seus registros de investimentos e despesas para um melhor controle</span>
                </div>

                <Dialog.Root open={open} onOpenChange={setOpen}>

                    <Dialog.Trigger className='md:ml-auto'>
                        <Button.Root className='w-full justify-center'>
                            <Button.Icon className='text-lg'/>
                            Adicionar
                        </Button.Root>
                    </Dialog.Trigger>
                    <Dialog.Portal >
                        <Dialog.Overlay className='inset-0 fixed bg-black bg-opacity-25'>
                            <Dialog.Content className='flex flex-col w-96 fixed top-1/4 left-[35%] bg-white rounded p-4 '>
                                <Dialog.DialogClose className='self-end rounded transition hover:text-primary-hover'>
                                    <XCircle className='text-xl' />
                                </Dialog.DialogClose>
                                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                                    <Dialog.DialogTitle className='text-md font-bold'>
                                        Novo Registro
                                    </Dialog.DialogTitle>
                                    <fieldset className='flex flex-col gap-2'>
                                        <label className="text-sm" htmlFor='name'>Nome</label>
                                        <Input.Root>
                                            <Input.Input id='name' value={name} onChange={event => setName(event.target.value)} placeholder='Ex: Ifood' />
                                        </Input.Root>
                                    </fieldset>
                                    <fieldset className='flex flex-col gap-2'>
                                        <label className="text-sm" htmlFor="value">Valor</label>
                                        <Input.Root>
                                            <Input.Addorn>R$</Input.Addorn>
                                            <Input.Input id='value' value={value} onChange={event => setValue(event.target.value)} type="number" placeholder='Valor' />
                                        </Input.Root>
                                    </fieldset>
                                    <fieldset className='flex flex-col gap-2'>
                                        <label className="text-sm" htmlFor='type'>Tipo</label>
                                        <select id='type' value={type} onChange={event => setType(event.target.value == "Investimento" ? "Investimento" : "Despesa")}>
                                            <option value="Investimento">Investimento</option>
                                            <option value="Despesa">Despesa</option>
                                        </select>
                                    </fieldset>
                                    <fieldset className='flex flex-col gap-2'>
                                        <label className="text-sm" htmlFor="date">Data</label>
                                        <Input.Root>
                                            <Input.Input id='date' type="date" placeholder='Valor' />
                                        </Input.Root>
                                    </fieldset>
                                    <Button.Root className='justify-center' type="submit">
                                        <Button.Icon className='text-xl' />
                                        Adicionar
                                    </Button.Root>
                                </form>

                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
            <Table className='w-full' headers={tableHeader}>
                {tableData.map(renderRow)}
                <tr className=''>
                    <td className='text-end py-4' colSpan={3}>
                        Total
                    </td>
                    {renderTotal()}
                </tr>
            </Table>
        </div>
    )
}
