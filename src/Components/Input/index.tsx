import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { Info } from 'phosphor-react';
import { InputHTMLAttributes, ReactNode } from 'react';

interface InputInputProps extends InputHTMLAttributes<HTMLInputElement> { }

interface InputRootProps {
  children: ReactNode,
  className?: string;
}

interface InputIconProps {
  children?: ReactNode
  className?: string;
}

interface InputAddornProps {
  children: string
  className?: string;
}

const InputRoot = ({ children, className }: InputRootProps) => {

  return (
    <div className={clsx("bg-gray-100 flex items-center rounded h-10 w-auto focus-within:ring-2 ring-primary group transition", className)}>
      {children}
    </div>
  )
}

export const InputIcon = ({ children = <Info />, className }: InputIconProps) => {

  return (
    <Slot className={clsx("w-7 h-7 pl-1", className)}>
      {children}
    </Slot>
  )
}

export const InputAddorn = ({ children, className }: InputAddornProps) => {

  return (
    <div className={clsx("flex items-center h-full p-2 rounded-tl rounded-bl group-focus-within:bg-primary group-focus-within:text-white transition addorn", className)}>
      {children}
    </div>
  )

}

const InputInput = (props: InputInputProps) => {

  return (
    <input
      className='bg-transparent outline-none w-full text-gray-900 placeholder:text-gray-400 px-3 font-sans'
      pattern={props.type === "number" ? "[0-9]+" : undefined}
      {...props}
    />
  )
}

export const Input = {
  Root: InputRoot,
  Input: InputInput,
  Addorn: InputAddorn,
  Icon: InputIcon
}