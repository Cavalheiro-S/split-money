import { STORAGE_KEYS } from "@/consts/storage";
import { decodeJwtPayload } from "@/utils/auth";
import axios from "axios";
import { redirect } from "next/navigation";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const apiWithoutAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)
        if (token) {
            const tokenPayload = decodeJwtPayload(token)
            const expirationDate = new Date(tokenPayload?.exp * 1000)
            if (expirationDate < new Date()) {
                localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
                redirect("sign-in");
            }

            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`
        } else {
            redirect("sign-in");
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
            redirect("sign-in");
        }
        return Promise.reject(error)
    }
)