import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./Components/PrivateRoute";
import { Dashboard } from "./Pages/Dashboard";
import { Home } from "./Pages/Home";
import Main from "./Pages/Main";
import { Profile } from "./Pages/Profile";
import Record from "./Pages/Record";
import RevenueCalculator from "./Pages/RevenueCalculator";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";

export const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<Navigate to="/" />} />
                    <Route path="/revenueCalculator" element={
                        <PrivateRoute>
                            <RevenueCalculator />
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