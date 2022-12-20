import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as SignOut } from "firebase/auth"
import { AuthContext } from "../Context/AuthContext"
import { auth } from "../firebase"
import { useContext } from "react"


export const useAuth = () => {
    const { user, setUser } = useContext(AuthContext)

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signOut = () => {
        return SignOut(auth);
    }

    return { signUp, signIn, signOut }
}