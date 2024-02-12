import { AuthContext } from "@/context/auth-context";
import { Button, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies"
import { useContext } from "react";

export default function Page() {
    const router = useRouter()
    const { setIsAuthenticated } = useContext(AuthContext)

    const handleSignOut = () => {
        destroyCookie(null, "split.money.token")
        setIsAuthenticated(false)
        router.push("/")
    }

    return (
        <div className="flex flex-col col-start-2 row-start-2 gap-4 p-4 m-auto bg-white rounded">
            <Typography.Text className="text-lg font-bold">Você tem certeza que quer se desconectar da sua conta ?</Typography.Text>
            <div className="flex items-center justify-between gap-2">
                <Link className="text-sm text-gray-500 hover:underline" href="/"> Voltar para página inicial</Link>
                <Button onClick={handleSignOut}>Sim</Button>
            </div>

        </div>
    )
}