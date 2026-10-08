import {
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    ExternalLink,
    Globe2,
    Package,
    Plus,
    RefreshCcw,
    ShoppingBag,
    Store,
    Users,
} from "lucide-react";


const stats = [
    {
        label: "In-store sales",
        value: "$0.00",
        meta: "0 orders",
        icon: Store,
    },
    {
        label: "Website sales",
        value: "$0.00",
        meta: "0 orders",
        icon: Globe2,
    },
    {
        label: "Total orders",
        value: "0",
        meta: "0 orders",
        icon: Package,
    },
    {
        label: "Discount",
        value: "$0.00",
        meta: "0 orders",
        icon: CircleDollarSign,
    },
    {
        label: "Customers",
        value: "42",
        meta: "0 new in period",
        icon: Users,
    },
    {
        label: "Refunds",
        value: "$0.00",
        meta: "0 refunds",
        icon: RefreshCcw,
    },
];


const chartTimes = [
    "01:00 AM",
    "03:00 AM",
    "05:00 AM",
    "07:00 AM",
    "09:00 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "07:00 PM",
    "09:00 PM",
    "11:00 PM",
];


const AdminDashboard = () => {
    return (
        <div className="px-[25px] pb-[24px] pt-[24px]">

            {/* Header */}

            <div className="flex items-start justify-between gap-6">

                <div>

                    <h1 className="text-[25px] font-bold tracking-[-0.5px] text-[#151d28]">
                        Good morning, Storify.
                    </h1>

                    <p className="mt-[2px] text-[13px] text-[#687483]">
                        Here's what's happening with your store today.
                    </p>

                </div>


                <div className="flex items-center gap-[10px]">

                    <button
                        type="button"
                        className="flex h-[38px] items-center gap-[8px] rounded-[8px] border border-[#dfe2e6] bg-white px-[13px] text-[13px] font-semibold text-[#252d38]"
                    >
                        <CalendarDays
                            size={16}
                            strokeWidth={1.8}
                        />

                        Today

                        <ChevronDown
                            size={14}
                            strokeWidth={1.8}
                        />
                    </button>


                    <button
                        type="button"
                        className="flex h-[38px] items-center gap-[8px] rounded-[8px] border border-[#dfe2e6] bg-white px-[13px] text-[13px] font-semibold text-[#252d38]"
                    >
                        Analytics

                        <ExternalLink
                            size={14}
                            strokeWidth={1.8}
                        />
                    </button>


                    <button
                        type="button"
                        className="flex h-[38px] items-center gap-[8px] rounded-[8px] bg-[#3f73f7] px-[14px] text-[13px] font-semibold text-white"
                    >
                        <ShoppingBag
                            size={16}
                            strokeWidth={1.8}
                        />

                        Orders

                        <ExternalLink
                            size={14}
                            strokeWidth={1.8}
                        />
                    </button>

                </div>

            </div>


            {/* Stats */}

            <div className="mt-[18px] grid grid-cols-6 gap-[12px]">

                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.label}
                            className="relative min-h-[101px] rounded-[11px] border border-[#dedfe3] bg-white px-[15px] py-[14px]"
                        >

                            <Icon
                                size={17}
                                strokeWidth={1.7}
                                className="absolute right-[14px] top-[15px] text-[#68717b]"
                            />


                            <p className="text-[11px] text-[#717b87]">
                                {item.label}
                            </p>


                            <p className="mt-[7px] text-[20px] font-semibold leading-none text-[#121a24]">
                                {item.value}
                            </p>


                            <div className="mt-[8px] flex items-center gap-[7px]">

                                <span className="text-[11px] text-[#77818c]">
                                    {item.meta}
                                </span>

                                <span className="text-[11px] text-[#ff4545]">
                                    100% ↘
                                </span>

                            </div>

                        </div>
                    );
                })}

            </div>


            {/* Orders Analytics */}

            <section className="mt-[14px] overflow-hidden rounded-[12px] border border-[#dedfe3] bg-white">

                {/* Card Header */}

                <div className="flex items-start justify-between px-[20px] pb-[14px] pt-[18px]">

                    <div>

                        <h2 className="text-[18px] font-semibold text-[#17202b]">
                            Orders
                        </h2>

                        <p className="mt-[1px] text-[12px] text-[#707b88]">
                            Hourly · Oct 8, 2026
                        </p>

                    </div>


                    <button
                        type="button"
                        className="flex h-[34px] items-center gap-[8px] rounded-[7px] border border-[#dfe2e6] bg-white px-[13px] text-[12px] font-medium text-[#242c36]"
                    >
                        <Plus
                            size={15}
                            strokeWidth={1.8}
                        />

                        Add activity
                    </button>

                </div>


                <div className="grid grid-cols-[minmax(0,1fr)_310px] border-t border-[#f1f2f4]">

                    {/* Chart */}

                    <div className="relative min-h-[395px] border-r border-[#e6e8eb] px-[42px] pb-[54px] pt-[25px]">

                        {/* Y Axis Labels */}

                        <div className="absolute bottom-[55px] left-[20px] top-[25px] flex flex-col justify-between text-[10px] text-[#777f89]">

                            <span>4</span>
                            <span>3</span>
                            <span>2</span>
                            <span>1</span>
                            <span>0</span>

                        </div>


                        {/* Horizontal Lines */}

                        <div className="absolute bottom-[55px] left-[40px] right-[22px] top-[25px] flex flex-col justify-between">

                            {[1, 2, 3, 4, 5].map((line) => (
                                <div
                                    key={line}
                                    className="h-px w-full bg-[#e9ebee]"
                                />
                            ))}

                        </div>


                        {/* X Labels */}

                        <div className="absolute bottom-[24px] left-[53px] right-[21px] flex justify-between">

                            {chartTimes.map((time) => (
                                <span
                                    key={time}
                                    className="text-[9px] text-[#707983]"
                                >
                                    {time}
                                </span>
                            ))}

                        </div>


                        {/* Legend */}

                        <div className="absolute bottom-[2px] left-1/2 flex -translate-x-1/2 items-center gap-[17px]">

                            <span className="flex items-center gap-[6px] text-[10px] text-[#626c77]">

                                <span className="h-[8px] w-[8px] rounded-[2px] bg-[#316ff4]" />

                                In-store

                            </span>


                            <span className="flex items-center gap-[6px] text-[10px] text-[#626c77]">

                                <span className="h-[8px] w-[8px] rounded-[2px] bg-[#c6c9cd]" />

                                Online

                            </span>

                        </div>

                    </div>


                    {/* Right Panel */}

                    <div className="px-[19px] py-[18px]">

                        {/* Tabs */}

                        <div className="flex items-center gap-[24px] border-b border-[#e3e5e8]">

                            <button
                                type="button"
                                className="border-b-2 border-[#171d25] pb-[10px] text-[12px] font-semibold text-[#171d25]"
                            >
                                Orders
                            </button>

                            <button
                                type="button"
                                className="pb-[10px] text-[12px] text-[#707984]"
                            >
                                Sales
                            </button>

                        </div>


                        <div className="mt-[18px] text-[23px] font-semibold text-[#131b25]">
                            0
                        </div>


                        {/* Progress */}

                        <div className="mt-[19px] h-[7px] w-full rounded-full bg-[#f0f1f3]" />


                        <div className="mt-[9px] flex items-center justify-between">

                            <div className="flex items-center gap-[6px] text-[10px] text-[#68727e]">

                                <span className="h-[7px] w-[7px] rounded-[2px] bg-[#316ff4]" />

                                In-store

                                <span className="font-semibold text-[#25303c]">
                                    0
                                </span>

                            </div>


                            <div className="flex items-center gap-[6px] text-[10px] text-[#68727e]">

                                <span className="h-[7px] w-[7px] rounded-[2px] bg-[#bfc3c8]" />

                                Online

                                <span className="font-semibold text-[#25303c]">
                                    0
                                </span>

                            </div>

                        </div>


                        <p className="mt-[25px] text-[12px] leading-[20px] text-[#6c7682]">
                            Totals for the selected period, split by sales channel.
                        </p>


                        <button
                            type="button"
                            className="mt-[22px] flex h-[46px] w-full items-center justify-between rounded-[12px] border border-[#dfe2e6] bg-white px-[13px] text-[12px] font-medium text-[#18212c]"
                        >
                            <span className="flex items-center gap-[9px]">

                                <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#eef4ff] text-[#316ff4]">
                                    📣
                                </span>

                                Show all highlights

                            </span>

                            <ChevronRight
                                size={15}
                                strokeWidth={1.8}
                            />
                        </button>


                        <button
                            type="button"
                            className="mt-[8px] flex h-[46px] w-full items-center justify-between rounded-[12px] border border-[#dfe2e6] bg-white px-[13px] text-[12px] font-medium text-[#18212c]"
                        >
                            <span className="flex items-center gap-[9px]">

                                <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#eef4ff] text-[#316ff4]">
                                    ▦
                                </span>

                                Show all sales data

                            </span>

                            <ChevronRight
                                size={15}
                                strokeWidth={1.8}
                            />
                        </button>

                    </div>

                </div>

            </section>

        </div>
    );
};


export default AdminDashboard;