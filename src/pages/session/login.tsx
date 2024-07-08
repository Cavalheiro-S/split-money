
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Form, Input } from 'antd'
import { SessionStatusEnum } from "enums/next-auth.enum"
import { routes } from "global.config"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import * as z from 'zod'

interface Inputs {
  email: string,
  password: string
}

const schema = z.object({
  email: z.string().nonempty({ message: "Email não pode ser vazio" }),
  password: z.string().nonempty({ message: "Senha não pode ser vazio" })
})

export default function Page() {
  const { data, status } = useSession()
  const router = useRouter()

  const { handleSubmit, control, } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(schema)
  })

  const OnSubmit: SubmitHandler<Inputs> = async data => {
    try {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: routes.dashboard
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`flex flex-col gap-5 p-8 m-auto bg-white rounded row-start-2 ${data?.accessToken ? "col-start-2" : "col-span-2"}`}>
      <div>
        <h3 className='text-2xl font-semibold'>Acesse sua conta</h3>
        <span className='text-gray-500'>Informe seus dados para acessar , ou acesse com outra forma de login</span>
      </div>
      <Form layout='vertical' onFinish={handleSubmit(OnSubmit)}>
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
        <div className='flex flex-col gap-4'>
          <Button loading={status === SessionStatusEnum.loading} htmlType="submit" size='large'>Entrar</Button>
          <Button
            disabled={status === SessionStatusEnum.loading}
            htmlType='button'
            size='large'
            onClick={() => router.push("/session/signup")}>Criar Conta</Button>
        </div>
      </Form>
    </div>
  )
}
