import { useState } from 'react';
import { Heading } from '../../Components/Heading';
import Table from '../../Components/Table';
import { Text } from '../../Components/Text';
import { RegisterProps } from '../../Context/RegisterContext';
import DialogCustom from './Dialog';

export interface DialogOpenProps {
    open: boolean;
    register?: RegisterProps;
}

export default function Register() {
    const [dialogOpen, setDialogOpen] = useState({ open: false } as DialogOpenProps);
    return (
        <div className='flex flex-col'>
            <div className='flex flex-col gap-2 md:flex-row md:items-end mb-10 md:px-0'>
                <div>
                    <Heading size='lg' className='text-start'>Registros</Heading>
                    <Text size='lg' className='md:mx-0 text-neutral-400'>Adicione aqui seus registros de investimentos e despesas para um melhor controle</Text>
                </div>
                <DialogCustom dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
            </div>
            <Table setDialogOpen={setDialogOpen} className='max-h-screen' />

        </div>
    )
}
