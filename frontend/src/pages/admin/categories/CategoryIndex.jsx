import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Archive,
    Ban,
    Boxes,
    CheckCircle2,
    ChevronDown,
    Edit3,
    Layers3,
    Plus,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Star,
    Trash2,
    X,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import BrandToast from "../../../components/admin/brands/BrandToast";

import {
    archiveCategory,
    deleteCategory,
    getCategories,
    restoreCategory,
    updateCategory,
} from "../../../api/admin/categoryApi";


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
        key: "featured",
        label: "Featured",
    },
    {
        key: "inactive",
        label: "Inactive",
    },
    {
        key: "archived",
        label: "Archived",
    },
];


export default function CategoryIndex() {
    const navigate = useNavigate();
    const location = useLocation();

    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        statsCategories,
        setStatsCategories,
    ] = useState([]);

    const [
        activeTab,
        setActiveTab,
    ] = useState("all");

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        updatingFeaturedId,
        setUpdatingFeaturedId,
    ] = useState(null);

    const [
        updatingArchiveId,
        setUpdatingArchiveId,
    ] = useState(null);

   

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);

    const [
        deleting,
        setDeleting,
    ] = useState(false);

   

   

    const [
        toast,
        setToast,
    ] = useState({
        open: false,
        message: "",
    });

    const toastTimerRef = useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Toast
    |--------------------------------------------------------------------------
    */

    const showToast = useCallback(
        (message) => {
            if (toastTimerRef.current) {
                clearTimeout(
                    toastTimerRef.current
                );
            }

            setToast({
                open: true,
                message,
            });

            toastTimerRef.current =
                setTimeout(
                    () => {
                        setToast({
                            open: false,
                            message: "",
                        });
                    },
                    3200
                );
        },
        []
    );


    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(
                    toastTimerRef.current
                );
            }
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Navigation Success Toast
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const message =
            location.state
                ?.successMessage;

        if (!message) {
            return;
        }

        showToast(
            message
        );

        navigate(
            location.pathname,
            {
                replace: true,
                state: {},
            }
        );
    }, [
        location.pathname,
        location.state,
        navigate,
        showToast,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Search Debounce
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer =
            setTimeout(
                () => {
                    setDebouncedSearch(
                        search.trim()
                    );
                },
                350
            );

        return () =>
            clearTimeout(
                timer
            );
    }, [
        search,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Load Categories
    |--------------------------------------------------------------------------
    */

    const loadCategories = useCallback(
        async ({
            silent = false,
        } = {}) => {
            if (!silent) {
                setLoading(
                    true
                );
            }

            setError("");

            try {
                const response =
                    await getCategories({
                        filter:
                            activeTab,

                        search:
                            debouncedSearch ||
                            undefined,

                        sort_by:
                            "display_order",

                        sort_direction:
                            "asc",

                        per_page:
                            100,
                    });

                setCategories(
                    extractCategories(
                        response
                    )
                );
            } catch (error) {
                setCategories([]);

                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                if (!silent) {
                    setLoading(
                        false
                    );
                }
            }
        },
        [
            activeTab,
            debouncedSearch,
        ]
    );


    useEffect(() => {
        loadCategories();
    }, [
        loadCategories,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Stats
    |--------------------------------------------------------------------------
    */

    const loadStats = useCallback(
        async () => {
            try {
                const response =
                    await getCategories({
                        filter:
                            "all",

                        sort_by:
                            "display_order",

                        sort_direction:
                            "asc",

                        per_page:
                            100,
                    });

                setStatsCategories(
                    extractCategories(
                        response
                    )
                );
            } catch {
                // Keep page usable if stats refresh fails.
            }
        },
        []
    );


    useEffect(() => {
        loadStats();
    }, [
        loadStats,
    ]);


    const stats = useMemo(
        () => {
            const total =
                statsCategories.length;

            const active =
                statsCategories.filter(
                    (category) =>
                        category.status ===
                        "active"
                ).length;

            const inactive =
                statsCategories.filter(
                    (category) =>
                        category.status ===
                        "inactive"
                ).length;

            const parents =
                statsCategories.filter(
                    (category) =>
                        !category.parent_id
                ).length;

            const assignedProducts =
                statsCategories.reduce(
                    (
                        totalProducts,
                        category
                    ) =>
                        totalProducts +
                        Number(
                            category.products_count ||
                            0
                        ),
                    0
                );

            return {
                total,
                active,
                inactive,
                parents,
                assignedProducts,
            };
        },
        [
            statsCategories,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Featured
    |--------------------------------------------------------------------------
    */

    const handleToggleFeatured =
        async (category) => {
            if (
                !category?.id ||
                updatingFeaturedId ||
                isCategoryArchived(
                    category
                )
            ) {
                return;
            }

            const nextFeatured =
                !Boolean(
                    category.is_featured
                );

            setUpdatingFeaturedId(
                category.id
            );

            setError("");

            setCategories(
                (current) =>
                    current.map(
                        (item) =>
                            item.id ===
                            category.id
                                ? {
                                    ...item,
                                    is_featured:
                                        nextFeatured,
                                }
                                : item
                    )
            );

            try {
                await updateCategory(
                    category.id,
                    {
                        is_featured:
                            nextFeatured,
                    }
                );

                if (
                    activeTab ===
                        "featured" &&
                    !nextFeatured
                ) {
                    setCategories(
                        (current) =>
                            current.filter(
                                (item) =>
                                    item.id !==
                                    category.id
                            )
                    );
                }

                await loadStats();

                showToast(
                    nextFeatured
                        ? `${category.name} marked as featured`
                        : `${category.name} removed from featured`
                );
            } catch (error) {
                setCategories(
                    (current) =>
                        current.map(
                            (item) =>
                                item.id ===
                                category.id
                                    ? {
                                        ...item,
                                        is_featured:
                                            category.is_featured,
                                    }
                                    : item
                        )
                );

                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setUpdatingFeaturedId(
                    null
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Archive / Restore Archive
    |--------------------------------------------------------------------------
    */

    const handleToggleArchive =
        async (category) => {
            if (
                !category?.id ||
                updatingArchiveId
            ) {
                return;
            }

            const archived =
                isCategoryArchived(
                    category
                );

            setUpdatingArchiveId(
                category.id
            );

            setError("");

            try {
                if (archived) {
                    await restoreCategory(
                        category.id
                    );

                    showToast(
                        `${category.name} restored successfully`
                    );
                } else {
                    await archiveCategory(
                        category.id
                    );

                    showToast(
                        `${category.name} archived successfully`
                    );
                }

                setCategories(
                    (current) =>
                        current.filter(
                            (item) =>
                                item.id !==
                                category.id
                        )
                );

                await Promise.all([
                    loadCategories({
                        silent: true,
                    }),
                    loadStats(),
                ]);
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setUpdatingArchiveId(
                    null
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Soft Delete / Move To Trash
    |--------------------------------------------------------------------------
    */

    const handleDelete =
    async () => {
        if (
            !deleteTarget?.id ||
            deleting
        ) {
            return;
        }

        const categoryName =
            deleteTarget.name;

        setDeleting(
            true
        );

        setError("");

        try {
            await deleteCategory(
                deleteTarget.id
            );

            setDeleteTarget(
                null
            );

            await Promise.all([
                loadCategories({
                    silent: true,
                }),
                loadStats(),
            ]);

            showToast(
                `${categoryName} deleted permanently`
            );
        } catch (error) {
            setError(
                getApiError(
                    error
                )
            );
        } finally {
            setDeleting(
                false
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Restore From Trash
    |--------------------------------------------------------------------------
    */

    const handleRestoreDeleted =
        async (category) => {
            if (
                !category?.id ||
                restoringTrashId
            ) {
                return;
            }

            setRestoringTrashId(
                category.id
            );

            setError("");

            try {
                await restoreDeletedCategory(
                    category.id
                );

                setCategories(
                    (current) =>
                        current.filter(
                            (item) =>
                                item.id !==
                                category.id
                        )
                );

                await loadStats();

                showToast(
                    `${category.name} restored from trash`
                );
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setRestoringTrashId(
                    null
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    const handlePermanentDelete =
        async () => {
            if (
                !permanentDeleteTarget?.id ||
                permanentlyDeleting
            ) {
                return;
            }

            const categoryName =
                permanentDeleteTarget.name;

            setPermanentlyDeleting(
                true
            );

            setError("");

            try {
                await forceDeleteCategory(
                    permanentDeleteTarget.id
                );

                setPermanentDeleteTarget(
                    null
                );

                await loadCategories({
                    silent: true,
                });

                showToast(
                    `${categoryName} permanently deleted`
                );
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setPermanentlyDeleting(
                    false
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-full bg-[#f7f7f8]">

            <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-7">

                <CategoryStats
                    stats={
                        stats
                    }
                    loading={
                        loading
                    }
                />


                {error && (
                    <div className="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
                        {error}
                    </div>
                )}


                <div className="mt-4 overflow-hidden rounded-[15px] border border-[#dedfe3] bg-white shadow-sm">

                    <div className="flex items-center justify-between px-[20px] py-[20px]">

                        <h1 className="text-[20px] font-semibold text-[#11151b]">
                            Categories
                        </h1>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/categories/create"
                                )
                            }
                            className="flex h-[36px] items-center gap-[7px] rounded-[10px] bg-[#3775f4] px-[14px] text-[12px] font-semibold text-white transition hover:bg-[#2d68df]"
                        >
                            <Plus
                                size={15}
                            />

                            Add Category
                        </button>

                    </div>


                    <div className="mx-[20px] overflow-hidden rounded-[12px] border border-[#e0e2e6]">

                        <div className="flex min-h-[54px] items-end justify-between border-b border-[#e3e5e8] px-[17px]">

                            <div className="flex h-full items-end gap-[28px] overflow-x-auto">

                                {tabs.map(
                                    (tab) => (
                                        <button
                                            key={
                                                tab.key
                                            }
                                            type="button"
                                            onClick={() => {
                                                setActiveTab(
                                                    tab.key
                                                );

                                                setSearch(
                                                    ""
                                                );
                                            }}
                                            className={[
                                                "relative",
                                                "h-[54px]",
                                                "shrink-0",
                                                "text-[12px]",
                                                "font-medium",
                                                "transition",
                                                activeTab ===
                                                tab.key
                                                    ? "text-[#11151b]"
                                                    : "text-[#59616c]",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {tab.label}

                                            {activeTab ===
                                                tab.key && (
                                                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#11151b]" />
                                            )}
                                        </button>
                                    )
                                )}

                            </div>


                            <SlidersHorizontal
                                size={15}
                                className="mb-[19px] shrink-0 text-[#69717a]"
                            />

                        </div>


                        <div className="flex items-center justify-between gap-4 border-b border-[#e3e5e8] px-[17px] py-[10px]">

                            <div className="relative w-full max-w-[505px]">

                                <Search
                                    size={15}
                                    className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#77808a]"
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
                                    placeholder={
                                        getSearchPlaceholder(
                                            activeTab
                                        )
                                    }
                                    className="h-[38px] w-full rounded-[10px] border border-[#bfc6cf] bg-white pl-[35px] pr-[12px] text-[12px] text-[#303844] outline-none transition placeholder:text-[#7c858f] focus:border-[#4e7eff] focus:ring-1 focus:ring-[#4e7eff]"
                                />

                            </div>


                            <button
                                type="button"
                                className="flex h-[34px] shrink-0 items-center gap-[7px] rounded-[9px] border border-[#d9dde2] bg-white px-[12px] text-[11px] font-semibold text-[#222a33] transition hover:bg-[#f8f9fa]"
                            >
                                <ChevronDown
                                    size={13}
                                />

                                Import / Export

                                <ChevronDown
                                    size={12}
                                />
                            </button>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px] border-collapse">

                                <thead>

                                    <tr className="h-[53px] border-b border-[#e5e7ea] bg-white">

                                        <th className="w-[54px] px-[17px] text-left">
                                            <input
                                                type="checkbox"
                                                className="h-[16px] w-[16px] rounded-[4px] border-[#cbd1d8]"
                                            />
                                        </th>

                                        <th className="px-0 text-left text-[11.5px] font-medium text-[#59616b]">
                                            Category
                                        </th>

                                        <th className="w-[150px] text-left text-[11.5px] font-medium text-[#59616b]">
                                            Products
                                        </th>

                                        <th className="w-[175px] text-left text-[11.5px] font-medium text-[#59616b]">
                                            Featured
                                        </th>

                                        <th className="w-[150px] text-left text-[11.5px] font-medium text-[#59616b]">
                                            Status
                                        </th>

                                        <th className="w-[180px] pr-[17px] text-right text-[11.5px] font-medium text-[#59616b]">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loading ? (
                                        <LoadingRows />
                                    ) : categories.length ===
                                      0 ? (
                                        <EmptyState
                                            activeTab={
                                                activeTab
                                            }
                                        />
                                    ) : (
                                        categories.map(
                                            (category) => (


                                              <CategoryRow
    key={
        category.id
    }
    category={
        category
    }
    updatingFeaturedId={
        updatingFeaturedId
    }
    updatingArchiveId={
        updatingArchiveId
    }
    onEdit={() =>
        navigate(
            `/admin/categories/${category.id}/edit`
        )
    }
    onToggleFeatured={() =>
        handleToggleFeatured(
            category
        )
    }
    onToggleArchive={() =>
        handleToggleArchive(
            category
        )
    }
    onDelete={() =>
        setDeleteTarget(
            category
        )
    }
/>

                                            )
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    <div className="h-[20px]" />

                </div>

            </div>


            <DeleteCategoryModal
                open={
                    Boolean(
                        deleteTarget
                    )
                }
                category={
                    deleteTarget
                }
                loading={
                    deleting
                }
                onClose={() => {
                    if (!deleting) {
                        setDeleteTarget(
                            null
                        );
                    }
                }}
                onConfirm={
                    handleDelete
                }
            />


           


            <BrandToast
                open={
                    toast.open
                }
                message={
                    toast.message
                }
                onClose={() => {
                    if (
                        toastTimerRef.current
                    ) {
                        clearTimeout(
                            toastTimerRef.current
                        );
                    }

                    setToast({
                        open: false,
                        message: "",
                    });
                }}
            />

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Stats
|--------------------------------------------------------------------------
*/

function CategoryStats({
    stats,
    loading,
}) {
    const cards = [
        {
            label:
                "Total Categories",

            value:
                stats.total,

            helper:
                "All category records",

            icon:
                Layers3,

            iconClass:
                "bg-[#edf3ff] text-[#3475f6]",
        },
        {
            label:
                "Active Categories",

            value:
                stats.active,

            helper:
                "Visible in storefront",

            icon:
                CheckCircle2,

            iconClass:
                "bg-[#eafbf1] text-[#21a65f]",
        },
        {
            label:
                "Inactive Categories",

            value:
                stats.inactive,

            helper:
                "Hidden from customers",

            icon:
                Ban,

            iconClass:
                "bg-[#fff0f2] text-[#ff3857]",
        },
        {
            label:
                "Parent Categories",

            value:
                stats.parents,

            helper:
                "Top-level taxonomy",

            icon:
                Layers3,

            iconClass:
                "bg-[#f0f0ff] text-[#6566f5]",
        },
        {
            label:
                "Assigned Products",

            value:
                stats.assignedProducts,

            helper:
                "Products mapped to categories",

            icon:
                Boxes,

            iconClass:
                "bg-[#f4ecff] text-[#8144ee]",
        },
    ];


    return (
        <div className="grid overflow-hidden rounded-[15px] border border-[#dedfe3] bg-white shadow-sm md:grid-cols-2 xl:grid-cols-5">

            {cards.map(
                (
                    card,
                    index
                ) => {
                    const Icon =
                        card.icon;

                    return (
                        <div
                            key={
                                card.label
                            }
                            className={[
                                "min-h-[112px]",
                                "px-[22px]",
                                "py-[20px]",
                                index !==
                                cards.length -
                                    1
                                    ? "border-b border-[#e3e5e8] xl:border-b-0 xl:border-r"
                                    : "",
                            ].join(
                                " "
                            )}
                        >
                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-[12px] font-medium text-[#242b33]">
                                        {card.label}
                                    </p>

                                    <p className="mt-[5px] text-[20px] font-semibold leading-none text-[#11151a]">
                                        {loading
                                            ? "—"
                                            : card.value}
                                    </p>

                                </div>


                                <div
                                    className={[
                                        "flex",
                                        "h-[31px]",
                                        "w-[31px]",
                                        "items-center",
                                        "justify-center",
                                        "rounded-full",
                                        card.iconClass,
                                    ].join(
                                        " "
                                    )}
                                >
                                    <Icon
                                        size={15}
                                    />
                                </div>

                            </div>


                            <p className="mt-[11px] text-[10px] text-[#848c96]">
                                {card.helper}
                            </p>

                        </div>
                    );
                }
            )}

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Category Row
|--------------------------------------------------------------------------
*/

function CategoryRow({
    category,
    updatingFeaturedId,
    updatingArchiveId,
    onEdit,
    onToggleFeatured,
    onToggleArchive,
    onDelete,
}) {
    const archived =
        isCategoryArchived(
            category
        );

    const archiveLoading =
        updatingArchiveId ===
        category.id;


    return (
        <tr className="h-[78px] border-b border-[#e8eaed] last:border-b-0">

            <td className="px-[17px]">
                <input
                    type="checkbox"
                    className="h-[16px] w-[16px] rounded-[4px] border-[#cbd1d8]"
                />
            </td>


            <td>

                <div className="flex items-center gap-[12px]">

                    <div
                        className={[
                            "flex",
                            "h-[43px]",
                            "w-[43px]",
                            "shrink-0",
                            "items-center",
                            "justify-center",
                            "overflow-hidden",
                            "rounded-[8px]",
                            "bg-[#f3f4f5]",
                            archived
                                ? "opacity-60"
                                : "",
                        ].join(
                            " "
                        )}
                    >

                        {category.image_url ? (
                            <img
                                src={
                                    category.image_url
                                }
                                alt={
                                    category.name
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : category.icon_url ? (
                            <img
                                src={
                                    category.icon_url
                                }
                                alt={
                                    category.name
                                }
                                className="h-full w-full object-contain p-[5px]"
                            />
                        ) : (
                            <Layers3
                                size={18}
                                className="text-[#8e969f]"
                            />
                        )}

                    </div>


                    <div>

                        <div className="flex items-center gap-[7px]">

                            <p className="text-[12px] font-semibold text-[#11161c]">
                                {category.name}
                            </p>

                            {archived && (
                                <span className="rounded-full bg-[#f0f1f3] px-[6px] py-[2px] text-[8px] font-semibold text-[#717a84]">
                                    Archived
                                </span>
                            )}

                        </div>


                        <p className="mt-[2px] text-[10.5px] text-[#7b848e]">
                            /
                            {category.slug ||
                                "category"}
                        </p>

                    </div>

                </div>

            </td>


            <td className="text-[12px] text-[#202831]">
                {Number(
                    category.products_count ||
                    0
                )}
            </td>


            <td>

                {category.is_featured ? (
                    <span className="inline-flex items-center gap-[4px] rounded-full bg-[#f5f4ee] px-[8px] py-[4px] text-[9.5px] font-semibold text-[#22272c]">

                        <Star
                            size={9}
                            fill="currentColor"
                        />

                        Featured

                    </span>
                ) : (
                    <span className="text-[12px] text-[#7a828b]">
                        -
                    </span>
                )}

            </td>


            <td>

                {archived ? (
                    <span className="inline-flex rounded-full bg-[#eef0f2] px-[9px] py-[4px] text-[9.5px] font-semibold text-[#68717b]">
                        Archived
                    </span>
                ) : (
                    <span
                        className={[
                            "inline-flex",
                            "rounded-full",
                            "px-[9px]",
                            "py-[4px]",
                            "text-[9.5px]",
                            "font-semibold",
                            category.status ===
                            "active"
                                ? "bg-[#3775f4] text-white"
                                : "bg-[#f0f1f3] text-[#646d77]",
                        ].join(
                            " "
                        )}
                    >
                        {category.status ===
                        "active"
                            ? "Active"
                            : "Inactive"}
                    </span>
                )}

            </td>


            <td className="pr-[17px]">

                <div className="flex justify-end">

                    <div className="inline-flex overflow-hidden rounded-[9px] border border-[#dfe2e6] bg-white">

                        {!archived && (
                            <>
                                <button
                                    type="button"
                                    onClick={
                                        onEdit
                                    }
                                    className="flex h-[32px] w-[32px] items-center justify-center border-r border-[#e2e4e7] text-[#6b747e] transition hover:bg-[#f7f8f9]"
                                    title="Edit category"
                                >
                                    <Edit3
                                        size={14}
                                    />
                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        updatingFeaturedId ===
                                        category.id
                                    }
                                    onClick={
                                        onToggleFeatured
                                    }
                                    className={[
                                        "flex",
                                        "h-[32px]",
                                        "w-[32px]",
                                        "items-center",
                                        "justify-center",
                                        "border-r",
                                        "border-[#e2e4e7]",
                                        "transition",
                                        category.is_featured
                                            ? "text-[#f59d00]"
                                            : "text-[#7b848e]",
                                        "hover:bg-[#f7f8f9]",
                                        "disabled:opacity-50",
                                    ].join(
                                        " "
                                    )}
                                    title={
                                        category.is_featured
                                            ? "Remove featured"
                                            : "Mark featured"
                                    }
                                >
                                    <Star
                                        size={14}
                                        fill={
                                            category.is_featured
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                </button>
                            </>
                        )}


                        <button
                            type="button"
                            disabled={
                                archiveLoading
                            }
                            onClick={
                                onToggleArchive
                            }
                            className={[
                                "flex",
                                "h-[32px]",
                                "w-[32px]",
                                "items-center",
                                "justify-center",
                                "border-r",
                                "border-[#e2e4e7]",
                                "transition",
                                archived
                                    ? "text-[#3775f4] hover:bg-[#f1f6ff]"
                                    : "text-[#7b848e] hover:bg-[#f7f8f9]",
                                "disabled:cursor-not-allowed",
                                "disabled:opacity-50",
                            ].join(
                                " "
                            )}
                            title={
                                archived
                                    ? "Restore category"
                                    : "Archive category"
                            }
                        >
                            {archived ? (
                                <RotateCcw
                                    size={14}
                                />
                            ) : (
                                <Archive
                                    size={14}
                                />
                            )}
                        </button>


                        <button
                            type="button"
                            onClick={
                                onDelete
                            }
                            className="flex h-[32px] w-[32px] items-center justify-center text-[#818991] transition hover:bg-[#fff4f5] hover:text-[#e04955]"
                            title="Delete category permanently"
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
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState({
    activeTab,
}) {
    const archived =
        activeTab ===
        "archived";


    return (
        <tr>
            <td
                colSpan="6"
                className="px-6 py-14 text-center"
            >
                <div className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#f1f4f8] text-[#7d8792]">

                    {archived ? (
                        <Archive
                            size={19}
                        />
                    ) : (
                        <Layers3
                            size={19}
                        />
                    )}

                </div>


                <p className="mt-3 text-[12px] font-semibold text-[#2a323c]">
                    {archived
                        ? "No archived categories"
                        : "No categories found"}
                </p>


                <p className="mt-1 text-[10.5px] text-[#8a929c]">
                    {archived
                        ? "Archived categories will appear here."
                        : "Add a category or change your current filters."}
                </p>

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
        length: 5,
    }).map(
        (
            _,
            index
        ) => (
            <tr
                key={
                    index
                }
                className="h-[78px] border-b border-[#e8eaed]"
            >
                <td className="px-[17px]">
                    <div className="h-[15px] w-[15px] animate-pulse rounded bg-[#eceef1]" />
                </td>

                <td>
                    <div className="flex items-center gap-3">

                        <div className="h-[43px] w-[43px] animate-pulse rounded-[8px] bg-[#eceef1]" />

                        <div>
                            <div className="h-[10px] w-[110px] animate-pulse rounded bg-[#eceef1]" />
                            <div className="mt-2 h-[8px] w-[70px] animate-pulse rounded bg-[#f0f1f3]" />
                        </div>

                    </div>
                </td>

                <td>
                    <div className="h-[10px] w-[20px] animate-pulse rounded bg-[#eceef1]" />
                </td>

                <td>
                    <div className="h-[20px] w-[70px] animate-pulse rounded-full bg-[#eceef1]" />
                </td>

                <td>
                    <div className="h-[20px] w-[50px] animate-pulse rounded-full bg-[#eceef1]" />
                </td>

                <td className="pr-[17px]">
                    <div className="ml-auto h-[32px] w-[128px] animate-pulse rounded-[9px] bg-[#eceef1]" />
                </td>
            </tr>
        )
    );
}


/*
|--------------------------------------------------------------------------
| Move To Trash Modal
|--------------------------------------------------------------------------
*/

function DeleteCategoryModal({
    open,
    category,
    loading,
    onClose,
    onConfirm,
}) {
    if (!open) {
        return null;
    }


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4">

            <div className="relative w-full max-w-[430px] overflow-hidden rounded-[16px] bg-white shadow-2xl">

                <div className="h-[4px] bg-red-500" />


                <button
                    type="button"
                    onClick={
                        onClose
                    }
                    disabled={
                        loading
                    }
                    className="absolute right-[14px] top-[16px] flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#77808a] transition hover:bg-[#f3f4f5]"
                >
                    <X
                        size={16}
                    />
                </button>


                <div className="px-[24px] pb-[22px] pt-[25px]">

                    <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-red-50 text-red-500">
                        <Trash2
                            size={20}
                        />
                    </div>


                    <h2 className="mt-[15px] text-[17px] font-semibold text-[#171d25]">
                        Delete Category
                    </h2>


                    <p className="mt-[7px] text-[12px] leading-[19px] text-[#69727d]">
                        Are you sure you want to permanently delete{" "}

                        <span className="font-semibold text-[#303842]">
                            {category?.name}
                        </span>

                        ? This action cannot be undone.
                    </p>


                    <div className="mt-[22px] grid grid-cols-2 gap-[10px]">

                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="h-[40px] rounded-[10px] border border-[#d9dde2] bg-white text-[12px] font-semibold text-[#39424d] transition hover:bg-[#f8f9fa]"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={
                                onConfirm
                            }
                            disabled={
                                loading
                            }
                            className="h-[40px] rounded-[10px] bg-red-500 text-[12px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Deleting..."
                                : "Delete"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Permanent Delete Modal
|--------------------------------------------------------------------------
*/

function PermanentDeleteCategoryModal({
    open,
    category,
    loading,
    onClose,
    onConfirm,
}) {
    if (!open) {
        return null;
    }


    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/35 px-4">

            <div className="relative w-full max-w-[430px] overflow-hidden rounded-[16px] bg-white shadow-2xl">

                <div className="h-[4px] bg-red-600" />


                <button
                    type="button"
                    onClick={
                        onClose
                    }
                    disabled={
                        loading
                    }
                    className="absolute right-[14px] top-[16px] flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#77808a] transition hover:bg-[#f3f4f5]"
                >
                    <X
                        size={16}
                    />
                </button>


                <div className="px-[24px] pb-[22px] pt-[25px]">

                    <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-red-50 text-red-600">
                        <Trash2
                            size={20}
                        />
                    </div>


                    <h2 className="mt-[15px] text-[17px] font-semibold text-[#171d25]">
                        Delete Permanently
                    </h2>


                    <p className="mt-[7px] text-[12px] leading-[19px] text-[#69727d]">
                        Permanently delete{" "}

                        <span className="font-semibold text-[#303842]">
                            {category?.name}
                        </span>

                        ? This will remove the database record and its category media. This action cannot be undone.
                    </p>


                    <div className="mt-[22px] grid grid-cols-2 gap-[10px]">

                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="h-[40px] rounded-[10px] border border-[#d9dde2] bg-white text-[12px] font-semibold text-[#39424d] transition hover:bg-[#f8f9fa]"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={
                                onConfirm
                            }
                            disabled={
                                loading
                            }
                            className="h-[40px] rounded-[10px] bg-red-600 text-[12px] font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Deleting..."
                                : "Delete Permanently"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function isCategoryArchived(
    category
) {
    return Boolean(
        category?.is_archived ||
        category?.archived_at
    );
}

function getSearchPlaceholder(
    activeTab
) {
    if (
        activeTab ===
        "archived"
    ) {
        return "Search archived categories...";
    }

    return "Search categories...";
}


function extractCategories(
    response
) {
    const root =
        response?.data ??
        response ??
        {};


    if (
        Array.isArray(
            root?.categories?.data
        )
    ) {
        return root.categories.data;
    }


    if (
        Array.isArray(
            root?.categories
        )
    ) {
        return root.categories;
    }


    if (
        Array.isArray(
            root?.data
        )
    ) {
        return root.data;
    }


    if (
        Array.isArray(
            root
        )
    ) {
        return root;
    }


    return [];
}


function getApiError(
    error
) {
    const errors =
        error?.response?.data
            ?.errors;


    if (errors) {
        const first =
            Object.values(
                errors
            )?.[0];


        if (
            Array.isArray(
                first
            )
        ) {
            return (
                first[0] ||
                "Something went wrong."
            );
        }
    }


    return (
        error?.response?.data
            ?.message ||
        error?.message ||
        "Unable to complete this action."
    );
}