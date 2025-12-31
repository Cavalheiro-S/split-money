// frontend/lib/auth.ts
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword
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
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        }
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

  static async resetPassword(email: string) {
    try {
      const result = await resetPassword({ username: email });
      return result;
    } catch (error) {
      console.error("Error forgot password:", error);
      throw error;
    }
  }

  static async confirmResetPassword({ email, code, newPassword }: { email: string; code: string; newPassword: string }) {
    try {
      const result = await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      return result;
    } catch (error) {
      console.error("Error confirming reset password:", error);
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
      const errorObj = error as { name?: string };
      if (errorObj?.name === "UserUnAuthenticatedException") {
        return null;
      }
      console.error("Error getting current user:", error);
      return null;
    }
  }


  static async getAuthSession() {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch (error) {   
      const errorObj = error as { name?: string };
      if (errorObj?.name === "UserUnAuthenticatedException") {
        return null;
      }
      console.error("Error getting auth session:", error);
      return null;
    }
  }

  static async getToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      const errorObj = error as { name?: string };
      if (errorObj?.name === "UserUnAuthenticatedException") {
        return null;
      }
      console.error("Error getting token:", error);
      return null;
    }
  }

}
