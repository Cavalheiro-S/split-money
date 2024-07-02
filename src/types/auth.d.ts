type AccessToken = {
    access_token: string,
    expiresIn: number
}

type AccessTokenPayload = {
    id: string,
    email: string
    exp: number
}

type RequestLogin = {
    email: string,
    password: string
}