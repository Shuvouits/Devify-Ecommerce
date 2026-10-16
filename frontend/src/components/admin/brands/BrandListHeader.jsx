import {
    ArrowUpDown,
    ChevronDown,
    Plus,
    Search,
} from "lucide-react";

const tabs = [
    {
        key: "all",
        label: "All",
    },
    {
        key: "pending",
        label: "Pending",
    },
    {
        key: "active",
        label: "Active",
    },
    {
        key: "featured",
        label: "Featured",
    },
    {
        key: "inactive",
        label: "Inactive",
    },
    {
        key: "rejected",
        label: "Rejected",
    },
    {
        key: "archived",
        label: "Archived",
    },
];

export default function BrandListHeader({
    activeTab,
    onTabChange,
    search,
    onSearchChange,
    onAddBrand,
}) {
    return (
        <>
            <div className="flex flex-col gap-4 px-6 pb-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold tracking-tight text-slate-950">
                    Brands
                </h1>

                <button
                    type="button"
                    onClick={onAddBrand}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus size={17} />
                    Add Brand
                </button>
            </div>

            <div className="border-t border-slate-100 px-6">
                <div className="flex overflow-x-auto border-b border-slate-200">
                    {tabs.map((tab) => {
                        const active =
                            activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    onTabChange(tab.key)
                                }
                                className={[
                                    "relative shrink-0 px-3 py-4 text-sm transition",
                                    active
                                        ? "font-semibold text-slate-950"
                                        : "font-medium text-slate-500 hover:text-slate-800",
                                ].join(" ")}
                            >
                                {tab.label}

                                {active && (
                                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-slate-950" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-[520px]">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search brands..."
                        className="h-10 w-full rounded-xl border border-blue-500 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        title="Sort brands"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        <ArrowUpDown size={17} />
                    </button>

                    <button
                        type="button"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                        Import / Export
                        <ChevronDown size={15} />
                    </button>
                </div>
            </div>
        </>
    );
}