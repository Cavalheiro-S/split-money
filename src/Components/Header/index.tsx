import clsx from "clsx";
import { SignOut, UserCircle, UserList } from "phosphor-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid';
import { AuthContext } from "../../Context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { DropdownMenu, DropdownMenuOptionProps } from "../DropdownMenu";

interface HeaderProps {
    className?: string,
}

type linkType = {
    title: string,
    url?: string,
    dropdown?: boolean,
    dropdownOptions?: DropdownMenuOptionProps[]
}

export default function Header({ className }: HeaderProps) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const links: linkType[] = [
        {
            title: "Dashboard",
            url: "/dashboard",
        },
        {
            title: "Ferramentas",
            dropdown: true,
            dropdownOptions: [
                {
                    option: "Renda Mensal",
                    onSelect: () => navigate("/monthRevenue")
                },
                {
                    option: "Histórico de Transações",
                    onSelect: () => navigate("/history")
                }
            ]
        },
    ]

    const renderLinks = (link: linkType) => {

        if (link.dropdown) {

            return (
                <DropdownMenu
                    className="flex items-center"
                    key={uuid()}
                    selected={
                        <span className="rounded hover:text-primary-hover transition select-none">
                            {link.title}
                        </span>
                    }
                    options={link.dropdownOptions ?? []} />
            )
        }
        return (
            <li className="flex marker:text-transparent items-center text-center" key={uuid()}>
                <Link to={link.url ?? "/"} className="px-4 py-1 rounded hover:text-primary-hover transition select-none">
                    {link.title}
                </Link>
            </li>
        )
    }

    const renderAutenticatedLinks = () => {

        if (auth.user.logged) {
            const options = [
                {
                    option:
                        <div className="flex items-center gap-2">
                            <UserList className="h-5 w-5" />
                            <span className="text-sm select-none">Perfil</span>
                        </div>,
                    onSelect: () => navigate("/profile")
                },
                {
                    option:
                        <div className="flex items-center gap-2">
                            <SignOut className="h-5 w-5" />
                            <span className="text-sm select-none">Sair</span>
                        </div>,
                    onSelect: () => {
                        signOut();
                        navigate("/signin");
                    }
                },
            ]
            return (
                <>
                    <nav className="flex text-sm justify-center text-neutral-800 md:col-start-2">
                        {links.map(renderLinks)}
                    </nav>
                    <DropdownMenu
                        className="md:col-start-3 justify-self-end"
                        selected={
                            <div className="flex items-center gap-2">
                                <UserCircle className="text-primary h-8 w-8" />
                                <span className="text-sm hover:text-primary transition select-none">Lucas Cavalheiro</span>
                            </div>
                        }
                        options={options} />
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
        <header className={clsx("flex py-6 md:px-10 px-4 border-b-2 md:grid items-center md:grid-cols-3", className)} >
            <span onClick={() => navigate("/")} className="font-bold text-primary drop-shadow-lg text-sm ">Split Money</span>
            {renderAutenticatedLinks()}
        </header>
    )
}
