// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeJwtPayload(token: string): Record<string, any> | null {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decodedJson);
    } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        return null;
    }
}