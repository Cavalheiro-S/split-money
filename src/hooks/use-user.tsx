import { api } from "@/data/axios"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useUser = () => {

    const { data: user, mutate: getUser } = useMutation({
        mutationKey: ["user"],
        mutationFn: (email: string) => api.post<ApiBase<User>>("/user/getByEmail", { email: email })
    })

    useEffect(() => {
        console.log(user);

    }, [user])

    return { user, getUser }
}