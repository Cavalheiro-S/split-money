
export const verifyErrorType = (error: unknown) => {
    if(error instanceof Error) {
        return error.message
    }
}

export const capitalizeFirstLetter = (string: string) => {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export const formatInputMoney = (value: string): number => {
    const valueAsString = value.replace("R$", "")
        .replace(".", "")
        .replace(",", ".")
    return Number(valueAsString)
}

export const getFirstEnumKey = (enumObj: object): string => {
    const keys = Object.keys(enumObj) as Array<keyof typeof enumObj>;
    return keys[0];
}