import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    validateStatus: (status) => status <= 500,
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${Cookies.get("split.money.token")}`;
    return config
})