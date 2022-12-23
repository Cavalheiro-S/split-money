import * as Dialog from '@radix-ui/react-dialog';
import moment from 'moment';
import { Trash, XCircle } from 'phosphor-react';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button } from '../../../Components/Button';
import { Input } from '../../../Components/Input';
import { Select } from '../../../Components/Select';
import { HistoryContext, ItemProps } from '../../../Context/HistoryContext';
import { useAuth } from '../../../hooks/useAuth';
import { RegisterProps, useDatabase } from '../../../hooks/useDatabase';

interface Inputs {
    name: string,
    type: "investiment" | "expense",
    value: number,
    date: Date
}

export default function DialogCustom() {

    const HistoryValue = useContext(HistoryContext);
    const { currentUser, signOut } = useAuth();
    const { saveRegister, loadRegister } = useDatabase();
    const { register, formState: { }, handleSubmit } = useForm<Inputs>()
    const [dialogOpen, setDialogOpen] = useState(false);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!currentUser) {
            signOut();
            return;
        }
        const newItem: RegisterProps = {
            uid: currentUser.uid,
            name: data.name,
            type: data.type,
            value: data.value,
            date: data.date
        }
        console.log(newItem);
        await saveRegister(currentUser.uid, newItem);
    }

    useEffect(() => {
        const loadInfo = async () => {
            if (!currentUser) {
                signOut();
                return;
            }
            const register = await loadRegister(currentUser.uid);
            console.log(register);
        }
        loadInfo();
    }, [])

    return (
        <Dialog.Root open={dialogOpen}>
            <Dialog.Trigger className='md:ml-auto z-10' asChild>
                <Button.Root className='justify-center' onClick={() => setDialogOpen(true)}>
                    <Button.Icon className='text-lg' />
                    Adicionar
                </Button.Root>
            </Dialog.Trigger>
            <Dialog.Portal >
                <Dialog.Overlay className='inset-0 fixed bg-black bg-opacity-25'>
                    <Dialog.Content className='flex flex-col md:w-96 w-full  bg-white md:rounded p-4 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
                        <Dialog.DialogClose onClick={() => setDialogOpen(false)} className='self-end rounded transition hover:text-primary-hover'>
                            <XCircle className='text-xl' />
                        </Dialog.DialogClose>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <Dialog.DialogTitle className='text-md font-bold'>
                                {HistoryValue.id === "" ? "Adicionar" : "Editar"} item
                            </Dialog.DialogTitle>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor='name'>Nome</label>
                                <Input.Root>
                                    <Input.Input id='name' {...register("name")} placeholder='Ex: Ifood' />
                                </Input.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor="value">Valor</label>
                                <Input.Root>
                                    <Input.Addorn>R$</Input.Addorn>
                                    <Input.Input id='value' {...register("value")} min={0} type="number" placeholder='Valor' />
                                </Input.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor='type'>Tipo</label>
                                <Select.Root>
                                    <Select.Input defaultValue="investiment" id='type' {...register("type")}>
                                        <Select.Options value="Investimento">Investimento</Select.Options>
                                        <Select.Options value="Despesa">Despesa</Select.Options>
                                    </Select.Input>
                                </Select.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor="date">Data</label>
                                <Input.Root>
                                    <Input.Input id='date' {...register("date")} type="date" placeholder='Valor' />
                                </Input.Root>
                            </fieldset>
                            <div className='flex justify-between gap-3'>
                                <Button.Root
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
