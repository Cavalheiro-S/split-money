import { get, getDatabase, ref, set } from "firebase/database";
import { app } from "../Utils/firebase";

export interface UserProps {
    uid: string;
    name: string;
    email: string;
    salary: number;
}

export const useDatabase = () => {

    const db = getDatabase(app);

    const saveUser = async (user: UserProps) => {
        await set(ref(db, `users/${user.uid}`), user);
    }

    const loadUser = async (uid: string) => {
        const snapshot = await get(ref(db, `users/${uid}`));
        return snapshot.val();
    }

    const deleteUser = async (uid: string) => {
        await set(ref(db, `users/${uid}`), null);
    }


    return { saveUser, loadUser, deleteUser, db };
}