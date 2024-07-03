
import axios, { AxiosError } from "axios";
import { JWT_TOKEN_COOKIE } from "global.config";
import { parseCookies } from "nookies";
import { transformErrorResponse } from "utils/error-handler";

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