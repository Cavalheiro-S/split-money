import { get, push, ref, remove, update } from "firebase/database";
import { useContext } from "react";
import { RegisterContext, RegisterProps } from "../Context/RegisterContext";
import { convertSnapshotToRegister, convertSnapshotToRegisterArray } from "../Utils/database";
import { useDatabase } from "./useDatabase";


export const useRegister = () => {

    const { registers, setRegisters } = useContext(RegisterContext);
    const { db } = useDatabase();


    const saveRegister = async (userUid: string, register: RegisterProps) => {
        await push(ref(db, `users/${userUid}/register`), register);
        await loadAllRegisters(userUid);
    }

    const updateRegister = async (userUid: string, registerId: string, register: RegisterProps) => {
        await update(ref(db, `users/${userUid}/register/${registerId}`), register);
        await loadAllRegisters(userUid);
    }

    const deleteRegister = async (userUid: string, registerId: string) => {
        await remove(ref(db, `users/${userUid}/register/${registerId}`));
        await loadAllRegisters(userUid);
    }

    const loadAllRegisters = async (userUid: string) => {
        const snapshot = await get(ref(db, `users/${userUid}/register`));
        const registersDatabase = convertSnapshotToRegisterArray(snapshot);
        setRegisters(registersDatabase);
    }

    const loadRegisterById = async (userUid: string, registerId: string) => {
        const snapshot = await get(ref(db, `users/${userUid}/register/${registerId}`));
        const register = convertSnapshotToRegister(snapshot);
        return register;
    }

    return { registers, saveRegister, loadAllRegisters, loadRegisterById, updateRegister, deleteRegister };
}