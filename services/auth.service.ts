// frontend/lib/auth.ts
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode,
} from "aws-amplify/auth";

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export class AuthService {
  static async signIn({ email, password }: SignInParams) {
    try {
      const result = await signIn({
        username: email,
        password,
      });
      return result;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  static async signUp({ email, password, name }: SignUpParams) {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
      return result;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  static async confirmSignUp(email: string, code: string) {
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return result;
    } catch (error) {
      console.error("Error confirming sign up:", error);
      throw error;
    }
  }

  static async resendCode(email: string) {
    try {
      await resendSignUpCode({ username: email });
    } catch (error) {
      console.error("Error resending code:", error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }


  static async getAuthSession() {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {
      console.error("Error getting auth session:", error);
      return null;
    }
  }

  static async getToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

}
