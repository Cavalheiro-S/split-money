import { Pencil } from "phosphor-react"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../../Components/Button"
import { Heading } from "../../Components/Heading"
import { Input } from "../../Components/Input"
import { Text } from "../../Components/Text"
import { AuthContext } from "../../Context/AuthContext"

interface Inputs {
    name: string;
    email: string;
    password: string;
    salary: number;
}

export const Profile = () => {

    const { register, formState: { errors }, setValue, handleSubmit } = useForm<Inputs>()
    const [editable, setEditable] = useState(false)
    const { user } = useContext(AuthContext);
    const handleSubmitForm = (data: Inputs) => {
        console.log(data);
        setEditable(!editable)
    }

    const onSubmit = handleSubmit(handleSubmitForm)

    useEffect(() => {
        setValue("name", "Lucas")
        setValue("email", user.email ?? "")
        setValue("password", "123456")
        setValue("salary", 1000)
    }, [])

    return (
        <>
            <div className="mb-10">
                <Heading size="xl">
                    Perfil
                </Heading>
                <Text size="lg" className="text-md text-gray-500">Informe alguns dados para nos ajudar a te proporcionar uma melhor experiência</Text>
            </div>
            <div className="flex">
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <Text size="md" asChild className="text-md text-font">
                        <label htmlFor="name">Nome
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={!editable} {...register("name")} id="name" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Text size="md" asChild className="text-md text-font">
                        <label htmlFor="email">Email
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={!editable} {...register("email")} id="email" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Text size="md" asChild className="text-md text-font">
                        <label htmlFor="password">Senha
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={!editable} {...register("password")}  type="password"  id="password" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Text size="md" asChild className="text-md text-font">
                        <label htmlFor="salary">Salário Atual
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={!editable} {...register("salary")} id="salary" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Button.Root className="flex justify-center">
                        <Button.Icon>
                            <Pencil className="h-5 w-5" />
                        </Button.Icon>
                        Editar
                    </Button.Root>
                </form>
            </div>


        </>
    )
}