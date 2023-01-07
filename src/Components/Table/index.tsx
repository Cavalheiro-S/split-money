import { MenuItem, Select, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import clsx from 'clsx';
import moment from 'moment';
import { Bank, CreditCard } from 'phosphor-react';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CustomComponentProps } from '..';
import { RegisterProps } from '../../Context/RegisterContext';
import { useRegister } from '../../Hooks/useRegister';
import { useWindowDimensions } from '../../Hooks/useWindowDimensions';
import { DialogOpenProps } from '../../Pages/Record';
import { convertToMoneyString } from '../../Utils/util';
import { Text } from '../Text';
import { DataGrid } from '@mui/x-data-grid';

interface TableProps extends CustomComponentProps {
    title?: string,
    setDialogOpen?: React.Dispatch<React.SetStateAction<DialogOpenProps>>
}

export default function TableStyled({ title, className, setDialogOpen }: TableProps) {

    const { firestore: { get }, registers, setRegisters } = useRegister();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [monthFilter, setMonthFilter] = useState(moment().format("MM"));
    const [totalRegisters, setTotalRegisters] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const { width } = useWindowDimensions();
    const navigate = useNavigate();

    useEffect(() => {
        const loadRegisters = async () => {
            setLoading(true);
            const registersLength = await get.RegistersLength();
            await get.RegistersByMonth(monthFilter)
            setTotalRegisters(registersLength);
            setLoading(false);
        }
        loadRegisters();
    }, [])

    const renderTableData = () => {
        const registersValue = registers ?? [];
        return registersValue.map((item, index) => {
            if (index >= rowsPerPage) return;
            return renderList(item);
        })
    }
    const renderTotal = () => {
        const registersValue = registers ?? [];
        let total = registersValue.reduce((acumulator, item) => {
            if (item.type === "investiment")
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
                sx={{ cursor: "pointer" }}
                onClick={() => {
                    if (setDialogOpen) {
                        navigate("/record")
                        setDialogOpen({ open: true, register: item });
                    }
                }}
                className='gap-10 transition hover:bg-gray-100 border-y border-collapse'>
                <TableCell sx={{ display: "flex", padding: "0px 8px" }} className='gap-5 items-center h-20'>
                    <TableCell sx={{padding:"0px", display: "flex"}} className={
                        clsx('rounded-full w-10 h-10 items-center justify-center',
                            { "bg-green-100": item.type === "investiment", "bg-red-100": item.type === "expense" })}>
                        {item.type == "investiment" ?
                            <Bank className='text-green-800 h-6 w-6' size={24} /> :
                            <CreditCard className='text-red-800 h-6 w-6' size={24} />}
                    </TableCell>
                    <TableCell sx={{padding: "0px", display: "flex"}} className='flex-col gap-2'>
                        <Text>{item.name}</Text>
                        <Text className='text-neutral-500'>{moment(item.date ?? new Date()).format("DD/MM/YYYY")}</Text>
                    </TableCell>
                </TableCell>
                <TableCell sx={{ padding: "0px 4px" }} align="right">
                    <Text size={width > 768 ? "lg" : "md"} className={
                        clsx("h-20", { "text-green-800": item.type === "investiment", "text-red-800": item.type === "expense" })}>
                        {item.type == "investiment" ? "+\t" : "-\t"}
                        {convertToMoneyString(item.value)}
                    </Text>
                </TableCell>
            </TableRow>
        )
    }
    return (
        <Table className={clsx('border-collapse', className)}>
            <TableHead>
                <TableRow>
                    <Select
                        value={monthFilter}
                        onChange={async (e) => {
                            setMonthFilter(e.target.value)
                            await get.RegistersByMonth(e.target.value);
                        }}
                        variant="standard"
                    >
                        <MenuItem value={"01"}>Janeiro</MenuItem>
                        <MenuItem value={"02"}>Fevereiro</MenuItem>
                        <MenuItem value={"03"}>Março</MenuItem>
                    </Select>
                    <Text size='lg'>
                        {title}
                    </Text>
                </TableRow>
            </TableHead>
            <TableBody>
                {registers.length > 0 ? renderTableData() : (
                    <TableRow className='flex justify-between border-b-2'>
                        <TableCell className='flex-1 p-2 text-center'>
                            <Text size='lg'>Nenhum registro encontrado</Text>
                        </TableCell>
                    </TableRow>)}
                <TableRow className='flex justify-between border-b-2 h-20'>
                    <TableCell className='flex-1 p-2 text-center text-lg'>
                        <Text size='lg'>Total</Text>
                    </TableCell>
                    <TableCell sx={{ padding: "0px 4px" }} align="right">
                        {renderTotal()}
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        labelRowsPerPage='Registros por página'
                        rowsPerPageOptions={[5, 10, 25]}
                        count={totalRegisters}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, number) => {
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
    )
}
