import clsx from "clsx"
import { FirebaseError } from "firebase/app"
import { Pencil, SpinnerGap, User } from "phosphor-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../../Components/Button"
import { Heading } from "../../Components/Heading"
import { Input } from "../../Components/Input"
import { Notification } from "../../Components/Notification"
import { Text } from "../../Components/Text"
import { useAuth } from "../../Hooks/useAuth"
import { UserProps } from "../../Hooks/useUser"
import { useUser } from "../../Hooks/useUser"
import { convertToMoneyString } from "../../Utils/util"

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
    const { user, loadUser, updateUser } = useUser();
    const [notification, setNotification] = useState(false)
    const [loading, setLoading] = useState(false)
    const { updateEmail } = useAuth();


    useEffect(() => {
        const loadUserInfo = async () => {
            const user = await loadUser() as UserProps
            setValue("email", currentUser?.email ?? "")
            setValue("name", user.name ?? "")
            setValue("salary", user.salary ?? 0)
        }
        loadUserInfo();
    }, [])

    const verifyIsEdit = (data: Inputs) => {
        if (data.email !== currentUser?.email)
            return true
        if (data.name !== user.name)
            return true
        if (data.salary !== user.salary)
            return true
        return false
    }


    const handleSubmitForm = async (data: Inputs) => {
        setNotification(false)
        setDisabled(!disabled)
        setFocus("email")
        try {

            if (!disabled && verifyIsEdit(data)) {
                setLoading(true)
                setNotification(true)
                await updateEmail(data.email)
                const userUpdate = {
                    ...data,
                    uid: currentUser?.uid
                } as UserProps
                await updateUser(userUpdate)

            }
        }
        catch (error) {
            if (error instanceof FirebaseError)
                setError("email", { message: error.message })

            setValue("email", currentUser?.email ?? "")
            setError("email", { message: "Falha ao alterar email" })
            console.log(error)
        }

        finally {
            setLoading(false)
        }

    }

    const onSubmit = handleSubmit(handleSubmitForm)

    return (
        <>
            <div className="mb-10">
                <Heading size="lg">
                    Perfil
                </Heading>
                <Text size="lg" className="text-md text-gray-500">Informe alguns dados para nos ajudar a te proporcionar uma melhor experiência</Text>
            </div>
            <div className="flex">
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <Text asChild className="text-font">
                        <label htmlFor="name">
                            Nome
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={disabled} {...register("name")} id="name" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Text asChild className="text-font">
                        <label htmlFor="email">
                            Email
                            <Input.Root>
                                <Input.Input className="disabled:text-gray-400" disabled={disabled} {...register("email")} id="email" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Text asChild className="text-font">
                        <label htmlFor="salary">
                            Salário
                            <Input.Root>
                                <Input.Addorn>R$</Input.Addorn>
                                <Input.Input className="disabled:text-gray-400" disabled={disabled} {...register("salary")} id="salary" />
                            </Input.Root>
                        </label>
                    </Text>
                    <Button.Root
                        disabled={loading}
                        styleType="secondary"
                        className={clsx("flex justify-center")}>
                        <Button.Icon>
                            {loading ? <SpinnerGap className="h-5 w-5 animate-spin" /> : <Pencil className="h-5 w-5" />}
                        </Button.Icon>
                        {disabled ? "Editar" : "Salvar"}
                    </Button.Root>
                </form>
            </div>
            {notification && <Notification title="Sucesso" message="Email alterado com sucesso" type="success" />}
            {errors.email && <Notification title="Erro" message="Email inválido" type="error" />}
        </>
    )
}