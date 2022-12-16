import { Password } from "phosphor-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../Components/Button";
import { Input } from "../../Components/Input";

interface Inputs {
    email: string;
    password: string;
}

export const Signin = () => {

    const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);

    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
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
                {errors.email && <span className="text-red-500 text-sm">O email deve ser preenchido</span>}
                <label className="flex flex-col gap-2" htmlFor="password">Senha
                    <Input.Root>
                        <Input.Addorn>
                            <Password />
                        </Input.Addorn>
                        <Input.Input id="password" type="password" {...register("password", { required: "A senha deve ser preenchida" })} />
                    </Input.Root>
                </label>
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                <Button.Root id="signin" type="submit" className="self-end">
                    Entrar
                </Button.Root>
            </form>
        </div>
    )
}

export default Signin;