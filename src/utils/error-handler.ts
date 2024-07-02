import { AxiosCodeErrorEnum } from "@/enums/axios.enum";
import { JWT_TOKEN_COOKIE } from "@/global.config";
import { AxiosError, HttpStatusCode } from "axios";
import { destroyCookie } from "nookies";

export const transformErrorResponse = (error: AxiosError<any>) => {
    console.log({ error });
    
    if (error.response?.status === HttpStatusCode.BadRequest && error.response?.data.message) {
        throw new Error(error.response.data.message)
    }

    if (error.response?.status === HttpStatusCode.Unauthorized) {
        destroyCookie(null, JWT_TOKEN_COOKIE)
        throw new Error("Sessão expirada, faça o login novamente")
    }

    if (error.code === AxiosCodeErrorEnum.ERR_NETWORK) {
        throw new Error("Não foi possivel se conectar ao servidor")
    }
    throw new Error("Falha ao se comunicar com o servidor , por favor tente novamente mais tarde.")

};