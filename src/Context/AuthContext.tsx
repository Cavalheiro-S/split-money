import { createUserWithEmailAndPassword, onAuthStateChanged, User, UserCredential } from "firebase/auth";
import { createContext, ReactElement, ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase";

interface AuthContextData {
    user: UserProps;
    setUser: React.Dispatch<React.SetStateAction<UserProps>> | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface UserProps extends User {
    logged: boolean;

}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserProps>({} as UserProps);

    const state = {
        user,
        setUser
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({ ...user, logged: true })
            }
            else {
                setUser(user => ({ ...user, logged: false }))
            }
        })
        return unsubscribe;
    }, [])

    return (
        <AuthContext.Provider value={state}>
            {children}
        </AuthContext.Provider>
    )
}