import {
    Bell,
    ChevronDown,
    Globe2,
    LogOut,
    PanelLeft,
    Search,
    Settings,
    ShoppingCart,
    UserRound,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import api from "../../api/axios";

import {
    clearAuth,
    getStoredUser,
} from "../../utils/auth";


const AdminHeader = () => {
    const navigate = useNavigate();

    const dropdownRef = useRef(null);

    const user = getStoredUser();

    const [profileOpen, setProfileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | USER INITIALS
    |--------------------------------------------------------------------------
    */

    const getInitials = (name) => {
        if (!name) {
            return "AD";
        }

        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };


    /*
    |--------------------------------------------------------------------------
    | CLOSE DROPDOWN ON OUTSIDE CLICK
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);


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
            await api.post("/auth/logout");

        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

        } finally {
            clearAuth();

            setProfileOpen(false);

            navigate(
                "/login",
                {
                    replace: true,
                }
            );
        }
    };


    return (
        <header className="fixed left-[245px] right-0 top-0 z-40 h-[64px] border-b border-[#e6e8eb] bg-white">

            <div className="flex h-full items-center justify-between px-[25px]">

                {/* Left */}

                <div className="flex items-center gap-[20px]">

                    <button
                        type="button"
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-[#343d48] transition hover:bg-[#f5f6f8]"
                    >
                        <PanelLeft
                            size={18}
                            strokeWidth={1.8}
                        />
                    </button>


                    {/* Search */}

                    <button
                        type="button"
                        className="flex h-[36px] w-[88px] items-center justify-between rounded-full border border-[#e2e4e8] bg-white px-[12px] text-[#7d8691]"
                    >
                        <Search
                            size={16}
                            strokeWidth={1.8}
                        />

                        <span className="text-[12px]">
                            ⌘K
                        </span>
                    </button>

                </div>


                {/* Center */}

                <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[10px]">

                    <button
                        type="button"
                        className="flex h-[35px] items-center gap-[7px] rounded-full border border-[#bcd0ff] bg-[#f5f8ff] px-[14px] text-[13px] font-medium text-[#316ff4]"
                    >
                        <ShoppingCart
                            size={17}
                            strokeWidth={1.8}
                        />

                        POS
                    </button>


                    <button
                        type="button"
                        className="flex h-[35px] items-center gap-[7px] rounded-full border border-[#dedfe3] bg-white px-[14px] text-[13px] font-medium text-[#252d38]"
                    >
                        <Globe2
                            size={17}
                            strokeWidth={1.8}
                        />

                        Browse Website
                    </button>

                </div>


                {/* Right */}

                <div className="flex items-center gap-[17px]">

                    {/* Language */}

                    <button
                        type="button"
                        className="text-[21px]"
                        aria-label="Language"
                    >
                        🇺🇸
                    </button>


                    {/* Notification */}

                    <button
                        type="button"
                        className="relative flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#303944] transition hover:bg-[#f5f6f8]"
                    >
                        <Bell
                            size={18}
                            strokeWidth={1.8}
                        />

                        <span className="absolute -right-[4px] -top-[4px] flex min-w-[20px] items-center justify-center rounded-full bg-[#ff4545] px-[4px] py-[2px] text-[9px] font-bold text-white">
                            9+
                        </span>
                    </button>


                    {/* Settings */}

                    <Link
                        to="/admin/settings"
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#626c77] transition hover:bg-[#f5f6f8]"
                    >
                        <Settings
                            size={17}
                            strokeWidth={1.8}
                        />
                    </Link>


                    {/* Profile */}

                    <div
                        ref={dropdownRef}
                        className="relative"
                    >

                        <button
                            type="button"
                            onClick={() =>
                                setProfileOpen(
                                    (prev) => !prev
                                )
                            }
                            className="flex items-center gap-[7px]"
                            aria-expanded={profileOpen}
                        >

                            {/* Avatar */}

                            <div className="flex h-[37px] w-[37px] items-center justify-center overflow-hidden rounded-full border border-[#e1e4e8] bg-[#ead3b9] text-[11px] font-bold text-[#4b392b]">

                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user?.name || "Admin"}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    getInitials(user?.name)
                                )}

                            </div>


                            <ChevronDown
                                size={13}
                                strokeWidth={1.8}
                                className={`text-[#89919b] transition-transform ${
                                    profileOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />

                        </button>


                        {/* Dropdown */}

                        {profileOpen && (
                            <div className="absolute right-0 top-[48px] w-[218px] overflow-hidden rounded-[17px] border border-[#e3e5e8] bg-white shadow-[0_12px_35px_rgba(15,23,42,0.14)]">

                                {/* User */}

                                <div className="px-[14px] pb-[11px] pt-[12px]">

                                    <h3 className="truncate text-[13px] font-semibold text-[#252c35]">
                                        {user?.name || "Storify Admin"}
                                    </h3>

                                    <p className="mt-[2px] truncate text-[11px] text-[#79828e]">
                                        {user?.email || "admin@storify.com"}
                                    </p>

                                </div>


                                <div className="h-px bg-[#e7e9ec]" />


                                {/* Profile */}

                                <Link
                                    to="/admin/profile"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex h-[42px] items-center gap-[11px] px-[14px] text-[13px] font-medium text-[#444d58] transition hover:bg-[#f7f8fa]"
                                >
                                    <UserRound
                                        size={17}
                                        strokeWidth={1.7}
                                        className="text-[#707a86]"
                                    />

                                    Profile
                                </Link>


                                {/* Settings */}

                                <Link
                                    to="/admin/settings"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                    className="flex h-[42px] items-center gap-[11px] px-[14px] text-[13px] font-medium text-[#444d58] transition hover:bg-[#f7f8fa]"
                                >
                                    <Settings
                                        size={17}
                                        strokeWidth={1.7}
                                        className="text-[#707a86]"
                                    />

                                    Settings
                                </Link>


                                <div className="h-px bg-[#e7e9ec]" />


                                {/* Logout */}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex h-[43px] w-full items-center gap-[11px] px-[14px] text-left text-[13px] font-medium text-[#e43f45] transition hover:bg-[#fff6f6] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <LogOut
                                        size={17}
                                        strokeWidth={1.7}
                                    />

                                    {loggingOut
                                        ? "Logging out..."
                                        : "Logout"
                                    }
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>

        </header>
    );
};


export default AdminHeader;