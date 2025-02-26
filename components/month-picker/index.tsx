import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthPickerProps {
    onChange?: (date: Date) => void;
}


export const MonthPicker = ({ onChange }: MonthPickerProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        if (date && onChange) {
            onChange(date)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-fit justify-between">
                    {date ? format(date, "MMMM yyyy", { locale: ptBR }) : "Selecione um mês"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4">
                <div className="flex gap-2">
                    {/* Seleção de Mês */}
                    <Select
                        onValueChange={(value) => {
                            setMonth(Number(value))
                            setDate(new Date(year, Number(value), 1))
                        }}
                        value={month.toString()}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Mês" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                    {format(new Date(2023, i, 1), "MMMM", { locale: ptBR })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Seleção de Ano */}
                    <Select
                        onValueChange={(value) => {
                            setYear(Number(value))
                            setDate(new Date(Number(value), month, 1))
                        }}
                        value={year.toString()}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                                const y = new Date().getFullYear() - 5 + i;
                                return (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    )
}