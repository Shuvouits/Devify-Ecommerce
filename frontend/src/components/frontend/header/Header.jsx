import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    ChevronDown,
    Heart,
    LayoutDashboard,
    MapPin,
    Menu,
    Moon,
    Package,
    Search,
    ShoppingBag,
    ShoppingCart,
    UserRound,
    Wifi,
} from "lucide-react";

import { getStorefrontCollections } from "../../../api/storefront/collectionApi";

const getCollectionImageUrl = (path) => {
    if (!path) {
        return "";
    }

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:")
    ) {
        return path;
    }

    return `http://127.0.0.1:8000/${path.replace(/^\/+/, "")}`;
};

const Header = () => {
    const [collections, setCollections] = useState([]);
    const [collectionsLoading, setCollectionsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadCollections = async () => {
            try {
                setCollectionsLoading(true);

                const response =
                    await getStorefrontCollections();

                if (!mounted) {
                    return;
                }

                const collectionItems =
                    Array.isArray(response?.data)
                        ? response.data
                        : [];

                setCollections(
                    collectionItems.slice(0, 6)
                );
            } catch (error) {
                console.error(
                    "Failed to load storefront collections:",
                    error
                );

                if (mounted) {
                    setCollections([]);
                }
            } finally {
                if (mounted) {
                    setCollectionsLoading(false);
                }
            }
        };

        loadCollections();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <header className="relative z-50 w-full border-t-2 border-[#51363f] bg-white">
            {/* Top Header */}
            <div className="border-b border-[#f0f1f3]">
                <div className="mx-auto flex h-[68px] max-w-[1300px] items-center px-4 xl:px-0">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex min-w-[230px] items-center gap-2.5"
                    >
                        <div className="relative flex h-[39px] w-[36px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#3575ff] via-[#5b6eff] to-[#8a55ff] shadow-[0_4px_10px_rgba(80,92,255,0.28)]">
                            <ShoppingBag
                                size={26}
                                strokeWidth={2}
                                className="text-white"
                            />

                            <span className="absolute mt-1 text-[13px] font-extrabold text-white">
                                D.
                            </span>
                        </div>

                        <span className="text-[28px] font-extrabold tracking-[-1.4px] text-[#3474f5]">
                            Devify
                        </span>
                    </Link>

                    {/* Location */}
                    <button
                        type="button"
                        className="mr-[32px] flex shrink-0 items-center gap-2 text-left"
                    >
                        <MapPin
                            size={19}
                            strokeWidth={1.8}
                            className="text-[#303640]"
                        />

                        <span className="flex flex-col">
                            <span className="text-[11px] leading-[13px] text-[#8b919c]">
                                Deliver to
                            </span>

                            <span className="text-[13px] font-semibold leading-[17px] text-[#262c36]">
                                Set location
                            </span>
                        </span>
                    </button>

                    {/* Search */}
                    <div className="flex h-[40px] min-w-0 flex-1 items-center overflow-hidden rounded-full border border-[#dedfe4] bg-white">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="h-full min-w-0 flex-1 bg-transparent px-4 text-[13px] text-[#303641] outline-none placeholder:text-[#676d77]"
                        />

                        <button
                            type="button"
                            className="flex h-[24px] shrink-0 items-center gap-1.5 border-l border-[#e2e3e6] px-[13px] text-[11px] font-medium text-[#565d68]"
                        >
                            All Categories

                            <ChevronDown
                                size={13}
                                strokeWidth={1.8}
                            />
                        </button>

                        <button
                            type="button"
                            className="flex h-full w-[42px] shrink-0 items-center justify-center text-[#28303b]"
                        >
                            <Search
                                size={19}
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>

                    {/* Header Actions */}
                    <div className="ml-[135px] flex shrink-0 items-center gap-[20px]">
                        <div className="group relative flex items-center">
                            <button
                                type="button"
                                className="flex items-center justify-center text-[#252d38] transition hover:text-[#3f73f7]"
                                aria-label="Account"
                            >
                                <UserRound
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            </button>

                            {/* Hover Bridge */}
                            <div className="absolute right-[-28px] top-full h-[20px] w-[90px]" />

                            {/* Account Dropdown */}
                            <div
                                className="
                                    invisible absolute right-[-28px] top-[38px] z-[100]
                                    w-[320px]
                                    translate-y-2
                                    rounded-[30px]
                                    border border-[#e8e8e8]
                                    bg-[#f8f8f8]
                                    p-[22px]
                                    opacity-0
                                    shadow-[0_10px_30px_rgba(0,0,0,0.14)]
                                    transition-all duration-200
                                    group-hover:visible
                                    group-hover:translate-y-0
                                    group-hover:opacity-100
                                "
                            >
                                {/* Sign In */}
                                <Link
                                    to="/login"
                                    className="
                                        flex h-[42px] w-full
                                        items-center justify-center
                                        rounded-full
                                        bg-[#2f6ed7]
                                        text-[16px] font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#2862c4]
                                    "
                                >
                                    Sign in
                                </Link>

                                {/* Register */}
                                <Link
                                    to="/register"
                                    className="
                                        flex h-[50px]
                                        items-center justify-center
                                        text-[16px]
                                        font-medium
                                        text-[#414141]
                                        transition
                                        hover:text-[#2f6ed7]
                                    "
                                >
                                    Register
                                </Link>

                                {/* Divider */}
                                <div className="h-px w-full bg-[#d9d9d9]" />

                                {/* Menu */}
                                <div className="pt-[12px]">
                                    <Link
                                        to="/account"
                                        className="
                                            flex h-[43px]
                                            items-center gap-[11px]
                                            rounded-lg px-[10px]
                                            text-[15px] font-medium
                                            text-[#3b3b3b]
                                            transition
                                            hover:bg-white
                                            hover:text-[#2f6ed7]
                                        "
                                    >
                                        <LayoutDashboard
                                            size={18}
                                            strokeWidth={1.7}
                                        />

                                        Dashboard
                                    </Link>

                                    <Link
                                        to="/account/orders"
                                        className="
                                            flex h-[43px]
                                            items-center gap-[11px]
                                            rounded-lg px-[10px]
                                            text-[15px] font-medium
                                            text-[#3b3b3b]
                                            transition
                                            hover:bg-white
                                            hover:text-[#2f6ed7]
                                        "
                                    >
                                        <Package
                                            size={18}
                                            strokeWidth={1.7}
                                        />

                                        My Orders
                                    </Link>

                                    <Link
                                        to="/wishlist"
                                        className="
                                            flex h-[43px]
                                            items-center gap-[11px]
                                            rounded-lg px-[10px]
                                            text-[15px] font-medium
                                            text-[#3b3b3b]
                                            transition
                                            hover:bg-white
                                            hover:text-[#2f6ed7]
                                        "
                                    >
                                        <Heart
                                            size={18}
                                            strokeWidth={1.7}
                                        />

                                        Wishlist
                                    </Link>

                                    <Link
                                        to="/account/profile"
                                        className="
                                            flex h-[43px]
                                            items-center gap-[11px]
                                            rounded-lg px-[10px]
                                            text-[15px] font-medium
                                            text-[#3b3b3b]
                                            transition
                                            hover:bg-white
                                            hover:text-[#2f6ed7]
                                        "
                                    >
                                        <UserRound
                                            size={18}
                                            strokeWidth={1.7}
                                        />

                                        Profile
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="text-[#252d38] transition hover:text-[#3e73f5]"
                            aria-label="Theme"
                        >
                            <Moon
                                size={20}
                                strokeWidth={1.8}
                            />
                        </button>

                        <Link
                            to="/wishlist"
                            className="text-[#252d38] transition hover:text-[#3e73f5]"
                            aria-label="Wishlist"
                        >
                            <Heart
                                size={20}
                                strokeWidth={1.8}
                            />
                        </Link>

                        <Link
                            to="/cart"
                            className="relative text-[#252d38] transition hover:text-[#3e73f5]"
                            aria-label="Cart"
                        >
                            <ShoppingCart
                                size={21}
                                strokeWidth={1.8}
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Header */}
            <div className="border-b border-[#eceef1] bg-white">
                <div className="mx-auto flex h-[64px] max-w-[1300px] items-center justify-between px-4 xl:px-0">
                    {/* Main Navigation */}
                    <nav className="flex h-full items-center gap-[29px]">
                        <Link
                            to="/categories"
                            className="flex h-[42px] w-[237px] items-center gap-3 rounded-[5px] bg-[#3f73f7] px-[19px] text-[14px] font-semibold text-white transition hover:bg-[#3267ed]"
                        >
                            <Menu size={19} />

                            <span>All Categories</span>
                        </Link>

                        {/* Collections Hover Menu */}
                        <div className="group relative flex h-full items-center">
                            <Link
                                to="/collections"
                                className="flex h-full items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-[#323944] transition group-hover:text-[#3f73f7]"
                            >
                                Collections

                                <ChevronDown
                                    size={13}
                                    className="transition-transform duration-200 group-hover:rotate-180"
                                />
                            </Link>

                            {/* Hover Bridge */}
                            <div className="absolute left-1/2 top-[52px] h-[18px] w-[170px] -translate-x-1/2" />

                            {/* Collection Dropdown */}
                            <div
                                className="
                                    invisible absolute left-1/2 top-[58px] z-[150]
                                    w-[390px]
                                    -translate-x-1/2 translate-y-2
                                    rounded-[22px]
                                    border border-[#e8eaee]
                                    bg-white
                                    p-[20px]
                                    opacity-0
                                    shadow-[0_14px_40px_rgba(24,31,45,0.14)]
                                    transition-all duration-200
                                    group-hover:visible
                                    group-hover:translate-y-0
                                    group-hover:opacity-100
                                "
                            >
                                <div className="mb-[17px] flex items-center justify-between">
                                    <h3 className="text-[16px] font-semibold text-[#252b35]">
                                        Shop by Collection
                                    </h3>
                                </div>

                                {collectionsLoading ? (
                                    <div className="grid grid-cols-3 gap-x-[14px] gap-y-[18px]">
                                        {[1, 2, 3, 4, 5, 6].map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="animate-pulse"
                                                >
                                                    <div className="aspect-square w-full rounded-[10px] bg-[#f0f1f3]" />

                                                    <div className="mx-auto mt-2 h-[10px] w-[70%] rounded-full bg-[#f0f1f3]" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : collections.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-x-[14px] gap-y-[18px]">
                                        {collections.map(
                                            (collection) => {
                                                const imageUrl =
                                                    getCollectionImageUrl(
                                                        collection.image_path
                                                    );

                                                return (
                                                    <Link
                                                        key={
                                                            collection.id
                                                        }
                                                        to="/collections"
                                                        className="group/card block min-w-0"
                                                    >
                                                        <div className="aspect-square w-full overflow-hidden rounded-[10px] bg-[#f5f6f8]">
                                                            {imageUrl ? (
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        collection.title
                                                                    }
                                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.04]"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-[#a4abb5]">
                                                                    <Package
                                                                        size={
                                                                            27
                                                                        }
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="mt-[8px] line-clamp-2 text-center text-[12px] font-medium leading-[16px] text-[#343b46] transition group-hover/card:text-[#3f73f7]">
                                                            {
                                                                collection.title
                                                            }
                                                        </p>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[110px] items-center justify-center rounded-[12px] bg-[#f7f8fa] px-4 text-center text-[13px] text-[#818893]">
                                        No collections available.
                                    </div>
                                )}

                                <div className="mt-[20px] border-t border-[#eceef1] pt-[15px]">
                                    <Link
                                        to="/collections"
                                        className="flex items-center justify-center gap-1 text-[13px] font-semibold text-[#3f73f7] transition hover:text-[#2f63df]"
                                    >
                                        View All
                                        <span aria-hidden="true">
                                            →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Link
                            to="/category/phone"
                            className="whitespace-nowrap text-[13px] font-medium text-[#323944] transition hover:text-[#3f73f7]"
                        >
                            Phone
                        </Link>

                        <Link
                            to="/category/camera"
                            className="whitespace-nowrap text-[13px] font-medium text-[#323944] transition hover:text-[#3f73f7]"
                        >
                            Camera
                        </Link>

                        <Link
                            to="/category/shoe"
                            className="whitespace-nowrap text-[13px] font-medium text-[#323944] transition hover:text-[#3f73f7]"
                        >
                            Shoe
                        </Link>

                        <Link
                            to="/category/bags"
                            className="whitespace-nowrap text-[13px] font-medium text-[#323944] transition hover:text-[#3f73f7]"
                        >
                            Bags
                        </Link>

                        <Link
                            to="/category/cosmetics"
                            className="whitespace-nowrap text-[13px] font-medium text-[#323944] transition hover:text-[#3f73f7]"
                        >
                            Cosmetics
                        </Link>
                    </nav>

                    {/* Right Navigation */}
                    <nav className="flex items-center gap-[27px]">
                        <Link
                            to="/track-order"
                            className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-[#7e8694] transition hover:text-[#3f73f7]"
                        >
                            <Package
                                size={16}
                                strokeWidth={1.7}
                            />

                            Track Order
                        </Link>

                        <Link
                            to="/blog"
                            className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-[#7e8694] transition hover:text-[#3f73f7]"
                        >
                            <Wifi
                                size={16}
                                strokeWidth={1.7}
                            />

                            Blog
                        </Link>

                        <Link
                            to="/contact"
                            className="whitespace-nowrap text-[12px] font-medium text-[#7e8694] transition hover:text-[#3f73f7]"
                        >
                            Contact Us
                        </Link>

                        <Link
                            to="/become-vendor"
                            className="whitespace-nowrap text-[12px] font-medium text-[#7e8694] transition hover:text-[#3f73f7]"
                        >
                            Become a Vendor
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;