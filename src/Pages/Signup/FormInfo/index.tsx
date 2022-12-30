import { FirebaseError } from "firebase/app";
import { SpinnerGap, User } from "phosphor-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../Components/Button";
import { Input } from "../../../Components/Input";
import { Text } from "../../../Components/Text";
import { useAuth } from "../../../Hooks/useAuth";
import { useUser } from "../../../Hooks/useUser";
import { returnErrorMessage } from "../../../Utils/firebase";

interface FormInfoProps {
    activeTab: "login" | "info";
    setActiveTab: React.Dispatch<React.SetStateAction<"login" | "info">>;
}

interface Inputs {
    name: string;
    salary: number;
}

export const FormInfo = ({ activeTab, setActiveTab }: FormInfoProps) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { saveUser } = useUser();
    const { currentUser } = useAuth();

    const { register, handleSubmit, setError, formState: { errors }, getValues } = useForm<Inputs>()


    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            setLoading(true);
            if (currentUser === null) throw new Error("Usuário não encontrado")
            if (currentUser.email === null) throw new Error("Email não encontrado")
            await saveUser({
                uid: currentUser.uid,
                name: data.name,
                email: currentUser.email,
                salary: data.salary,
            })

            navigate("/dashboard")
        }
        catch (error) {
            if (error instanceof FirebaseError) {
                const messageError = returnErrorMessage(error.code)
                setError("name", { type: "manual", message: messageError })
                return;
            }

            setError("name", { type: "manual", message: "Email ou senha inválidos" })
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <label className="flex flex-col gap-2" htmlFor="name">Nome
                <Input.Root>
                    <Input.Addorn>
                        <User className="h-6 w-6" />
                    </Input.Addorn>
                    <Input.Input id="name" {...register("name", { required: true, valueAsNumber: false })} />
                </Input.Root>
                {errors.name?.type == "required" && <Text type="error">Campo não pode ser vazio</Text>}
                {errors.name?.type == "valueAsNumber" && <Text type="error">Campo não pode ser um número</Text>}
            </label>
            <label className="flex flex-col gap-2" htmlFor="salary">Salário
                <Input.Root>
                    <Input.Addorn>
                        R$
                    </Input.Addorn>
                    <Input.Input id="salary" type="number" {...register("salary", { required: true, valueAsNumber: true })} />
                </Input.Root>
                {errors.name?.type == "required" && <Text type="error">Campo não pode ser vazio</Text>}
            </label>
            <Button.Root id="signup" disabled={loading} type="submit">
                {loading ? <SpinnerGap className="h-6 w-6 animate-spin" /> : "Finalizar Cadastro"}
            </Button.Root>
        </form>
    )
}