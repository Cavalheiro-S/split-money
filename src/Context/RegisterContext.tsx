import { createContext, useState } from "react";

export interface RegisterProps {
    id: string;
    userId: string;
    name: string;
    type: RegisterType;
    value: number;
    date: string;
}

export enum RegisterType {
    INCOMING = "incoming",
    EXPENSE = "expense",
}

interface RegisterContextProps {
    registers: RegisterProps[];
    setRegisters: React.Dispatch<React.SetStateAction<RegisterProps[]>>,
}

interface RegisterProviderProps {
    children: React.ReactNode;
}

export const RegisterContext = createContext<RegisterContextProps>({} as RegisterContextProps);

export const RegisterProvider = ({ children }: RegisterProviderProps) => {
    const [registers, setRegisters] = useState<RegisterProps[]>([] as RegisterProps[]);

    const state = {
        registers,
        setRegisters,
    }
    return (
        <RegisterContext.Provider value={state}>
            {children}
        </RegisterContext.Provider>
    );
};
