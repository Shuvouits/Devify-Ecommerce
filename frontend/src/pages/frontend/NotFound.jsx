import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Heart,
    House,
    Package,
    Search,
    Sparkles,
    Tag,
} from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        if (!search.trim()) {
            return;
        }

        navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    };

    return (
        <section className="w-full bg-white">
            <div className="mx-auto max-w-[1300px] px-4 pb-[48px] pt-[48px] xl:px-0">
                {/* 404 Illustration */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative flex h-[210px] w-[270px] items-center justify-center">
                        {/* Large 404 */}
                        <div className="absolute top-[3px] text-[92px] font-extrabold leading-none tracking-[-5px] text-[#edf0f3]">
                            404
                        </div>

                        {/* Soft Background Circle */}
                        <div className="absolute top-[71px] h-[112px] w-[112px] rounded-full bg-[#fafbfc]" />

                        {/* Magnifying Glass */}
                        <div className="absolute top-[72px] flex h-[100px] w-[100px] items-center justify-center">
                            <Search
                                size={92}
                                strokeWidth={1.8}
                                className="text-[#4f83f5]"
                            />
                        </div>

                        {/* Decoration dots */}
                        <span className="absolute left-[64px] top-[105px] h-[5px] w-[5px] rounded-full bg-[#e7eaee]" />
                        <span className="absolute right-[63px] top-[99px] h-[6px] w-[6px] rounded-full bg-[#e3e7eb]" />

                        <span className="absolute bottom-[37px] left-[72px] text-[20px] font-medium text-[#eceff2]">
                            ?
                        </span>

                        <span className="absolute bottom-[34px] right-[72px] text-[20px] font-medium text-[#eceff2]">
                            ?
                        </span>

                        {/* Small bottom decoration */}
                        <div className="absolute bottom-[13px] flex items-center gap-[15px]">
                            <div className="h-[10px] w-[24px] rounded-full border-2 border-[#d9dee4]" />
                            <div className="h-[10px] w-[24px] rounded-full border-2 border-[#d9dee4]" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="mt-[2px] text-[38px] font-bold leading-tight tracking-[-1px] text-[#172536]">
                        Page Not Found
                    </h1>

                    <p className="mt-[10px] max-w-[470px] text-[16px] leading-[24px] text-[#637083]">
                        We couldn't find the page you're looking for. It might have
                        been moved or no longer exists.
                    </p>
                </div>

                {/* Search Box Area */}
                <div className="mx-auto mt-[34px] max-w-[650px] rounded-[10px] border border-dashed border-[#e2e6eb] bg-white px-[16px] py-[17px]">
                    <div className="mb-[11px] flex items-center gap-[8px]">
                        <Search
                            size={16}
                            strokeWidth={1.8}
                            className="text-[#657183]"
                        />

                        <span className="text-[14px] font-medium text-[#172536]">
                            Search for products
                        </span>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-[8px]"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="h-[42px] min-w-0 flex-1 rounded-[8px] border border-[#dfe3e8] bg-white px-[14px] text-[14px] text-[#243041] outline-none transition placeholder:text-[#8a94a2] focus:border-[#4f7ff2]"
                        />

                        <button
                            type="submit"
                            className="flex h-[42px] shrink-0 items-center justify-center gap-[7px] rounded-[8px] bg-[#3f73f7] px-[17px] text-[14px] font-semibold text-white transition hover:bg-[#3268ed]"
                        >
                            <Search
                                size={16}
                                strokeWidth={1.8}
                            />

                            Search
                        </button>
                    </form>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-[30px] flex items-center justify-center gap-[11px]">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex h-[40px] items-center justify-center gap-[7px] rounded-[8px] border border-[#e2e5e9] bg-white px-[16px] text-[14px] font-medium text-[#293444] transition hover:bg-[#f8f9fb]"
                    >
                        <ArrowLeft
                            size={16}
                            strokeWidth={1.8}
                        />

                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="flex h-[40px] items-center justify-center gap-[7px] rounded-[8px] bg-[#3f73f7] px-[16px] text-[14px] font-semibold text-white transition hover:bg-[#3268ed]"
                    >
                        <House
                            size={16}
                            strokeWidth={1.8}
                        />

                        Back to Home
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="mx-auto mt-[38px] grid max-w-[650px] grid-cols-3 overflow-hidden rounded-[8px] border border-[#e4e7eb] bg-white">
                    <Link
                        to="/products"
                        className="group flex min-h-[94px] items-center gap-[12px] border-r border-[#e4e7eb] px-[16px] transition hover:bg-[#fafbfc]"
                    >
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#f4f6f8] text-[#768395] transition group-hover:bg-[#eef4ff] group-hover:text-[#3f73f7]">
                            <Package
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                            <h3 className="text-[14px] font-semibold text-[#172536]">
                                All Products
                            </h3>

                            <p className="mt-[2px] truncate text-[12px] text-[#778395]">
                                Browse our full catalog
                            </p>
                        </div>

                        <ArrowRight
                            size={15}
                            className="shrink-0 text-[#9ba4b0]"
                        />
                    </Link>

                    <Link
                        to="/products?featured=1"
                        className="group flex min-h-[94px] items-center gap-[12px] border-r border-[#e4e7eb] px-[16px] transition hover:bg-[#fafbfc]"
                    >
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#f4f6f8] text-[#768395] transition group-hover:bg-[#eef4ff] group-hover:text-[#3f73f7]">
                            <Sparkles
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                            <h3 className="text-[14px] font-semibold text-[#172536]">
                                Featured
                            </h3>

                            <p className="mt-[2px] truncate text-[12px] text-[#778395]">
                                Our top picks for you
                            </p>
                        </div>

                        <ArrowRight
                            size={15}
                            className="shrink-0 text-[#9ba4b0]"
                        />
                    </Link>

                    <Link
                        to="/products?sale=1"
                        className="group flex min-h-[94px] items-center gap-[12px] px-[16px] transition hover:bg-[#fafbfc]"
                    >
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#f4f6f8] text-[#768395] transition group-hover:bg-[#eef4ff] group-hover:text-[#3f73f7]">
                            <Tag
                                size={18}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                            <h3 className="text-[14px] font-semibold text-[#172536]">
                                On Sale
                            </h3>

                            <p className="mt-[2px] truncate text-[12px] text-[#778395]">
                                Great deals and discounts
                            </p>
                        </div>

                        <ArrowRight
                            size={15}
                            className="shrink-0 text-[#9ba4b0]"
                        />
                    </Link>
                </div>

                {/* New Arrivals CTA */}
                <Link
                    to="/products?sort=newest"
                    className="group mx-auto mt-[30px] flex min-h-[116px] max-w-[650px] items-center justify-between rounded-[9px] border border-[#b8d0ff] bg-gradient-to-r from-[#f3f7ff] to-[#fafcff] px-[17px] transition hover:border-[#8fb4ff]"
                >
                    <div className="flex items-center gap-[13px]">
                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-white text-[#3f73f7] shadow-[0_2px_8px_rgba(63,115,247,0.08)]">
                            <Heart
                                size={20}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div>
                            <h3 className="text-[14px] font-semibold text-[#172536]">
                                Discover our new arrivals
                            </h3>

                            <p className="mt-[2px] text-[12px] text-[#68778a]">
                                Fresh products added every week
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-[7px] text-[14px] font-semibold text-[#171717]">
                        Shop Now

                        <ArrowRight
                            size={16}
                            strokeWidth={1.8}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </div>
                </Link>

                {/* Support */}
                <p className="mt-[31px] text-center text-[12px] text-[#68778a]">
                    Still can't find what you need?{" "}
                    <Link
                        to="/contact"
                        className="transition hover:text-[#3f73f7]"
                    >
                        Contact our support team.
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default NotFound;