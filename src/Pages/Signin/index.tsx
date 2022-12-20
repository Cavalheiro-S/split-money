import { Password, Spinner } from "phosphor-react";
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
        catch {
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
                <form className="flex flex-col w-96 gap-2" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full mb-4">

                        <h3 className="text-3xl font-bold">Login</h3>
                        <span className="text-gray-400">Informe suas credencias para logar</span>
                    </div>
                    <label className="flex flex-col gap-2" htmlFor="email">Email
                        <Input.Root>
                            <Input.Addorn>
                                @
                            </Input.Addorn>
                            <Input.Input type={"email"} id="email" {...register("email", { required: true, minLength: 3 })} />
                        </Input.Root>
                    </label>
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    <label className="flex flex-col gap-2" htmlFor="password">Senha
                        <Input.Root>
                            <Input.Addorn>
                                <Password />
                            </Input.Addorn>
                            <Input.Input id="password" type="password" {...register("password", { required: "A senha deve ser preenchida" })} />
                        </Input.Root>
                    </label>
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    <div className="flex flex-col gap-2">
                        <Button.Root className="justify-center" id="signin" type="submit">
                            {loading ? <Spinner className="animate-spin" /> : "Entrar"}
                        </Button.Root>
                        <Button.Root
                            onClick={handleClickSignUp}
                            className="justify-center bg-transparent text-primary border border-primary hover:text-white hover:bg-primary"
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