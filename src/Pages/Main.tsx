import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <div className="flex flex-col overflow-x-hidden">
            <Header className="h-[10vh] w-100 px-4 md:px-10" />
            <div className="min-h-[90vh] px-4 md:px-10 py-10 relative">
                <Outlet />
            </div>
        </div>
    )
}
