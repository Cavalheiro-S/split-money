import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import { CheckCircle, X, XCircle } from 'phosphor-react';
import { useState } from 'react';

export interface NotificationProps {
    title: string;
    message: string;
    type: "success" | "error";
}

export const Notification = ({ message, title, type }: NotificationProps) => {
    const [open, setOpen] = useState(true);

    const renderType = () => {
        switch (type) {
            case "success":
                return <CheckCircle className='h-7 w-7 text-green-700' />
            case "error":
                return <XCircle className='h-7 w-7 text-red-700' />
        }
    }
    return (
        <Toast.Provider>
            <Toast.Root
                className={clsx('flex items-center rounded border p-4 gap-4', {
                    'border-green-700': type === "success",
                    'border-red-700': type === "error"
                })} 
                open={open} onOpenChange={setOpen}>
                {renderType()}
                <div>
                    <Toast.Title className='font-bold text-gray-900'>
                        {title}
                    </Toast.Title>
                    <Toast.Description className='text-gray-500'>
                        {message}
                    </Toast.Description>
                </div>
                <Toast.Close />
            </Toast.Root>

            <Toast.Viewport className='absolute top-0 right-0 flex flex-col outline-none m-4' />
        </Toast.Provider>
    )
}
