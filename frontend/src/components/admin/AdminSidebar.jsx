import { NavLink } from "react-router-dom";

import {
    BarChart3,
    Bot,
    ChevronRight,
    ClipboardList,
    FileText,
    Inbox,
    Landmark,
    LayoutGrid,
    MessageSquareText,
    Package,
    Percent,
    Rocket,
    Settings,
    ShoppingBag,
    Sparkles,
    Store,
    UserCog,
    Users,
} from "lucide-react";


const menuItems = [
    {
        label: "Overview",
        icon: LayoutGrid,
        path: "/admin/dashboard",
    },
    {
        label: "Analytics",
        icon: BarChart3,
        path: "/admin/analytics",
        arrow: true,
    },
    {
        label: "Orders",
        icon: ClipboardList,
        path: "/admin/orders",
        arrow: true,
    },
    {
        label: "Products",
        icon: Package,
        path: "/admin/products",
        arrow: true,
    },
    {
        label: "AI Studio",
        icon: Sparkles,
        path: "/admin/ai-studio",
    },
    {
        label: "Sales Agent",
        icon: Bot,
        path: "/admin/sales-agent",
    },
    {
        label: "Customers",
        icon: Users,
        path: "/admin/customers",
    },
    {
        label: "Vendors",
        icon: Store,
        path: "/admin/vendors",
        arrow: true,
    },
    {
        label: "Team",
        icon: UserCog,
        path: "/admin/team",
    },
    {
        label: "Finance",
        icon: Landmark,
        path: "/admin/finance",
        arrow: true,
    },
    {
        label: "Discounts",
        icon: Percent,
        path: "/admin/discounts",
    },
    {
        label: "Boosting",
        icon: Rocket,
        path: "/admin/boosting",
        arrow: true,
    },
    {
        label: "Content",
        icon: FileText,
        path: "/admin/content",
        arrow: true,
    },
    {
        label: "Inbox",
        icon: MessageSquareText,
        path: "/admin/inbox",
    },
];


const AdminSidebar = () => {
    const itemClass = ({ isActive }) =>
        `group flex h-[39px] w-full items-center justify-between rounded-[9px] px-[12px] text-[13px] font-medium transition ${
            isActive
                ? "bg-[#f1f4fb] text-[#316ff4]"
                : "text-[#515a67] hover:bg-[#f7f8fa] hover:text-[#222b38]"
        }`;


    return (
        <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-[245px] flex-col border-r border-[#e6e8eb] bg-white">

            {/* Logo */}

            <div className="flex h-[64px] shrink-0 items-center border-b border-[#eceef1] px-[22px]">

                <NavLink
                    to="/admin/dashboard"
                    className="flex items-center gap-[8px]"
                >
                    <div className="relative flex h-[34px] w-[32px] items-center justify-center rounded-[8px] bg-gradient-to-br from-[#3e7cff] via-[#5e6cff] to-[#9451ff] text-white shadow-sm">
                        <ShoppingBag
                            size={21}
                            strokeWidth={2}
                        />

                        <span className="absolute mt-[2px] text-[10px] font-bold">
                            D.
                        </span>
                    </div>

                    <span className="text-[23px] font-extrabold tracking-[-1px] text-[#202833]">
                        Devify
                    </span>
                </NavLink>

            </div>


            {/* Scrollable Navigation */}

            <div className="flex-1 overflow-y-auto px-[18px] pb-[90px] pt-[10px]">

                <nav className="space-y-[2px]">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                className={itemClass}
                            >
                                <span className="flex items-center gap-[11px]">

                                    <Icon
                                        size={17}
                                        strokeWidth={1.75}
                                    />

                                    <span>
                                        {item.label}
                                    </span>

                                </span>


                                {item.arrow && (
                                    <ChevronRight
                                        size={15}
                                        strokeWidth={1.8}
                                        className="text-[#8d96a1]"
                                    />
                                )}

                            </NavLink>
                        );
                    })}

                </nav>


                {/* Sales Channels */}

                <div className="mt-[34px]">

                    <p className="px-[12px] text-[10px] font-semibold uppercase tracking-[0.8px] text-[#9aa1aa]">
                        Sales Channels
                    </p>

                    <div className="mt-[8px]">

                        <button
                            type="button"
                            className="flex h-[39px] w-full items-center gap-[11px] rounded-[9px] px-[12px] text-[13px] font-medium text-[#515a67] transition hover:bg-[#f7f8fa]"
                        >
                            <Store
                                size={17}
                                strokeWidth={1.75}
                            />

                            Online Store
                        </button>

                    </div>

                </div>

            </div>


            {/* Settings */}

            <div className="absolute bottom-0 left-0 right-0 border-t border-[#eceef1] bg-white px-[18px] py-[10px]">

                <NavLink
                    to="/admin/settings"
                    className="flex h-[40px] items-center gap-[11px] rounded-[12px] bg-[#f1f1f2] px-[12px] text-[13px] font-semibold text-[#1f2732]"
                >
                    <Settings
                        size={18}
                        strokeWidth={1.8}
                    />

                    Settings
                </NavLink>

            </div>

        </aside>
    );
};


export default AdminSidebar;