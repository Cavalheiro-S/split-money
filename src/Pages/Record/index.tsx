import { useContext, useEffect } from 'react';
import { Heading } from '../../Components/Heading';
import { Text } from '../../Components/Text';
import { RegisterContext } from '../../Context/RegisterContext';
import { useAuth } from '../../hooks/useAuth';
import { useDatabase } from '../../hooks/useDatabase';
import DialogCustom from './Dialog';
import Table from './Table';

export default function Register() {

    const { loadAllRegisters } = useDatabase();
    const { currentUser, signOut } = useAuth();
    const { registers, setRegisters } = useContext(RegisterContext);

    useEffect(() => {
        const load = async () => {
            if (!currentUser) {
                signOut();
                return;
            }
            const registersDatabase = await loadAllRegisters(currentUser.uid);
            setRegisters(registersDatabase);
            
        }
        load();
    }, [])

    return (
        <div className='flex flex-col'>
            <div className='flex flex-col gap-2 md:flex-row md:items-end mb-10 md:px-0'>
                <div>
                    <Heading size='lg' className='text-start'>Registros</Heading>
                    <Text size='lg' className='md:mx-0 text-neutral-400'>Adicione aqui seus registros de investimentos e despesas para um melhor controle</Text>
                </div>
                <DialogCustom />
            </div>
            <Table />
        </div>
    )
}
