import { get, off, onValue, push, ref, remove, update } from "firebase/database";
import { useContext, useEffect } from "react";
import { RegisterContext, RegisterProps } from "../Context/RegisterContext";
import { convertSnapshotToRegister, convertSnapshotToRegisterArray } from "../Utils/database";
import { useAuth } from "./useAuth";
import { useDatabase } from "./useDatabase";


export const useRegister = () => {

    const { registers, setRegisters } = useContext(RegisterContext);
    const { db } = useDatabase();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;
        const registersDatabase = ref(db, `users/${currentUser.uid}/register`)
        const onValueChange = onValue(registersDatabase, (snapshot) => {
            const registersDatabase = convertSnapshotToRegisterArray(snapshot);
            setRegisters(registersDatabase);
        })
        return () => {
            off(registersDatabase, 'value', onValueChange);
        }
    },[])

    const saveRegister = async (userUid: string, register: RegisterProps) => {
        await push(ref(db, `users/${userUid}/register`), register);
    }

    const updateRegister = async (userUid: string, registerId: string, register: RegisterProps) => {
        await update(ref(db, `users/${userUid}/register/${registerId}`), register);
    }

    const deleteRegister = async (userUid: string, registerId: string) => {
        await remove(ref(db, `users/${userUid}/register/${registerId}`));
    }

   
    const loadRegisterById = async (userUid: string, registerId: string) => {
        const snapshot = await get(ref(db, `users/${userUid}/register/${registerId}`));
        const register = convertSnapshotToRegister(snapshot);
        return register;
    }

    return { registers, saveRegister, loadRegisterById, updateRegister, deleteRegister };
}