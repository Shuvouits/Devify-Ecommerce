import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    Bell,
    Bot,
    Box,
    CreditCard,
    Grid3X3,
    KeyRound,
    Mail,
    MapPin,
    MessageSquare,
    Monitor,
    Palette,
    Search,
    Shield,
    Store,
} from "lucide-react";


const settingsItems = [
    {
        label: "General Settings",
        icon: Store,
    },
    {
        label: "Branding",
        icon: Palette,
    },
    {
        label: "Multi-Vendor Mode",
        icon: Grid3X3,
    },
    {
        label: "Point of Sale (POS) Access",
        icon: Monitor,
    },
    {
        label: "Inventory Locations",
        icon: MapPin,
    },
    {
        label: "Two-Factor Authentication",
        icon: Shield,
    },
    {
        label: "OAuth / Social Login",
        icon: KeyRound,
        path: "/admin/settings/social-login",
    },
    {
        label: "AI Configuration",
        icon: Bot,
    },
    {
        label: "Security & Access Control",
        icon: Shield,
    },
    {
        label: "Payment Settings",
        icon: CreditCard,
    },
    {
        label: "Email Configuration (SMTP)",
        icon: Mail,
        path: "/admin/settings/email",
    },
    {
        label: "Notification Settings",
        icon: Bell,
    },
    {
        label: "Omnichannel Messaging",
        icon: MessageSquare,
    },
    {
        label: "Order Settings",
        icon: Box,
    },
];


const SettingsSidebar = () => {
    const navigate = useNavigate();


    return (
        <aside className="sticky top-0 flex h-screen w-[305px] shrink-0 flex-col border-r border-[#dde1e6] bg-white">

            {/* Store */}

            <div className="border-b border-[#e7eaee] px-[14px] py-[13px]">

                <div className="flex items-center gap-[11px]">

                    <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-[#eef4ff] text-[#2f6ff3]">

                        <Store
                            size={18}
                            strokeWidth={1.7}
                        />

                    </div>


                    <div className="min-w-0">

                        <div className="text-[14px] font-semibold leading-[20px] text-[#172333]">
                            Storify
                        </div>


                        <div className="mt-[1px] truncate text-[10px] font-normal leading-[15px] text-[#7d8794]">
                            http://localhost:5173
                        </div>

                    </div>

                </div>

            </div>


            {/* Search */}

            <div className="px-[13px] pt-[12px]">

                <div className="flex h-[34px] items-center rounded-[9px] border border-[#dadde2] bg-[#fafafa] px-[11px]">

                    <Search
                        size={15}
                        strokeWidth={1.7}
                        className="mr-[9px] shrink-0 text-[#8a929c]"
                    />


                    <input
                        type="text"
                        placeholder="Search settings"
                        className="h-full min-w-0 flex-1 border-0 bg-transparent !text-[13px] !font-normal !leading-[20px] text-[#333333] outline-none placeholder:!text-[13px] placeholder:!font-normal placeholder:text-[#9299a3]"
                    />

                </div>

            </div>


            {/* Menu */}

            <div className="flex-1 overflow-y-auto px-[13px] pb-[85px] pt-[7px]">

                <div className="space-y-[2px]">

                    {settingsItems.map((item) => {
                        const Icon = item.icon;


                        if (item.path) {
                            return (
                                <NavLink
                                    key={item.label}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex h-[37px] w-full items-center gap-[11px] rounded-[8px] px-[10px] !text-[13px] !font-normal !leading-[20px] transition ${
                                            isActive
                                                ? "bg-[#eaf1ff] text-[#2365d8]"
                                                : "text-[#333333] hover:bg-[#f6f7f9]"
                                        }`
                                    }
                                >

                                    <Icon
                                        size={16}
                                        strokeWidth={1.7}
                                        className="shrink-0"
                                    />


                                    <span className="min-w-0 truncate !text-[13px] !font-normal !leading-[20px]">
                                        {item.label}
                                    </span>

                                </NavLink>
                            );
                        }


                        return (
                            <button
                                key={item.label}
                                type="button"
                                className="flex h-[37px] w-full items-center gap-[11px] rounded-[8px] px-[10px] text-left !text-[13px] !font-normal !leading-[20px] text-[#333333] transition hover:bg-[#f6f7f9]"
                            >

                                <Icon
                                    size={16}
                                    strokeWidth={1.7}
                                    className="shrink-0"
                                />


                                <span className="min-w-0 truncate !text-[13px] !font-normal !leading-[20px]">
                                    {item.label}
                                </span>

                            </button>
                        );
                    })}

                </div>

            </div>


            {/* Dashboard */}

            <div className="absolute bottom-0 left-0 right-0 border-t border-[#e7eaee] bg-white px-[96px] py-[13px]">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                    className="flex h-[34px] items-center justify-center gap-[8px] whitespace-nowrap rounded-full border border-[#dcdfe4] bg-white px-[16px] !text-[13px] !font-normal !leading-[20px] text-[#333333] transition hover:bg-[#f8f9fa]"
                >

                    <Grid3X3
                        size={14}
                        strokeWidth={1.7}
                    />


                    <span className="!text-[13px] !font-normal !leading-[20px]">
                        Dashboard
                    </span>

                </button>

            </div>

        </aside>
    );
};


export default SettingsSidebar;