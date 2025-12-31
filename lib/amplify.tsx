"use client";

import { Amplify } from "aws-amplify";
import { useEffect } from "react";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_CLIENT_ID!,
    },
  },
};

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Amplify.configure(amplifyConfig, { ssr: true });
  }, []);

  return <>{children}</>;
}
