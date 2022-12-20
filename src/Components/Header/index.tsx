import clsx from "clsx"
import { useContext } from "react";
import { Link } from "react-router-dom"
import { v4 as uuid } from 'uuid';
import { AuthContext } from "../../Context/AuthContext";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
    className?: string,
}

type linkType = {
    title: string,
    url: string,
    action?: () => void
}

export default function Header({ className }: HeaderProps) {
    const auth = useContext(AuthContext);
    const { signOut } = useAuth();
    const links: linkType[] = [
        {
            title: "Renda Mensal",
            url: "/monthRevenue",
        },
        {
            title: "Histórico",
            url: "/history",
        },
        {
            title: "Sair",
            url: "/signin",
            action: () => { signOut()}
        }
    ]

    const renderLinks = (link: linkType) => {

        if (link.action){
            return (
                <li className="flex marker:text-transparent items-center text-center" key={uuid()}>
                    <button onClick={link.action} className="px-4 py-1 rounded font-semibold hover:text-primary-hover transition">
                        {link.title}
                    </button>
                </li>
            )
        }
        return (
            <li className="flex marker:text-transparent items-center text-center" key={uuid()}>
                <Link to={link.url} className="px-4 py-1 rounded font-semibold hover:text-primary-hover transition">
                    {link.title}
                </Link>
            </li>
        )

    }

    const renderAutenticatedLinks = () => {
        
        if (auth.user.logged)
            return links.map(renderLinks)
        return (
            <li className="flex marker:text-transparent items-center text-center" key={uuid()}>
                <Link to="/signin" className="px-4 py-1 rounded font-semibold hover:text-primary-hover transition">
                    Entrar
                </Link>
            </li>
        )
    }

    return (
        <header className={clsx("flex py-6 md:px-10 px-4 border-b-2 md:grid items-center md:grid-cols-3", className)} >
            <span className="font-bold text-primary drop-shadow-lg text-sm ">Split Money</span>
            <nav className="flex flex-1 text-sm justify-end text-neutral-800 md:col-start-3">
                {renderAutenticatedLinks()}
            </nav>
        </header>
    )
}
