import moment from "moment"
import { useSession } from "next-auth/react"

export const useVerifTokenValid = () => {
    const { data } = useSession()
    const dateTokenExpires = data?.expires
    const dateTokenExpiresMoment = moment(dateTokenExpires)
    const dateNow = moment()
    const differenceInDays = dateTokenExpiresMoment.diff(dateNow, 'days')
    if (differenceInDays < 1) {
        return false
    }
    return true
}