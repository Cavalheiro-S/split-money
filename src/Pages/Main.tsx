import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <div className="flex flex-col">
            <Header className="h-[10vh] w-screen px-10" />
            <div className="h-[90vh] md:px-10">
                <Outlet />
            </div>
        </div>
    )
}
