import { useState } from "react";

import {
    Bell,
    FileText,
    Heart,
    LayoutDashboard,
    LogOut,
    MapPin,
    MessageSquare,
    Package,
    Pencil,
    ShieldCheck,
    SlidersHorizontal,
    UserRound,
    WalletCards,
} from "lucide-react";

import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import api from "../../api/axios";

import {
    clearAuth,
    getStoredUser,
} from "../../utils/auth";


const CustomerSidebar = () => {
    const navigate = useNavigate();

    const [loggingOut, setLoggingOut] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | CURRENT LOGGED-IN CUSTOMER
    |--------------------------------------------------------------------------
    */

    const customer = getStoredUser();


    /*
    |--------------------------------------------------------------------------
    | CUSTOMER INITIALS
    |--------------------------------------------------------------------------
    */

    const getInitials = (name) => {
        if (!name) {
            return "CU";
        }

        return name
            .trim()
            .split(/\s+/)
            .map((word) =>
                word.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };


    /*
    |--------------------------------------------------------------------------
    | CUSTOMER AVATAR
    |--------------------------------------------------------------------------
    |
    | Backend theke avatar / avatar_url jeta ashbe,
    | seta automatically use korbe.
    |
    */

    const customerAvatar =
        customer?.avatar ||
        customer?.avatar_url ||
        null;


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {
        if (loggingOut) {
            return;
        }

        setLoggingOut(true);

        try {
            await api.post(
                "/auth/logout"
            );

        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

        } finally {
            clearAuth();

            navigate(
                "/login",
                {
                    replace: true,
                }
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | NAV ITEM
    |--------------------------------------------------------------------------
    */

    const navItemClass = ({
        isActive,
    }) =>
        `flex h-[38px] items-center justify-between rounded-[8px] px-[10px] text-[13px] font-medium transition ${
            isActive
                ? "bg-[#3f73f7] text-white"
                : "text-[#526173] hover:bg-[#f5f7fa] hover:text-[#1f2c3d]"
        }`;


    return (
        <aside className="h-fit rounded-[10px] border border-[#e4e7eb] bg-white p-[14px]">

            {/* Profile */}

            <div className="flex items-start gap-[11px] border-b border-[#edf0f3] pb-[14px]">

                <div className="relative">

                    {/* Avatar */}

                    <div className="flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#c7d9ff] to-[#f1d4db] text-[14px] font-bold text-[#46546a]">

                        {customerAvatar ? (
                            <img
                                src={customerAvatar}
                                alt={
                                    customer?.name ||
                                    "Customer"
                                }
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            getInitials(
                                customer?.name
                            )
                        )}

                    </div>


                    {/* Edit Profile */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/account/profile"
                            )
                        }
                        className="absolute -bottom-[3px] -right-[2px] flex h-[21px] w-[21px] items-center justify-center rounded-full border border-[#e2e5e9] bg-white text-[#718096] shadow-sm transition hover:text-[#286bd7]"
                        aria-label="Edit profile"
                    >

                        <Pencil
                            size={11}
                            strokeWidth={1.8}
                        />

                    </button>

                </div>


                {/* Customer Info */}

                <div className="min-w-0 pt-[3px]">

                    <h3 className="truncate text-[14px] font-semibold text-[#172536]">

                        {customer?.name ||
                            "Customer"}

                    </h3>


                    <p className="mt-[2px] truncate text-[11px] text-[#718096]">

                        {customer?.email ||
                            "No email available"}

                    </p>

                </div>

            </div>


            {/* Dashboard */}

            <div className="pt-[13px]">

                <p className="mb-[7px] px-[8px] text-[10px] font-semibold uppercase tracking-[0.7px] text-[#697789]">
                    Dashboard
                </p>


                <div className="space-y-[2px]">

                    <NavLink
                        to="/account"
                        end
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <LayoutDashboard
                                size={16}
                            />

                            Overview

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/orders"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <Package
                                size={16}
                            />

                            My Orders

                        </span>


                        <span className="rounded-[5px] border border-[#dfe4ea] bg-white px-[6px] py-[1px] text-[10px] text-[#536173]">
                            15
                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/notifications"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <Bell
                                size={16}
                            />

                            Notifications

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/inbox"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <MessageSquare
                                size={16}
                            />

                            Inbox

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/quotes"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <FileText
                                size={16}
                            />

                            Quotes

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/wishlist"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <Heart
                                size={16}
                            />

                            Wishlist

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/store-credit"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <WalletCards
                                size={16}
                            />

                            Store credit

                        </span>

                    </NavLink>

                </div>

            </div>


            {/* Settings */}

            <div className="mt-[13px]">

                <p className="mb-[7px] px-[8px] text-[10px] font-semibold uppercase tracking-[0.7px] text-[#697789]">
                    Settings
                </p>


                <div className="space-y-[2px]">

                    <NavLink
                        to="/account/profile"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <UserRound
                                size={16}
                            />

                            Profile

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/preferences"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <SlidersHorizontal
                                size={16}
                            />

                            Preferences

                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/addresses"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <MapPin
                                size={16}
                            />

                            Addresses

                        </span>


                        <span className="rounded-[5px] border border-[#dfe4ea] bg-white px-[6px] py-[1px] text-[10px] text-[#536173]">
                            1
                        </span>

                    </NavLink>


                    <NavLink
                        to="/account/security"
                        className={
                            navItemClass
                        }
                    >

                        <span className="flex items-center gap-[10px]">

                            <ShieldCheck
                                size={16}
                            />

                            Security

                        </span>

                    </NavLink>

                </div>

            </div>


            {/* Logout */}

            <div className="mt-[14px] border-t border-[#edf0f3] pt-[12px]">

                <button
                    type="button"
                    onClick={
                        handleLogout
                    }
                    disabled={
                        loggingOut
                    }
                    className="flex h-[37px] w-full items-center gap-[10px] rounded-[8px] border border-[#e2e5e9] bg-white px-[10px] text-[13px] font-medium text-[#526173] transition hover:bg-[#f8f9fb] hover:text-[#222d3d] disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <LogOut
                        size={16}
                        strokeWidth={1.7}
                    />


                    {loggingOut
                        ? "Signing out..."
                        : "Sign out"
                    }

                </button>

            </div>

        </aside>
    );
};


export default CustomerSidebar;