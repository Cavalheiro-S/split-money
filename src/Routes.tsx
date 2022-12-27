import { ReactElement, useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./Components/PrivateRoute";
import { AuthContext } from "./Context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Dashboard } from "./Pages/Dashboard";
import Record from "./Pages/Record";
import Main from "./Pages/Main";
import MonthRevenue from "./Pages/MonthRevenue";
import { Profile } from "./Pages/Profile";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import { Home } from "./Pages/Home";

export const AppRoutes = () => {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route path="/" element={<Home/>} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/monthRevenue" element={
                        <PrivateRoute>
                            <MonthRevenue />
                        </PrivateRoute>
                    } />
                    <Route path="/record" element={
                        <PrivateRoute>
                            <Record />
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