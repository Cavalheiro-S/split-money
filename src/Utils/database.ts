import { DataSnapshot } from "firebase/database";
import { RegisterProps } from "../Context/RegisterContext";

export const convertSnapshotToRegisterArray = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) return [] as RegisterProps[];
    const object = snapshot.val();

    const [objectIds, objectValues] = Object.entries(object);
    console.log(Object.entries(object));

    console.log(objectValues);
    const registers = objectValues.map((item: any, index) => {
        return {
            id: objectIds[index],
            name: item.name,
            value: item.value,
            type: item.type,
            date: item.date,
        } as RegisterProps;
    })
    return registers;
}

export const convertSnapshotToRegister = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) return {} as RegisterProps;
    const object = snapshot.val();
    const register = {
        id: object.id,
        name: object.name,
        value: object.value,
        type: object.type,
        date: object.date,
    } as RegisterProps;
    return register;
}