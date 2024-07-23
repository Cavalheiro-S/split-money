import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal as ModalAnt } from "antd";
import React from 'react';
import { twMerge } from "tailwind-merge";

interface ModalProps {
    content: React.ReactNode
    openModal: () => void
    closeModal: () => void
    open?: boolean
    title?: string
    className?: string
}

export const Modal = ({ content, openModal, closeModal, open, className }: ModalProps) => {

    return (
        <div className={twMerge('flex justify-end', className)}>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openModal}>
                Adicionar
            </Button>
            <ModalAnt open={open} onClose={closeModal} onCancel={closeModal} footer={[]}>
                {content}
            </ModalAnt>
        </div>
    )
}
