import { Search } from "lucide-react";


export default function LocationTabs({
    activeTab,
    onTabChange,
    search,
    onSearchChange,
}) {
    const tabs = [
        {
            key: "all",
            label: "All",
        },
        {
            key: "active",
            label: "Active",
        },
        {
            key: "inactive",
            label: "Inactive",
        },
    ];


    return (
        <>
            {/* Tabs */}
            <div className="border-b border-[#e5e7eb] px-[16px]">
                <div className="flex items-center gap-[22px]">
                    {tabs.map((tab) => {
                        const isActive =
                            activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    onTabChange(
                                        tab.key
                                    )
                                }
                                className={`relative h-[54px] text-[13px] font-medium transition ${
                                    isActive
                                        ? "text-[#17191c]"
                                        : "text-[#6f7782] hover:text-[#353b44]"
                                }`}
                            >
                                {tab.label}

                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#17191c]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Search Row */}
            <div className="border-b border-[#e5e7eb] px-[16px] py-[13px]">
                <div className="relative w-full max-w-[505px]">
                    <Search
                        size={15}
                        strokeWidth={1.8}
                        className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8d949c]"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search locations..."
                        className="h-[36px] w-full rounded-[10px] border border-[#dfe2e5] bg-white pl-[36px] pr-[12px] text-[13px] text-[#252a31] outline-none transition placeholder:text-[#78818c] focus:border-[#b9c0c8] focus:ring-2 focus:ring-[#f1f3f5]"
                    />
                </div>
            </div>
        </>
    );
}