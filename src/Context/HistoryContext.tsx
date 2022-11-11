import { createContext, SetStateAction, useState } from "react";
import { v4 as uuid } from 'uuid';

export interface ItemProps {
    id: string,
    name: string,
    type: "Investimento" | "Despesa",
    value: number,
    date: Date
}

interface HistoryContextProps {
    children: React.ReactNode
}

interface HistoryContextData {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>,
    id: string,
    setId: React.Dispatch<SetStateAction<string>>,
    name: string,
    setName: React.Dispatch<SetStateAction<string>>,
    type: "Investimento" | "Despesa",
    setType: React.Dispatch<SetStateAction<"Investimento" | "Despesa">>,
    value: string,
    setValue: React.Dispatch<SetStateAction<string>>,
    date: Date,
    setDate: React.Dispatch<SetStateAction<Date>>,
    ListItems: ItemProps[],
    setListItems: React.Dispatch<SetStateAction<ItemProps[]>>

}

export const HistoryContext = createContext({} as HistoryContextData);

export const HistoryProvider = ({ children }: HistoryContextProps) => {

    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [id, setId] = useState<string>("")
    const [type, setType] = useState<"Investimento" | "Despesa">("Investimento")
    const [value, setValue] = useState("")
    const [date, setDate] = useState(new Date())
    const [ListItems, setListItems] = useState<ItemProps[]>(
        [
            {
                id: uuid(),
                name: "Teste",
                type: "Investimento",
                value: 100,
                date: new Date()
            }
        ]
    );

    const HistoryValues = {
        open,
        setOpen,
        id,
        setId,
        name,
        setName,
        type,
        setType,
        value,
        setValue,
        date,
        setDate,
        ListItems,
        setListItems
    }

    return (
        <HistoryContext.Provider value={HistoryValues}>
            {children}
        </HistoryContext.Provider>
    )

}