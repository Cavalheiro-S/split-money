import { get, getDatabase, ref, set, push, remove, query } from "firebase/database";
import { RegisterProps } from "../Context/RegisterContext";
import { convertSnapshotToRegister, convertSnapshotToRegisterArray } from "../Utils/database";
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

    const saveRegister = async (userUid: string, register: RegisterProps) => {
        return await push(ref(db, `users/${userUid}/register`), register);
    }

    const loadAllRegisters = async (userUid: string) => {
        const snapshot = await get(ref(db, `users/${userUid}/register`));
        const registers = convertSnapshotToRegisterArray(snapshot);
        return registers;
    }

    const loadRegisterById = async (userUid: string, registerId: string) => {
        
        const snapshot = await get(ref(db, `users/${userUid}/register/${registerId}`));
        const register = convertSnapshotToRegister(snapshot);
        return register;
    }

    const deleteRegister = async (userUid: string, registerId: string) => {
        return await remove(ref(db, `users/${userUid}/register/${registerId}`));
    }
    return { saveUser, loadUser, deleteUser, saveRegister, loadAllRegisters, loadRegisterById, deleteRegister };
}