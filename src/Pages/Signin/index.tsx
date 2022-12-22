import { FirebaseError } from "firebase/app";
import { EnvelopeSimple, Lock, SpinnerGap } from "phosphor-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components/Button";
import { Input } from "../../Components/Input";
import { Notification, NotificationProps } from "../../Components/Notification";
import { useAuth } from "../../hooks/useAuth";

interface Inputs {
    email: string;
    password: string;
}

export const Signin = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState<NotificationProps>({
        title: "",
        message: "Email ou senha inválidos",
        type: "error"
    });

    const { signIn } = useAuth();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>()
    const [loading, setLoading] = useState(false);


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            setNotification({ ...notification, title: "" })
            await signIn(data.email, data.password)
            navigate("/monthRevenue")
        }
        catch (error) {
            
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
                <form className="flex flex-col w-96 gap-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full mb-4">

                        <h3 className="text-3xl font-bold">Login</h3>
                        <span className="text-gray-400">Informe suas credencias para logar</span>
                    </div>
                    <label className="flex flex-col gap-2" htmlFor="email">Email
                        <Input.Root>
                            <Input.Addorn>
                                <EnvelopeSimple className="h-6 w-6" />
                            </Input.Addorn>
                            <Input.Input type={"email"} id="email" {...register("email", { required: "Email deve ser preenchido", minLength: 4 })} />
                        </Input.Root>
                        {errors.email?.type === "required" && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        {errors.email?.type === "minLength" && <span className="text-red-500 text-sm">Email deve ter no mínimo 3 caracteres</span>}
                    </label>
                    <label className="flex flex-col gap-2" htmlFor="password">Senha
                        <Input.Root>
                            <Input.Addorn>
                                <Lock className="h-6 w-6" />
                            </Input.Addorn>
                            <Input.Input id="password" type="password" {...register("password", { required: "A senha deve ser preenchida" })} />
                        </Input.Root>
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </label>
                    <div className="flex flex-col gap-2">
                        <Button.Root disabled={loading} className="justify-center" id="signin" type="submit">
                            {loading ? <SpinnerGap className="h-6 w-6 animate-spin" /> : "Entrar"}
                        </Button.Root>
                        <Button.Root
                            onClick={handleClickSignUp}
                            className="justify-center bg-transparent text-primary border border-primary hover:text-white hover:bg-primary"
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