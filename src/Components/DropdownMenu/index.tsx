import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu"
import clsx from "clsx";
import { CaretDown } from "phosphor-react";
import { ReactNode } from "react";

export interface DropdownMenuProps {
    options: DropdownMenuOptionProps[];
    selected: ReactNode;
    className?: string;
}

export interface DropdownMenuOptionProps {
    option: ReactNode;
    onSelect: (event: Event) => void;
}

export const DropdownMenu = ({ selected, options, className }: DropdownMenuProps) => {

    return (
        <DropdownMenuRadix.Root>
            <DropdownMenuRadix.Trigger className={clsx("flex items-center outline-none gap-2", className)}>
                <>
                    {selected}
                    <CaretDown className="text-primary" />
                </>
            </DropdownMenuRadix.Trigger>
            <DropdownMenuRadix.Content className="flex flex-col gap-2 p-2 bg-white rounded-md shadow-md z-40">
                {options.map(option => (
                    <DropdownMenuRadix.Item className="px-8 py-2 outline-none hover:bg-primary-hover transition hover:text-white" key={option.option?.toString()} onSelect={option.onSelect}>
                        {option.option}
                    </DropdownMenuRadix.Item>
                ))}
            </DropdownMenuRadix.Content>
        </DropdownMenuRadix.Root>

    )
}