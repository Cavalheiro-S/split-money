import clsx from "clsx";
import { SignOut, UserCircle, UserList } from "phosphor-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { useAuth } from "../../Hooks/useAuth";
import { useWindowDimensions } from "../../Hooks/useWindowDimensions";
import { DropdownMenu } from "../DropdownMenu";
import { Heading } from "../Heading";
import { Text } from "../Text";
import { NavMenuBurguer } from "./NavMenuBurguer";
interface HeaderProps {
    className?: string,
}

export default function Header({ className }: HeaderProps) {
    const navigate = useNavigate();
    const { signOut, currentUser } = useAuth();
    const { width } = useWindowDimensions();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const renderItemsNavMenu = () => {
        if (currentUser) {
            return (
                <>
                    <nav className="flex text-sm justify-center text-neutral-800 md:col-start-2">
                        <li className="flex marker:text-transparent items-center text-center" key={uuid()}>
                            <Text asChild>
                                <Link to={"/dashboard"} className="px-4 py-1 rounded hover:text-primary-hover transition select-none">
                                    Dashboard
                                </Link>
                            </Text>
                        </li>
                        <DropdownMenu
                            className="flex items-center"
                            selected={{ title: "Ferramentas" }}
                            key={uuid()}
                            options={[
                                { title: "Renda Mensal", onSelect: () => navigate("/revenueCalculator") },
                                { title: "Histórico de Transações", onSelect: () => navigate("/record") }
                            ]} />
                    </nav>
                    <DropdownMenu
                        className="md:col-start-3 justify-self-end"
                        open={isMenuOpen}
                        setIsMenuOpen={setIsMenuOpen}
                        selected={{ title: "Perfil", icon: <UserCircle className="text-primary h-5 w-5" />, onSelect: () => { } }}
                        options={[
                            { title: "Informações", icon: <UserList className="h-5 w-5" />, onSelect: () => navigate("/profile") },
                            {
                                title: "Sair", icon: <SignOut className="h-5 w-5" />, onSelect: async () => {
                                    await signOut()
                                    navigate("/signin")
                                }
                            }
                        ]}
                    />
                </>
            )
        }
        return (
            <li className="flex marker:text-transparent items-center justify-end text-center md:col-start-3" key={uuid()}>
                <Text asChild>
                    <Link to="/signin" className="px-4 py-1 rounded hover:text-primary-hover transition select-none">
                        Entrar
                    </Link>
                </Text>
            </li>
        )
    }

    return (
        <header className={clsx("flex items-center justify-between md:grid md:grid-cols-3 md:gap-4 ", className)}>
            <Heading asChild color="primary" size="lg">
                <Link to={"/"} className="flex items-center">
                    Split Money
                </Link>
            </Heading>
            {width > 768 ? renderItemsNavMenu() : <NavMenuBurguer />}
        </header>
    )
}
