import { DialogTitle } from '@radix-ui/react-dialog';
import { Trash } from 'phosphor-react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { DialogOpenProps } from '../..';
import { Button } from '../../../../Components/Button';
import { RegisterProps } from '../../../../Context/RegisterContext';
import { useAuth } from '../../../../Hooks/useAuth';
import { useRegister } from '../../../../Hooks/useRegister';
import { Input } from '../../../../Components/Input';
import { Select } from '../../../../Components/Select';

interface Inputs {
    name: string,
    type: "investiment" | "expense",
    value: number,
    date: Date
}

interface FormProps {
    dialogOpen: DialogOpenProps,
    setDialogOpen: React.Dispatch<React.SetStateAction<DialogOpenProps>>
}

export const Form = ({ dialogOpen, setDialogOpen }: FormProps) => {

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Inputs>()
    const { currentUser, signOut } = useAuth();
    const { firestore: { saveRegister, deleteRegister, updateRegister, get } } = useRegister();

    const cleanStateForms = () => {
        setValue("name", "");
        setValue("type", "investiment");
        setValue("value", 0);
        setValue("date", new Date());
    }

    useEffect(() => {
        if (dialogOpen.register) {
            setValue("name", dialogOpen.register.name);
            setValue("type", dialogOpen.register.type as "investiment" | "expense");
            setValue("value", dialogOpen.register.value);
            setValue("date", dialogOpen.register.date);
            return;
        }
        cleanStateForms();

    }, [dialogOpen.register])


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            if (!currentUser) {
                await signOut();
                return;
            }

            const registerValues = {
                ...data,
                name: data.name.trim(),
                userId: currentUser?.uid as string,
                value: Number(data.value),
            } as RegisterProps;

            dialogOpen.register?.id ? await handleUpdate(registerValues) : await handleSave(registerValues);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setDialogOpen({ open: false });
        }
    }

    const handleUpdate = async (registerValues: RegisterProps) => {
        try {
            if (dialogOpen.register?.id) {
                registerValues.id = dialogOpen.register.id;
                await updateRegister(registerValues)
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleSave = async (registerValues: RegisterProps) => {
        try {
            registerValues.id = uuid();
            await saveRegister(registerValues)
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async () => {
        try {
            if (!currentUser) {
                signOut();
                return;
            }
            dialogOpen.register?.id && await deleteRegister(dialogOpen.register.id)
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
        if (dialogOpen.register?.name !== watch("name") ||
            dialogOpen.register?.value !== watch("value") ||
            dialogOpen.register?.type !== watch("type") ||
            dialogOpen.register?.date !== watch("date"))
            return false;
        return true;
    }

    const renderActionButtons = () => {
        if (dialogOpen.register?.id) {
            const editButtonActive = verifyIsEditing();
            return (
                <>
                    <Button.Root styleType='secondary' className='w-full' onClick={() => handleDelete()} type='button'>
                        <Button.Icon className='text-xl'>
                            <Trash />
                        </Button.Icon>
                        Remover
                    </Button.Root>
                    <Button.Root disabled={editButtonActive} className='justify-center w-full' type="submit">
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
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <DialogTitle className='text-md font-bold'>
                {dialogOpen.register?.id ? 'Editar registro' : 'Adicionar registro'}
            </DialogTitle>
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
                    <Input.Input id='value' {...register("value", { required: true, maxLength: 12 })} type={"number"} placeholder='0' />
                </Input.Root>
                {errors.value?.type === 'required' && <span className='text-xs text-red-500'>Campo obrigatório</span>}
                {errors.value?.type === 'min' && <span className='text-xs text-red-500'>Valor mínimo: R$ 0,01</span>}
                {errors.value?.type === 'maxLength' && <span className='text-xs text-red-500'>Valor máximo: R$ 999.999.999,99</span>}
            </fieldset>
            <fieldset className='flex flex-col gap-2'>
                <label className="text-sm" htmlFor='type'>Tipo</label>
                <Select.Root>
                    <Select.Input defaultValue="investiment" id='type' {...register("type", { required: true })}>
                        <Select.Options value="investiment">Investimento</Select.Options>
                        <Select.Options value="expense">Despesa</Select.Options>
                    </Select.Input>
                </Select.Root>
                {errors.type?.type === 'required' && <span className='text-xs text-red-500'>Campo obrigatório</span>}
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
    )
}