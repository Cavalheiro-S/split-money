import { Button, Modal as ModalAnt } from "antd";
import React from 'react';

interface ModalProps {
    content: React.ReactNode
    openModal: () => void
    closeModal: () => void
    open?: boolean
    trigger?: React.ReactNode
    title?: string
}

export const Modal = ({ content, openModal, closeModal, open }: ModalProps) => {

    return (
        <div className='flex justify-end'>
            <Button onClick={openModal}>
                Adicionar
            </Button>
            <ModalAnt open={open} onCancel={closeModal} footer={[]}>
                {content}
            </ModalAnt>
        </div>
    )
}
