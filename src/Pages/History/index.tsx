import DialogCustom from './Dialog';
import List from './List';

export default function History() {

    return (
        <div className='flex flex-col my-10 md:mx-4'>
            <div className='flex flex-col gap-2 md:flex-row md:items-end mb-10 px-4 md:px-0'>
                <div>
                    <h2 className='text-3xl font-bold text-gray-800 text-start'>Histórico</h2>
                    <span className='md:mx-0 text-neutral-400 text-xl'>Adicione aqui seus registros de investimentos e despesas para um melhor controle</span>
                </div>
                <DialogCustom />
            </div>
            <List />
        </div>
    )
}
