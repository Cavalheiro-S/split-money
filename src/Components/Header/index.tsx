import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";
import * as Acordion from "@radix-ui/react-accordion";
import clsx from "clsx";
import { CaretDown, List, SignOut, UserCircle, UserList } from "phosphor-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { useAuth } from "../../hooks/useAuth";
import { useDatabase, UserProps } from "../../hooks/useDatabase";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { DropdownMenu } from "../DropdownMenu";
import { Heading } from "../Heading";
import { Text } from "../Text";

interface HeaderProps {
    className?: string,
}

export default function Header({ className }: HeaderProps) {
    const navigate = useNavigate();
    const { signOut, currentUser } = useAuth();
    const { width } = useWindowDimensions();
    const { loadUser } = useDatabase();
    const [loggedUser, setLoggedUser] = useState<UserProps | null>(null);

    useEffect(() => {
        const getLoggedUserInfo = async () => {
            if (!currentUser) return
            const user = await loadUser(currentUser.uid);
            setLoggedUser(user);
        }
        getLoggedUserInfo();

    }, [currentUser])

    const renderSubMenu = () => {
        return (
            <Acordion.Root className="flex flex-col gap-2" type="single" collapsible>
                <Acordion.Item className="flex-1" value="item-1">
                    <Acordion.Trigger className="flex flex-col gap-2 px-8 py-2">
                        <div className="flex items-center gap-2">
                            <Text className="flex-1">Ferramentas</Text>
                            <CaretDown className="text-primary" />
                        </div>
                        <Acordion.Content className="text-start">
                            <Acordion.Item onClick={() => navigate("/monthRevenue")} className="py-2 hover:text-primary" value="item-1-1">
                                <Text >Renda Mensal</Text>
                            </Acordion.Item>
                            <Acordion.Item onClick={() => navigate("record")} className="py-2 hover:text-primary" value="item-1-2">
                                <Text>Histórico de Transações</Text>
                            </Acordion.Item>
                        </Acordion.Content>
                    </Acordion.Trigger>
                </Acordion.Item>
            </Acordion.Root>
        )
    }

    const renderHeader = () => {
        if (width > 768) {
            return (
                <header className={clsx("grid grid-cols-3 gap-4 items-center", className)}>
                    <Link to={"/"} className="flex items-center">
                        <Heading color="primary" size="lg">Split Money</Heading>
                    </Link>
                    {renderLinks()}
                </header>
            )
        }

        const tools = {
            title: "Ferramentas",
            children: renderSubMenu(),

        }

        return (
            <header className={clsx("flex items-center justify-between", className)} >
                <Link to={"/"} className="flex items-center">
                    <Heading color="primary" size="lg">Split Money</Heading>
                </Link>
                <DropdownMenu
                    className="flex items-center"
                    selected={{ icon: <List className="h-6 w-6" /> }}
                    key={uuid()}
                    options={[
                        { title: "Dashboard", onSelect: () => navigate("/dashboard") },
                        tools,
                    ]} />
            </header >
        )
    }

    const renderLinks = () => {
        if (currentUser) {
            return (
                <>
                    <nav className="flex text-sm justify-center text-neutral-800 md:col-start-2">
                        <li className="flex marker:text-transparent items-center text-center" key={uuid()}>
                            <Link to={"/dashboard"} className="px-4 py-1 rounded hover:text-primary-hover transition select-none">
                                Dashboard
                            </Link>
                        </li>
                        <DropdownMenu
                            className="flex items-center"
                            selected={{ title: "Ferramentas", onSelect: () => { } }}
                            key={uuid()}
                            options={[
                                { title: "Renda Mensal", onSelect: () => navigate("/monthRevenue") },
                                { title: "Histórico de Transações", onSelect: () => navigate("/record") }
                            ]} />
                    </nav>
                    <DropdownMenu
                        className="md:col-start-3 justify-self-end"
                        selected={{ title: loggedUser?.name ?? "", icon: <UserCircle />, onSelect: () => { } }}
                        options={[
                            { title: "Perfil", icon: <UserList />, onSelect: () => navigate("/profile") },
                            { title: "Sair", icon: <SignOut />, onSelect: () => signOut() }]}
                    />
                </>
            )
        }
        return (
            <li className="flex marker:text-transparent items-center justify-end text-center md:col-start-3" key={uuid()}>
                <Link to="/signin" className="px-4 py-1 rounded hover:text-primary-hover transition select-none">
                    Entrar
                </Link>
            </li>
        )
    }

    return (
        <>
            {renderHeader()}
        </>
    )
}
