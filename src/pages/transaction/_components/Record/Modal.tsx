import { Modal } from '@/components/Modal/Modal'
import { Button } from 'antd'
import { useState } from 'react'
import { RecordForm } from './Form'

export const RecordModal = () => {
    const [open, setOpen] = useState(false)

    return (
        <Modal
            closeModal={() => setOpen(false)}
            openModal={() => setOpen(true)}
            open={open}
            trigger={<Button>Adicionar</Button>}
            content={<RecordForm setOpen={setOpen} />}
        />)
}
