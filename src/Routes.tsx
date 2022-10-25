import { BrowserRouter, Route, Routes } from "react-router-dom";
import History from "./Pages/History";
import Main from "./Pages/Main";
import MonthRevenue from "./Pages/MonthRevenue";


export const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route path="/monthRevenue" element={<MonthRevenue />} />
                    <Route path="/history" element={<History />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}