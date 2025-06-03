import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Investment } from "@/types/investment"
import { PlusCircle, Trash2 } from "lucide-react"

type CardInvestimentProps = {
    investment: Investment
    isDeleting: boolean
    setInvestmentToDelete: (id: string) => void
}

export const CardInvestiment = ({ investment, isDeleting, setInvestmentToDelete }: CardInvestimentProps) => {
    return (
        <Card key={investment.id} className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">{investment.ticker}</h2>
                    <p className="text-gray-600">
                        {investment.quantity} unidades x {investment.currency}{' '}
                        {investment.purchasePrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                        Total: R${' '}
                        {(investment.quantity * investment.purchasePrice).toFixed(2)}
                    </p>

                </div>
                <div className='flex flex-col items-end gap-2'>
                    <span className="text-sm text-gray-500">
                        {new Date(investment.purchaseDate).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <PlusCircle className="text-primary cursor-pointer" size={20} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Executar Ação</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => alert("Aplicação Adicionada")}>Adicionar aplicação</DropdownMenuItem>
                                <DropdownMenuItem>Adicionar resgate parcial</DropdownMenuItem>
                                <DropdownMenuItem>Adicionar resgate total</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            className='bg-white p-2 shadow-none hover:bg-red-100 rounded-full'
                            onClick={() => setInvestmentToDelete(investment.id)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="text-red-500 cursor-pointer" size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>

    )
}