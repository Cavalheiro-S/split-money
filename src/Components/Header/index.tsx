import clsx from "clsx"
import { Link } from "react-router-dom"

interface HeaderProps {
    className?: string,
}

type linkType = {
    title: string,
    url: string
}

export default function Header({ className }: HeaderProps) {

    const links: linkType[] = [
        {
            title: "Renda Mensal",
            url: "/monthRevenue",
        },
        {
            title: "Histórico",
            url: "/history",
        }
    ]

    const renderLinks = (link: linkType) => {
        return (
            <li>
                <Link to={link.url} className="px-4 py-1 rounded font-semibold">
                    {link.title}
                </Link>
            </li>
        )
    }


    return (
        <header className={clsx("py-6 md:px-10 px-4 border-b-2 grid grid-cols-2 items-center md:grid-cols-3", className)} >
            <span className="font-bold text-primary drop-shadow-lg text-sm ">Split Money</span>
            <div className="flex items-center justify-center text-sm text-neutral-800 col-start-2">
                <ul className="flex items-center justify-items-center">
                    {links.map(renderLinks)}
                </ul>
            </div>
        </header>
    )
}
