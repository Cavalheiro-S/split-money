import { Pencil } from "phosphor-react"
import { FirebaseError } from "firebase/app"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../../Components/Button"
import { Heading } from "../../Components/Heading"
import { Input } from "../../Components/Input"
import { Notification } from "../../Components/Notification"
import { Text } from "../../Components/Text"
import { AuthContext } from "../../Context/AuthContext"
import { useAuth } from "../../hooks/useAuth"
import clsx from "clsx"

interface Inputs {
    name: string;
    email: string;
    password: string;
    salary: number;
}

export const Profile = () => {

    const { register, formState: { errors }, setError, getValues, setValue, handleSubmit } = useForm<Inputs>()
    const [disabled, setDisabled] = useState(true)
    const [notification, setNotification] = useState(false)
    const [loading, setLoading] = useState(false)
    const { user } = useContext(AuthContext);
    const { updateEmail } = useAuth();

    const handleSubmitForm = async (data: Inputs) => {
        setNotification(false)
        setDisabled(!disabled)
        try {
            if (!disabled && data.email !== user.email) {
                setLoading(true)
                await updateEmail(data.email)
                setNotification(true)
                return;
            }
        }
        catch (err) {
            if (err instanceof FirebaseError) {
                setError("email", { message: err.message })
            }
            setValue("email", user.email ?? "")
            console.log(err)
            setError("email", { message: "Falha ao alterar email" })
        }

        finally {
            setLoading(false)
        }

    }

    const onSubmit = handleSubmit(handleSubmitForm)

    useEffect(() => {
        setValue("email", user.email ?? "")
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
                        <label htmlFor="email">Email
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={disabled} {...register("email")} id="email" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Button.Root className={clsx("flex justify-center", {
                        "bg-transparent border border-primary text-primary hover:bg-primary-hover hover:text-white": disabled,
                    })}>
                        <Button.Icon>
                            <Pencil className="h-5 w-5" />
                        </Button.Icon>
                        {disabled ? "Editar" : "Salvar"}
                    </Button.Root>
                </form>
            </div>
            {notification && <Notification title="Sucesso" message="Email alterado com sucesso" type="success" />}
            {errors.email && <Notification title="Erro" message="Email inválido" type="error" />}
            {loading && <Notification title="Carregando" message="Aguarde um momento" type="success" />}
        </>
    )
}