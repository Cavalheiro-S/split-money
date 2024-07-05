
import { AxiosError, HttpStatusCode } from "axios";
import { ERROR_MESSAGES } from "consts/error-messages";
import { AxiosCodeErrorEnum } from "enums/axios.enum";

export const transformErrorResponse = (error: AxiosError<any>) => {
    console.log({ error });

    if (error.response?.status === HttpStatusCode.BadRequest && error.response?.data.message) {
        throw new Error(error.response.data.message)
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
        throw new Error(ERROR_MESSAGES.Unauthorized)
    }

    if (error.code === AxiosCodeErrorEnum.ERR_NETWORK) {
        throw new Error(ERROR_MESSAGES.NoConnection)
    }
    throw new Error("Falha ao se comunicar com o servidor , por favor tente novamente mais tarde.")

};