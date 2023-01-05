import * as Dialog from '@radix-ui/react-dialog';
import { XCircle } from 'phosphor-react';
import { DialogOpenProps } from '..';
import { Button } from '../../../Components/Button';
import { RegisterProps } from '../../../Context/RegisterContext';
import { Form } from './Form';

interface DialogCustomProps {
    dialogOpen: DialogOpenProps,
    setDialogOpen: React.Dispatch<React.SetStateAction<DialogOpenProps>>
}
export default function DialogCustom({ dialogOpen, setDialogOpen }: DialogCustomProps) {

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
                        <Form dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
