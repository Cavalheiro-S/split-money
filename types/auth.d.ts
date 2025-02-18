type ResponseSignIn = {
    accessToken: string;
    error?: {
        code: string;
        message: string;
    }
}