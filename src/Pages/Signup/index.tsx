import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import { useState } from "react";
import { Heading } from "../../Components/Heading";
import { Text } from "../../Components/Text";
import { useAuth } from "../../hooks/useAuth";
import { FormInfo } from "./FormInfo";
import { FormLogin } from "./FormLogin";

export const Signup = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"login" | "info">("login");

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-col w-96 gap-6">
                <div className="flex flex-col w-full">
                    <Heading size="xl">Criando uma conta</Heading>
                    <Text size="lg" className="text-gray-400">Informe suas credencias para criar sua conta</Text>
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
                                { "text-primary border-b border-b-primary": activeTab === "info", })}
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