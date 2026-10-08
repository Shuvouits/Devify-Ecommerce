import {
    ChevronDown,
    Clock3,
    Heart,
    Package,
    Star,
    WalletCards,
} from "lucide-react";


const dashboardStats = [
    {
        value: "15",
        label: "Total Orders",
        icon: Package,
    },

    {
        value: "$12,982.78",
        label: "Total Spent",
        icon: WalletCards,
    },

    {
        value: "15",
        label: "Pending Orders",
        icon: Clock3,
    },

    {
        value: "0",
        label: "Wishlist Items",
        icon: Heart,
    },
];


const reviewProducts = [
    {
        id: 1,
        name: "Beats Solo 4 Wireless Headphones",
        delivered: "Delivered Oct 7, 2026",
        order: "#ORD000237",
        emoji: "🎧",
    },

    {
        id: 2,
        name: "Galaxy Watch9",
        delivered: "Delivered Sep 23, 2026",
        order: "#ORD000194",
        emoji: "⌚",
    },

    {
        id: 3,
        name: "Ugreen CD317 2 in 1 Wireless Charger",
        delivered: "Delivered Sep 19, 2026",
        order: "#ORD000176",
        emoji: "🔌",
    },
];


const CustomerDashboard = () => {
    return (
        <div>

            {/* Heading */}

            <div>

                <h1 className="text-[25px] font-bold leading-[31px] text-[#172536]">
                    Overview
                </h1>

                <p className="mt-[2px] text-[14px] text-[#657489]">
                    Your account at a glance
                </p>

            </div>


            {/* Stats */}

            <div className="mt-[24px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">

                {dashboardStats.map(
                    ({
                        value,
                        label,
                        icon: Icon,
                    }) => (
                        <div
                            key={label}
                            className="relative min-h-[94px] rounded-[12px] border border-[#e1e5e9] bg-white px-[18px] py-[18px] shadow-[0_2px_6px_rgba(20,34,55,0.03)]"
                        >

                            <Icon
                                size={18}
                                strokeWidth={1.7}
                                className="absolute right-[17px] top-[20px] text-[#69788b]"
                            />


                            <div className="pr-[32px]">

                                <div className="text-[25px] font-bold leading-[30px] text-[#142335]">
                                    {value}
                                </div>

                                <div className="mt-[5px] text-[13px] text-[#66758a]">
                                    {label}
                                </div>

                            </div>

                        </div>
                    )
                )}

            </div>


            {/* Review Section */}

            <div className="mt-[22px] rounded-[11px] border border-[#e2e5e9] bg-white p-[22px]">

                {/* Heading */}

                <div>

                    <div className="flex items-center gap-[8px]">

                        <Star
                            size={19}
                            fill="#fbbf00"
                            stroke="#fbbf00"
                        />

                        <h2 className="text-[15px] font-semibold text-[#172536]">
                            Rate your purchases
                        </h2>

                    </div>

                    <p className="mt-[5px] text-[13px] text-[#68778a]">
                        Your orders have arrived. Tell other shoppers what you think.
                    </p>

                </div>


                {/* Products */}

                <div className="mt-[22px] overflow-hidden rounded-[9px] border border-[#e2e5e9]">

                    {reviewProducts.map(
                        (product, index) => (
                            <div
                                key={product.id}
                                className={`flex min-h-[77px] items-center justify-between gap-4 px-[15px] py-[12px] ${
                                    index !== reviewProducts.length - 1
                                        ? "border-b border-[#e8ebee]"
                                        : ""
                                }`}
                            >

                                {/* Left */}

                                <div className="flex min-w-0 items-center gap-[13px]">

                                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[6px] bg-[#f2f4f6] text-[27px]">
                                        {product.emoji}
                                    </div>


                                    <div className="min-w-0">

                                        <h3 className="truncate text-[13px] font-medium text-[#182537]">
                                            {product.name}
                                        </h3>

                                        <div className="mt-[3px] flex flex-wrap items-center gap-[7px] text-[11px] text-[#738194]">

                                            <span>
                                                {product.delivered}
                                            </span>

                                            <span>
                                                •
                                            </span>

                                            <span>
                                                {product.order}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* Right */}

                                <div className="flex shrink-0 items-center gap-[17px]">

                                    {/* Stars */}

                                    <div className="hidden items-center gap-[2px] md:flex">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (
                                                <Star
                                                    key={star}
                                                    size={18}
                                                    strokeWidth={1.6}
                                                    className="text-[#cbd2da]"
                                                />
                                            )
                                        )}

                                    </div>


                                    {/* Review */}

                                    <button
                                        type="button"
                                        className="h-[36px] rounded-[8px] border border-[#dfe3e7] bg-white px-[13px] text-[12px] font-semibold text-[#172536] transition hover:bg-[#f8f9fb]"
                                    >
                                        Write a Review
                                    </button>

                                </div>

                            </div>
                        )
                    )}

                </div>


                {/* Show More */}

                <button
                    type="button"
                    className="mx-auto mt-[13px] flex items-center gap-[8px] text-[12px] font-semibold text-[#172536]"
                >
                    Show 6 more

                    <ChevronDown
                        size={14}
                        strokeWidth={1.8}
                    />
                </button>

            </div>

        </div>
    );
};


export default CustomerDashboard;