import { get, off, onValue, push, ref, remove, update } from "firebase/database";
import { useContext, useEffect } from "react";
import { RegisterContext, RegisterProps, RegisterType } from "../Context/RegisterContext";
import { convertSnapshotToRegister, convertSnapshotToRegisterArray } from "../Utils/database";
import { convertToMoneyString } from "../Utils/util";
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
    }, [])

    const saveRegister = async (register: RegisterProps) => {
        await push(ref(db, `users/${currentUser?.uid}/register`), register);
    }

    const updateRegister = async (registerId: string, register: RegisterProps) => {
        await update(ref(db, `users/${currentUser?.uid}/register/${registerId}`), register);
    }

    const deleteRegister = async (registerId: string) => {
        await remove(ref(db, `users/${currentUser?.uid}/register/${registerId}`));
    }

    const getRegisterByType = async (type: RegisterType) => {
        const snapshot = await get(ref(db, `users/${currentUser?.uid}/register`));
        const registers = convertSnapshotToRegisterArray(snapshot);
        return registers.filter(item => item.type === type);
    }

    const getRegisterById = async (registerId: string) => {
        const snapshot = await get(ref(db, `users/${currentUser?.uid}/register/${registerId}`));
        const register = convertSnapshotToRegister(snapshot);
        return register;
    }

    const getValueTotalRegisters = async (type: RegisterType) => {
        const registers = await getRegisterByType(type);
        const total = registers.reduce((total, register) => total + register.value, 0);
        return convertToMoneyString(total)
    }

    return { registers, saveRegister, getRegisterById, updateRegister, deleteRegister, getRegisterByType, getValueTotalRegisters };
}