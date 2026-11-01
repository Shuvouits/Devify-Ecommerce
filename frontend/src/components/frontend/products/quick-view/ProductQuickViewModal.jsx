import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { getProductQuickView } from "../../../../api/storefront/productApi";

import ProductQuickViewGallery from "./ProductQuickViewGallery";
import ProductQuickViewOptions from "./ProductQuickViewOptions";
import ProductQuickViewPurchase from "./ProductQuickViewPurchase";

import {
    areAllOptionsSelected,
    findMatchingVariant,
    getAvailableGlobalVariants,
    getInitialSelectedOptions,
    getQuickViewPricing,
    getSelectedVariantImage,
    getVariantAvailability,
} from "./quickViewUtils";

const ProductQuickViewModal = ({
    productId,
    isOpen,
    onClose,
    onAddToCart,
    onBuyNow,
}) => {
    const [product, setProduct] =
        useState(null);

    const [
        selectedOptions,
        setSelectedOptions,
    ] = useState({});

    const [quantity, setQuantity] =
        useState(1);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        isAddingToCart,
        setIsAddingToCart,
    ] = useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (
            !isOpen ||
            !productId
        ) {
            return;
        }

        loadProduct();
    }, [
        isOpen,
        productId,
    ]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (
            event
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
                onClose();
            }
        };

        const originalOverflow =
            document.body.style
                .overflow;

        document.body.style.overflow =
            "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                originalOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        isOpen,
        onClose,
    ]);

    const loadProduct =
        async () => {
            try {
                setIsLoading(
                    true
                );

                setError("");
                setProduct(null);
                setQuantity(1);

                const response =
                    await getProductQuickView(
                        productId
                    );

                const productData =
                    response?.data ||
                    null;

                setProduct(
                    productData
                );

                setSelectedOptions(
                    getInitialSelectedOptions(
                        productData
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to load product quick view:",
                    error
                );

                setError(
                    error?.response
                        ?.data
                        ?.message ||
                        "Unable to load product."
                );
            } finally {
                setIsLoading(
                    false
                );
            }
        };

    const availableGlobalVariants =
        useMemo(() => {
            if (!product) {
                return [];
            }

            return getAvailableGlobalVariants(
                product
            );
        }, [
            product,
        ]);

    const selectedVariant =
        useMemo(() => {
            if (!product) {
                return null;
            }

            return findMatchingVariant(
                product,
                selectedOptions
            );
        }, [
            product,
            selectedOptions,
        ]);

    const selectedVariantImage =
        useMemo(() => {
            if (!selectedVariant) {
                return null;
            }

            return getSelectedVariantImage(
                selectedVariant
            );
        }, [
            selectedVariant,
        ]);

    const pricing =
        useMemo(() => {
            if (!product) {
                return {
                    price: null,
                    compareAtPrice:
                        null,
                };
            }

            return getQuickViewPricing(
                product,
                selectedVariant
            );
        }, [
            product,
            selectedVariant,
        ]);

    const availability =
        useMemo(() => {
            if (!product) {
                return {
                    isAvailable:
                        false,

                    availableQuantity:
                        0,
                };
            }

            return getVariantAvailability(
                product,
                selectedVariant
            );
        }, [
            product,
            selectedVariant,
        ]);

    const allOptionsSelected =
        useMemo(() => {
            if (!product) {
                return false;
            }

            return areAllOptionsSelected(
                product,
                selectedOptions
            );
        }, [
            product,
            selectedOptions,
        ]);

    const isAvailable =
        allOptionsSelected &&
        (
            !hasVariants(
                product
            ) ||
            selectedVariant !==
                null
        ) &&
        availability.isAvailable;

    const handleSelectOption = (
        variantId,
        optionId
    ) => {
        setSelectedOptions(
            (current) => ({
                ...current,

                [variantId]:
                    optionId,
            })
        );
    };

    const handleAddToCart =
        async () => {
            if (
                !isAvailable ||
                isAddingToCart
            ) {
                return;
            }

            try {
                setIsAddingToCart(
                    true
                );

                if (onAddToCart) {
                    await onAddToCart({
                        product,

                        variant:
                            selectedVariant,

                        quantity,

                        selectedOptions,
                    });
                }
            } finally {
                setIsAddingToCart(
                    false
                );
            }
        };

    const handleBuyNow =
        async () => {
            if (!isAvailable) {
                return;
            }

            if (onBuyNow) {
                await onBuyNow({
                    product,

                    variant:
                        selectedVariant,

                    quantity,

                    selectedOptions,
                });
            }
        };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 px-4 py-6"
            onMouseDown={(
                event
            ) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="relative max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-[20px] bg-white shadow-2xl">
                <button
                    type="button"
                    onClick={
                        onClose
                    }
                    className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 hover:text-[#252b35]"
                    aria-label="Close quick view"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-[18px] w-[18px]"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6l12 12M18 6 6 18"
                        />
                    </svg>
                </button>

                {isLoading ? (
                    <QuickViewSkeleton />
                ) : error ? (
                    <div className="flex min-h-[420px] items-center justify-center px-6 py-12">
                        <div className="text-center">
                            <p className="text-[15px] font-semibold text-[#252b35]">
                                Could not load product
                            </p>

                            <p className="mt-2 text-[13px] text-gray-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={
                                    loadProduct
                                }
                                className="mt-5 h-10 rounded-lg bg-[#252b35] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1c2129]"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : product ? (
                    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
                        <ProductQuickViewGallery
                            media={
                                product?.media ||
                                []
                            }
                            title={
                                product?.title ||
                                "Product"
                            }
                            selectedImage={
                                selectedVariantImage
                            }
                        />

                        <div className="min-w-0 py-1">
                            {product?.brand
                                ?.name && (
                                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                                    {
                                        product
                                            .brand
                                            .name
                                    }
                                </p>
                            )}

                            <h2 className="pr-10 text-[24px] font-bold leading-[1.3] text-[#252b35]">
                                {
                                    product.title
                                }
                            </h2>

                            {product?.overview && (
                                <p className="mt-3 text-[13px] leading-6 text-gray-500">
                                    {
                                        product.overview
                                    }
                                </p>
                            )}

                            <div className="my-5 h-px bg-gray-100" />

                            <ProductQuickViewOptions
                                globalVariants={
                                    availableGlobalVariants
                                }
                                selectedOptions={
                                    selectedOptions
                                }
                                onSelectOption={
                                    handleSelectOption
                                }
                            />

                            {hasVariants(
                                product
                            ) &&
                                allOptionsSelected &&
                                !selectedVariant && (
                                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12px] text-amber-700">
                                        This option combination is unavailable.
                                    </div>
                                )}

                            <div className="my-5 h-px bg-gray-100" />

                            <ProductQuickViewPurchase
                                price={
                                    pricing.price
                                }
                                compareAtPrice={
                                    pricing.compareAtPrice
                                }
                                quantity={
                                    quantity
                                }
                                setQuantity={
                                    setQuantity
                                }
                                isAvailable={
                                    isAvailable
                                }
                                isAddingToCart={
                                    isAddingToCart
                                }
                                onAddToCart={
                                    handleAddToCart
                                }
                                onBuyNow={
                                    handleBuyNow
                                }
                            />

                            {availability.availableQuantity !==
                                null &&
                                availability.availableQuantity >
                                    0 && (
                                    <p className="mt-3 text-[11px] text-gray-400">
                                        {
                                            availability.availableQuantity
                                        }{" "}
                                        available
                                    </p>
                                )}

                            {product?.slug && (
                                <a
                                    href={`/products/${product.slug}`}
                                    className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#4f7df3] transition hover:text-[#416fe0]"
                                >
                                    View full product details

                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-3.5 w-3.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 12h14M13 6l6 6-6 6"
                                        />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

const QuickViewSkeleton = () => {
    return (
        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
            <div className="aspect-square animate-pulse rounded-[16px] bg-gray-100" />

            <div className="py-2">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

                <div className="mt-4 h-7 w-3/4 animate-pulse rounded bg-gray-100" />

                <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-100" />

                <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-100" />

                <div className="my-6 h-px bg-gray-100" />

                <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />

                <div className="mt-3 flex gap-2">
                    {Array.from({
                        length: 4,
                    }).map(
                        (_, index) => (
                            <div
                                key={
                                    index
                                }
                                className="h-10 w-12 animate-pulse rounded-lg bg-gray-100"
                            />
                        )
                    )}
                </div>

                <div className="my-6 h-px bg-gray-100" />

                <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />

                <div className="mt-6 h-12 w-full animate-pulse rounded-lg bg-gray-100" />
            </div>
        </div>
    );
};

const hasVariants = (
    product
) => {
    return (
        Array.isArray(
            product?.variants
        ) &&
        product.variants.length >
            0
    );
};

export default ProductQuickViewModal;