import { Outlet } from "react-router-dom";

import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";


const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-[#f7f7f8]">

            <AdminSidebar />

            <AdminHeader />


            <main className="ml-[245px] min-h-screen pt-[64px]">

                <Outlet />

            </main>

        </div>
    );
};


export default AdminLayout;