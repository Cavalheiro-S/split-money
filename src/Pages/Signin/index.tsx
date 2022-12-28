import { FirebaseError } from "firebase/app";
import { EnvelopeSimple, Lock, SpinnerGap } from "phosphor-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components/Button";
import { Heading } from "../../Components/Heading";
import { Input } from "../../Components/Input";
import { Notification, NotificationProps } from "../../Components/Notification";
import { Text } from "../../Components/Text";
import { useAuth } from "../../Hooks/useAuth";

interface Inputs {
    email: string;
    password: string;
}

interface SigninProps {
    notificationRedirect?: NotificationProps;
}

export const Signin = ({ notificationRedirect }: SigninProps) => {

    const navigate = useNavigate();
    const { signIn } = useAuth();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>()
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<NotificationProps>({
        title: notificationRedirect?.title ?? "",
        message: notificationRedirect?.message ?? "Email ou senha inválidos",
        type: notificationRedirect?.type ?? "error"
    });


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            setNotification({ ...notification, title: "" })
            await signIn(data.email, data.password)
            navigate("/dashboard")
        }
        catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/user-not-found") {
                    setError("email", { type: "manual", message: "Email não cadastrado" })
                    setNotification({
                        title: "Erro",
                        message: "Email não cadastrado",
                        type: "error"
                    });
                    return;
                }
                if (error.code === "auth/wrong-password") {
                    setError("password", { type: "manual", message: "Senha incorreta" })
                    setNotification({
                        title: "Erro",
                        message: "Senha incorreta",
                        type: "error"
                    });
                    return;
                }
            }
            console.log(error);

            setError("email", { type: "manual", message: "Email ou senha inválidos" })
            setNotification({
                title: "Erro",
                message: "Email ou senha inválidos",
                type: "error"
            });
        }
        finally {
            setLoading(false);
        }

    }

    const handleClickSignUp = () => {
        navigate("/signup")
    }

    return (
        <>
            {notification.title && <Notification title={notification.title} message={notification.message} type={notification.type} />}
            < div className="flex flex-col justify-center items-center h-full" >
                <form className="flex flex-col md:w-96 gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full mb-4">
                        <Heading size="xl">Login</Heading>
                        <Text size="lg" className="text-gray-400">Informe suas credencias para logar</Text>
                    </div>
                    <label className="flex flex-col gap-2" htmlFor="email">Email
                        <Input.Root>
                            <Input.Addorn>
                                <EnvelopeSimple className="h-6 w-6" />
                            </Input.Addorn>
                            <Input.Input type={"email"} id="email" {...register("email", { required: "Email deve ser preenchido", minLength: 4 })} />
                        </Input.Root>
                        {errors.email?.type === "required" && <Text type="error">{errors.email.message}</Text>}
                        {errors.email?.type === "minLength" && <Text type="error">Email deve ter no mínimo 3 caracteres</Text>}
                        {errors.email?.type === "manual" && <Text type="error">{errors.email.message}</Text>}
                    </label>
                    <label className="flex flex-col gap-2" htmlFor="password">Senha
                        <Input.Root>
                            <Input.Addorn>
                                <Lock className="h-6 w-6" />
                            </Input.Addorn>
                            <Input.Input id="password" type="password" {...register("password", { required: "A senha deve ser preenchida" })} />
                        </Input.Root>
                        {errors.password && <Text type="error">{errors.password.message}</Text>}
                    </label>
                    <div className="flex flex-col gap-2">
                        <Button.Root disabled={loading} className="justify-center" id="signin" type="submit">
                            {loading ? <SpinnerGap className="h-6 w-6 animate-spin" /> : "Entrar"}
                        </Button.Root>
                        <Button.Root
                            onClick={handleClickSignUp}
                            styleType="secondary"
                            disabled={loading}
                            id="signup" type="button">
                            Criar conta
                        </Button.Root>
                    </div>
                </form>
            </div >

        </>
    )
}

export default Signin;