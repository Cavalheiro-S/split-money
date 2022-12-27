import * as Dialog from '@radix-ui/react-dialog';
import moment from 'moment';
import { Trash, XCircle } from 'phosphor-react';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button } from '../../../Components/Button';
import { Input } from '../../../Components/Input';
import { Select } from '../../../Components/Select';
import { RegisterContext, RegisterProps } from '../../../Context/RegisterContext';
import { useAuth } from '../../../hooks/useAuth';
import { useDatabase } from '../../../hooks/useDatabase';
import { convertToMoneyValues, replaceCommaInDot } from '../../../Utils/util';

interface Inputs {
    name: string,
    type: "investiment" | "expense",
    value: number,
    date: Date
}

export default function DialogCustom() {

    const { registers, setRegisters, dialogOpen, setDialogOpen } = useContext(RegisterContext);
    const { currentUser, signOut } = useAuth();
    const { saveRegister, deleteRegister, loadAllRegisters, updateRegister } = useDatabase();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<Inputs>()


    const cleanStateForms = () => {
        setValue("name", "");
        setValue("type", "investiment");
        setValue("value", 0);
        setValue("date", new Date());
    }

    useEffect(() => {
        if (dialogOpen.register) {
            setValue("name", dialogOpen.register.name);
            setValue("type", dialogOpen.register.type);
            setValue("value", dialogOpen.register.value);
            setValue("date", dialogOpen.register.date);
            return;
        }
        cleanStateForms();

    }, [dialogOpen.register, setValue])

    const formatValues = (data: Inputs) => {
        const { value } = data;
        const valueFormated = convertToMoneyValues(value.toString());

        return {
            ...data,
            id: uuid(),
            value: valueFormated
        } as RegisterProps
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (!currentUser) {
                signOut();
                return;
            }

            const formatedValues = formatValues(data);

            if (dialogOpen.register?.id) {
                await updateRegister(currentUser.uid, dialogOpen.register.id, formatedValues);
                const loadedRegisters = await loadAllRegisters(currentUser.uid);
                setRegisters(loadedRegisters);
                return
            }

            await saveRegister(currentUser.uid, formatedValues);
            setRegisters([...registers, formatedValues]);

        }
        catch (error) {
            console.log(error);
        }
        finally {
            setDialogOpen({ open: false });
        }
    }

    const handleDelete = async () => {
        try {
            if (!currentUser) {
                signOut();
                return;
            }
            if (dialogOpen.register?.id) {
                await deleteRegister(currentUser.uid, dialogOpen.register.id);
                const loadedRegisters = await loadAllRegisters(currentUser.uid);
                setRegisters(loadedRegisters);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setDialogOpen({ open: false });
            cleanStateForms();
        }
    }

    const verifyIsEditing = () => {
        if (dialogOpen.register?.name !== getValues("name")) return true
        if (dialogOpen.register?.value !== getValues("value")) return true
        if (dialogOpen.register?.type !== getValues("type")) return true
        if (dialogOpen.register?.date !== getValues("date")) return true
    }

    const renderActionButtons = () => {
        if (dialogOpen.register?.id) {
            const editButtonDisabled = verifyIsEditing();
            return (
                <>
                    <Button.Root styleType='secondary' className='w-full' onClick={() => handleDelete()} type='button'>
                        <Button.Icon className='text-xl'>
                            <Trash />
                        </Button.Icon>
                        Remover
                    </Button.Root>
                    <Button.Root disabled={!editButtonDisabled} className='justify-center w-full' type="submit">
                        <Button.Icon className='text-xl' />
                        Editar
                    </Button.Root>
                </>
            )
        }
        return (
            <Button.Root className='justify-center w-full' type="submit">
                <Button.Icon className='text-xl' />
                Adicionar
            </Button.Root >
        )
    }

    return (
        <Dialog.Root open={dialogOpen.open}>
            <Dialog.Trigger className='md:ml-auto' asChild>
                <Button.Root className='justify-center' onClick={() => setDialogOpen({ open: true, register: {} as RegisterProps })}>
                    <Button.Icon className='text-lg' />
                    Adicionar
                </Button.Root>
            </Dialog.Trigger>
            <Dialog.Portal >
                <Dialog.Overlay className='inset-0 fixed bg-black bg-opacity-25'>
                    <Dialog.Content className='flex flex-col md:w-96 w-full  bg-white md:rounded p-4 fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]'>
                        <Dialog.DialogClose onClick={() => setDialogOpen({ open: false })} className='self-end rounded transition hover:text-primary-hover'>
                            <XCircle className='text-xl' />
                        </Dialog.DialogClose>
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                            <Dialog.DialogTitle className='text-md font-bold'>
                                {dialogOpen.register?.id ? 'Editar registro' : 'Adicionar registro'}
                            </Dialog.DialogTitle>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor='name'>Nome</label>
                                <Input.Root>
                                    <Input.Input id='name' {...register("name", { required: true })} placeholder='Ex: Ifood' />
                                </Input.Root>
                                {errors.name && <span className='text-xs text-red-500'>Campo obrigatório</span>}
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor="value">Valor</label>
                                <Input.Root>
                                    <Input.Addorn>R$</Input.Addorn>
                                    <Input.Input id='value' {...register("value", { required: true })} type={"number"} step="any" placeholder='0' />
                                </Input.Root>
                                {errors.value && <span className='text-xs text-red-500'>Campo obrigatório</span>}
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor='type'>Tipo</label>
                                <Select.Root>
                                    <Select.Input defaultValue="investiment" id='type' {...register("type")}>
                                        <Select.Options value="investiment">Investimento</Select.Options>
                                        <Select.Options value="expense">Despesa</Select.Options>
                                    </Select.Input>
                                </Select.Root>
                            </fieldset>
                            <fieldset className='flex flex-col gap-2'>
                                <label className="text-sm" htmlFor="date">Data</label>
                                <Input.Root>
                                    <Input.Input id='date' {...register("date", { required: true, })} type="date" placeholder='Valor' />
                                </Input.Root>
                                {errors.date && <span className='text-xs text-red-500'>Campo obrigatório</span>}
                            </fieldset>
                            <div className='flex justify-between gap-3'>
                                {renderActionButtons()}

                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
