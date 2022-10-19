import clsx from "clsx"

type linkType = {
    title: string,
    url: string
}

export default function Header() {

    const links: linkType[] = [
        {
            title: "Renda Mensal",
            url: "",
        },
        {
            title: "Histórico",
            url: "",
        }
    ]

    const renderLinks = (link: linkType) => {
        return (
            <li>
                <a href={link.url} className="px-4 py-1 rounded font-semibold">
                    {link.title}
                </a>
            </li>
        )
    }


    return (
        <header className="py-6 px-10 border-b-2 grid grid-cols-3">
            <span className="font-bold text-primary drop-shadow-lg text-sm ">Split Money</span>
            <div className="flex items-center justify-center text-sm text-neutral-800 col-start-2">
                <ul className="flex">
                    {links.map(renderLinks)}
                </ul>
            </div>
        </header>
    )
}
