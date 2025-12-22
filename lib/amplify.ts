"use client";

import { Amplify } from "aws-amplify";
import { useEffect } from "react";

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {

    Amplify.configure(
      {
        Auth: {
          Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID!,
            userPoolClientId:
              process.env.NEXT_PUBLIC_COGNITO_USERPOOL_CLIENT_ID!,
          },
        },
      },
      { ssr: true }
    );

    
  }, []);
  return children;
}
