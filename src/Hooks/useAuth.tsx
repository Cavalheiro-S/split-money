import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut as SignOut,
    updateEmail as UpdateEmail
} from "firebase/auth";
import { auth } from "../Utils/firebase";

export const useAuth = () => {
    const { currentUser } = auth;

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signOut = async () => {
        return SignOut(auth);
    }

    const updateEmail = async (email: string) => {
        if (!currentUser) return Promise.reject(new Error("No user found"))
        return UpdateEmail(currentUser, email)
    }

    return { currentUser, signUp, signIn, signOut, updateEmail }
}