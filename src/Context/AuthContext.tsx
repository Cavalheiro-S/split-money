import { createUserWithEmailAndPassword, onAuthStateChanged, User, UserCredential } from "firebase/auth";
import { createContext, ReactElement, ReactNode, useEffect, useState } from "react";
import { auth } from "../Utils/firebase";

interface AuthContextData {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>> | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>({} as User);

    const state = {
        user,
        setUser
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
            }
            else {
                setUser({}  as User)
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