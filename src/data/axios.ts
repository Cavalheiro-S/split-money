
import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import { transformErrorResponse } from "utils/error-handler";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
    const session = await getSession();

    config.headers.Authorization = `Bearer ${session?.accessToken}`;
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error instanceof AxiosError) {

            transformErrorResponse(error)
        }
    })