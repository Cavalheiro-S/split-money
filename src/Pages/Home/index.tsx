import { Button } from "../../Components/Button"
import { Heading } from "../../Components/Heading"
import { Text } from "../../Components/Text"
import HomeImage from "../../assets/imgs/HomeImage.svg"
import { Card } from "../../Components/Card"
import { ChartLine, ListPlus, MathOperations } from "phosphor-react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
export const Home = () => {

    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const handleClick = () => {
        if(currentUser)
            navigate("/dashboard")
        else
            navigate("/signin")
    }

    return (
        <div className="flex flex-col h-full justify-center gap-20">
            <section className="flex gap-20 justify-center h-100">
                <div className="flex flex-col gap-6 max-w-sm justify-center">
                    <Heading size="xl">Split Money</Heading>
                    <Text size="lg" className="text-gray-500">Ut eget urna malesuada, pharetra urna ornare, volutpat est. Aenean id quam justo. Maecenas vitae nulla massa. Cras gravida </Text>
                    <Button.Root onClick={() => handleClick()} className="self-start">Controle suas finanças</Button.Root>
                </div>
                <img src={HomeImage} alt="Home" />
            </section>
            <section className="flex flex-col items-center">
                <Heading className="text-center">Funcionalidades</Heading>
                <Text className="text-gray-500">Algumas das funcionalidades que vão te ajudar a controlar suas finanças</Text>
                <div className="flex gap-12 mt-12">
                    <Card.Root title="Dashboard" subTitle="Insights sobre suas finanças ">
                        <Card.Icon IconBGColor="green">
                            <ChartLine/>
                        </Card.Icon>
                    </Card.Root>
                    <Card.Root title="Calculadora de Renda Mensal" subTitle="Divida seus gasto">
                        <Card.Icon IconBGColor="red">
                            <MathOperations/>
                        </Card.Icon>
                    </Card.Root>
                    <Card.Root title="Registros Financeiros" subTitle="Controle seus gastos e investimentos">
                        <Card.Icon IconBGColor="blue">
                            <ListPlus/>
                        </Card.Icon>
                    </Card.Root>
                </div>
            </section>
        </div>
    )
}