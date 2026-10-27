import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Image as ImageIcon,
    Layers3,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
    Sparkles,
    Store,
    Trash2,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    deleteCollection,
    getCollections,
} from "../../../../api/admin/collectionApi";


export default function CollectionIndex() {
    const navigate =
        useNavigate();

    const [
        collections,
        setCollections,
    ] = useState([]);

    const [
        stats,
        setStats,
    ] = useState({
        total: 0,
        active: 0,
        draft: 0,
    });

    const [
        meta,
        setMeta,
    ] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        from: null,
        to: null,
    });

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState("");

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        filterOpen,
        setFilterOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Collections
    |--------------------------------------------------------------------------
    */

    const loadCollections =
        async () => {
            try {
                setLoading(true);

                const response =
                    await getCollections({
                        search:
                            search.trim() ||
                            undefined,

                        status:
                            status ||
                            undefined,

                        page,

                        per_page: 20,
                    });

                setCollections(
                    response?.data ||
                        []
                );

                setStats(
                    response?.stats || {
                        total: 0,
                        active: 0,
                        draft: 0,
                    }
                );

                setMeta(
                    response?.meta || {
                        current_page: 1,
                        last_page: 1,
                        per_page: 20,
                        total: 0,
                        from: null,
                        to: null,
                    }
                );
            } catch (error) {
                console.error(
                    "Failed to load collections:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        const timer =
            setTimeout(
                () => {
                    loadCollections();
                },
                300
            );

        return () =>
            clearTimeout(timer);
    }, [
        search,
        status,
        page,
    ]);


    useEffect(() => {
        setPage(1);
    }, [
        search,
        status,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async () => {
            if (
                !deleteTarget?.id
            ) {
                return;
            }

            try {
                setDeletingId(
                    deleteTarget.id
                );

                await deleteCollection(
                    deleteTarget.id
                );

                setDeleteTarget(
                    null
                );

                await loadCollections();
            } catch (error) {
                console.error(
                    "Failed to delete collection:",
                    error
                );
            } finally {
                setDeletingId(
                    null
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getImageUrl = (
        collection
    ) => {
        const path =
            collection?.image_path;

        if (!path) {
            return null;
        }

        if (
            path.startsWith(
                "http://"
            ) ||
            path.startsWith(
                "https://"
            )
        ) {
            return path;
        }

        return `http://127.0.0.1:8000/${path}`;
    };


    const visibleRange =
        useMemo(
            () => {
                if (
                    !meta.total ||
                    !meta.from ||
                    !meta.to
                ) {
                    return "0 collections";
                }

                return `${meta.from}-${meta.to} of ${meta.total}`;
            },
            [meta]
        );


    const tabs = [
        {
            label: "All",
            value: "",
        },
        {
            label: "Active",
            value: "active",
        },
        {
            label: "Draft",
            value: "draft",
        },
    ];


    return (
        <div className="mx-auto w-full max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Stats */}

            <div className="mb-[16px] overflow-hidden rounded-[14px] border border-[#e1e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                    <StatCard
                        label="Total Collections"
                        value={
                            stats.total ??
                            meta.total ??
                            0
                        }
                        helper="All collections"
                        icon={
                            Layers3
                        }
                        iconClass="bg-[#e0f2fe] text-[#0284c7]"
                    />

                    <StatCard
                        label="Active"
                        value={
                            stats.active ??
                            0
                        }
                        helper="Live collections"
                        icon={
                            Store
                        }
                        iconClass="bg-[#dcfce7] text-[#16a34a]"
                    />

                    <StatCard
                        label="Draft"
                        value={
                            stats.draft ??
                            0
                        }
                        helper="Not published yet"
                        icon={
                            Sparkles
                        }
                        iconClass="bg-[#f3e8ff] text-[#7c3aed]"
                        last
                    />
                </div>
            </div>


            {/* Main Card */}

            <section className="overflow-visible rounded-[14px] border border-[#e1e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {/* Header */}

                <div className="flex items-center justify-between gap-4 px-[20px] py-[18px]">
                    <div>
                        <h1 className="text-[18px] font-semibold text-[#111827]">
                            Collections
                        </h1>

                        <p className="mt-[2px] text-[10px] text-[#7b8490]">
                            Organize products into curated groups for your storefront.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/collections/create"
                            )
                        }
                        className="inline-flex h-[36px] items-center justify-center gap-[7px] rounded-[11px] bg-[#4f7df3] px-[15px] text-[11.5px] font-semibold text-white shadow-sm transition hover:bg-[#3f6ee8]"
                    >
                        <Plus
                            size={15}
                        />

                        Add Collection
                    </button>
                </div>


                {/* Inner */}

                <div className="mx-[20px] mb-[20px] overflow-visible rounded-[13px] border border-[#e1e4e8] bg-white">
                    {/* Tabs */}

                    <div className="flex min-h-[55px] items-end border-b border-[#e6e8eb] px-[16px]">
                        <div className="flex items-end gap-[25px]">
                            {tabs.map(
                                (tab) => {
                                    const active =
                                        status ===
                                        tab.value;

                                    return (
                                        <button
                                            key={
                                                tab.label
                                            }
                                            type="button"
                                            onClick={() =>
                                                setStatus(
                                                    tab.value
                                                )
                                            }
                                            className={[
                                                "relative",
                                                "h-[55px]",
                                                "text-[11.5px]",
                                                "font-medium",
                                                "transition",
                                                active
                                                    ? "text-[#111827]"
                                                    : "text-[#68717c] hover:text-[#202833]",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {
                                                tab.label
                                            }

                                            {active && (
                                                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#111827]" />
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>


                    {/* Search / Filter */}

                    <div className="flex flex-col gap-[10px] border-b border-[#e6e8eb] px-[14px] py-[11px] lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full max-w-[500px]">
                            <Search
                                size={14}
                                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7e8792]"
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search collections"
                                className="h-[36px] w-full rounded-[11px] border border-[#d9dde3] bg-white pl-[34px] pr-[12px] text-[11px] text-[#303945] outline-none transition placeholder:text-[#7e8792] focus:border-[#94a3b8]"
                            />
                        </div>


                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setFilterOpen(
                                        (current) =>
                                            !current
                                    )
                                }
                                className="inline-flex h-[34px] items-center gap-[6px] rounded-[10px] border border-[#d9dde3] bg-white px-[11px] text-[10.5px] font-medium text-[#303945] transition hover:bg-[#f8f9fa]"
                            >
                                <SlidersHorizontal
                                    size={13}
                                />

                                Filter
                            </button>

                            {filterOpen && (
                                <div className="absolute right-0 top-[40px] z-30 w-[180px] rounded-[11px] border border-[#e1e4e8] bg-white p-[8px] shadow-xl">
                                    <p className="px-[6px] pb-[6px] text-[9px] font-medium uppercase tracking-wide text-[#8b949f]">
                                        Status
                                    </p>

                                    {tabs.map(
                                        (
                                            tab
                                        ) => (
                                            <button
                                                key={
                                                    tab.label
                                                }
                                                type="button"
                                                onClick={() => {
                                                    setStatus(
                                                        tab.value
                                                    );

                                                    setFilterOpen(
                                                        false
                                                    );
                                                }}
                                                className={[
                                                    "flex",
                                                    "h-[32px]",
                                                    "w-full",
                                                    "items-center",
                                                    "rounded-[7px]",
                                                    "px-[8px]",
                                                    "text-left",
                                                    "text-[10px]",
                                                    status ===
                                                    tab.value
                                                        ? "bg-[#f1f5ff] font-medium text-[#316ff4]"
                                                        : "text-[#4f5965] hover:bg-[#f6f7f8]",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {
                                                    tab.label
                                                }
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Content */}

                    {loading ? (
                        <div className="flex min-h-[340px] items-center justify-center">
                            <p className="text-[11px] text-[#707986]">
                                Loading collections...
                            </p>
                        </div>
                    ) : collections.length ===
                      0 ? (
                        <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#f3f4f6] text-[#7b8490]">
                                <Layers3
                                    size={20}
                                />
                            </div>

                            <h3 className="mt-[12px] text-[12px] font-semibold text-[#202833]">
                                No collections found
                            </h3>

                            <p className="mt-[4px] text-[10px] text-[#7b8490]">
                                Create your first collection or adjust the filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[980px]">
                                <thead>
                                    <tr className="border-b border-[#e6e8eb]">
                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Collection
                                        </th>

                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Kind
                                        </th>

                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Type
                                        </th>

                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Status
                                        </th>

                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Publishing
                                        </th>

                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Sort
                                        </th>

                                        <th className="px-[14px] py-[13px] text-left text-[10px] font-medium text-[#636c77]">
                                            Position
                                        </th>

                                        <th className="px-[14px] py-[13px] text-right text-[10px] font-medium text-[#636c77]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {collections.map(
                                        (
                                            collection
                                        ) => {
                                            const image =
                                                getImageUrl(
                                                    collection
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        collection.id
                                                    }
                                                    className="border-b border-[#eceef0] transition last:border-b-0 hover:bg-[#fafbfc]"
                                                >
                                                    {/* Collection */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <div className="flex items-center gap-[10px]">
                                                            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e1e4e8] bg-[#f6f7f8]">
                                                                {image ? (
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            collection.title
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ImageIcon
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-[#9aa2ad]"
                                                                    />
                                                                )}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/collections/${collection.id}/edit`
                                                                    )
                                                                }
                                                                className="max-w-[240px] truncate text-left text-[10.5px] font-medium text-[#202833] hover:underline"
                                                            >
                                                                {
                                                                    collection.title
                                                                }
                                                            </button>
                                                        </div>
                                                    </td>


                                                    {/* Kind */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <KindBadge
                                                            kind={
                                                                collection.kind
                                                            }
                                                        />
                                                    </td>


                                                    {/* Type */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <span className="text-[10px] capitalize text-[#4f5965]">
                                                            {collection.collection_type ===
                                                            "automated"
                                                                ? "Automated"
                                                                : "Manual"}
                                                        </span>
                                                    </td>


                                                    {/* Status */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <StatusBadge
                                                            status={
                                                                collection.status
                                                            }
                                                        />
                                                    </td>


                                                    {/* Publishing */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <div className="flex flex-wrap gap-[5px]">
                                                            {collection.publish_online_store && (
                                                                <PublishBadge label="Online" />
                                                            )}

                                                            {collection.publish_point_of_sale && (
                                                                <PublishBadge label="POS" />
                                                            )}

                                                            {!collection.publish_online_store &&
                                                                !collection.publish_point_of_sale && (
                                                                    <span className="text-[9.5px] text-[#9aa2ad]">
                                                                        —
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>


                                                    {/* Sort */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <span className="text-[9.5px] capitalize text-[#5f6975]">
                                                            {formatSortOrder(
                                                                collection.sort_order
                                                            )}
                                                        </span>
                                                    </td>


                                                    {/* Position */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <span className="text-[10px] font-medium text-[#303945]">
                                                            {collection.display_position ??
                                                                0}
                                                        </span>
                                                    </td>


                                                    {/* Actions */}

                                                    <td className="px-[14px] py-[12px]">
                                                        <div className="flex items-center justify-end">
                                                            <div className="inline-flex overflow-hidden rounded-[9px] border border-[#dfe3e8] bg-white">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/admin/collections/${collection.id}/edit`
                                                                        )
                                                                    }
                                                                    title="View collection"
                                                                    className="flex h-[30px] w-[31px] items-center justify-center border-r border-[#e3e6ea] text-[#69727d] transition hover:bg-[#f7f8fa]"
                                                                >
                                                                    <Eye
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/admin/collections/${collection.id}/edit`
                                                                        )
                                                                    }
                                                                    title="Edit collection"
                                                                    className="flex h-[30px] w-[31px] items-center justify-center border-r border-[#e3e6ea] text-[#69727d] transition hover:bg-[#f7f8fa]"
                                                                >
                                                                    <Pencil
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setDeleteTarget(
                                                                            collection
                                                                        )
                                                                    }
                                                                    title="Delete collection"
                                                                    className="flex h-[30px] w-[31px] items-center justify-center text-[#8a929c] transition hover:bg-red-50 hover:text-red-600"
                                                                >
                                                                    <Trash2
                                                                        size={
                                                                            13
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}


                    {/* Pagination */}

                    {!loading &&
                        collections.length >
                            0 && (
                            <div className="flex flex-col gap-[10px] border-t border-[#e6e8eb] px-[14px] py-[11px] sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[9.5px] text-[#737c87]">
                                    {
                                        visibleRange
                                    }
                                </span>

                                <div className="flex items-center gap-[6px]">
                                    <button
                                        type="button"
                                        disabled={
                                            meta.current_page <=
                                            1
                                        }
                                        onClick={() =>
                                            setPage(
                                                Math.max(
                                                    1,
                                                    page -
                                                        1
                                                )
                                            )
                                        }
                                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#dfe3e8] bg-white text-[#65707c] transition hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                    <span className="min-w-[62px] text-center text-[9.5px] font-medium text-[#59636f]">
                                        {
                                            meta.current_page
                                        }{" "}
                                        /{" "}
                                        {
                                            meta.last_page
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        disabled={
                                            meta.current_page >=
                                            meta.last_page
                                        }
                                        onClick={() =>
                                            setPage(
                                                Math.min(
                                                    meta.last_page,
                                                    page +
                                                        1
                                                )
                                            )
                                        }
                                        className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#dfe3e8] bg-white text-[#65707c] transition hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight
                                            size={
                                                13
                                            }
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                </div>
            </section>


            {/* Delete Modal */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
                    <div className="relative w-full max-w-[420px] overflow-hidden rounded-[18px] bg-white shadow-2xl">
                        <div className="h-[3px] w-full bg-red-500" />

                        <button
                            type="button"
                            onClick={() =>
                                setDeleteTarget(
                                    null
                                )
                            }
                            className="absolute right-[14px] top-[14px] flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-[17px] text-[#929aa4] transition hover:bg-[#f3f4f6]"
                        >
                            ×
                        </button>

                        <div className="px-[22px] pb-[20px] pt-[22px]">
                            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-red-50 text-red-600">
                                <Trash2
                                    size={18}
                                />
                            </div>

                            <h3 className="mt-[14px] text-[15px] font-semibold text-[#111827]">
                                Delete collection?
                            </h3>

                            <p className="mt-[7px] text-[11px] leading-[18px] text-[#68717c]">
                                You are about to delete{" "}
                                <span className="font-semibold text-[#303945]">
                                    {
                                        deleteTarget.title
                                    }
                                </span>
                                .
                            </p>

                            <p className="mt-[3px] text-[10.5px] text-[#7d8691]">
                                This action cannot be undone.
                            </p>

                            <div className="mt-[20px] flex justify-end gap-[8px]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteTarget(
                                            null
                                        )
                                    }
                                    className="h-[35px] rounded-[9px] border border-[#d9dee4] bg-white px-[13px] text-[10.5px] font-medium text-[#59636f]"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDelete
                                    }
                                    disabled={
                                        deletingId ===
                                        deleteTarget.id
                                    }
                                    className="h-[35px] rounded-[9px] bg-red-600 px-[14px] text-[10.5px] font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
                                >
                                    {deletingId ===
                                    deleteTarget.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function StatCard({
    label,
    value,
    helper,
    icon: Icon,
    iconClass,
    last = false,
}) {
    return (
        <div
            className={[
                "min-h-[105px]",
                "px-[20px]",
                "py-[18px]",
                "sm:border-r",
                "sm:border-[#e1e4e8]",
                last
                    ? "sm:border-r-0"
                    : "",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-medium text-[#202833]">
                        {label}
                    </p>

                    <p className="mt-[5px] text-[19px] font-semibold leading-none text-[#111827]">
                        {value ?? 0}
                    </p>

                    <p className="mt-[8px] text-[9.5px] text-[#7b8490]">
                        {helper}
                    </p>
                </div>

                <div
                    className={[
                        "flex",
                        "h-[32px]",
                        "w-[32px]",
                        "items-center",
                        "justify-center",
                        "rounded-full",
                        iconClass,
                    ].join(" ")}
                >
                    <Icon
                        size={14}
                    />
                </div>
            </div>
        </div>
    );
}


function StatusBadge({
    status,
}) {
    const active =
        status ===
        "active";

    return (
        <span
            className={[
                "inline-flex",
                "h-[22px]",
                "items-center",
                "rounded-full",
                "px-[9px]",
                "text-[9px]",
                "font-semibold",
                active
                    ? "bg-[#4f7df3] text-white"
                    : "bg-[#f1f2f4] text-[#69727d]",
            ].join(" ")}
        >
            {active
                ? "Active"
                : "Draft"}
        </span>
    );
}


function KindBadge({
    kind,
}) {
    const look =
        kind ===
        "look";

    return (
        <span
            className={[
                "inline-flex",
                "h-[22px]",
                "items-center",
                "rounded-full",
                "border",
                "px-[8px]",
                "text-[9px]",
                "font-medium",
                look
                    ? "border-[#e6d6ff] bg-[#f8f2ff] text-[#7c3aed]"
                    : "border-[#dce2e8] bg-[#f7f8fa] text-[#59636f]",
            ].join(" ")}
        >
            {look
                ? "Look"
                : "Collection"}
        </span>
    );
}


function PublishBadge({
    label,
}) {
    return (
        <span className="inline-flex h-[22px] items-center rounded-full bg-[#f4f6f8] px-[8px] text-[9px] font-medium text-[#59636f]">
            {label}
        </span>
    );
}


function formatSortOrder(
    value
) {
    const labels = {
        manual: "Manual",
        best_selling:
            "Best selling",
        alphabetical_asc:
            "A-Z",
        alphabetical_desc:
            "Z-A",
        price_asc:
            "Price ↑",
        price_desc:
            "Price ↓",
        newest:
            "Newest",
        oldest:
            "Oldest",
    };

    return (
        labels[value] ||
        value ||
        "Manual"
    );
}