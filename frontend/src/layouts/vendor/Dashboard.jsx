import { getStoredUser } from "../../utils/auth";

const VendorDashboard = () => {
    const user = getStoredUser();

    return (
        <div className="min-h-screen p-8">

            <div className="mx-auto max-w-[1300px]">

                <div className="rounded-[16px] border border-[#e2e6ec] bg-white p-8 shadow-sm">

                    <p className="text-[13px] font-semibold uppercase tracking-wide text-[#286bd7]">
                        Vendor Dashboard
                    </p>

                    <h1 className="mt-2 text-[30px] font-bold text-[#172536]">
                        Welcome, {user?.name || "Vendor"}
                    </h1>

                    <p className="mt-2 text-[14px] text-[#788493]">
                        Manage your store, products, inventory, orders and sales.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default VendorDashboard;