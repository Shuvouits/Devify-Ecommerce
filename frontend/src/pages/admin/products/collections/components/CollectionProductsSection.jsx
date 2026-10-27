import {
    useEffect,
    useState,
} from "react";

import {
    ChevronDown,
    ChevronUp,
    Loader2,
    Package,
    Search,
    X,
} from "lucide-react";

import {
    getProducts,
} from "../../../../../api/admin/productApi";


export default function CollectionProductsSection({
    form,
    onChange,
}) {
    const isManual =
        form.collection_type ===
        "manual";

    const selectedProducts =
        Array.isArray(
            form.selected_products
        )
            ? form.selected_products
            : [];

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        results,
        setResults,
    ] = useState([]);

    const [
        searching,
        setSearching,
    ] = useState(false);

    const [
        searchOpen,
        setSearchOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Search Products
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!isManual) {
            return;
        }

        const timer =
            setTimeout(
                async () => {
                    try {
                        setSearching(true);

                        const response =
                            await getProducts({
                                search:
                                    search.trim() ||
                                    undefined,

                                per_page: 8,
                            });

                        setResults(
                            response?.data ||
                            []
                        );
                    } catch (error) {
                        console.error(
                            "Failed to search products:",
                            error
                        );

                        setResults([]);
                    } finally {
                        setSearching(false);
                    }
                },
                250
            );

        return () =>
            clearTimeout(timer);
    }, [
        search,
        isManual,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

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


    const formatPrice = (
        product
    ) => {
        const value =
            product?.pricing?.price ??
            product?.price;

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }

        const amount =
            Number(value);

        if (
            Number.isNaN(amount)
        ) {
            return "—";
        }

        return `$${amount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };


    /*
    |--------------------------------------------------------------------------
    | Selection
    |--------------------------------------------------------------------------
    */

    const syncSelection = (
        products
    ) => {
        onChange(
            "selected_products",
            products
        );

        onChange(
            "product_ids",
            products.map(
                (product) =>
                    product.id
            )
        );
    };


    const addProduct = (
        product
    ) => {
        const exists =
            selectedProducts.some(
                (item) =>
                    item.id ===
                    product.id
            );

        if (exists) {
            setSearchOpen(false);
            return;
        }

        syncSelection([
            ...selectedProducts,
            product,
        ]);

        setSearch("");
        setSearchOpen(false);
    };


    const removeProduct = (
        id
    ) => {
        syncSelection(
            selectedProducts.filter(
                (product) =>
                    product.id !== id
            )
        );
    };


    const moveProduct = (
        index,
        direction
    ) => {
        const targetIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            targetIndex < 0 ||
            targetIndex >=
                selectedProducts.length
        ) {
            return;
        }

        const next = [
            ...selectedProducts,
        ];

        [
            next[index],
            next[targetIndex],
        ] = [
            next[targetIndex],
            next[index],
        ];

        syncSelection(
            next
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Automated Collection
    |--------------------------------------------------------------------------
    */

    if (!isManual) {
        return (
            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[22px]">
                    <h2 className="text-[14px] font-semibold text-[#111827]">
                        Products in Collection
                    </h2>

                    <div className="mt-[14px] rounded-[12px] border border-[#e1e5e9] bg-[#fafbfc] px-[14px] py-[18px] text-center">
                        <p className="text-[10.5px] font-medium text-[#4f5965]">
                            Products are added automatically
                        </p>

                        <p className="mx-auto mt-[4px] max-w-[380px] text-[9.5px] leading-[15px] text-[#858e99]">
                            This collection uses the conditions defined above to determine which products belong here.
                        </p>
                    </div>
                </div>
            </section>
        );
    }


    return (
        <section className="overflow-visible rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                {/* Header */}

                <div>
                    <h2 className="text-[14px] font-semibold text-[#111827]">
                        Products in Collection
                    </h2>

                    <p className="mt-[2px] text-[9.5px] text-[#858e99]">
                        Search for products and arrange them in the order you want.
                    </p>
                </div>


                {/* Search */}

                <div className="relative mt-[14px]">
                    <Search
                        size={14}
                        className="absolute left-[11px] top-1/2 z-10 -translate-y-1/2 text-[#808995]"
                    />

                    <input
                        type="text"
                        value={
                            search
                        }
                        onFocus={() =>
                            setSearchOpen(
                                true
                            )
                        }
                        onChange={(event) => {
                            setSearch(
                                event.target.value
                            );

                            setSearchOpen(
                                true
                            );
                        }}
                        placeholder="Search products"
                        className="h-[38px] w-full rounded-[10px] border border-[#ccd3dc] bg-white pl-[34px] pr-[38px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#969ea8] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />

                    {searching && (
                        <Loader2
                            size={13}
                            className="absolute right-[12px] top-1/2 -translate-y-1/2 animate-spin text-[#7d8691]"
                        />
                    )}


                    {/* Search Dropdown */}

                    {searchOpen && (
                        <div className="absolute left-0 right-0 top-[44px] z-40 max-h-[285px] overflow-y-auto rounded-[11px] border border-[#dfe3e8] bg-white p-[5px] shadow-xl">
                            {searching ? (
                                <div className="flex h-[70px] items-center justify-center text-[9.5px] text-[#858e99]">
                                    Searching products...
                                </div>
                            ) : results.length ===
                              0 ? (
                                <div className="flex h-[70px] items-center justify-center text-[9.5px] text-[#858e99]">
                                    No products found.
                                </div>
                            ) : (
                                results.map(
                                    (
                                        product
                                    ) => {
                                        const image =
                                            getCoverImage(
                                                product
                                            );

                                        const selected =
                                            selectedProducts.some(
                                                (
                                                    item
                                                ) =>
                                                    item.id ===
                                                    product.id
                                            );

                                        return (
                                            <button
                                                key={
                                                    product.id
                                                }
                                                type="button"
                                                disabled={
                                                    selected
                                                }
                                                onClick={() =>
                                                    addProduct(
                                                        product
                                                    )
                                                }
                                                className="flex w-full items-center gap-[9px] rounded-[8px] px-[7px] py-[7px] text-left transition hover:bg-[#f7f8fa] disabled:cursor-default disabled:opacity-50"
                                            >
                                                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e1e4e8] bg-[#f5f6f7]">
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
                                                            size={15}
                                                            className="text-[#9ba3ad]"
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[10.5px] font-medium text-[#303945]">
                                                        {
                                                            product.title
                                                        }
                                                    </p>

                                                    <p className="mt-[2px] text-[9px] text-[#858e99]">
                                                        {product
                                                            ?.category
                                                            ?.name ||
                                                            "Uncategorized"}
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-[9.5px] font-medium text-[#4f5965]">
                                                    {selected
                                                        ? "Added"
                                                        : formatPrice(
                                                              product
                                                          )}
                                                </span>
                                            </button>
                                        );
                                    }
                                )
                            )}
                        </div>
                    )}
                </div>


                {/* Selected Products */}

                {selectedProducts.length ===
                0 ? (
                    <div className="mt-[12px] flex min-h-[135px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#d6dbe2] bg-[#fcfcfd] px-4 text-center">
                        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-[#f1f3f5] text-[#8d96a1]">
                            <Package
                                size={17}
                            />
                        </div>

                        <p className="mt-[8px] text-[10px] font-medium text-[#59636f]">
                            No products added
                        </p>

                        <p className="mt-[3px] text-[9px] text-[#8a939e]">
                            Use the search field above to add products.
                        </p>
                    </div>
                ) : (
                    <div className="mt-[12px] overflow-hidden rounded-[12px] border border-[#e0e3e7]">
                        {/* Heading */}

                        <div className="grid grid-cols-[38px_minmax(0,1fr)_100px_92px] items-center border-b border-[#e5e8eb] bg-[#fafbfc] px-[9px] py-[8px]">
                            <span className="text-[9px] font-medium text-[#7b8490]">
                                #
                            </span>

                            <span className="text-[9px] font-medium text-[#7b8490]">
                                Product
                            </span>

                            <span className="text-[9px] font-medium text-[#7b8490]">
                                Price
                            </span>

                            <span className="text-right text-[9px] font-medium text-[#7b8490]">
                                Actions
                            </span>
                        </div>


                        {selectedProducts.map(
                            (
                                product,
                                index
                            ) => {
                                const image =
                                    getCoverImage(
                                        product
                                    );

                                return (
                                    <div
                                        key={
                                            product.id
                                        }
                                        className="grid grid-cols-[38px_minmax(0,1fr)_100px_92px] items-center border-b border-[#eceef1] px-[9px] py-[9px] last:border-b-0"
                                    >
                                        {/* Position */}

                                        <span className="text-[9.5px] font-medium text-[#7c8590]">
                                            {index +
                                                1}
                                        </span>


                                        {/* Product */}

                                        <div className="flex min-w-0 items-center gap-[8px]">
                                            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e1e4e8] bg-[#f5f6f7]">
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
                                                        size={14}
                                                        className="text-[#9ba3ad]"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-[10px] font-medium text-[#303945]">
                                                    {
                                                        product.title
                                                    }
                                                </p>

                                                <p className="mt-[1px] truncate text-[8.5px] text-[#858e99]">
                                                    {product
                                                        ?.inventory_settings
                                                        ?.sku ||
                                                        "No SKU"}
                                                </p>
                                            </div>
                                        </div>


                                        {/* Price */}

                                        <span className="text-[9.5px] font-medium text-[#4f5965]">
                                            {formatPrice(
                                                product
                                            )}
                                        </span>


                                        {/* Actions */}

                                        <div className="flex items-center justify-end gap-[3px]">
                                            <button
                                                type="button"
                                                disabled={
                                                    index ===
                                                    0
                                                }
                                                onClick={() =>
                                                    moveProduct(
                                                        index,
                                                        "up"
                                                    )
                                                }
                                                title="Move up"
                                                className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] text-[#747e89] transition hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ChevronUp
                                                    size={12}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    index ===
                                                    selectedProducts.length -
                                                        1
                                                }
                                                onClick={() =>
                                                    moveProduct(
                                                        index,
                                                        "down"
                                                    )
                                                }
                                                title="Move down"
                                                className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] text-[#747e89] transition hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <ChevronDown
                                                    size={12}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeProduct(
                                                        product.id
                                                    )
                                                }
                                                title="Remove product"
                                                className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] text-[#8b949e] transition hover:bg-red-50 hover:text-red-600"
                                            >
                                                <X
                                                    size={12}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}


                {selectedProducts.length >
                    0 && (
                    <p className="mt-[9px] text-[9px] text-[#858e99]">
                        {
                            selectedProducts.length
                        }{" "}
                        {selectedProducts.length ===
                        1
                            ? "product"
                            : "products"}{" "}
                        in this collection
                    </p>
                )}
            </div>
        </section>
    );
}