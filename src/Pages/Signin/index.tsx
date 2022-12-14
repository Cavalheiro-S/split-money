import { useForm } from "react-hook-form";

interface Inputs {
    email: string;
    password: string;
}

const Sigin = () => {

    const { register, handleSubmit } = useForm<Inputs>()

    const onSubmit = (data: Inputs) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email
                <input type="text" {...register("email")} />
            </label>
            <label htmlFor="password">Password
                <input type="password" {...register("password")} />
            </label>
        </form>
    )
}

export default Sigin;