import { createUserWithEmailAndPassword, onAuthStateChanged, UserCredential } from "firebase/auth";
import { createContext, ReactElement, ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase";

interface AuthContextData {
    user: UserProps;
    setUser: React.Dispatch<React.SetStateAction<UserProps>>;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface UserProps{
    email: string | null;
    id: string | null;
    logged: boolean;

}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children } : AuthProviderProps) => {
    const [user, setUser] = useState<UserProps>({} as UserProps);

    const state = {
        user,
        setUser
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser({
                    email: user.email,
                    id: user.uid,
                    logged: true
                })
            }
            else{
                setUser({
                    email: null,
                    id: null,
                    logged: false
                })
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