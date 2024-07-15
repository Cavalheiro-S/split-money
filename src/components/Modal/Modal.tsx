import { Button, Modal as ModalAnt } from "antd";
import React from 'react';
import { twMerge } from "tailwind-merge";

interface ModalProps {
    content: React.ReactNode
    openModal: () => void
    closeModal: () => void
    open?: boolean
    trigger?: React.ReactNode
    title?: string
    className?: string
}

export const Modal = ({ content, openModal, closeModal, open, className }: ModalProps) => {

    return (
        <div className={twMerge('flex justify-end', className)}>
            <Button onClick={openModal}>
                Adicionar
            </Button>
            <ModalAnt open={open} onCancel={closeModal} footer={[]}>
                {content}
            </ModalAnt>
        </div>
    )
}
