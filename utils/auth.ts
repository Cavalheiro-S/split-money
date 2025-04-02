import { jwtVerify, createRemoteJWKSet } from "jose";

const COGNITO_USERPOOL_ID = process.env.COGNITO_USERPOOL_ID
const COGNITO_REGION = process.env.COGNITO_REGION
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USERPOOL_ID}/.well-known/jwks.json`;

export const validateToken = async (token: string) => {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jwtVerify(token, JWKS);
    return payload;
};
