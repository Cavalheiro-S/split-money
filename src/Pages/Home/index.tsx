import { ChartLine, ListPlus, MathOperations } from "phosphor-react"
import { useNavigate } from "react-router-dom"
import HomeImage from "../../Assets/Imgs/HomeImage.svg"
import { Button } from "../../Components/Button"
import { Card } from "../../Components/Card"
import { Heading } from "../../Components/Heading"
import { Text } from "../../Components/Text"
import { useAuth } from "../../Hooks/useAuth"
export const Home = () => {

    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const handleClick = () => {
        if (currentUser) {
            navigate("/dashboard")
            return;
        }
        navigate("/signin")
    }

    return (
        <div className="flex flex-col justify-center gap-20">
            <section className="flex flex-col md:flex-row gap-20 justify-center items-center h-[70vh]">
                <div className="flex flex-col gap-6 md:max-w-sm justify-center">
                    <Heading className="md:text-start text-center" size="xl">Split Money</Heading>
                    <Text size="lg" className="text-gray-500 text-center md:text-start">Ut eget urna malesuada, pharetra urna ornare, volutpat est. Aenean id quam justo. Maecenas vitae nulla massa. Cras gravida </Text>
                    <Button.Root onClick={() => handleClick()} className="md:self-start">Controle suas finanças</Button.Root>
                </div>
                <img className="max-w-sm" src={HomeImage} alt="Home" />
            </section>
            <section className="flex flex-col items-center mb-20">
                <Heading className="text-center">Funcionalidades</Heading>
                <Text className="text-gray-500 text-center">Algumas das funcionalidades que vão te ajudar a controlar suas finanças</Text>
                <div className="flex flex-col lg:flex-row gap-4 md:gap-12 mt-4 md:mt-12">
                    <Card.Root title="Dashboard" subTitle="Insights sobre suas finanças ">
                        <Card.Icon IconBGColor="green">
                            <ChartLine />
                        </Card.Icon>
                    </Card.Root>
                    <Card.Root title="Calculadora de Renda Mensal" subTitle="Divida seus gasto">
                        <Card.Icon IconBGColor="red">
                            <MathOperations />
                        </Card.Icon>
                    </Card.Root>
                    <Card.Root title="Registros Financeiros" subTitle="Controle seus gastos e investimentos">
                        <Card.Icon IconBGColor="blue">
                            <ListPlus />
                        </Card.Icon>
                    </Card.Root>
                </div>
            </section>
        </div>
    )
}