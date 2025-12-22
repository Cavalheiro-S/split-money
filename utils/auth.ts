"use server";
import { STORAGE_KEYS } from "@/consts/storage";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COGNITO_USERPOOL_ID = process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID;
const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USERPOOL_ID}/.well-known/jwks.json`;

export const validateToken = async (token: string) => {
  if (!COGNITO_USERPOOL_ID || !COGNITO_REGION) {
    throw new Error("Missing required AWS Cognito configuration");
  }

  try {
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jwtVerify(token, JWKS);
    return payload;
  } catch (error) {
    console.error("Token validation error:", error);
    throw error;
  }
};

export async function setAuthTokens(idToken: string, accessToken: string) {
  const cookieStore = await cookies();

  const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  // ID Token (usado para autenticação na API)
  cookieStore.set("idToken", idToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 10, // 10 horas
  });

  // Access Token
  cookieStore.set(STORAGE_KEYS.JWT_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60 * 10, // 10 horas
  });
}

export async function clearAuthTokens() {
  const cookieStore = await cookies();

  cookieStore.delete("idToken");
  cookieStore.delete(STORAGE_KEYS.JWT_TOKEN);
}
