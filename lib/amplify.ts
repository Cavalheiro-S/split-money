"use client";

import { Amplify } from "aws-amplify";

if (typeof window !== "undefined") {
  Amplify.configure(
    {
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_CLIENT_ID!,
        },
      },
    },
    { ssr: true }
  );
}

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return children;
}
