import { AxiosCodeErrorEnum } from "@/enums/axios.enum";
import { JWT_TOKEN_COOKIE } from "@/global.config";
import { transformErrorResponse } from "@/utils/error-handler";
import axios, { Axios, AxiosError, HttpStatusCode } from "axios";
import { destroyCookie, parseCookies } from "nookies";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use((config) => {
    const cookies = parseCookies()
    const cookieToken = cookies[JWT_TOKEN_COOKIE]
    config.headers.Authorization = `Bearer ${cookieToken}`;
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error instanceof AxiosError) {

            transformErrorResponse(error)
        }
    })