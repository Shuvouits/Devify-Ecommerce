import {
    Archive,
    ArchiveRestore,
    Pencil,
    Star,
    Trash2,
} from "lucide-react";


export default function BrandTable({
     brands = [],
    loading = false,
    updatingFeaturedId = null,
    updatingArchiveId = null,
    onEdit,
    onDelete,
    onToggleFeatured,
    onToggleArchive,
}) {
    return (
        <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[980px]">

                <thead>
                    <tr className="border-b border-slate-200">

                        <th className="w-16 px-6 py-4 text-left">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300"
                            />
                        </th>

                        <th className="px-3 py-4 text-left text-[12px] font-medium text-slate-600">
                            Brand
                        </th>

                        <th className="w-32 px-3 py-4 text-left text-[12px] font-medium text-slate-600">
                            Products
                        </th>

                        <th className="w-32 px-3 py-4 text-left text-[12px] font-medium text-slate-600">
                            Source
                        </th>

                        <th className="w-40 px-3 py-4 text-left text-[12px] font-medium text-slate-600">
                            Approval
                        </th>

                        <th className="w-32 px-3 py-4 text-left text-[12px] font-medium text-slate-600">
                            Status
                        </th>

                        <th className="w-44 px-6 py-4 text-right text-[12px] font-medium text-slate-600">
                            Actions
                        </th>

                    </tr>
                </thead>


                <tbody>

                    {loading &&
                        Array.from({
                            length: 5,
                        }).map(
                            (_, index) => (
                                <LoadingRow
                                    key={index}
                                />
                            )
                        )}


                    {!loading &&
                        brands.length ===
                        0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-16 text-center"
                                >
                                    <p className="text-[12px] font-medium text-slate-700">
                                        No brands found.
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Try another filter or create a new brand.
                                    </p>
                                </td>
                            </tr>
                        )}


                    {!loading &&
                        brands.map(
                            (brand) => (

                               
                                <BrandRow
    key={brand.id}
    brand={brand}
    updatingFeatured={
        updatingFeaturedId === brand.id
    }
    updatingArchive={
        updatingArchiveId === brand.id
    }
    onEdit={onEdit}
    onDelete={onDelete}
    onToggleFeatured={
        onToggleFeatured
    }
    onToggleArchive={
        onToggleArchive
    }
/>



                            )
                        )}

                </tbody>

            </table>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Brand Row
|--------------------------------------------------------------------------
*/

function BrandRow({
   
      brand,
    updatingFeatured,
    updatingArchive,
    onEdit,
    onDelete,
    onToggleFeatured,
    onToggleArchive,


}) {
    const isArchived =
        Boolean(
            brand.archived_at
        );


    return (
        <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">

            {/* Checkbox */}

            <td className="px-6 py-4">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                />
            </td>


            {/* Brand */}

            <td className="px-3 py-4">

                <div className="flex items-center gap-3">

                    <BrandLogo
                        brand={
                            brand
                        }
                    />

                    <div className="min-w-0">

                        <p className="truncate text-[12px] font-semibold text-slate-900">
                            {brand.name}
                        </p>

                        <p className="mt-0.5 truncate text-[10.5px] text-slate-500">
                            /{brand.slug}
                        </p>

                    </div>

                </div>

            </td>


            {/* Products */}

            <td className="px-3 py-4">
                <span className="text-[12px] text-slate-700">
                    {brand.products_count ??
                        0}
                </span>
            </td>


            {/* Source */}

            <td className="px-3 py-4">
                <span className="text-[11.5px] text-slate-600">
                    {formatLabel(
                        brand.source
                    )}
                </span>
            </td>


            {/* Approval */}

            <td className="px-3 py-4">
                <ApprovalBadge
                    status={
                        brand.approval_status
                    }
                />
            </td>


            {/* Status */}

            <td className="px-3 py-4">
                <StatusBadge
                    status={
                        brand.status
                    }
                    archived={
                        isArchived
                    }
                />
            </td>


            {/* Actions */}

            <td className="px-6 py-4">

                <div className="flex items-center justify-end">

                    <div className="inline-flex overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">

                        {/* Edit */}

                       

                       <button
    type="button"
    title="Edit brand"
    onClick={() =>
        onEdit?.(brand)
    }
    className="flex h-8 w-8 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-[#316ff4]"
>
    <Pencil
        size={14}
    />
</button>



                        {/* Featured */}

                        <button
                            type="button"
                            title={
                                brand.is_featured
                                    ? "Remove from featured"
                                    : "Mark as featured"
                            }
                            disabled={
                                updatingFeatured ||
                                isArchived
                            }
                            onClick={() =>
                                onToggleFeatured?.(
                                    brand
                                )
                            }
                            className={[
                                "relative",
                                "flex",
                                "h-8",
                                "w-8",
                                "items-center",
                                "justify-center",
                                "border-r",
                                "border-slate-200",
                                "transition",
                                brand.is_featured
                                    ? "bg-amber-50 text-amber-500 hover:bg-amber-100"
                                    : "text-slate-400 hover:bg-amber-50 hover:text-amber-500",
                                updatingFeatured ||
                                    isArchived
                                    ? "cursor-not-allowed opacity-45"
                                    : "",
                            ].join(" ")}
                        >
                            {updatingFeatured ? (
                                <span className="h-[13px] w-[13px] animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                            ) : (
                                <Star
                                    size={14}
                                    fill={
                                        brand.is_featured
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            )}
                        </button>


                        {/* Archive / Restore */}

                        <button
                            type="button"
                            title={
                                isArchived
                                    ? "Restore brand"
                                    : "Archive brand"
                            }
                            disabled={
                                updatingArchive
                            }
                            onClick={() =>
                                onToggleArchive?.(
                                    brand
                                )
                            }
                            className={[
                                "flex",
                                "h-8",
                                "w-8",
                                "items-center",
                                "justify-center",
                                "border-r",
                                "border-slate-200",
                                "transition",
                                isArchived
                                    ? "text-emerald-600 hover:bg-emerald-50"
                                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600",
                                updatingArchive
                                    ? "cursor-wait opacity-50"
                                    : "",
                            ].join(" ")}
                        >
                            {updatingArchive ? (
                                <span className="h-[13px] w-[13px] animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                            ) : isArchived ? (
                                <ArchiveRestore
                                    size={14}
                                />
                            ) : (
                                <Archive
                                    size={14}
                                />
                            )}
                        </button>


                        {/* Delete */}

                        <button
                            type="button"
                            title="Delete brand"
                            onClick={() =>
                                onDelete?.(
                                    brand
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2
                                size={14}
                            />
                        </button>

                    </div>

                </div>

            </td>

        </tr>
    );
}


/*
|--------------------------------------------------------------------------
| Logo
|--------------------------------------------------------------------------
*/

function BrandLogo({
    brand,
}) {
    if (
        brand.logo_url
    ) {
        return (
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-slate-100 bg-slate-50 p-1.5">

                <img
                    src={
                        brand.logo_url
                    }
                    alt={
                        brand.name
                    }
                    className="max-h-full max-w-full object-contain"
                />

            </div>
        );
    }


    return (
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-slate-100 text-[12px] font-semibold uppercase text-slate-500">
            {getInitials(
                brand.name
            )}
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Approval
|--------------------------------------------------------------------------
*/

function ApprovalBadge({
    status,
}) {
    const normalized =
        status ||
        "pending";


    if (
        normalized ===
        "approved"
    ) {
        return (
            <span className="inline-flex items-center rounded-full bg-[#316ff4] px-2.5 py-1 text-[10px] font-semibold text-white">
                ✓ Approved
            </span>
        );
    }


    if (
        normalized ===
        "rejected"
    ) {
        return (
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600">
                Rejected
            </span>
        );
    }


    return (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-semibold text-orange-600">
            Pending
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Status
|--------------------------------------------------------------------------
*/

function StatusBadge({
    status,
    archived,
}) {
    if (archived) {
        return (
            <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                Archived
            </span>
        );
    }


    if (
        status ===
        "active"
    ) {
        return (
            <span className="inline-flex items-center rounded-full bg-[#316ff4] px-2.5 py-1 text-[10px] font-semibold text-white">
                Active
            </span>
        );
    }


    return (
        <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            Inactive
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function LoadingRow() {
    return (
        <tr className="border-b border-slate-100">

            <td className="px-6 py-4">
                <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            </td>


            <td className="px-3 py-4">

                <div className="flex items-center gap-3">

                    <div className="h-[42px] w-[42px] animate-pulse rounded-[11px] bg-slate-200" />

                    <div>
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                        <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-100" />
                    </div>

                </div>

            </td>


            {Array.from({
                length: 4,
            }).map(
                (_, index) => (
                    <td
                        key={index}
                        className="px-3 py-4"
                    >
                        <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                    </td>
                )
            )}


            <td className="px-6 py-4">
                <div className="ml-auto h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
            </td>

        </tr>
    );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatLabel(
    value
) {
    if (!value) {
        return "Unknown";
    }


    return String(value)
        .replace(
            /_/g,
            " "
        )
        .replace(
            /\b\w/g,
            (character) =>
                character.toUpperCase()
        );
}


function getInitials(
    value
) {
    if (!value) {
        return "B";
    }


    return value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
            (item) =>
                item[0]
        )
        .join("");
}

/*
|--------------------------------------------------------------------------
| Edit Brand
|--------------------------------------------------------------------------
*/

const handleEditBrand =
    (brand) => {
        if (!brand?.id) {
            return;
        }

        navigate(
            `/admin/brands/${brand.id}/edit`
        );
    };