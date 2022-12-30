import { get, getDatabase, off, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { app } from "../Utils/firebase";
import { useAuth } from "./useAuth";


export interface UserProps {
    uid: string;
    name: string;
    email: string;
    salary: number;
}

export const useUser = () => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState<UserProps>({} as UserProps);
    useEffect(() => {
        if (!currentUser) return;
        const userRef = ref(db, `users/${currentUser.uid}`)
        const onValueChange = onValue(userRef, async (snapshot) => {
            const userLoadedDatabase = await loadUser();
            setUser(userLoadedDatabase);
        })
        return () => {
            off(userRef, 'value', onValueChange);
        }
    }, [])
    const db = getDatabase(app);
    const saveUser = async (user: UserProps) => {
        await set(ref(db, `users/${currentUser?.uid}`), user);
    }

    const loadUser = async () => {
        const snapshot = await get(ref(db, `users/${currentUser?.uid}`));
        return snapshot.val();
    }

    const updateUser = async (user: UserProps) => {
        await set(ref(db, `users/${currentUser?.uid}`), user);
    }

    const deleteUser = async () => {
        await set(ref(db, `users/${currentUser?.uid}`), null);
    }
    return { user, saveUser, loadUser, deleteUser, updateUser }
}