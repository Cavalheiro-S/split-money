import { createContext, useState } from "react";

export interface RegisterProps {
    id: string;
    name: string;
    type: "investiment" | "expense";
    value: number;
    date: Date;
}

export interface DialogOpenProps {
    open: boolean;
    register?: RegisterProps;
}
interface RegisterContextProps {
    registers: RegisterProps[];
    setRegisters: React.Dispatch<React.SetStateAction<RegisterProps[]>>,
    dialogOpen: DialogOpenProps;
    setDialogOpen: React.Dispatch<React.SetStateAction<DialogOpenProps>>;
}

interface RegisterProviderProps {
    children: React.ReactNode;
}

export const RegisterContext = createContext<RegisterContextProps>({} as RegisterContextProps);

export const RegisterProvider = ({ children }: RegisterProviderProps) => {
    const [registers, setRegisters] = useState<RegisterProps[]>([] as RegisterProps[]);
    const [dialogOpen, setDialogOpen] = useState({ open: false } as DialogOpenProps);
    const state = {
        registers,
        setRegisters,
        dialogOpen,
        setDialogOpen
    }
    return (
        <RegisterContext.Provider value={state}>
            {children}
        </RegisterContext.Provider>
    );
};
