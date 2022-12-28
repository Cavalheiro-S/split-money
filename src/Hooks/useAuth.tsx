import {
    browserLocalPersistence,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut as SignOut,
    updateEmail as UpdateEmail
} from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Utils/firebase";


export const useAuth = () => {
    const { currentUser } = auth;
    const navigate = useNavigate();

    useEffect(() => {

        auth.setPersistence(browserLocalPersistence)
    }, [currentUser, navigate])

    const signUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signOut = async () => {
        await SignOut(auth);
        navigate("/signin")
        return
    }

    const updateEmail = async (email: string) => {
        const date = new Date(currentUser?.metadata.lastSignInTime ?? 0)
        if (new Date().getMinutes() - date.getMinutes() > 5) {
            await signOut()
            return
        }
        if (!currentUser) return Promise.reject(new Error("No user found"))

        return UpdateEmail(currentUser, email)
    }

    return { currentUser, signUp, signIn, signOut, updateEmail }
}