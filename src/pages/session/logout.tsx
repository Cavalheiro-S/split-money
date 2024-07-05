import { Button, Typography } from "antd";
import { routes } from "global.config";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Page() {

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: routes.login })
        }
        catch (error) {
            console.log(error)
        }
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