import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { AuthContext } from "../Context/AuthContext"
import { auth } from "../firebase"
import { useContext } from "react"


export const useAuth = () => {
    const { user, setUser } = useContext(AuthContext)

    const signUp = async (email: string, password: string) => {
        const response = await createUserWithEmailAndPassword(auth, email, password)

        if (response && setUser) {
            setUser({
                email: response.user.email,
                id: response.user.uid,
                logged: true
            })
        }
        else if (setUser) {
            setUser({
                email: null,
                id: null,
                logged: false
            })
        }
    }

    const signIn = async (email: string, password: string) => {

        const response = await signInWithEmailAndPassword(auth, email, password)
        if (response && setUser) {
            setUser({
                email: response.user.email,
                id: response.user.uid,
                logged: true
            })
        }
        else if (setUser) {
            setUser({
                email: null,
                id: null,
                logged: false
            })
        }
    }

    const signOut = () => {
        if (user && setUser) {
            setUser({
                email: null,
                id: null,
                logged: false
            })
        }
    }
    return { signUp, signIn, signOut }
}