import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <div className="flex flex-col items-center">
            <Header className="w-screen" />
            <Outlet />
        </div>
    )
}
