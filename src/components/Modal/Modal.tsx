import { PlusOutlined } from "@ant-design/icons";
import { Button, Modal as ModalAnt } from "antd";
import React from 'react';
import { twMerge } from "tailwind-merge";

interface ModalProps {
    content: React.ReactNode
    openModal: () => void
    closeModal: () => void
    isLoading?: boolean
    open?: boolean
    title?: string
    className?: string
}

export const Modal = ({ content, openModal, closeModal, open, className, isLoading }: ModalProps) => {

    return (
        <div className={twMerge('flex justify-end', className)}>
            <Button
                type="primary"
                loading={isLoading}
                icon={<PlusOutlined />}
                onClick={openModal}>
                Adicionar
            </Button>
            <ModalAnt open={open} onCancel={closeModal} footer={[]}>
                {content}
            </ModalAnt>
        </div>
    )
}
