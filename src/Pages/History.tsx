import { Table } from '../Components/Table'

export default function History() {
    return (
        <Table headers={["Nome", "Tipo"]}>
            <tr>
                <td className='p-4'>Depósito 99pop</td>
                <td className='p-4'>Investimento</td>
            </tr>
        </Table>
    )
}
