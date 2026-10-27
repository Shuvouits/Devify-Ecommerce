import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    NavLink,
    useLocation,
} from "react-router-dom";

import {
    BarChart3,
    Bot,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    FileText,
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


/*
|--------------------------------------------------------------------------
| Product Submenu
|--------------------------------------------------------------------------
*/

const productItems = [
    {
        label: "All Products",
        path: "/admin/products",
        end: true,
    },
    {
        label: "Global Variants",
        path: "/admin/global-variants",
    },
    {
        label: "Collections",
        path: "/admin/collections",
    },
    {
        label: "Categories",
        path: "/admin/categories",
    },
    {
        label: "Brands",
        path: "/admin/brands",
    },
    {
        label: "Inventory",
        path: "/admin/inventory",
    },
    {
        label: "Locations",
        path: "/admin/locations",
    },
    {
        label: "Transfers",
        path: "/admin/transfers",
    },
    {
        label: "Reviews",
        path: "/admin/reviews",
    },
];


/*
|--------------------------------------------------------------------------
| Main Menu
|--------------------------------------------------------------------------
*/

const menuItems = [
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
    const location =
        useLocation();


    /*
    |--------------------------------------------------------------------------
    | Products Section Active
    |--------------------------------------------------------------------------
    */

    const isProductsSectionActive =
        useMemo(() => {
            return (
                location.pathname === "/admin/products" ||
                location.pathname.startsWith(
                    "/admin/products/"
                ) ||
                location.pathname.startsWith(
                    "/admin/brands"
                ) ||
                location.pathname.startsWith(
                    "/admin/inventory"
                ) ||
                location.pathname.startsWith(
                    "/admin/locations"
                ) ||
                location.pathname.startsWith(
                    "/admin/transfers"
                ) ||
                location.pathname.startsWith(
                    "/admin/reviews"
                )
            );
        }, [location.pathname]);


    /*
    |--------------------------------------------------------------------------
    | Products Expanded
    |--------------------------------------------------------------------------
    */

    const [
        productsExpanded,
        setProductsExpanded,
    ] =
        useState(
            isProductsSectionActive
        );


    useEffect(() => {
        if (isProductsSectionActive) {
            setProductsExpanded(true);
        }
    }, [isProductsSectionActive]);


    /*
    |--------------------------------------------------------------------------
    | Main Nav Style
    |--------------------------------------------------------------------------
    */

    const itemClass = ({
        isActive,
    }) =>
        [
            "group",
            "flex",
            "h-[37px]",
            "w-full",
            "items-center",
            "justify-between",
            "rounded-[9px]",
            "px-[11px]",
            "text-[12px]",
            "leading-none",
            "font-medium",
            "transition",
            isActive
                ? "bg-[#f1f4fb] text-[#316ff4]"
                : "text-[#515a67] hover:bg-[#f7f8fa] hover:text-[#222b38]",
        ].join(" ");


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
                            size={20}
                            strokeWidth={2}
                        />

                        <span className="absolute mt-[2px] text-[9px] font-bold">
                            D.
                        </span>

                    </div>

                    <span className="text-[21px] font-extrabold tracking-[-0.8px] text-[#202833]">
                        Devify
                    </span>

                </NavLink>

            </div>


            {/* Scrollable Menu */}

            <div className="flex-1 overflow-y-auto px-[18px] pb-[90px] pt-[10px]">

                <nav className="space-y-[1px]">

                    {/* Overview */}

                    <NavLink
                        to="/admin/dashboard"
                        className={itemClass}
                    >
                        <span className="flex items-center gap-[10px]">

                            <LayoutGrid
                                size={16}
                                strokeWidth={1.75}
                            />

                            <span>
                                Overview
                            </span>

                        </span>
                    </NavLink>


                    {/* Analytics */}

                    <NavLink
                        to="/admin/analytics"
                        className={itemClass}
                    >
                        <span className="flex items-center gap-[10px]">

                            <BarChart3
                                size={16}
                                strokeWidth={1.75}
                            />

                            <span>
                                Analytics
                            </span>

                        </span>

                        <ChevronRight
                            size={14}
                            strokeWidth={1.8}
                            className="text-[#8d96a1]"
                        />
                    </NavLink>


                    {/* Orders */}

                    <NavLink
                        to="/admin/orders"
                        className={itemClass}
                    >
                        <span className="flex items-center gap-[10px]">

                            <ClipboardList
                                size={16}
                                strokeWidth={1.75}
                            />

                            <span>
                                Orders
                            </span>

                        </span>

                        <ChevronRight
                            size={14}
                            strokeWidth={1.8}
                            className="text-[#8d96a1]"
                        />
                    </NavLink>


                   {/* Products */}

<div>
    <button
        type="button"
        onClick={() =>
            setProductsExpanded(
                (current) => !current
            )
        }
        style={{
            fontFamily: "inherit",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: 1,
        }}
        className={[
            "group",
            "flex",
            "h-[37px]",
            "w-full",
            "items-center",
            "justify-between",
            "rounded-[9px]",
            "px-[11px]",
            "!text-[12px]",
            "!font-medium",
            "leading-none",
            "transition",
            isProductsSectionActive
                ? "bg-[#eef3ff] text-[#316ff4]"
                : "text-[#515a67] hover:bg-[#f7f8fa] hover:text-[#222b38]",
        ].join(" ")}
    >
        <span className="flex items-center gap-[10px]">
            <Package
                size={16}
                strokeWidth={1.75}
            />

            <span className="!text-[12px] !font-medium leading-none">
                Products
            </span>
        </span>

        <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={[
                "transition-transform duration-200",
                isProductsSectionActive
                    ? "text-[#316ff4]"
                    : "text-[#8d96a1]",
                productsExpanded
                    ? "rotate-0"
                    : "-rotate-90",
            ].join(" ")}
        />
    </button>


    {/* Product Submenu */}

    {productsExpanded && (
        <div className="relative ml-[19px] mt-[2px] pl-[17px]">

            <span className="absolute bottom-[17px] left-[1px] top-0 w-px bg-[#e4e7eb]" />

            <div className="space-y-[1px]">
                {productItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            [
                                "relative",
                                "flex",
                                "h-[32px]",
                                "items-center",
                                "rounded-[9px]",
                                "px-[9px]",
                                "text-[11.5px]",
                                "leading-none",
                                "font-medium",
                                "transition",
                                isActive
                                    ? "bg-[#f1f1f2] font-semibold text-[#252c35]"
                                    : "text-[#67707b] hover:bg-[#f7f8fa] hover:text-[#252c35]",
                            ].join(" ")
                        }
                    >
                        <span className="absolute -left-[16px] top-1/2 h-px w-[12px] bg-[#e4e7eb]" />

                        <span>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </div>

        </div>
    )}
</div>


                    {/* Other Menu Items */}

                    {menuItems.map((item) => {
                        const Icon =
                            item.icon;

                        return (
                            <NavLink
                                key={
                                    item.label
                                }
                                to={
                                    item.path
                                }
                                className={
                                    itemClass
                                }
                            >
                                <span className="flex items-center gap-[10px]">

                                    <Icon
                                        size={16}
                                        strokeWidth={
                                            1.75
                                        }
                                    />

                                    <span>
                                        {
                                            item.label
                                        }
                                    </span>

                                </span>

                                {item.arrow && (
                                    <ChevronRight
                                        size={14}
                                        strokeWidth={
                                            1.8
                                        }
                                        className="text-[#8d96a1]"
                                    />
                                )}

                            </NavLink>
                        );
                    })}

                </nav>


                {/* Sales Channels */}

                <div className="mt-[28px]">

                    <p className="px-[11px] text-[9px] font-semibold uppercase tracking-[0.8px] text-[#9aa1aa]">
                        Sales Channels
                    </p>

                    <div className="mt-[7px]">

                        <button
                            type="button"
                            className="flex h-[37px] w-full items-center gap-[10px] rounded-[9px] px-[11px] text-[12px] leading-none font-medium text-[#515a67] transition hover:bg-[#f7f8fa] hover:text-[#222b38]"
                        >
                            <Store
                                size={16}
                                strokeWidth={1.75}
                            />

                            <span>
                                Online Store
                            </span>
                        </button>

                    </div>

                </div>

            </div>


            {/* Bottom Settings */}

            <div className="absolute bottom-0 left-0 right-0 border-t border-[#eceef1] bg-white px-[18px] py-[10px]">

                <NavLink
                    to="/admin/settings"
                    className={() =>
                        [
                            "flex",
                            "h-[38px]",
                            "items-center",
                            "gap-[10px]",
                            "rounded-[11px]",
                            "px-[11px]",
                            "text-[12px]",
                            "leading-none",
                            "font-semibold",
                            "transition",
                            location.pathname ===
                                "/admin/settings" ||
                            location.pathname.startsWith(
                                "/admin/settings/"
                            )
                                ? "bg-[#f1f1f2] text-[#1f2732]"
                                : "text-[#515a67] hover:bg-[#f7f8fa] hover:text-[#222b38]",
                        ].join(" ")
                    }
                >
                    <Settings
                        size={16}
                        strokeWidth={1.8}
                    />

                    <span>
                        Settings
                    </span>

                </NavLink>

            </div>

        </aside>
    );
};


export default AdminSidebar;