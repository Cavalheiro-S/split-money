import { ApiService } from "./base.service";

export type CreateUserRequest = {
    email: string;
    name: string;
    id: string;
}

export class UserService extends ApiService {
    static async getMe() {
        return this.request<{ message: string; data: User }>("/user/me")
    }

    static async updateEmail(email: string) {
        return this.request<{ message: string; data: User["email"] }>("/user/me", {
            method: "PATCH",
            body: JSON.stringify({ email }),
        })
    }
    
    static async createUser(data: CreateUserRequest) {
        return this.request<{ message: string; data: User }>("/create-user", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

}

