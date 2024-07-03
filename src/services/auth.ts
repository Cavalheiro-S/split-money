import { api } from "data/axios"


export const signIn = async (email: string, password: string) => {
    const response = await api.post<ApiBase<AccessToken>>("/auth/login", { email, password })
    return response.data   
}