import { Outlet } from "react-router-dom";

const VendorLayout = () => {
    return (
        <div className="min-h-screen bg-[#f5f7fb]">
            <Outlet />
        </div>
    );
};

export default VendorLayout;