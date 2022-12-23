import clsx from "clsx"
import { FirebaseError } from "firebase/app"
import { Pencil, SpinnerGap } from "phosphor-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../../Components/Button"
import { Heading } from "../../Components/Heading"
import { Input } from "../../Components/Input"
import { Notification } from "../../Components/Notification"
import { Text } from "../../Components/Text"
import { useAuth } from "../../Hooks/useAuth"

interface Inputs {
    name: string;
    email: string;
    password: string;
    salary: number;
}

export const Profile = () => {

    const { register, formState: { errors }, setError, setValue, setFocus, handleSubmit } = useForm<Inputs>()
    const [disabled, setDisabled] = useState(true)
    const { currentUser } = useAuth();
    const [notification, setNotification] = useState(false)
    const [loading, setLoading] = useState(false)
    const { updateEmail } = useAuth();

    const handleSubmitForm = async (data: Inputs) => {
        setNotification(false)
        setDisabled(!disabled)
        setFocus("email")
        try {

            if (!disabled && data.email !== currentUser?.email) {
                setLoading(true)
                await updateEmail(data.email)
                setNotification(true)
                setLoading(false)
            }
        }
        catch (err) {
            if (err instanceof FirebaseError)
                setError("email", { message: err.message })

            setValue("email", currentUser?.email ?? "")
            setError("email", { message: "Falha ao alterar email" })
            console.log(err)
        }

        finally {
            setLoading(false)
        }

    }

    const onSubmit = handleSubmit(handleSubmitForm)

    useEffect(() => {
        setValue("email", currentUser?.email ?? "")
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
                    <Button.Root
                        disabled={loading}
                        className={
                            clsx("flex justify-center",
                                {
                                    "bg-transparent border border-primary text-primary hover:bg-primary-hover hover:text-white": disabled,
                                })}>
                        <Button.Icon>
                            {loading ? <SpinnerGap className="h-5 w-5 animate-spin" /> : <Pencil className="h-5 w-5" />}

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