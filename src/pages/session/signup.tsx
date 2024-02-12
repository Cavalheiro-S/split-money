import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as z from 'zod'

interface Inputs {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export default function Page() {

    const schema = z.object({
        name: z.string().nonempty({ message: "Nome não pode ser vazio" }),
        email: z.string().nonempty({ message: "Email não pode ser vazio" }),
        password: z.string()
            .nonempty({ message: "Senha não pode ser vazio" })
            .min(8, { message: "Senha deve conter no mínimo 8 caracteres" }),
        confirmPassword: z
            .string()
            .nonempty({ message: "Confirmação de senha não pode ser vazio" })
    })
        .refine(value => value.confirmPassword === value.password,
            {
                message: "As senhas não coincidem",
                path: ["confirmPassword"]
            })

    const { handleSubmit, control, setError, } = useForm<Inputs>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        resolver: zodResolver(schema)
    })
    const router = useRouter()

    const OnSubmit: SubmitHandler<Inputs> = async data => {
        try {

        }
        catch (err) {
            toast.error("Não foi possível fazer o login")
        }
    }

    return (
        <div className='flex flex-col col-start-2 gap-5 p-8 m-auto bg-white rounded'>
            <div>
                <h3 className='text-2xl font-semibold'>Acesse sua conta</h3>
                <span className='text-gray-500'>Informe seus dados para acessar , ou acesse com outra forma de login</span>
            </div>
            <Form layout='vertical' onFinish={handleSubmit(OnSubmit)} >

                <FormItem
                    label="Nome"
                    name='name'
                    control={control}
                >
                    <Input size='large' placeholder='Adicione seu nome' />
                </FormItem>
                <FormItem
                    label="Email"
                    name='email'
                    control={control}
                >
                    <Input size='large' placeholder='Adicione seu email' />
                </FormItem>
                <FormItem
                    label="Senha"
                    name='password'
                    control={control}
                >
                    <Input.Password size='large' type='password' placeholder='********' />
                </FormItem>
                <FormItem
                    label="Confirme a senha"
                    name='confirmPassword'

                    control={control}
                >
                    <Input.Password size='large' type='password' placeholder='********' />
                </FormItem>
                <div className='flex flex-col gap-4'>
                    <Button htmlType="submit" size='large'>Criar conta</Button>
                    <Button size='large' onClick={() => router.push("/session/login")}>Voltar ao login</Button>
                </div>
            </Form>
        </div>
    )
}
