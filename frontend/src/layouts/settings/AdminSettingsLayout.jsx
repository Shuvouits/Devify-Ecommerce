import { Outlet, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import SettingsSidebar from "../../components/admin/settings/SettingsSidebar";


const AdminSettingsLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f4f5f7]">

            <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">

                <SettingsSidebar />


                {/* Content */}

                <main className="relative min-w-0 flex-1 px-[22px] py-[14px]">

                    {/* Close */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/dashboard")
                        }
                        className="fixed right-[20px] top-[122px] z-30 flex h-[35px] w-[35px] items-center justify-center rounded-full border border-[#dde1e5] bg-white text-[#737d88] shadow-sm transition hover:bg-[#f8f9fa]"
                    >
                        <X
                            size={18}
                            strokeWidth={1.7}
                        />
                    </button>


                    <Outlet />

                </main>

            </div>

        </div>
    );
};


export default AdminSettingsLayout;