import {
    ChevronRight,
} from "lucide-react";

import {
    Link,
    Outlet,
} from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";




const CustomerLayout = () => {
    return (
        <div className="w-full bg-white">

            {/* Breadcrumb */}

            <div className="border-b border-[#edf0f3]">

                <div className="mx-auto flex h-[42px] max-w-[1300px] items-center gap-[8px] px-4 text-[12px] xl:px-0">

                    <Link
                        to="/"
                        className="text-[#607085] transition hover:text-[#3f73f7]"
                    >
                        Home
                    </Link>

                    <ChevronRight
                        size={13}
                        strokeWidth={1.7}
                        className="text-[#8e98a5]"
                    />

                    <span className="font-medium text-[#233044]">
                        Account
                    </span>

                </div>

            </div>


            {/* Dashboard Area */}

            <div className="mx-auto max-w-[1300px] px-4 pb-[40px] pt-[30px] xl:px-0">

                <div className="grid grid-cols-1 gap-[28px] lg:grid-cols-[250px_minmax(0,1fr)]">

                    {/* Sidebar */}

                    <CustomerSidebar />


                    {/* Dynamic Account Content */}

                    <main className="min-w-0">
                        <Outlet />
                    </main>

                </div>

            </div>

        </div>
    );
};


export default CustomerLayout;