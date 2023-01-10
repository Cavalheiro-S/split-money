import {
    FormControl, FormLabel,
    IconButton, InputAdornment, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import clsx from 'clsx';
import moment from 'moment';
import { Bank, CreditCard, MagnifyingGlass, Pen, Trash } from 'phosphor-react';
import { useEffect, useState } from "react";
import { CustomComponentProps } from '..';
import NoDataSVG from "../../Assets/Imgs/noData.svg";
import { RegisterProps } from '../../Context/RegisterContext';
import { useRegister } from '../../Hooks/useRegister';
import { useWindowDimensions } from '../../Hooks/useWindowDimensions';
import { DialogOpenProps } from '../../Pages/Record';
import { convertToMoneyString } from '../../Utils/util';
import { Text } from '../Text';

interface TableProps extends CustomComponentProps {
    title?: string,
    setDialogOpen?: React.Dispatch<React.SetStateAction<DialogOpenProps>>
}

export default function TableStyled({ title, className, setDialogOpen }: TableProps) {

    const { firestore: { get, deleteRegister }, registers } = useRegister();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dateFilter, setDateFilter] = useState(new Date());
    const [registersByMonth, setRegistersByMonth] = useState<RegisterProps[]>([]);
    const [registersByPage, setRegistersByPage] = useState<RegisterProps[]>([]);

    const [totalRegisters, setTotalRegisters] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const { width } = useWindowDimensions();

    useEffect(() => {
        const loadRegisters = async () => {
            setLoading(true);
            const registersResult = await get.RegistersByMonth(moment(dateFilter).format("M"))
            setRegistersByMonth(registersResult);
            setRegistersByPage(registersResult);
            setTotalRegisters(registersResult.length);
            setLoading(false);
        }
        loadRegisters();
    }, [registers])

    const renderTableData = () => {
        const registersValue = registersByPage ?? [];
        const tableRows = registersValue.map((item, index) => {
            if (index >= rowsPerPage) return;
            return renderList(item);
        })
        tableRows.push((
            <TableRow className='h-20'>
                <TableCell colSpan={3} align="right">
                    <Text size='lg'>Total</Text>
                </TableCell>
                <TableCell colSpan={2} align="left">
                    {renderTotal()}
                </TableCell>
            </TableRow>
        ));
        return tableRows;
    }
    const renderTotal = () => {
        const registersValue = registersByMonth ?? [];
        let total = registersValue.reduce((acumulator, item) => {
            if (item.type === "incoming")
                return acumulator + Number(item.value);
            return acumulator - Number(item.value);
        }, 0);
        if (total < 0) {
            total = total * -1;
            return <Text className='text-red-800' size='lg'>- {convertToMoneyString(total)}</Text>;
        }
        return <Text className='text-green-800'>{convertToMoneyString(total)}</Text>
    }

    const renderList = (item: RegisterProps) => {

        return (
            <TableRow
                key={item.id}
                className="hover:bg-gray-100"
                sx={{ height: "80px" }}>
                <TableCell sx={{ padding: "0px 8px" }} className="flex w-10">
                    {item.type == "incoming" ?
                        <Bank className='text-white bg-green-800 p-2 rounded-full' size={40} /> :
                        <CreditCard className='text-white bg-red-800 p-2 rounded-full' size={40} />}
                </TableCell>
                <TableCell>
                    <Text size={width > 768 ? "lg" : "md"} className='text-neutral-500'>{item.name}</Text>
                </TableCell>
                <TableCell>
                    <Text className='text-neutral-500'>{moment(item.date ?? new Date()).format("DD/MM/YYYY")}</Text>
                </TableCell>
                <TableCell align="left">
                    <Text size={width > 768 ? "lg" : "md"} className={
                        clsx("h-20", { "text-green-800": item.type === "incoming", "text-red-800": item.type === "expense" })}>
                        {item.type == "incoming" ? "+\t" : "-\t"}
                        {convertToMoneyString(item.value)}
                    </Text>
                </TableCell>
                <TableCell>
                    <IconButton
                        onClick={() => setDialogOpen && setDialogOpen({ open: true, register: item })}
                        color="secondary"><Pen /></IconButton>
                    <IconButton
                        onClick={() => deleteRegister(item.id)}
                        color="error"><Trash /></IconButton>
                </TableCell>
            </TableRow>
        )
    }
    return (
        <>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <FormControl className="md:w-48 w-full">
                    <FormLabel>Filtrar por mês</FormLabel>
                    <DatePicker
                        value={dateFilter}
                        openTo="month"
                        onChange={async (date) => {
                            setDateFilter(date ?? new Date());
                            const registersResult = await get.RegistersByMonth(moment(date).format("M"));
                            setRegistersByMonth(registersResult);
                            setTotalRegisters(registersResult.length);
                        }}
                        views={["year", "month"]}
                        InputProps={{ sx: { height: "40px" } }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </FormControl>
                {/* <TextField size="small"
                    className="md:w-48 w-full"
                    sx={{ margin: "8px 0px", outline: "none" }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <MagnifyingGlass />
                            </InputAdornment>)
                    }} /> */}
            </div>
            {registersByMonth.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96">
                    <img src={NoDataSVG} alt="No data" />
                    <Text size="lg" className="text-font">Nenhum registro encontrado</Text>
                    <Text className="text-gray-500">Adicione um novo registro clicando no botão "Adicionar"</Text>
                </div>) : (
                <TableContainer className="overflow-x-auto">
                    <Table sx={{ overflowX: "auto" }} className={clsx('border rounded', className)}>
                        <TableHead>
                            <TableRow sx={{ height: "60px" }}>
                                <TableCell sx={{ padding: "0px 8px" }} className='md:w-10'>
                                </TableCell>
                                <TableCell sx={{ padding: "0px 8px" }}>
                                    <Text className="font-semibold">Nome</Text>
                                </TableCell>
                                <TableCell sx={{ padding: "0px 8px" }}>
                                    <Text className="font-semibold">Data</Text>
                                </TableCell>
                                <TableCell sx={{ padding: "0px 8px" }}>
                                    <Text className="font-semibold">Valor</Text>
                                </TableCell>
                                <TableCell sx={{ padding: "0px 8px" }} className='w-36'></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTableData()}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    labelRowsPerPage='Registros por página'
                                    labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count}`}
                                    rowsPerPageOptions={[5, 10, 25]}
                                    count={totalRegisters}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={async (event, number) => {
                                        const registersTemp = await get.RegistersByMonth(moment(dateFilter).format("M"));
                                        setRegistersByPage([...registersTemp.slice(number * rowsPerPage, (number + 1) * rowsPerPage)])
                                        setPage(number);
                                    }}
                                    onRowsPerPageChange={(event) => {
                                        const rowsPerPage = Number(event.target.value);
                                        setRowsPerPage(rowsPerPage);
                                    }}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>)}
        </>
    )
}
