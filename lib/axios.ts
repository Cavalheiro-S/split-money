import { STORAGE_KEYS } from "@/consts/storage";
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
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`
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