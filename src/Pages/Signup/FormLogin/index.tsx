import { FirebaseError } from "firebase/app";
import { EnvelopeSimple, Lock, SpinnerGap } from "phosphor-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../Components/Button";
import { Input } from "../../../Components/Input";
import { useAuth } from "../../../Hooks/useAuth";
import { returnErrorMessage } from "../../../Utils/firebase";

interface FormLoginProps {
    activeTab: "login" | "info";
    setActiveTab: React.Dispatch<React.SetStateAction<"login" | "info">>;
}

interface Inputs {
    email: string;
    password: string;
    confirmPassword: string;
}

export const FormLogin = ({ activeTab, setActiveTab }: FormLoginProps) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { register, handleSubmit, setError, formState: { errors }, getValues } = useForm<Inputs>()


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            const response = await signUp(data.email, data.password)
            if (!response) throw new Error("Erro ao cadastrar usuário")
            setActiveTab("info")
        }
        catch (error) {
            if (error instanceof FirebaseError) {
                const messageError = returnErrorMessage(error.code)
                setError("email", { type: "manual", message: messageError })
                return;
            }
            setError("email", { type: "manual", message: "Email ou senha inválidos" })
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2" htmlFor="email">Email
                <Input.Root>
                    <Input.Addorn>
                        <EnvelopeSimple className="h-6 w-6" />
                    </Input.Addorn>
                    <Input.Input type={"email"} id="email" {...register("email", { required: true, minLength: 6 })} />
                </Input.Root>
                {errors.email?.type == "manual" && <span className="text-red-500 text-sm">{errors.email.message}</span>}
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
            <div className="flex flex-col gap-2">
                <Button.Root id="signup" className="justify-center" type="submit">
                    {loading ? <SpinnerGap className="h-6 w-6 animate-spin" /> : "Continuar"}
                </Button.Root>
                <Button.Root id="signin-redirect" styleType="secondary" type="button" onClick={() => navigate("/signin")}>
                    Já tem uma conta?
                </Button.Root>
            </div>
        </form>
    )
}