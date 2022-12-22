import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as SignOut, updateEmail as UpdateEmail } from "firebase/auth"
import { auth } from "../firebase"


export const useAuth = () => {
    const { currentUser } = auth;
    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signOut = () => {
        return SignOut(auth);
    }

    const updateEmail = (email: string) => {
        if (currentUser)
            return UpdateEmail(currentUser, email)
        throw Error("No user found")
    }

    return { currentUser, signUp, signIn, signOut, updateEmail }
}