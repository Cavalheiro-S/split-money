import { createContext, useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { useRegister } from "../Hooks/useRegister";

export interface RegisterProps {
    id: string;
    name: string;
    type: "investiment" | "expense";
    value: number;
    date: Date;
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
