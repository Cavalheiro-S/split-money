import * as Acordion from "@radix-ui/react-accordion"
import clsx from "clsx"
import { CaretDown, List } from "phosphor-react"
import { Link, useNavigate } from "react-router-dom"
import { CustomComponentProps } from "../.."
import { useAuth } from "../../../Hooks/useAuth"
import { DropdownMenu } from "../../DropdownMenu"
import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu"
import { Text } from "../../Text"
interface HeaderProps extends CustomComponentProps { }

export const NavMenuBurguer = ({ className }: HeaderProps) => {
    const navigate = useNavigate()
    const { signOut } = useAuth();
    const { currentUser } = useAuth();

    const renderToolsMenu = () => {
        return (
            <Acordion.Root className="flex flex-col gap-2" type="single" collapsible>
                <Acordion.Item className="flex flex-1" value="item-1">
                    <Acordion.Trigger className="flex flex-col gap-2 px-8 py-2">
                        <div className="flex items-center gap-2">
                            <Text className="flex-1">Ferramentas</Text>
                            <CaretDown className="text-primary" />
                        </div>
                        <Acordion.Content className="flex-1 text-start">
                            <DropdownMenuRadix.Item className="w-full">
                                <Acordion.Item onClick={() => navigate("/monthRevenue")} className="py-2 hover:text-primary flex-1" value="item-1-1">
                                    <Text >
                                        Renda Mensal
                                    </Text>
                                </Acordion.Item>
                            </DropdownMenuRadix.Item>
                            <DropdownMenuRadix.Item className="w-full">
                                <Acordion.Item onClick={() => navigate("/record")} className="py-2 hover:text-primary" value="item-1-2">
                                    <Text>
                                        Histórico de Transações
                                    </Text>
                                </Acordion.Item>
                            </DropdownMenuRadix.Item>
                        </Acordion.Content>
                    </Acordion.Trigger>
                </Acordion.Item>
            </Acordion.Root>
        )
    }

    const renderProfileMenu = () => {
        return (
            <Acordion.Root className="flex-1 flex-col gap-2" type="single" collapsible>
                <Acordion.Item className="flex-1" value="item-1">
                    <Acordion.Trigger className="flex flex-col gap-2 px-8 py-2 w-full">
                        <div className="flex flex-1 items-center gap-2">
                            <Text>Perfil</Text>
                            <CaretDown className="text-primary" />
                        </div>
                        <Acordion.Content className="text-start">
                            <DropdownMenuRadix.Item>
                                <Acordion.Item
                                    onClick={() => navigate("/profile")}
                                    className="py-2 hover:text-primary w-full" value="item-1-1">
                                    <Text >
                                        Informações
                                    </Text>
                                </Acordion.Item>
                            </DropdownMenuRadix.Item>
                            <DropdownMenuRadix.Item onClick={() => {
                                navigate("/signin")
                                signOut()
                            }}>
                                <Acordion.Item
                                    className="py-2 hover:text-primary" value="item-1-2">
                                    <Text>
                                        Sair
                                    </Text>
                                </Acordion.Item>
                            </DropdownMenuRadix.Item>
                        </Acordion.Content>
                    </Acordion.Trigger>
                </Acordion.Item>
            </Acordion.Root >
        )
    }

    const renderHeaderAutenticated = () => {
        if (currentUser) {
            return (
                < DropdownMenu
                    className={clsx("flex items-center", className)}
                    selected={{ icon: <List className="h-6 w-6" /> }
                    }
                    options={[
                        { title: "Dashboard", onSelect: () => navigate("/dashboard") },
                        tools,
                        profile
                    ]} />
            )
        }
        return (
            <li className="flex marker:text-transparent items-center justify-end text-center md:col-start-3" >
                <Text asChild>
                    <Link to="/signin" className="px-4 py-1 rounded hover:text-primary-hover transition select-none">
                        Entrar
                    </Link>
                </Text>
            </li>
        )
    }
    const tools = {
        title: "Ferramentas",
        children: renderToolsMenu(),
    }

    const profile = {
        title: "Perfil",
        children: renderProfileMenu(),
    }

    return renderHeaderAutenticated()

}