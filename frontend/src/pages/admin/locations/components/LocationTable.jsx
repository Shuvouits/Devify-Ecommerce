import { MapPin, Plus } from "lucide-react";
import LocationRow from "./LocationRow";


export default function LocationTable({
    locations = [],
    loading = false,
    search = "",
    activeTab = "all",
    onEdit,
    onDelete,
    onStatusToggle,
    onShipLater,
    onAdd,
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed">
                <thead>
                    <tr className="border-b border-[#e5e7eb] bg-white">
                        <TableHeader className="w-[46%]">
                            Name
                        </TableHeader>

                        <TableHeader className="w-[12%]">
                            Delivery order
                        </TableHeader>

                        <TableHeader className="w-[16%]">
                            Services
                        </TableHeader>

                        <TableHeader className="w-[14%]">
                            Status
                        </TableHeader>

                        <TableHeader
                            align="right"
                            className="w-[12%]"
                        >
                            Actions
                        </TableHeader>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <LoadingRows />
                    ) : locations.length === 0 ? (
                        <EmptyState
                            search={search}
                            activeTab={activeTab}
                            onAdd={onAdd}
                        />
                    ) : (
                        locations.map(
                            (
                                location,
                                index
                            ) => (
                                <LocationRow
                                    key={location.id}
                                    location={location}
                                    isLast={
                                        index ===
                                        locations.length - 1
                                    }
                                    onEdit={() =>
                                        onEdit(location)
                                    }
                                    onDelete={() =>
                                        onDelete(location)
                                    }
                                    onStatusToggle={() =>
                                        onStatusToggle(
                                            location
                                        )
                                    }
                                    onShipLater={() =>
                                        onShipLater(
                                            location
                                        )
                                    }
                                />
                            )
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Table Header
|--------------------------------------------------------------------------
*/

function TableHeader({
    children,
    align = "left",
    className = "",
}) {
    return (
        <th
            className={`px-[20px] py-[15px] text-[11.5px] font-medium text-[#707780] ${
                align === "right"
                    ? "text-right"
                    : "text-left"
            } ${className}`}
        >
            {children}
        </th>
    );
}


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState({
    search,
    activeTab,
    onAdd,
}) {
    let message =
        "Add your first location to start managing inventory and order routing.";

    if (search) {
        message = `No locations match "${search}".`;
    } else if (activeTab === "active") {
        message =
            "There are no active locations.";
    } else if (activeTab === "inactive") {
        message =
            "There are no inactive locations.";
    }

    return (
        <tr>
            <td
                colSpan={5}
                className="px-6 py-14 text-center"
            >
                <div className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#eef3ff] text-[#3f7bf7]">
                    <MapPin
                        size={18}
                        strokeWidth={1.9}
                    />
                </div>

                <h3 className="mt-3 text-[13px] font-semibold text-[#20252b]">
                    No locations found
                </h3>

                <p className="mx-auto mt-1 max-w-sm text-[12px] leading-5 text-[#7a828d]">
                    {message}
                </p>

                {!search &&
                    activeTab === "all" && (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="mt-4 inline-flex h-[35px] items-center gap-2 rounded-[9px] bg-[#3677f5] px-[13px] text-[12px] font-semibold text-white transition hover:bg-[#2f6ce3]"
                        >
                            <Plus size={14} />

                            Add Location
                        </button>
                    )}
            </td>
        </tr>
    );
}


/*
|--------------------------------------------------------------------------
| Loading Rows
|--------------------------------------------------------------------------
*/

function LoadingRows() {
    return Array.from({
        length: 4,
    }).map((_, index) => (
        <tr
            key={index}
            className="border-b border-[#e8eaed]"
        >
            <td className="px-[20px] py-[14px]">
                <div className="h-[34px] w-[260px] animate-pulse rounded-lg bg-slate-100" />
            </td>

            <td className="px-[20px] py-[14px]">
                <div className="h-[18px] w-[30px] animate-pulse rounded bg-slate-100" />
            </td>

            <td className="px-[20px] py-[14px]">
                <div className="h-[24px] w-[70px] animate-pulse rounded-full bg-slate-100" />
            </td>

            <td className="px-[20px] py-[14px]">
                <div className="h-[24px] w-[68px] animate-pulse rounded-full bg-slate-100" />
            </td>

            <td className="px-[20px] py-[14px]">
                <div className="ml-auto h-[32px] w-[32px] animate-pulse rounded-[8px] bg-slate-100" />
            </td>
        </tr>
    ));
}