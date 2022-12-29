import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useDatabase } from "../Hooks/useDatabase";
import { useRegister } from "../Hooks/useRegister";
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
    const {loadAllRegisters} = useRegister();
    
    const state = {
        user,
        setUser
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
                loadAllRegisters(user.uid);
            }
            else {
                setUser({} as User)
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