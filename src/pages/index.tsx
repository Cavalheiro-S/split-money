import { Button, Space } from "antd";
import { useRouter } from "next/router";

export default function Page() {

  const router = useRouter();
  
  return (
    <Space className="flex flex-col col-span-2 col-start-1 row-start-2 m-auto">
      <h1 className="text-4xl font-bold"> SPLIT MONEY </h1>
      <span className="text-lg text-gray-500">Seu controle financeiro na palma de suas mãos</span>
      <Button type="primary" onClick={() => {
        router.push("/session/login")
      }}>
        Acessar sua conta
      </Button>
    </Space>
  )
}
