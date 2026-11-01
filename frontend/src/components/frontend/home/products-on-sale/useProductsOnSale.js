import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { getProductsOnSale } from "../../../../api/storefront/productApi";
import { getProducts } from "../../../../api/admin/productApi";
import { updateHomepageSection } from "../../../../api/admin/homepageSectionApi";
import { getStoredUser } from "../../../../utils/auth";

const SECTION_KEY = "products_on_sale";
const MAX_PRODUCTS = 24;

const useProductsOnSale = () => {
    const [products, setProducts] =
        useState([]);

    const [section, setSection] =
        useState({
            is_active: true,
            item_limit: 8,
            settings: {
                product_ids: [],
            },
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        isEditorOpen,
        setIsEditorOpen,
    ] = useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [
        availableProducts,
        setAvailableProducts,
    ] = useState([]);

    const [productMap, setProductMap] =
        useState({});

    const [
        selectedIds,
        setSelectedIds,
    ] = useState([]);

    const [search, setSearch] =
        useState("");

    const [
        isProductsLoading,
        setIsProductsLoading,
    ] = useState(false);

    const [isActive, setIsActive] =
        useState(true);

    const [
        saveError,
        setSaveError,
    ] = useState("");

    const user =
        getStoredUser();

    const isAdmin =
        Boolean(
            localStorage.getItem(
                "token"
            )
        ) &&
        user?.role === "admin";

    const mergeProductsIntoMap =
        useCallback(
            (productList) => {
                if (
                    !Array.isArray(
                        productList
                    )
                ) {
                    return;
                }

                setProductMap(
                    (current) => {
                        const next = {
                            ...current,
                        };

                        productList.forEach(
                            (product) => {
                                if (
                                    !product?.id
                                ) {
                                    return;
                                }

                                next[
                                    Number(
                                        product.id
                                    )
                                ] =
                                    product;
                            }
                        );

                        return next;
                    }
                );
            },
            []
        );

    const loadSection =
        useCallback(
            async () => {
                try {
                    setIsLoading(
                        true
                    );

                    const response =
                        await getProductsOnSale();

                    const sectionData =
                        response?.section ||
                        {};

                    const productIds =
                        Array.isArray(
                            sectionData
                                ?.settings
                                ?.product_ids
                        )
                            ? sectionData.settings.product_ids
                                  .map(
                                      Number
                                  )
                                  .filter(
                                      Boolean
                                  )
                            : [];

                    const productList =
                        Array.isArray(
                            response?.data
                        )
                            ? response.data
                            : [];

                    setSection({
                        is_active:
                            sectionData?.is_active ??
                            true,

                        item_limit:
                            sectionData?.item_limit ??
                            8,

                        settings: {
                            product_ids:
                                productIds,
                        },
                    });

                    setProducts(
                        productList
                    );

                    mergeProductsIntoMap(
                        productList
                    );
                } catch (error) {
                    console.error(
                        "Failed to load products on sale:",
                        error
                    );

                    setProducts([]);
                } finally {
                    setIsLoading(
                        false
                    );
                }
            },
            [
                mergeProductsIntoMap,
            ]
        );

    const loadAvailableProducts =
        useCallback(
            async (
                searchValue = ""
            ) => {
                try {
                    setIsProductsLoading(
                        true
                    );

                    const response =
                        await getProducts({
                            search:
                                searchValue.trim() ||
                                undefined,

                            status:
                                "active",

                            publish_online_store:
                                true,

                            per_page:
                                100,
                        });

                    const productList =
                        Array.isArray(
                            response?.data
                        )
                            ? response.data
                            : [];

                    setAvailableProducts(
                        productList
                    );

                    mergeProductsIntoMap(
                        productList
                    );
                } catch (error) {
                    console.error(
                        "Failed to load available products:",
                        error
                    );

                    setAvailableProducts(
                        []
                    );
                } finally {
                    setIsProductsLoading(
                        false
                    );
                }
            },
            [
                mergeProductsIntoMap,
            ]
        );

    useEffect(() => {
        loadSection();
    }, [
        loadSection,
    ]);

    useEffect(() => {
        if (!isEditorOpen) {
            return;
        }

        const timer =
            setTimeout(() => {
                loadAvailableProducts(
                    search
                );
            }, 300);

        return () => {
            clearTimeout(
                timer
            );
        };
    }, [
        isEditorOpen,
        search,
        loadAvailableProducts,
    ]);

    const openEditor = () => {
        const configuredIds =
            Array.isArray(
                section?.settings
                    ?.product_ids
            )
                ? section.settings.product_ids
                      .map(Number)
                      .filter(Boolean)
                : [];

        const currentIds =
            configuredIds.length
                ? configuredIds
                : products
                      .map(
                          (product) =>
                              Number(
                                  product.id
                              )
                      )
                      .filter(Boolean);

        setSelectedIds(
            currentIds
        );

        setIsActive(
            section.is_active
        );

        setSearch("");
        setSaveError("");
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        if (isSaving) {
            return;
        }

        setIsEditorOpen(false);
        setSaveError("");
    };

    const toggleProduct = (
        product
    ) => {
        const productId =
            Number(product?.id);

        if (!productId) {
            return;
        }

        setSelectedIds(
            (current) => {
                if (
                    current.includes(
                        productId
                    )
                ) {
                    return current.filter(
                        (id) =>
                            id !==
                            productId
                    );
                }

                if (
                    current.length >=
                    MAX_PRODUCTS
                ) {
                    return current;
                }

                return [
                    ...current,
                    productId,
                ];
            }
        );

        mergeProductsIntoMap([
            product,
        ]);
    };

    const removeProduct = (
        productId
    ) => {
        const id =
            Number(productId);

        setSelectedIds(
            (current) =>
                current.filter(
                    (itemId) =>
                        itemId !== id
                )
        );
    };

    const moveProduct = (
        index,
        direction
    ) => {
        setSelectedIds(
            (current) => {
                const newIndex =
                    direction === "up"
                        ? index - 1
                        : index + 1;

                if (
                    newIndex < 0 ||
                    newIndex >=
                        current.length
                ) {
                    return current;
                }

                const next = [
                    ...current,
                ];

                const [moved] =
                    next.splice(
                        index,
                        1
                    );

                next.splice(
                    newIndex,
                    0,
                    moved
                );

                return next;
            }
        );
    };

    const handleSave =
        async () => {
            try {
                setIsSaving(
                    true
                );

                setSaveError("");

                await updateHomepageSection(
                    SECTION_KEY,
                    {
                        is_active:
                            Boolean(
                                isActive
                            ),

                        item_limit:
                            Math.max(
                                1,
                                selectedIds.length
                            ),

                        settings: {
                            product_ids:
                                selectedIds,
                        },
                    }
                );

                setIsEditorOpen(
                    false
                );

                await loadSection();
            } catch (error) {
                console.error(
                    "Failed to save Products on Sale:",
                    error
                );

                setSaveError(
                    error?.response
                        ?.data
                        ?.message ||
                        "Unable to save section."
                );
            } finally {
                setIsSaving(
                    false
                );
            }
        };

    const selectedProducts =
        useMemo(() => {
            return selectedIds
                .map(
                    (id) =>
                        productMap[
                            Number(id)
                        ]
                )
                .filter(Boolean);
        }, [
            selectedIds,
            productMap,
        ]);

    return {
        products,
        section,

        isLoading,
        isAdmin,

        isEditorOpen,
        openEditor,
        closeEditor,

        isActive,
        setIsActive,

        availableProducts,
        selectedIds,
        selectedProducts,

        search,
        setSearch,

        isProductsLoading,

        isSaving,
        saveError,

        toggleProduct,
        removeProduct,
        moveProduct,
        handleSave,

        reload:
            loadSection,
    };
};

export default useProductsOnSale;