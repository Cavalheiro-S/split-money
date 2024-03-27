import { JWT_TOKEN_COOKIE } from "@/global.config";
import axios from "axios";
import { parseCookies } from "nookies";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    validateStatus: (status) => status <= 500,
});

api.interceptors.request.use((config) => {
    const cookies = parseCookies()
    const cookieToken = cookies[JWT_TOKEN_COOKIE]
    config.headers.Authorization = `Bearer ${cookieToken}`;
    return config
})