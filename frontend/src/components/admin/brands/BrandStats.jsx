import {
    Ban,
    CircleCheck,
    Clock3,
    Star,
    Tag,
} from "lucide-react";


const statItems = [
    {
        key: "total",
        label: "Total Brands",
        description:
            "All brands in your catalog",
        icon: Tag,
        iconWrapper:
            "bg-blue-50 text-blue-600",
    },
    {
        key: "active",
        label: "Active brands",
        description:
            "Visible on the storefront",
        icon: CircleCheck,
        iconWrapper:
            "bg-emerald-50 text-emerald-600",
    },
    {
        key: "inactive",
        label: "Inactive brands",
        description:
            "Hidden from the storefront",
        icon: Ban,
        iconWrapper:
            "bg-rose-50 text-rose-500",
    },
    {
        key: "pending",
        label: "Pending approval",
        description:
            "Vendor brands awaiting review",
        icon: Clock3,
        iconWrapper:
            "bg-orange-50 text-orange-500",
    },
    {
        key: "featured",
        label: "Featured brands",
        description:
            "Highlighted on the storefront",
        icon: Star,
        iconWrapper:
            "bg-amber-50 text-amber-500",
    },
];


export default function BrandStats({
    stats = {},
    loading = false,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 xl:grid-cols-5 xl:divide-x xl:divide-y-0">

                {statItems.map(
                    (item) => {
                        const Icon =
                            item.icon;


                        return (
                            <div
                                key={
                                    item.key
                                }
                                className="min-h-[112px] px-6 py-5"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div>

                                        <p className="text-[12px] font-medium text-slate-800">
                                            {item.label}
                                        </p>


                                        {loading ? (
                                            <div className="mt-2 h-7 w-10 animate-pulse rounded bg-slate-200" />
                                        ) : (
                                            <p className="mt-1 text-[22px] font-semibold tracking-tight text-slate-950">
                                                {stats[
                                                    item
                                                        .key
                                                ] ??
                                                    0}
                                            </p>
                                        )}

                                    </div>


                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.iconWrapper}`}
                                    >
                                        <Icon
                                            size={18}
                                            strokeWidth={
                                                1.8
                                            }
                                        />
                                    </div>

                                </div>


                                <p className="mt-1 text-[10.5px] leading-5 text-slate-500">
                                    {
                                        item.description
                                    }
                                </p>

                            </div>
                        );
                    }
                )}

            </div>

        </div>
    );
}