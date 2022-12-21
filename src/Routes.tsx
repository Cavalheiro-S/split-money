import { ReactElement, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import { Dashboard } from "./Pages/Dashboard";
import History from "./Pages/History";
import Main from "./Pages/Main";
import MonthRevenue from "./Pages/MonthRevenue";
import { Profile } from "./Pages/Profile";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";

interface RouteProps {
    children: ReactElement
}

export const AppRoutes = () => {

    const PrivateRoute = ({ children }: RouteProps) => {
        const auth = useContext(AuthContext)
        if (auth.user.logged)
            return children
        return <Navigate to="/signin" />
    }

    const SignRoute = ({ children }: RouteProps) => {
        const auth = useContext(AuthContext)
        if (!auth.user.logged)
            return children
        return <Navigate to="/monthRevenue" />
    }


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route path="/" element={<h1>HOME</h1>} />
                    <Route path="/signin" element={
                        <SignRoute>
                            <Signin />
                        </SignRoute>
                    } />
                    <Route path="/signup" element={<Signup />} />
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
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}