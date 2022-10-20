import { Slot } from "@radix-ui/react-slot";
import { Info } from 'phosphor-react';
import { InputHTMLAttributes, ReactNode } from 'react';

interface NumberInputInputProps extends InputHTMLAttributes<HTMLInputElement> { }

interface NumberInputRootProps {
  children: ReactNode,
}

interface NumberInputIconProps {
  children?: ReactNode
}

interface NumberInputAddornProps {
  children: string
}

const NumberInputRoot = ({ children }: NumberInputRootProps) => {

  return (
    <div className="bg-gray-100 flex items-center rounded h-10 w-auto focus-within:ring-2 ring-primary group transition">
      {children}
    </div>
  )
}

export const NumberInputIcon = ({ children = <Info /> }: NumberInputIconProps) => {

  return (
    <Slot className="w-7 h-7 pl-1">
      {children}
    </Slot>
  )
}

export const NumberInputAddorn = ({ children }: NumberInputAddornProps) => {

  return (
    <div className="flex items-center h-full p-2 rounded-tl rounded-bl group-focus-within:bg-primary group-focus-within:text-white transition addorn">
      {children}
    </div>
  )

}

const NumberInputInput = (props: NumberInputInputProps) => {

  return (
    <input className='bg-transparent outline-none w-full text-gray-900 placeholder:text-gray-600 px-3 font-sans' pattern="[0-9]+" {...props} />
  )
}

export const NumberInput = {
  Root: NumberInputRoot,
  Input: NumberInputInput,
  Addorn: NumberInputAddorn,
  Icon: NumberInputIcon
}