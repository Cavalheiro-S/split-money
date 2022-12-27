
export const replaceDotInComma = (value: string) => {
    const regex = /(\d+).(\d+)/g;
    return value.replace(regex, '$1,$2');
}

export const replaceCommaInDot = (value: string) => {
    const regex = /(\d+),(\d+)/g;
    return value.replace(regex, '$1.$2');
}

export const convertToMoneyValues = (value: string) => {
    if(value.includes(',')) {
        return Number(replaceCommaInDot(value));
    }
    return Number(value);
}