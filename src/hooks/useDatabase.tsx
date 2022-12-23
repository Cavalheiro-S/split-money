import { get, getDatabase, ref, set } from "firebase/database";
import { app } from "../Utils/firebase";

export interface UserProps {
    uid: string;
    name: string;
    email: string;
    salary: number;
}

export interface RegisterProps {
    uid: string;
    name: string;
    type: "investiment" | "expense";
    value: number;
    date: Date;
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

    const saveRegister = async (userUid: string, register: RegisterProps) => {
        return await set(ref(db, `users/${userUid}/register`), register);
    }

    const loadRegister = async (userUid: string) => {
        const snapshot = await get(ref(db, `users/${userUid}/register`));
        return snapshot.val();
    }

    return { saveUser, loadUser, deleteUser, saveRegister, loadRegister };
}