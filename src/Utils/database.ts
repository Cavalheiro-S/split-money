import { DataSnapshot } from "firebase/database";
import { RegisterProps } from "../Context/RegisterContext";

export const convertSnapshotToRegisterArray = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) return [] as RegisterProps[];
    const registersSnapshot = snapshot.val();

    const registersSnapshotEntries = Object.entries<RegisterProps>(registersSnapshot);

    const registers = registersSnapshotEntries.map(([id, register]) => {

        return {
            id: id,
            name: register.name,
            value: register.value,
            type: register.type,
            date: register.date,
        } as RegisterProps;
    })
    console.log(registers);

    return registers;
}

export const convertSnapshotToRegister = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) return {} as RegisterProps;
    const object = snapshot.val();
    const [id, registerValue] = Object.entries(object);

    const register = {
        id: object.id,
        name: object.name,
        value: object.value,
        type: object.type,
        date: object.date,
    } as RegisterProps;
    return register;
}