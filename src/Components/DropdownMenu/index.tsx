import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu"
import clsx from "clsx";
import { v4 as uuid } from "uuid"
import { CaretDown } from "phosphor-react";
import { ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Text } from "../Text";

export interface DropdownMenuProps {
    options: DropdownMenuOptionProps[];
    selected?: DropdownMenuOptionProps;
    className?: string;
    open?: boolean;
    setIsMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropdownMenuOptionProps {
    title?: string;
    icon?: ReactNode;
    className?: string;
    onSelect?: (event: Event) => void;
    children?: ReactNode;
}

export const DropdownMenu = ({ selected, options, className, open, setIsMenuOpen }: DropdownMenuProps) => {

    const handleHasIcon = (option: DropdownMenuOptionProps) => {
        if (option.icon) {
            return (
                <Slot>
                    {option.icon}
                </Slot>
            )
        }
    }

    return (
        <DropdownMenuRadix.Root open={open ?? undefined} onOpenChange={setIsMenuOpen ?? undefined}>
            <DropdownMenuRadix.Trigger className={clsx("flex items-center outline-none gap-2", className)}>
                <>
                    {selected && handleHasIcon(selected)}
                    <Text className="select-none hover:text-primary transition">{selected?.title}</Text>
                    {selected?.title && <CaretDown className="text-primary" />}
                </>
            </DropdownMenuRadix.Trigger>
            <DropdownMenuRadix.Content className="flex flex-col gap-2 p-2 bg-white rounded-md shadow-md z-40 mt-4 min-w-[240px] border">
                {options.map(option => (
                    option.children ?? (
                        <DropdownMenuRadix.Item
                            className={
                                clsx("px-8 py-2 flex items-center gap-2 outline-none transition hover:text-primary", className)}
                            key={uuid()}
                            onSelect={option.onSelect}>
                            {handleHasIcon(option)}
                            <Text className="select-none">{option.title}</Text>
                        </DropdownMenuRadix.Item>
                    )
                ))}
            </DropdownMenuRadix.Content>
        </DropdownMenuRadix.Root>

    )
}
