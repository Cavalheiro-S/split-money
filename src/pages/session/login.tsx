import { Loading } from '@/components/Loading/Loading'
import { AuthContext } from '@/context/auth-context'
import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/use-user'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
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
  const { token } = useContext(AuthContext)
  const { signInMutate } = useAuth()
  const { mutateGetUser } = useUser()
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

      await signInMutate.mutateAsync({ email: data.email, password: data.password }, {
        onSuccess: async () => {
          await mutateGetUser.mutateAsync(data.email, {
            onSuccess: () => {
              router.push("/dashboard")
            }
          })
        }
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`flex flex-col gap-5 p-8 m-auto bg-white rounded row-start-2 ${token ? "col-start-2" : "col-span-2"}`}>
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
          <Button loading={signInMutate.isPending} htmlType="submit" size='large'>Entrar</Button>
          <Button htmlType='button' size='large'
            onClick={() => router.push("/session/signup")}>Criar Conta</Button>
        </div>
      </Form>
    </div>
  )
}
