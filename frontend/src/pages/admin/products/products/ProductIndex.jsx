import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertTriangle,
    ArrowUpDown,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Globe2,
    Layers3,
    Package,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal,
    Store,
    Trash2,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    deleteProduct,
    getProducts,
} from "../../../../api/admin/productApi";


export default function ProductIndex() {
    const navigate =
        useNavigate();

    const [
        products,
        setProducts,
    ] = useState([]);

    const [
        stats,
        setStats,
    ] = useState({
        total: 0,
        active: 0,
        draft: 0,
        archived: 0,
        out_of_stock: 0,
        inventory_units: 0,
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
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);

    const [
        selectedIds,
        setSelectedIds,
    ] = useState([]);

    const [
        filterOpen,
        setFilterOpen,
    ] = useState(false);

    const [
        importExportOpen,
        setImportExportOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Load Products
    |--------------------------------------------------------------------------
    */

    const loadProducts =
        async () => {
            try {
                setLoading(true);

                const response =
                    await getProducts({
                        search:
                            search.trim() ||
                            undefined,

                        status:
                            status ||
                            undefined,

                        page,

                        per_page: 20,
                    });

                const productData =
                    response?.data ||
                    [];

                setProducts(
                    productData
                );

                setStats(
                    response?.stats || {
                        total: 0,
                        active: 0,
                        draft: 0,
                        archived: 0,
                        out_of_stock: 0,
                        inventory_units: 0,
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

                setSelectedIds([]);
            } catch (error) {
                console.error(
                    "Failed to load products:",
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
                    loadProducts();
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


    /*
    |--------------------------------------------------------------------------
    | Reset Page
    |--------------------------------------------------------------------------
    */

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

                await deleteProduct(
                    deleteTarget.id
                );

                setDeleteTarget(
                    null
                );

                await loadProducts();
            } catch (error) {
                console.error(
                    "Failed to delete product:",
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

    const formatMoney = (
        value
    ) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        const number =
            Number(value);

        if (
            Number.isNaN(number)
        ) {
            return null;
        }

        return `$${number.toLocaleString(
            "en-US",
            {
                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2,
            }
        )}`;
    };


    const getProductPrice = (
        product
    ) => {
        const prices = [];

        const basePrice =
            product?.pricing?.price ??
            product?.price;

        if (
            basePrice !== null &&
            basePrice !== undefined &&
            basePrice !== ""
        ) {
            const number =
                Number(basePrice);

            if (
                !Number.isNaN(number)
            ) {
                prices.push(
                    number
                );
            }
        }

        if (
            Array.isArray(
                product?.variants
            )
        ) {
            product.variants.forEach(
                (variant) => {
                    const value =
                        variant?.price ??
                        variant?.pricing
                            ?.price;

                    const number =
                        Number(value);

                    if (
                        value !== null &&
                        value !== undefined &&
                        value !== "" &&
                        !Number.isNaN(
                            number
                        )
                    ) {
                        prices.push(
                            number
                        );
                    }
                }
            );
        }

        if (
            prices.length === 0
        ) {
            return "—";
        }

        const min =
            Math.min(
                ...prices
            );

        const max =
            Math.max(
                ...prices
            );

        if (min === max) {
            return formatMoney(
                min
            );
        }

        return `${formatMoney(
            min
        )} - ${formatMoney(
            max
        )}`;
    };


    const getCoverImage = (
        product
    ) => {
        const media =
            Array.isArray(
                product?.media
            )
                ? product.media
                : [];

        const cover =
            media.find(
                (item) =>
                    item?.is_cover
            ) ||
            media[0];

        if (!cover) {
            return null;
        }

        if (cover?.url) {
            return cover.url;
        }

        if (
            !cover?.file_path
        ) {
            return null;
        }

        if (
            cover.file_path.startsWith(
                "http://"
            ) ||
            cover.file_path.startsWith(
                "https://"
            )
        ) {
            return cover.file_path;
        }

        return `http://127.0.0.1:8000/${cover.file_path}`;
    };


    const getInventoryTotal = (
        product
    ) => {
        let total = 0;

        let found =
            false;

        const addInventoryArray =
            (items) => {
                if (
                    !Array.isArray(
                        items
                    )
                ) {
                    return;
                }

                items.forEach(
                    (item) => {
                        const value =
                            item?.available_quantity ??
                            item?.available ??
                            item?.quantity ??
                            item?.on_hand ??
                            item?.stock;

                        if (
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                        ) {
                            const number =
                                Number(
                                    value
                                );

                            if (
                                !Number.isNaN(
                                    number
                                )
                            ) {
                                total +=
                                    number;

                                found =
                                    true;
                            }
                        }
                    }
                );
            };

        addInventoryArray(
            product?.inventories
        );

        addInventoryArray(
            product?.base_inventories
        );

        if (
            Array.isArray(
                product?.variants
            )
        ) {
            product.variants.forEach(
                (variant) => {
                    addInventoryArray(
                        variant?.inventories
                    );
                }
            );
        }

        if (
            !found
        ) {
            const fallback =
                product
                    ?.inventory_settings
                    ?.quantity ??
                product?.quantity;

            if (
                fallback !== null &&
                fallback !== undefined &&
                fallback !== ""
            ) {
                const number =
                    Number(
                        fallback
                    );

                if (
                    !Number.isNaN(
                        number
                    )
                ) {
                    return number;
                }
            }

            return null;
        }

        return total;
    };


    const getInventoryLabel = (
        product
    ) => {
        const total =
            getInventoryTotal(
                product
            );

        if (
            total !== null
        ) {
            return `${total.toLocaleString(
                "en-US"
            )} in stock`;
        }

        if (
            product
                ?.inventory_settings
                ?.track_quantity
        ) {
            return "Tracked";
        }

        return "Not tracked";
    };


    const getStoreName = (
        product
    ) => {
        return (
            product?.vendor
                ?.store_name ||
            product?.vendor
                ?.name ||
            product?.store_name ||
            "Devify"
        );
    };


    const isVendorProduct = (
        product
    ) => {
        return Boolean(
            product?.vendor_id ||
            product?.vendor?.id
        );
    };


    const isOnline = (
        product
    ) => {
        return Boolean(
            product
                ?.publishing
                ?.online_store ??
            product
                ?.publishing
                ?.publish_online_store ??
            product
                ?.publish_online_store
        );
    };


    const isPointOfSale = (
        product
    ) => {
        return Boolean(
            product
                ?.publishing
                ?.point_of_sale ??
            product
                ?.publishing
                ?.publish_point_of_sale ??
            product
                ?.publish_point_of_sale
        );
    };


    const handleViewProduct = (
        product
    ) => {
        if (product?.slug) {
            window.open(
                `/products/${product.slug}`,
                "_blank",
                "noopener,noreferrer"
            );

            return;
        }

        navigate(
            `/admin/products/${product.id}/edit`
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Selection
    |--------------------------------------------------------------------------
    */

    const allSelected =
        products.length > 0 &&
        products.every(
            (product) =>
                selectedIds.includes(
                    product.id
                )
        );


    const toggleAll =
        () => {
            if (allSelected) {
                setSelectedIds(
                    []
                );

                return;
            }

            setSelectedIds(
                products.map(
                    (product) =>
                        product.id
                )
            );
        };


    const toggleProduct = (
        id
    ) => {
        setSelectedIds(
            (current) =>
                current.includes(
                    id
                )
                    ? current.filter(
                          (
                              productId
                          ) =>
                              productId !==
                              id
                      )
                    : [
                          ...current,
                          id,
                      ]
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Stats Fallback
    |--------------------------------------------------------------------------
    */

    const currentOutOfStock =
        products.filter(
            (product) => {
                const inventory =
                    getInventoryTotal(
                        product
                    );

                return (
                    inventory !==
                        null &&
                    inventory <= 0
                );
            }
        ).length;


    const currentInventoryUnits =
        products.reduce(
            (
                total,
                product
            ) => {
                const inventory =
                    getInventoryTotal(
                        product
                    );

                return (
                    total +
                    (inventory || 0)
                );
            },
            0
        );


    const visibleRange =
        useMemo(
            () => {
                if (
                    !meta.total ||
                    !meta.from ||
                    !meta.to
                ) {
                    return "0 products";
                }

                return `${meta.from}-${meta.to} of ${meta.total}`;
            },
            [meta]
        );


    /*
    |--------------------------------------------------------------------------
    | Tabs
    |--------------------------------------------------------------------------
    */

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
        {
            label: "Archived",
            value: "archived",
        },
    ];


    return (
        <div className="mx-auto w-full max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8">
            {/* Stats */}

            <div className="mb-[16px] overflow-hidden rounded-[14px] border border-[#e1e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        label="Total Products"
                        value={
                            stats.total ??
                            meta.total ??
                            0
                        }
                        helper="All catalog products"
                        icon={Package}
                        iconClass="bg-[#ccfbf1] text-[#0f9f8f]"
                    />

                    <StatCard
                        label="Active Listings"
                        value={
                            stats.active ??
                            0
                        }
                        helper="Live on storefront"
                        icon={
                            CheckCircle2
                        }
                        iconClass="bg-[#dcfce7] text-[#16a36a]"
                    />

                    <StatCard
                        label="Draft Products"
                        value={
                            stats.draft ??
                            0
                        }
                        helper="Pending publish"
                        icon={
                            FileText
                        }
                        iconClass="bg-[#e8eaff] text-[#6366f1]"
                    />

                    <StatCard
                        label="Out of Stock"
                        value={
                            stats.out_of_stock ??
                            currentOutOfStock
                        }
                        helper="Need replenishment"
                        icon={
                            AlertTriangle
                        }
                        iconClass="bg-[#ffedd5] text-[#f97316]"
                    />

                    <StatCard
                        label="Inventory Units"
                        value={Number(
                            stats.inventory_units ??
                                currentInventoryUnits
                        ).toLocaleString(
                            "en-US"
                        )}
                        helper="Total sellable stock"
                        icon={
                            Layers3
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
                    <h1 className="text-[18px] font-semibold text-[#111827]">
                        Products
                    </h1>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products/create"
                            )
                        }
                        className="inline-flex h-[36px] items-center justify-center gap-[7px] rounded-[11px] bg-[#3f73f1] px-[15px] text-[11.5px] font-semibold text-white shadow-sm transition hover:bg-[#3366df]"
                    >
                        <Plus
                            size={15}
                            strokeWidth={2}
                        />

                        Add Product
                    </button>
                </div>


                {/* Inner Table Box */}

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

                        <div className="ml-auto flex h-[55px] items-center">
                            <ArrowUpDown
                                size={13}
                                className="text-[#6f7781]"
                            />
                        </div>
                    </div>


                    {/* Search / Tools */}

                    <div className="flex flex-col gap-[10px] border-b border-[#e6e8eb] px-[14px] py-[11px] lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full max-w-[505px]">
                            <Search
                                size={14}
                                strokeWidth={
                                    1.8
                                }
                                className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#7e8792]"
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search products"
                                className="h-[36px] w-full rounded-[11px] border border-[#d9dde3] bg-white pl-[34px] pr-[12px] text-[11px] text-[#303945] outline-none transition placeholder:text-[#7e8792] focus:border-[#94a3b8]"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-[8px]">
                            {/* Import / Export */}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImportExportOpen(
                                            (
                                                current
                                            ) =>
                                                !current
                                        );

                                        setFilterOpen(
                                            false
                                        );
                                    }}
                                    className="inline-flex h-[34px] items-center gap-[6px] rounded-[10px] border border-[#d9dde3] bg-white px-[11px] text-[10.5px] font-medium text-[#303945] transition hover:bg-[#f8f9fa]"
                                >
                                    <ArrowUpDown
                                        size={
                                            12
                                        }
                                    />

                                    Import / Export

                                    <ChevronDown
                                        size={
                                            12
                                        }
                                    />
                                </button>

                                {importExportOpen && (
                                    <div className="absolute right-0 top-[40px] z-30 w-[165px] overflow-hidden rounded-[10px] border border-[#e1e4e8] bg-white p-[5px] shadow-xl">
                                        <button
                                            type="button"
                                            disabled
                                            className="flex h-[32px] w-full cursor-not-allowed items-center rounded-[7px] px-[9px] text-left text-[10px] text-[#9aa2ad]"
                                        >
                                            Import products
                                        </button>

                                        <button
                                            type="button"
                                            disabled
                                            className="flex h-[32px] w-full cursor-not-allowed items-center rounded-[7px] px-[9px] text-left text-[10px] text-[#9aa2ad]"
                                        >
                                            Export products
                                        </button>
                                    </div>
                                )}
                            </div>


                            {/* Filter */}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFilterOpen(
                                            (
                                                current
                                            ) =>
                                                !current
                                        );

                                        setImportExportOpen(
                                            false
                                        );
                                    }}
                                    className="inline-flex h-[34px] items-center gap-[6px] rounded-[10px] border border-[#d9dde3] bg-white px-[11px] text-[10.5px] font-medium text-[#303945] transition hover:bg-[#f8f9fa]"
                                >
                                    <SlidersHorizontal
                                        size={
                                            13
                                        }
                                    />

                                    Filter
                                </button>

                                {filterOpen && (
                                    <div className="absolute right-0 top-[40px] z-30 w-[180px] rounded-[11px] border border-[#e1e4e8] bg-white p-[8px] shadow-xl">
                                        <p className="px-[6px] pb-[6px] text-[9px] font-medium uppercase tracking-wide text-[#8b949f]">
                                            Product status
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
                    </div>


                    {/* Loading */}

                    {loading ? (
                        <div className="flex min-h-[360px] items-center justify-center">
                            <p className="text-[11px] text-[#707986]">
                                Loading products...
                            </p>
                        </div>
                    ) : products.length ===
                      0 ? (
                        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] bg-[#f3f4f6] text-[#7b8490]">
                                <Package
                                    size={
                                        20
                                    }
                                    strokeWidth={
                                        1.7
                                    }
                                />
                            </div>

                            <h3 className="mt-[12px] text-[12px] font-semibold text-[#202833]">
                                No products found
                            </h3>

                            <p className="mt-[4px] text-[10px] text-[#7b8490]">
                                Create a product or change the current filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1180px] table-fixed">
                                <thead>
                                    <tr className="border-b border-[#e6e8eb] bg-white">
                                        <th className="w-[42px] px-[14px] py-[13px] text-left">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    allSelected
                                                }
                                                onChange={
                                                    toggleAll
                                                }
                                                className="h-[14px] w-[14px] rounded border-[#ccd3dc] accent-[#316ff4]"
                                            />
                                        </th>

                                        <th className="w-[255px] px-[7px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Product
                                        </th>

                                        <th className="w-[125px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Category
                                        </th>

                                        <th className="w-[130px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            StoreName
                                        </th>

                                        <th className="w-[95px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Source
                                        </th>

                                        <th className="w-[95px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Status
                                        </th>

                                        <th className="w-[125px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Inventory
                                        </th>

                                        <th className="w-[165px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Price
                                        </th>

                                        <th className="w-[180px] px-[10px] py-[13px] text-left text-[10.5px] font-medium text-[#636c77]">
                                            Available In
                                        </th>

                                        <th className="w-[100px] px-[10px] py-[13px] text-right text-[10.5px] font-medium text-[#636c77]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map(
                                        (
                                            product
                                        ) => {
                                            const image =
                                                getCoverImage(
                                                    product
                                                );

                                            const vendor =
                                                isVendorProduct(
                                                    product
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                    className="border-b border-[#eceef0] transition last:border-b-0 hover:bg-[#fafbfc]"
                                                >
                                                    {/* Select */}

                                                    <td className="px-[14px] py-[13px]">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(
                                                                product.id
                                                            )}
                                                            onChange={() =>
                                                                toggleProduct(
                                                                    product.id
                                                                )
                                                            }
                                                            className="h-[14px] w-[14px] rounded border-[#ccd3dc] accent-[#316ff4]"
                                                        />
                                                    </td>


                                                    {/* Product */}

                                                    <td className="px-[7px] py-[13px]">
                                                        <div className="flex min-w-0 items-center gap-[10px]">
                                                            <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#e1e4e8] bg-[#f6f7f8]">
                                                                {image ? (
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            product.title ||
                                                                            "Product"
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <Package
                                                                        size={
                                                                            16
                                                                        }
                                                                        strokeWidth={
                                                                            1.7
                                                                        }
                                                                        className="text-[#9aa2ad]"
                                                                    />
                                                                )}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/products/${product.id}/edit`
                                                                    )
                                                                }
                                                                className="min-w-0 max-w-[190px] truncate text-left text-[11px] font-medium text-[#202833] hover:underline"
                                                            >
                                                                {
                                                                    product.title
                                                                }
                                                            </button>
                                                        </div>
                                                    </td>


                                                    {/* Category */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <span className="block truncate text-[10.5px] text-[#424c58]">
                                                            {product
                                                                ?.category
                                                                ?.name ||
                                                                "—"}
                                                        </span>
                                                    </td>


                                                    {/* Store */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <span className="block truncate text-[10.5px] text-[#424c58]">
                                                            {getStoreName(
                                                                product
                                                            )}
                                                        </span>
                                                    </td>


                                                    {/* Source */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <SourceBadge
                                                            vendor={
                                                                vendor
                                                            }
                                                        />
                                                    </td>


                                                    {/* Status */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <StatusBadge
                                                            status={
                                                                product.status
                                                            }
                                                        />
                                                    </td>


                                                    {/* Inventory */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <span className="whitespace-nowrap text-[10.5px] text-[#303945]">
                                                            {getInventoryLabel(
                                                                product
                                                            )}
                                                        </span>
                                                    </td>


                                                    {/* Price */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <span className="whitespace-nowrap text-[10.5px] font-medium text-[#202833]">
                                                            {getProductPrice(
                                                                product
                                                            )}
                                                        </span>
                                                    </td>


                                                    {/* Availability */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <div className="flex flex-wrap items-center gap-[5px]">
                                                            {isPointOfSale(
                                                                product
                                                            ) && (
                                                                <AvailabilityBadge
                                                                    type="store"
                                                                />
                                                            )}

                                                            {isOnline(
                                                                product
                                                            ) && (
                                                                <AvailabilityBadge
                                                                    type="online"
                                                                />
                                                            )}

                                                            {!isPointOfSale(
                                                                product
                                                            ) &&
                                                                !isOnline(
                                                                    product
                                                                ) && (
                                                                    <span className="text-[10px] text-[#9aa2ad]">
                                                                        —
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>


                                                    {/* Actions */}

                                                    <td className="px-[10px] py-[13px]">
                                                        <div className="flex items-center justify-end">
                                                            <div className="inline-flex overflow-hidden rounded-[9px] border border-[#dfe3e8] bg-white">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleViewProduct(
                                                                            product
                                                                        )
                                                                    }
                                                                    title="View product"
                                                                    className="flex h-[30px] w-[31px] items-center justify-center border-r border-[#e3e6ea] text-[#69727d] transition hover:bg-[#f7f8fa] hover:text-[#202833]"
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
                                                                            `/admin/products/${product.id}/edit`
                                                                        )
                                                                    }
                                                                    title="Edit product"
                                                                    className="flex h-[30px] w-[31px] items-center justify-center border-r border-[#e3e6ea] text-[#69727d] transition hover:bg-[#f7f8fa] hover:text-[#202833]"
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
                                                                            product
                                                                        )
                                                                    }
                                                                    title="Delete product"
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
                        products.length >
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
                            className="absolute right-[14px] top-[14px] flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-[17px] text-[#929aa4] transition hover:bg-[#f3f4f6] hover:text-[#303945]"
                        >
                            ×
                        </button>

                        <div className="px-[22px] pb-[20px] pt-[22px]">
                            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[12px] bg-red-50 text-red-600">
                                <Trash2
                                    size={18}
                                    strokeWidth={
                                        1.8
                                    }
                                />
                            </div>

                            <h3 className="mt-[14px] text-[15px] font-semibold text-[#111827]">
                                Delete product?
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
                                    disabled={
                                        deletingId !==
                                        null
                                    }
                                    className="h-[35px] rounded-[9px] border border-[#d9dee4] bg-white px-[13px] text-[10.5px] font-medium text-[#59636f] transition hover:bg-[#f7f8fa] disabled:opacity-50"
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
                                    className="h-[35px] rounded-[9px] bg-red-600 px-[14px] text-[10.5px] font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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


/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

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
                    ? "xl:border-r-0"
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
                        "shrink-0",
                        "items-center",
                        "justify-center",
                        "rounded-full",
                        iconClass,
                    ].join(" ")}
                >
                    <Icon
                        size={14}
                        strokeWidth={1.8}
                    />
                </div>
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Source Badge
|--------------------------------------------------------------------------
*/

function SourceBadge({
    vendor,
}) {
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
                vendor
                    ? "border-[#99eee4] bg-[#ecfffc] text-[#008c80]"
                    : "border-[#dce2e8] bg-[#f7f8fa] text-[#626d78]",
            ].join(" ")}
        >
            {vendor
                ? "Vendor"
                : "Admin"}
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({
    status,
}) {
    if (
        status === "active"
    ) {
        return (
            <span className="inline-flex h-[22px] items-center rounded-full bg-[#3f73f1] px-[9px] text-[9px] font-semibold text-white">
                Active
            </span>
        );
    }

    if (
        status === "archived"
    ) {
        return (
            <span className="inline-flex h-[22px] items-center rounded-full bg-[#f1f2f4] px-[9px] text-[9px] font-semibold text-[#69727d]">
                Archived
            </span>
        );
    }

    return (
        <span className="inline-flex h-[22px] items-center rounded-full bg-[#f1f2f4] px-[9px] text-[9px] font-semibold text-[#69727d]">
            Draft
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Availability Badge
|--------------------------------------------------------------------------
*/

function AvailabilityBadge({
    type,
}) {
    if (
        type === "store"
    ) {
        return (
            <span className="inline-flex h-[23px] items-center gap-[4px] rounded-full bg-[#f7f7f8] px-[8px] text-[9px] font-medium text-[#59636f]">
                <Store
                    size={10}
                    className="text-[#f43f9b]"
                />

                In store
            </span>
        );
    }

    return (
        <span className="inline-flex h-[23px] items-center gap-[4px] rounded-full bg-[#f7f7f8] px-[8px] text-[9px] font-medium text-[#59636f]">
            <Globe2
                size={10}
                className="text-[#0bb8aa]"
            />

            Online
        </span>
    );
}