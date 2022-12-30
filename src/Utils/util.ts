
export const replaceDotInComma = (value: string) => {
    const regex = /(\d+).(\d+)/g;
    return value.replace(regex, '$1,$2');
}

export const replaceCommaInDot = (value: string) => {
    const regex = /(\d+),(\d+)/g;
    return value.replace(regex, '$1.$2');
}

export const convertToMoneyString = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}