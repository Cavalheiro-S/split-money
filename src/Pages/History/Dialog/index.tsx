import * as Dialog from '@radix-ui/react-dialog';
import moment from 'moment';
import { Trash, XCircle } from 'phosphor-react';
import { FormEvent, useContext } from 'react';
import { v4 as uuid } from 'uuid';
import { Button } from '../../../Components/Button';
import { Input } from '../../../Components/Input';
import { Select } from '../../../Components/Select';
import { HistoryContext, ItemProps } from '../../../Context/HistoryContext';


export default function DialogCustom() {

    const HistoryValue = useContext(HistoryContext);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (HistoryValue.id === "") {
            const data: ItemProps = {
                id: uuid(),
                name: HistoryValue.name,
                type: HistoryValue.type,
                value: Number(HistoryValue.value),
                date: HistoryValue.date
            }

            HistoryValue.setOpen(false);
            HistoryValue.setListItems([...HistoryValue.ListItems, data])
            HistoryValue.setName("")
            HistoryValue.setType("Investimento")
            HistoryValue.setValue("")
        }
        else {
            const data: ItemProps = {
                id: HistoryValue.id,
                name: HistoryValue.name,
                type: HistoryValue.type,
                value: Number(HistoryValue.value),
                date: HistoryValue.date
            }

            HistoryValue.setOpen(false);
            const newList = HistoryValue.ListItems.map(item => item.id === HistoryValue.id ? data : item)
            HistoryValue.setListItems(newList)
            HistoryValue.setName("")
            HistoryValue.setType("Investimento")
            HistoryValue.setValue("")
        }
    }

    const handleChangeDate = (event: FormEvent<HTMLInputElement>) => {
        const dateChanged = event.currentTarget.valueAsDate;
        HistoryValue.setDate(dateChanged ? dateChanged : new Date());
    }

    const handleOpen = () => {

        HistoryValue.setId("")
        HistoryValue.setName("")
        HistoryValue.setValue("")
        HistoryValue.setType("Investimento")
        HistoryValue.setDate(new Date())
        HistoryValue.setOpen(!HistoryValue.open)
        console.log(HistoryValue);

    }

    const handleDelete = (id: string) => {
        const newList = HistoryValue.ListItems.filter(item => item.id !== HistoryValue.id)
        HistoryValue.setListItems(newList)
        HistoryValue.setOpen(false)
    }

    const formatDate = (date: Date) => {
        return moment(date).add(1, "d").format("yyyy-MM-DD")
    }

    return (
        <Dialog.Root open={HistoryValue.open} onOpenChange={handleOpen}>
            <Dialog.Trigger className='md:ml-auto'>
                <Button.Root className='w-full justify-center'>
                    <Button.Icon className='text-lg' />
                    Adicionar
                </Button.Root>
            </Dialog.Trigger>
            <Dialog.Portal >
                <Dialog.Overlay className='inset-0 fixed bg-black bg-opacity-25'>
                    <Dialog.Content className='flex flex-col md:w-96 w-full  bg-white md:rounded p-4 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
                        <Dialog.DialogClose className='self-end rounded transition hover:text-primary-hover'>
                            <XCircle className='text-xl' />
                        </Dialog.DialogClose>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <Dialog.DialogTitle className='text-md font-bold'>

                                {HistoryValue.id === "" ? "Adicionar" : "Editar"} item
                            </Dialog.DialogTitle>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor='name'>Nome</label>
                                <Input.Root>
                                    <Input.Input id='name' value={HistoryValue.name} onChange={event => HistoryValue.setName(event.target.value)} placeholder='Ex: Ifood' />
                                </Input.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor="value">Valor</label>
                                <Input.Root>
                                    <Input.Addorn>R$</Input.Addorn>
                                    <Input.Input id='value' value={HistoryValue.value} onChange={event => HistoryValue.setValue(event.target.value)} type="number" placeholder='Valor' />
                                </Input.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor='type'>Tipo</label>
                                <Select.Root>
                                    <Select.Input id='type' value={HistoryValue.type} onChange={event => HistoryValue.setType(event.target.value == "Investimento" ? "Investimento" : "Despesa")}>
                                        <Select.Options value="Investimento">Investimento</Select.Options>
                                        <Select.Options value="Despesa">Despesa</Select.Options>
                                    </Select.Input>
                                </Select.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor="date">Data</label>
                                <Input.Root>
                                    <Input.Input id='date' value={formatDate(HistoryValue.date)} onChange={handleChangeDate} type="date" placeholder='Valor' />
                                </Input.Root>
                            </fieldset>
                            <div className='flex justify-between gap-3'>
                                <Button.Root
                                    onClick={event => handleDelete(HistoryValue.id)}
                                    disabled={HistoryValue.id != "" ? false : true}
                                    className='justify-center w-full bg-transparent border-2 border-primary text-primary hover:bg-white hover:text-primary-hover hover:border-primary-hover disabled:border-neutral-400 disabled:text-neutral-400 '>
                                    <Button.Icon className='text-xl'>
                                        <Trash />
                                    </Button.Icon>
                                    Remover
                                </Button.Root>
                                <Button.Root className='justify-center w-full' type="submit">
                                    <Button.Icon className='text-xl' />
                                    {HistoryValue.id === "" ? "Adicionar" : "Editar"}
                                </Button.Root>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
