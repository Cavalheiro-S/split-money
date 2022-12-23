import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { FormInfo } from "./FormInfo";
import { FormLogin } from "./FormLogin";
interface Inputs {
    name: string;
    salary: number;
    email: string;
    password: string;
    confirmPassword: string;
}

export const Signup = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"login" | "info">("login");

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col w-96 gap-6">
                <div className="flex flex-col w-full">
                    <h3 className="text-3xl font-bold">Criando uma conta</h3>
                    <span className="text-gray-400">Informe suas credencias para criar sua conta</span>
                </div>
                <Tabs.Root defaultValue={activeTab} value={activeTab}>
                    <Tabs.List className="flex mb-2">
                        <Tabs.Trigger
                            disabled={currentUser !== null}
                            className={clsx("w-full p-2 disabled:text-gray-500",
                                { "text-primary border-b border-b-primary": activeTab === "login", })}
                            onClick={() => setActiveTab("login")}
                            value="login">
                            Login
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            disabled={!currentUser}
                            className={clsx("w-full p-2 disabled:text-gray-500",
                                { "text-primary": activeTab === "info", })}
                            onClick={() => setActiveTab("info")}
                            value="info">
                            Informações relevantes
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="login" className="flex flex-col gap-6">
                        <FormLogin activeTab={activeTab} setActiveTab={setActiveTab} />
                    </Tabs.Content>
                    <Tabs.Content value="info" className="flex flex-col gap-6">
                        <FormInfo activeTab={activeTab} setActiveTab={setActiveTab} />
                    </Tabs.Content>
                </Tabs.Root>

            </div>
        </div>
    )
}

export default Signup;