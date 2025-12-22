type ResponseSignIn = {
    accessToken: string;
    user?: User;
    expiresIn?: number;
    expiresAt?: number;
    error?: {
        code: string;
        message: string;
    }
}