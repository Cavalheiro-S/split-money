import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { X } from "phosphor-react";
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
        <>
            <Button.Root className='md:ml-auto justify-center' onClick={() => setDialogOpen({ open: true, register: {} as RegisterProps })}>
                <Button.Icon className='text-lg' />
                Adicionar
            </Button.Root>
            <Dialog maxWidth={"xl"} open={dialogOpen.open} onClose={() => setDialogOpen({ open: false })}>
                <DialogTitle className='text-md font-bold'>
                    <IconButton
                        aria-label="close"
                        onClick={() => setDialogOpen({ open: false })}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <X className="hover:text-primary"/>
                    </IconButton>
                    {dialogOpen.register?.id ? 'Editar registro' : 'Adicionar registro'}
                </DialogTitle>
                <DialogContent>
                    <Form dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
                </DialogContent>
            </Dialog>
        </>
    )
}
