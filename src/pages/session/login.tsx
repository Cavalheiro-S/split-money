
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, Form, Input, Typography } from 'antd'
import { routes } from "global.config"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { toast } from "react-toastify"
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
  const [loading, setLoading] = useState(false)
  const { data } = useSession()
  const router = useRouter()

  const { handleSubmit, control } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(schema)
  })

  const OnSubmit: SubmitHandler<Inputs> = async data => {
    try {
      setLoading(true)
      const response = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (response?.error) {
        toast.error(response.error)
        return;
      }

      if (response?.ok) {
        toast.success("Login efetuado com sucesso")
        router.push(routes.dashboard)
      }

    }
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className={`flex flex-col gap-4 p-8 m-auto bg-white border-2 border-solid border-gray-200 shadow-md rounded-md ${data?.accessToken ? "col-start-2" : "col-span-2"}`}>
      <Typography.Title level={3} className='m-0 font-semibold'>Acesse sua conta</Typography.Title>
      <Typography.Text className='inline-block mb-2 text-gray-500'>Informe seus dados para acessar , ou acesse com outra forma de login</Typography.Text>

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
          <Button loading={loading} htmlType="submit" size='large' type='primary'>Entrar</Button>
          {/* <Button
            disabled={loading}
            htmlType='button'
            size='large'
            onClick={() => router.push("/session/signup")}>Criar Conta</Button> */}
        </div>
      </Form>
    </Card>
  )
}
