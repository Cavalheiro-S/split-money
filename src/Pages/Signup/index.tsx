import { EnvelopeSimple, Lock, SpinnerGap } from "phosphor-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Components/Button";
import { Input } from "../../Components/Input";
import { useAuth } from "../../hooks/useAuth";
interface Inputs {
    email: string;
    password: string;
    confirmPassword: string;
}

export const Signup = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { register, handleSubmit, setError, formState: { errors }, getValues } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            await signUp(data.email, data.password)
            navigate("/signin")
        }
        catch {
            setError("email", { type: "manual", message: "Email ou senha inválidos" })
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <form className="flex flex-col w-96 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full">
                    <h3 className="text-3xl font-bold">Criando uma conta</h3>
                    <span className="text-gray-400">Informe suas credencias para criar sua conta</span>
                </div>
                <label className="flex flex-col gap-2" htmlFor="email">Email
                    <Input.Root>
                        <Input.Addorn>
                            <EnvelopeSimple className="h-6 w-6" />
                        </Input.Addorn>
                        <Input.Input type={"email"} id="email" {...register("email", { required: true, minLength: 6 })} />
                    </Input.Root>
                    {errors.email?.type == "manual" && <span className="text-red-500 text-sm">Não foi possível criar uma conta com esse email</span>}
                    {errors.email?.type == "required" && <span className="text-red-500 text-sm">Campo não pode ser vazio</span>}
                    {errors.email?.type == "minLength" && <span className="text-red-500 text-sm">Campo não pode ter menos de 6 caracteres</span>}
                </label>
                <label className="flex flex-col gap-2" htmlFor="password">Senha
                    <Input.Root>
                        <Input.Addorn>
                            <Lock className="h-6 w-6" />
                        </Input.Addorn>
                        <Input.Input id="password" type="password" {...register("password", { required: true, minLength: 6 })} />
                    </Input.Root>
                    {errors.password?.type == "required" && <span className="text-red-500 text-sm">Campo não pode ser vazio</span>}
                    {errors.password?.type == "minLength" && <span className="text-red-500 text-sm">Campo não pode ter menos de 6 caracteres</span>}
                </label>
                <label className="flex flex-col gap-2" htmlFor="confirmPassword">Confirme a senha
                    <Input.Root>
                        <Input.Addorn>
                            <Lock className="h-6 w-6" />
                        </Input.Addorn>
                        <Input.Input id="confirmPassword" type="password"
                            {...register("confirmPassword",
                                {
                                    required: "A senha deve ser igual a anterior",
                                    validate: value => value == getValues().password
                                })} />
                    </Input.Root>
                    {errors.confirmPassword && <span className="text-red-500 text-sm">Senha deve ser igual a anterior</span>}
                </label>
                <Button.Root id="signup" className="justify-center" type="submit">
                    {loading ? <SpinnerGap className="h-6 w-6 animate-spin" /> : "Criar Conta"}
                </Button.Root>
            </form>
        </div>
    )
}

export default Signup;