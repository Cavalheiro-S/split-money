import { ReactElement, ReactNode } from "react";
import { BrowserRouter, Navigate, NavigateProps, Route, RouteProps, Routes } from "react-router-dom";
import History from "./Pages/History";
import Main from "./Pages/Main";
import MonthRevenue from "./Pages/MonthRevenue";
import Signin from "./Pages/Signin";

interface PrivateRouteProps {
    children: ReactElement
}

export const AppRoutes = () => {

    const PrivateRoute = ({ children }: PrivateRouteProps) => {
        if (false)
            return children
        return <Navigate to="/signin" />
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/monthRevenue" element={
                        <PrivateRoute>
                            <MonthRevenue />
                        </PrivateRoute>
                    } />
                    <Route path="/history" element={
                        <PrivateRoute>
                            <History />
                        </PrivateRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}