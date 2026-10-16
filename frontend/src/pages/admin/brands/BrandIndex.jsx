import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import BrandListHeader from "../../../components/admin/brands/BrandListHeader";
import BrandStats from "../../../components/admin/brands/BrandStats";
import BrandTable from "../../../components/admin/brands/BrandTable";
import DeleteBrandModal from "../../../components/admin/brands/DeleteBrandModal";
import BrandToast from "../../../components/admin/brands/BrandToast";

import {
    archiveBrand,
    deleteBrand,
    getBrands,
    restoreBrand,
    updateBrand,
} from "../../../api/admin/brandApi";


/*
|--------------------------------------------------------------------------
| Initial Statistics
|--------------------------------------------------------------------------
*/

const initialStats = {
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    featured: 0,
};


const BrandIndex = () => {
    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Filter State
    |--------------------------------------------------------------------------
    */

    const [
        activeTab,
        setActiveTab,
    ] =
        useState("all");


    /*
    |--------------------------------------------------------------------------
    | Search State
    |--------------------------------------------------------------------------
    */

    const [
        search,
        setSearch,
    ] =
        useState("");

    const [
        debouncedSearch,
        setDebouncedSearch,
    ] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Brand Data
    |--------------------------------------------------------------------------
    */

    const [
        brands,
        setBrands,
    ] =
        useState([]);


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const [
        stats,
        setStats,
    ] =
        useState(
            initialStats
        );


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        statsLoading,
        setStatsLoading,
    ] =
        useState(true);


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    const [
        error,
        setError,
    ] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Featured State
    |--------------------------------------------------------------------------
    */

    const [
        updatingFeaturedId,
        setUpdatingFeaturedId,
    ] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Archive State
    |--------------------------------------------------------------------------
    */

    const [
        updatingArchiveId,
        setUpdatingArchiveId,
    ] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Delete State
    |--------------------------------------------------------------------------
    */

    const [
        deleteTarget,
        setDeleteTarget,
    ] =
        useState(null);

    const [
        deleting,
        setDeleting,
    ] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Toast State
    |--------------------------------------------------------------------------
    */

    const [
        toast,
        setToast,
    ] =
        useState({
            open: false,
            message: "",
        });


    const toastTimerRef =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Toast Cleanup
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => {
            if (
                toastTimerRef.current
            ) {
                clearTimeout(
                    toastTimerRef.current
                );
            }
        };
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Show Premium Toast
    |--------------------------------------------------------------------------
    */

    const showToast =
        (message) => {
            if (
                toastTimerRef.current
            ) {
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
        };


    /*
    |--------------------------------------------------------------------------
    | Search Debounce
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timeout =
            setTimeout(
                () => {
                    setDebouncedSearch(
                        search.trim()
                    );
                },
                350
            );


        return () => {
            clearTimeout(
                timeout
            );
        };
    }, [
        search,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Load Brands
    |--------------------------------------------------------------------------
    */

    const loadBrands =
        useCallback(
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
                        await getBrands(
                            {
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
                            }
                        );


                    const extracted =
                        extractBrandResponse(
                            response
                        );


                    setBrands(
                        extracted.brands
                    );
                } catch (error) {
                    if (!silent) {
                        setBrands([]);
                    }


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


    /*
    |--------------------------------------------------------------------------
    | Initial Brand Loading
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadBrands();
    }, [
        loadBrands,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Load Statistics
    |--------------------------------------------------------------------------
    */

    const loadStats =
        useCallback(
            async ({
                silent = false,
            } = {}) => {
                if (!silent) {
                    setStatsLoading(
                        true
                    );
                }


                try {
                    const [
                        allResponse,
                        activeResponse,
                        inactiveResponse,
                        pendingResponse,
                        featuredResponse,
                    ] =
                        await Promise.all([
                            getBrands({
                                filter:
                                    "all",
                                per_page:
                                    1,
                            }),

                            getBrands({
                                filter:
                                    "active",
                                per_page:
                                    1,
                            }),

                            getBrands({
                                filter:
                                    "inactive",
                                per_page:
                                    1,
                            }),

                            getBrands({
                                filter:
                                    "pending",
                                per_page:
                                    1,
                            }),

                            getBrands({
                                filter:
                                    "featured",
                                per_page:
                                    1,
                            }),
                        ]);


                    setStats({
                        total:
                            extractTotal(
                                allResponse
                            ),

                        active:
                            extractTotal(
                                activeResponse
                            ),

                        inactive:
                            extractTotal(
                                inactiveResponse
                            ),

                        pending:
                            extractTotal(
                                pendingResponse
                            ),

                        featured:
                            extractTotal(
                                featuredResponse
                            ),
                    });
                } catch {
                    /*
                     * Brand list can continue working
                     * even if statistics fail.
                     */
                } finally {
                    if (!silent) {
                        setStatsLoading(
                            false
                        );
                    }
                }
            },
            []
        );


    /*
    |--------------------------------------------------------------------------
    | Initial Statistics Loading
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadStats();
    }, [
        loadStats,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Featured / Unfeatured
    |--------------------------------------------------------------------------
    */

    const handleToggleFeatured =
        async (brand) => {
            if (
                !brand?.id ||
                updatingFeaturedId
            ) {
                return;
            }


            const nextFeatured =
                !Boolean(
                    brand.is_featured
                );


            setUpdatingFeaturedId(
                brand.id
            );

            setError("");


            /*
            |--------------------------------------------------------------------------
            | Optimistic UI Update
            |--------------------------------------------------------------------------
            */

            setBrands(
                (current) =>
                    current.map(
                        (item) =>
                            item.id ===
                            brand.id
                                ? {
                                    ...item,

                                    is_featured:
                                        nextFeatured,
                                }
                                : item
                    )
            );


            try {
                await updateBrand(
                    brand.id,
                    {
                        is_featured:
                            nextFeatured,
                    }
                );


                /*
                |--------------------------------------------------------------------------
                | Remove From Featured Tab When Unfeatured
                |--------------------------------------------------------------------------
                */

                if (
                    activeTab ===
                        "featured" &&
                    !nextFeatured
                ) {
                    setBrands(
                        (current) =>
                            current.filter(
                                (item) =>
                                    item.id !==
                                    brand.id
                            )
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Refresh Statistics
                |--------------------------------------------------------------------------
                */

                await loadStats({
                    silent: true,
                });


                /*
                |--------------------------------------------------------------------------
                | Notification
                |--------------------------------------------------------------------------
                */

                showToast(
                    nextFeatured
                        ? "Brand marked as featured"
                        : "Brand removed from featured"
                );
            } catch (error) {
                /*
                |--------------------------------------------------------------------------
                | Rollback
                |--------------------------------------------------------------------------
                */

                setBrands(
                    (current) =>
                        current.map(
                            (item) =>
                                item.id ===
                                brand.id
                                    ? {
                                        ...item,

                                        is_featured:
                                            brand.is_featured,
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


    /*
    |--------------------------------------------------------------------------
    | Archive / Restore
    |--------------------------------------------------------------------------
    */

    const handleToggleArchive =
        async (brand) => {
            if (
                !brand?.id ||
                updatingArchiveId
            ) {
                return;
            }


            const isArchived =
                Boolean(
                    brand.archived_at
                );


            setUpdatingArchiveId(
                brand.id
            );

            setError("");


            try {
                /*
                |--------------------------------------------------------------------------
                | Restore
                |--------------------------------------------------------------------------
                */

                if (isArchived) {
                    await restoreBrand(
                        brand.id
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Remove From Archived Tab Immediately
                    |--------------------------------------------------------------------------
                    */

                    if (
                        activeTab ===
                        "archived"
                    ) {
                        setBrands(
                            (current) =>
                                current.filter(
                                    (item) =>
                                        item.id !==
                                        brand.id
                                )
                        );
                    }


                    showToast(
                        `${brand.name} restored successfully`
                    );
                } else {
                    /*
                    |--------------------------------------------------------------------------
                    | Archive
                    |--------------------------------------------------------------------------
                    */

                    await archiveBrand(
                        brand.id
                    );


                    /*
                    |--------------------------------------------------------------------------
                    | Remove From Normal Tabs
                    |--------------------------------------------------------------------------
                    */

                    if (
                        activeTab !==
                        "archived"
                    ) {
                        setBrands(
                            (current) =>
                                current.filter(
                                    (item) =>
                                        item.id !==
                                        brand.id
                                )
                        );
                    }


                    showToast(
                        `${brand.name} archived successfully`
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Refresh Data
                |--------------------------------------------------------------------------
                */

                await Promise.all([
                    loadBrands({
                        silent: true,
                    }),

                    loadStats({
                        silent: true,
                    }),
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
    | Open Delete Modal
    |--------------------------------------------------------------------------
    */

    const handleDeleteClick =
        (brand) => {
            setError("");

            setDeleteTarget(
                brand
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Close Delete Modal
    |--------------------------------------------------------------------------
    */

    const handleDeleteClose =
        () => {
            if (deleting) {
                return;
            }


            setDeleteTarget(
                null
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Confirm Delete
    |--------------------------------------------------------------------------
    */

    const handleDeleteConfirm =
        async () => {
            if (
                !deleteTarget?.id ||
                deleting
            ) {
                return;
            }


            const brandName =
                deleteTarget.name;


            setDeleting(
                true
            );

            setError("");


            try {
                await deleteBrand(
                    deleteTarget.id
                );


                setDeleteTarget(
                    null
                );


                /*
                |--------------------------------------------------------------------------
                | Refresh List + Stats
                |--------------------------------------------------------------------------
                */

                await Promise.all([
                    loadBrands({
                        silent: true,
                    }),

                    loadStats({
                        silent: true,
                    }),
                ]);


                showToast(
                    `${brandName} deleted successfully`
                );
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );


                setDeleteTarget(
                    null
                );
            } finally {
                setDeleting(
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
        <div className="min-h-full bg-slate-50">

            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-7">

                {/* Statistics */}

                <BrandStats
                    stats={
                        stats
                    }
                    loading={
                        statsLoading
                    }
                />


                {/* Error */}

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600">
                        {error}
                    </div>
                )}


                {/* Brand Table Card */}

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <BrandListHeader
                        activeTab={
                            activeTab
                        }
                        onTabChange={
                            setActiveTab
                        }
                        search={
                            search
                        }
                        onSearchChange={
                            setSearch
                        }
                        onAddBrand={() =>
                            navigate(
                                "/admin/brands/create"
                            )
                        }
                    />


                   <BrandTable
    brands={
        brands
    }
    loading={
        loading
    }
    updatingFeaturedId={
        updatingFeaturedId
    }
    updatingArchiveId={
        updatingArchiveId
    }
    onEdit={
        handleEditBrand
    }
    onToggleFeatured={
        handleToggleFeatured
    }
    onToggleArchive={
        handleToggleArchive
    }
    onDelete={
        handleDeleteClick
    }
/>

                </div>

            </div>


            {/* Delete Brand Modal */}

            <DeleteBrandModal
                open={
                    Boolean(
                        deleteTarget
                    )
                }
                brand={
                    deleteTarget
                }
                loading={
                    deleting
                }
                onClose={
                    handleDeleteClose
                }
                onConfirm={
                    handleDeleteConfirm
                }
            />


            {/* Premium Toast */}

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
};


export default BrandIndex;


/*
|--------------------------------------------------------------------------
| Extract Brand List
|--------------------------------------------------------------------------
*/

const extractBrandResponse = (
    response
) => {
    const root =
        response?.data ??
        response ??
        {};


    /*
    |--------------------------------------------------------------------------
    | data.brands.data
    |--------------------------------------------------------------------------
    */

    if (
        Array.isArray(
            root?.brands?.data
        )
    ) {
        return {
            brands:
                root.brands.data,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | data.brands
    |--------------------------------------------------------------------------
    */

    if (
        Array.isArray(
            root?.brands
        )
    ) {
        return {
            brands:
                root.brands,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | data.data
    |--------------------------------------------------------------------------
    */

    if (
        Array.isArray(
            root?.data
        )
    ) {
        return {
            brands:
                root.data,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | Direct Array
    |--------------------------------------------------------------------------
    */

    if (
        Array.isArray(
            root
        )
    ) {
        return {
            brands:
                root,
        };
    }


    return {
        brands: [],
    };
};


/*
|--------------------------------------------------------------------------
| Extract Pagination Total
|--------------------------------------------------------------------------
*/

const extractTotal = (
    response
) => {
    const root =
        response?.data ??
        response ??
        {};


    const possibleTotals = [
        root?.brands?.meta?.total,
        root?.brands?.total,
        root?.pagination?.total,
        root?.meta?.total,
        root?.total,
    ];


    const total =
        possibleTotals.find(
            (value) =>
                Number.isFinite(
                    Number(value)
                )
        );


    if (
        total !== undefined
    ) {
        return Number(
            total
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Fallback
    |--------------------------------------------------------------------------
    */

    return extractBrandResponse(
        response
    ).brands.length;
};


/*
|--------------------------------------------------------------------------
| API Error Helper
|--------------------------------------------------------------------------
*/

const getApiError = (
    error
) => {
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
        "Unable to complete this action."
    );
};