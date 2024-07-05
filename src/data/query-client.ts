import { QueryClient } from "@tanstack/react-query";
import { ERROR_MESSAGES } from "consts/error-messages";
import { toast } from "react-toastify";

export const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (error) => {
                toast.error(error.message)
            }
        },
        queries: {
            throwOnError: (error) => {
                if(error.message === ERROR_MESSAGES.NoConnection) {
                    toast.error(error.message)
                }
                return false
            },
            refetchOnWindowFocus: false,
            retry: (retries, error) => {
                if (error.message === ERROR_MESSAGES.NoConnection) {
                    return false
                }
                return retries < 2
            }
        },
    }
})