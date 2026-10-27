import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    Loader2,
    Save,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


import {
    analyzeProductSeo,
    createProduct,
    generateProductDescription,
    generateProductSeo,
    getProduct,
    updateProduct,
    uploadProductImage,
} from "../../../../api/admin/productApi";

import BrandImageStudio from "../../../../components/admin/brands/image-studio/BrandImageStudio";


import BrandAiModal from "../../../../components/admin/brands/form/BrandAiModal";

import {
    getBrands,
} from "../../../../api/admin/brandApi";

import {
    getCategories,
} from "../../../../api/admin/categoryApi";

import {
    getOrderedCollections,
} from "../../../../api/admin/collectionApi";

import {
    getLocations,
} from "../../../../api/admin/locationApi";

import {
    getOrderedGlobalVariants,
} from "../../../../api/admin/globalVariantApi";

import ProductDetailsSection from "./components/ProductDetailsSection";
import ProductMediaSection from "./components/ProductMediaSection";
import ProductPricingSection from "./components/ProductPricingSection";
import ProductInventorySection from "./components/ProductInventorySection";
import ProductShippingSection from "./components/ProductShippingSection";
import ProductOrganizationSection from "./components/ProductOrganizationSection";
import ProductVariantsSection from "./components/ProductVariantsSection";
import ProductReturnsPreorderSection from "./components/ProductReturnsPreorderSection";
import ProductSeoSection from "./components/ProductSeoSection";
import ProductStatusSection from "./components/ProductStatusSection";


const initialForm = {
    /*
    |--------------------------------------------------------------------------
    | Basic
    |--------------------------------------------------------------------------
    */

    title: "",
    slug: "",
    overview: "",
    description: "",
    specifications: [],
    tags: [],

    /*
    |--------------------------------------------------------------------------
    | Organization
    |--------------------------------------------------------------------------
    */

    brand_id: null,
    category_id: null,
    vendor_id: null,

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: "draft",
    is_featured: false,

    publish_online_store: true,
    publish_point_of_sale: false,

    /*
    |--------------------------------------------------------------------------
    | Returns
    |--------------------------------------------------------------------------
    */

    is_final_sale: false,
    return_window_days: "",

    /*
    |--------------------------------------------------------------------------
    | Pre-order
    |--------------------------------------------------------------------------
    */

    preorder_enabled: false,
    preorder_expected_ship_date: "",
    preorder_limit: 0,
    preorder_payment_collection:
        "pay_later",
    preorder_deposit_type: "",
    preorder_deposit_value: "",
    preorder_supplier_eta: "",
    preorder_batch_name: "",
    preorder_storefront_message: "",
    reserved_preorders: 0,
    sell_only_as_preorder: false,
    stop_preorders_after_release_date:
        false,

    /*
    |--------------------------------------------------------------------------
    | Pricing
    |--------------------------------------------------------------------------
    */

    price: "",
    compare_at_price: "",
    cost_per_item: "",

    charge_tax: true,
    tax_class: "",

    /*
    |--------------------------------------------------------------------------
    | Inventory
    |--------------------------------------------------------------------------
    */

    sku: "",
    barcode: "",
    track_quantity: true,
    continue_selling_when_out_of_stock:
        false,

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    */

    weight: 0,
    weight_unit: "kg",

    length: 0,
    width: 0,
    height: 0,
    size_unit: "cm",

    country_of_origin: "",
    hs_code: "",
    customs_description: "",

    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    seo_title: "",
    seo_description: "",
};


export default function ProductForm() {
    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const isEditing =
        Boolean(id);

    const [form, setForm] =
        useState(initialForm);

    const [media, setMedia] =
        useState([]);

    const [
        selectedCollections,
        setSelectedCollections,
    ] = useState([]);

    const [
        selectedGlobalVariants,
        setSelectedGlobalVariants,
    ] = useState([]);

    const [
        variants,
        setVariants,
    ] = useState([]);

    const [
        inventories,
        setInventories,
    ] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Reference Data
    |--------------------------------------------------------------------------
    */

    const [brands, setBrands] =
        useState([]);

    const [
        categories,
        setCategories,
    ] = useState([]);

    const [
        collections,
        setCollections,
    ] = useState([]);

    const [
        locations,
        setLocations,
    ] = useState([]);

    const [
        globalVariants,
        setGlobalVariants,
    ] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | UI State
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const [
        aiModal,
        setAiModal,
    ] = useState(null);

    const [
        aiLoading,
        setAiLoading,
    ] = useState(false);

    const [
        seoAnalysis,
        setSeoAnalysis,
    ] = useState(null);

    const [
        analyzingSeo,
        setAnalyzingSeo,
    ] = useState(false);


    const [
    studioOpen,
    setStudioOpen,
] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Form Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        field,
        value
    ) => {
        setForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        );
    };


    /*
|--------------------------------------------------------------------------
| Product AI Context
|--------------------------------------------------------------------------
*/

    const getSelectedBrandName =
        () => {
            const brand =
                brands.find(
                    (item) =>
                        Number(item.id) ===
                        Number(form.brand_id)
                );

            return (
                brand?.name ||
                null
            );
        };


    const getSelectedCategoryName =
        () => {
            const category =
                categories.find(
                    (item) =>
                        Number(item.id) ===
                        Number(form.category_id)
                );

            return (
                category?.name ||
                null
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Generate AI Overview
    |--------------------------------------------------------------------------
    */

    const handleGenerateOverview =
        async ({
            prompt,
            tone,
        }) => {
            if (
                !form.title.trim()
            ) {
                setError(
                    "Enter a product title before using AI."
                );

                return;
            }


            setAiLoading(true);
            setError("");


            try {
                const response =
                    await generateProductDescription({
                        product_title:
                            form.title,

                        brand_name:
                            getSelectedBrandName(),

                        category_name:
                            getSelectedCategoryName(),

                        overview:
                            form.overview ||
                            null,

                        prompt: [
                            "Write a concise product overview.",
                            "Keep it around 2 to 3 short sentences and under 350 characters.",
                            prompt || "",
                        ]
                            .filter(Boolean)
                            .join(" "),

                        tone,
                    });


                const overview =
                    response?.data
                        ?.description;


                if (overview) {
                    setForm(
                        (current) => ({
                            ...current,
                            overview:
                                overview.slice(
                                    0,
                                    350
                                ),
                        })
                    );
                }


                setAiModal(null);
            } catch (error) {
                setError(
                    error?.response
                        ?.data?.message ||
                    "Could not generate product overview."
                );
            } finally {
                setAiLoading(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Generate AI Description
    |--------------------------------------------------------------------------
    */

    const handleGenerateDescription =
        async ({
            prompt,
            tone,
        }) => {
            if (
                !form.title.trim()
            ) {
                setError(
                    "Enter a product title before using AI."
                );

                return;
            }


            setAiLoading(true);
            setError("");


            try {
                const response =
                    await generateProductDescription({
                        product_title:
                            form.title,

                        brand_name:
                            getSelectedBrandName(),

                        category_name:
                            getSelectedCategoryName(),

                        overview:
                            form.overview ||
                            null,

                        prompt:
                            prompt ||
                            null,

                        tone,
                    });


                const description =
                    response?.data
                        ?.description;


                if (description) {
                    setForm(
                        (current) => ({
                            ...current,
                            description,
                        })
                    );
                }


                setAiModal(null);
            } catch (error) {
                setError(
                    error?.response
                        ?.data?.message ||
                    "Could not generate product description."
                );
            } finally {
                setAiLoading(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Generate AI SEO
    |--------------------------------------------------------------------------
    */

    const handleGenerateSeo =
        async ({
            prompt,
            tone,
        }) => {
            if (
                !form.title.trim()
            ) {
                setError(
                    "Enter a product title before generating SEO."
                );

                return;
            }


            setAiLoading(true);
            setError("");


            try {
                const response =
                    await generateProductSeo({
                        product_title:
                            form.title,

                        overview:
                            form.overview ||
                            null,

                        description:
                            form.description ||
                            null,

                        brand_name:
                            getSelectedBrandName(),

                        category_name:
                            getSelectedCategoryName(),

                        prompt:
                            prompt ||
                            null,

                        tone,
                    });


                const seo =
                    response?.data
                        ?.seo;


                if (seo) {
                    setForm(
                        (current) => ({
                            ...current,

                            seo_title:
                                seo.title ||
                                "",

                            seo_description:
                                seo.meta_description ||
                                "",

                            slug:
                                seo.slug ||
                                current.slug,
                        })
                    );
                }


                setSeoAnalysis(null);
                setAiModal(null);
            } catch (error) {
                setError(
                    error?.response
                        ?.data?.message ||
                    "Could not generate product SEO."
                );
            } finally {
                setAiLoading(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Analyze Product SEO
    |--------------------------------------------------------------------------
    */

    const handleAnalyzeSeo =
        async () => {
            if (
                !form.title.trim()
            ) {
                setError(
                    "Enter a product title first."
                );

                return;
            }


            setAnalyzingSeo(true);
            setError("");


            try {
                const response =
                    await analyzeProductSeo({
                        product_title:
                            form.title,

                        overview:
                            form.overview ||
                            null,

                        description:
                            form.description ||
                            null,

                        seo_title:
                            form.seo_title ||
                            null,

                        seo_description:
                            form.seo_description ||
                            null,

                        slug:
                            form.slug ||
                            null,

                        brand_name:
                            getSelectedBrandName(),

                        category_name:
                            getSelectedCategoryName(),

                        has_media:
                            media.length > 0,

                        has_price:
                            form.price !== "" &&
                            form.price !== null &&
                            Number(
                                form.price
                            ) >= 0,
                    });


                setSeoAnalysis(
                    response?.data
                        ?.seo_analysis ||
                    null
                );
            } catch (error) {
                setError(
                    error?.response
                        ?.data?.message ||
                    "Could not analyze product SEO."
                );
            } finally {
                setAnalyzingSeo(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Extract API List
    |--------------------------------------------------------------------------
    */

    const extractList = (
        response
    ) => {
        if (
            Array.isArray(
                response?.data
            )
        ) {
            return response.data;
        }

        if (
            Array.isArray(
                response?.data?.data
            )
        ) {
            return response.data.data;
        }

        if (
            Array.isArray(response)
        ) {
            return response;
        }

        return [];
    };


    /*
    |--------------------------------------------------------------------------
    | Load Reference Data
    |--------------------------------------------------------------------------
    */

    const loadReferenceData =
        async () => {
            const [
                brandResponse,
                categoryResponse,
                collectionResponse,
                locationResponse,
                globalVariantResponse,
            ] =
                await Promise.all([
                    getBrands({
                        status: "active",
                        per_page: 100,
                    }),

                    getCategories({
                        status: "active",
                        per_page: 100,
                    }),

                    getOrderedCollections(),

                    getLocations({
                        status: "active",
                        per_page: 100,
                    }),

                    getOrderedGlobalVariants(),
                ]);

            setBrands(
                extractList(
                    brandResponse
                )
            );

            setCategories(
                extractList(
                    categoryResponse
                )
            );

            setCollections(
                extractList(
                    collectionResponse
                )
            );

            setLocations(
                extractList(
                    locationResponse
                )
            );

            setGlobalVariants(
                extractList(
                    globalVariantResponse
                )
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Load Existing Product
    |--------------------------------------------------------------------------
    */

    const loadProduct =
        async () => {
            const response =
                await getProduct(id);

            const product =
                response?.data;

            if (!product) {
                throw new Error(
                    "Product not found."
                );
            }

            setForm({
                title:
                    product.title ||
                    "",

                slug:
                    product.slug ||
                    "",

                overview:
                    product.overview ||
                    "",

                description:
                    product.description ||
                    "",

                specifications:
                    product.specifications ||
                    [],

                tags:
                    product.tags ||
                    [],

                brand_id:
                    product.brand?.id ||
                    null,

                category_id:
                    product.category?.id ||
                    null,

                vendor_id:
                    product.vendor?.id ||
                    null,

                status:
                    product.status ||
                    "draft",

                is_featured:
                    Boolean(
                        product.is_featured
                    ),

                publish_online_store:
                    Boolean(
                        product.publish_online_store
                    ),

                publish_point_of_sale:
                    Boolean(
                        product.publish_point_of_sale
                    ),

                is_final_sale:
                    Boolean(
                        product.returns
                            ?.is_final_sale
                    ),

                return_window_days:
                    product.returns
                        ?.return_window_days ??
                    "",

                preorder_enabled:
                    Boolean(
                        product.preorder
                            ?.enabled
                    ),

                preorder_expected_ship_date:
                    product.preorder
                        ?.expected_ship_date ||
                    "",

                preorder_limit:
                    product.preorder
                        ?.limit ??
                    0,

                preorder_payment_collection:
                    product.preorder
                        ?.payment_collection ||
                    "pay_later",

                preorder_deposit_type:
                    product.preorder
                        ?.deposit_type ||
                    "",

                preorder_deposit_value:
                    product.preorder
                        ?.deposit_value ??
                    "",

                preorder_supplier_eta:
                    product.preorder
                        ?.supplier_eta ||
                    "",

                preorder_batch_name:
                    product.preorder
                        ?.batch_name ||
                    "",

                preorder_storefront_message:
                    product.preorder
                        ?.storefront_message ||
                    "",

                reserved_preorders:
                    product.preorder
                        ?.reserved_preorders ??
                    0,

                sell_only_as_preorder:
                    Boolean(
                        product.preorder
                            ?.sell_only_as_preorder
                    ),

                stop_preorders_after_release_date:
                    Boolean(
                        product.preorder
                            ?.stop_preorders_after_release_date
                    ),

                price:
                    product.pricing
                        ?.price ??
                    "",

                compare_at_price:
                    product.pricing
                        ?.compare_at_price ??
                    "",

                cost_per_item:
                    product.pricing
                        ?.cost_per_item ??
                    "",

                charge_tax:
                    Boolean(
                        product.pricing
                            ?.charge_tax
                    ),

                tax_class:
                    product.pricing
                        ?.tax_class ||
                    "",

                sku:
                    product
                        .inventory_settings
                        ?.sku ||
                    "",

                barcode:
                    product
                        .inventory_settings
                        ?.barcode ||
                    "",

                track_quantity:
                    Boolean(
                        product
                            .inventory_settings
                            ?.track_quantity
                    ),

                continue_selling_when_out_of_stock:
                    Boolean(
                        product
                            .inventory_settings
                            ?.continue_selling_when_out_of_stock
                    ),

                weight:
                    product.shipping
                        ?.weight ??
                    0,

                weight_unit:
                    product.shipping
                        ?.weight_unit ||
                    "kg",

                length:
                    product.shipping
                        ?.length ??
                    0,

                width:
                    product.shipping
                        ?.width ??
                    0,

                height:
                    product.shipping
                        ?.height ??
                    0,

                size_unit:
                    product.shipping
                        ?.size_unit ||
                    "cm",

                country_of_origin:
                    product.shipping
                        ?.country_of_origin ||
                    "",

                hs_code:
                    product.shipping
                        ?.hs_code ||
                    "",

                customs_description:
                    product.shipping
                        ?.customs_description ||
                    "",

                seo_title:
                    product.seo?.title ||
                    "",

                seo_description:
                    product.seo
                        ?.description ||
                    "",
            });

            setMedia(
                Array.isArray(
                    product.media
                )
                    ? product.media
                    : []
            );

            setSelectedCollections(
                Array.isArray(
                    product.collections
                )
                    ? product.collections.map(
                        (
                            collection,
                            index
                        ) => ({
                            collection_id:
                                collection.id,

                            display_order:
                                collection
                                    .display_order ??
                                index + 1,
                        })
                    )
                    : []
            );

            setSelectedGlobalVariants(
                Array.isArray(
                    product.global_variants
                )
                    ? product.global_variants.map(
                        (
                            variant,
                            index
                        ) => ({
                            global_variant_id:
                                variant.id,

                            display_order:
                                variant
                                    .display_order ??
                                index + 1,

                            option_ids:
                                variant.selected_option_ids ||
                                [],
                        })
                    )
                    : []
            );

            setVariants(
                Array.isArray(
                    product.variants
                )
                    ? product.variants
                    : []
            );

            setInventories(
                Array.isArray(
                    product.inventories
                )
                    ? product.inventories
                    : []
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const initialize =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    await loadReferenceData();

                    if (isEditing) {
                        await loadProduct();
                    }
                } catch (loadError) {
                    console.error(
                        "Product form load failed:",
                        loadError
                    );

                    setError(
                        loadError?.response
                            ?.data?.message ||
                        loadError?.message ||
                        "Could not load product form."
                    );
                } finally {
                    setLoading(false);
                }
            };

        initialize();
    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | Normalize Nullable Number
    |--------------------------------------------------------------------------
    */

    const nullableNumber = (
        value
    ) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return Number(value);
    };


    /*
    |--------------------------------------------------------------------------
    | Normalize Media Payload
    |--------------------------------------------------------------------------
    */

    const buildMediaPayload =
        () => {
            return media.map(
                (
                    item,
                    index
                ) => ({
                    ...(item.id
                        ? {
                            id: item.id,
                        }
                        : {}),

                    media_type:
                        item.media_type ||
                        "image",

                    file_path:
                        item.file_path ||
                        null,

                    external_url:
                        item.external_url ||
                        null,

                    alt_text:
                        item.alt_text ||
                        null,

                    is_cover:
                        Boolean(
                            item.is_cover
                        ),

                    display_order:
                        index + 1,
                })
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Normalize Variant Payload
    |--------------------------------------------------------------------------
    */

    const buildVariantPayload =
        () => {
            return variants.map(
                (
                    variant,
                    index
                ) => ({
                    ...(variant.id
                        ? {
                            id: variant.id,
                        }
                        : {}),

                    title:
                        variant.title ||
                        null,

                    sku:
                        variant.sku ||
                        null,

                    barcode:
                        variant.barcode ||
                        null,

                    price:
                        nullableNumber(
                            variant.price
                        ),

                    compare_at_price:
                        nullableNumber(
                            variant.compare_at_price
                        ),

                    cost_per_item:
                        nullableNumber(
                            variant.cost_per_item
                        ),

                    image_path:
                        variant.image_path ||
                        null,

                    is_active:
                        variant.is_active !==
                        false,

                    display_order:
                        index + 1,

                    is_final_sale:
                        variant.is_final_sale ??
                        null,

                    return_window_days:
                        nullableNumber(
                            variant.return_window_days
                        ),

                    option_values:
                        Array.isArray(
                            variant.option_values
                        )
                            ? variant.option_values.map(
                                (
                                    value
                                ) => ({
                                    global_variant_id:
                                        Number(
                                            value.global_variant_id
                                        ),

                                    global_variant_option_id:
                                        Number(
                                            value.global_variant_option_id
                                        ),
                                })
                            )
                            : [],

                    inventories:
                        Array.isArray(
                            variant.inventories
                        )
                            ? variant.inventories.map(
                                (
                                    inventory
                                ) => ({
                                    ...(inventory.id
                                        ? {
                                            id: inventory.id,
                                        }
                                        : {}),

                                    location_id:
                                        Number(
                                            inventory.location_id
                                        ),

                                    quantity:
                                        Number(
                                            inventory.quantity ||
                                            0
                                        ),

                                    reserved_quantity:
                                        Number(
                                            inventory.reserved_quantity ||
                                            0
                                        ),

                                    incoming_quantity:
                                        Number(
                                            inventory.incoming_quantity ||
                                            0
                                        ),
                                })
                            )
                            : [],
                })
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Build Payload
    |--------------------------------------------------------------------------
    */

    const buildPayload =
        () => {
            return {
                title:
                    form.title.trim(),

                slug:
                    form.slug.trim() ||
                    null,

                overview:
                    form.overview ||
                    null,

                description:
                    form.description ||
                    null,

                specifications:
                    form.specifications ||
                    [],

                tags:
                    form.tags || [],

                vendor_id:
                    form.vendor_id ||
                    null,

                brand_id:
                    form.brand_id ||
                    null,

                category_id:
                    form.category_id ||
                    null,

                status:
                    form.status,

                is_featured:
                    Boolean(
                        form.is_featured
                    ),

                publish_online_store:
                    Boolean(
                        form.publish_online_store
                    ),

                publish_point_of_sale:
                    Boolean(
                        form.publish_point_of_sale
                    ),

                is_final_sale:
                    Boolean(
                        form.is_final_sale
                    ),

                return_window_days:
                    nullableNumber(
                        form.return_window_days
                    ),

                preorder_enabled:
                    Boolean(
                        form.preorder_enabled
                    ),

                preorder_expected_ship_date:
                    form.preorder_enabled
                        ? form.preorder_expected_ship_date ||
                        null
                        : null,

                preorder_limit:
                    form.preorder_enabled
                        ? Number(
                            form.preorder_limit ||
                            0
                        )
                        : 0,

                preorder_payment_collection:
                    form.preorder_enabled
                        ? form.preorder_payment_collection
                        : "pay_later",

                preorder_deposit_type:
                    form.preorder_enabled &&
                        form.preorder_payment_collection ===
                        "deposit"
                        ? form.preorder_deposit_type ||
                        null
                        : null,

                preorder_deposit_value:
                    form.preorder_enabled &&
                        form.preorder_payment_collection ===
                        "deposit"
                        ? nullableNumber(
                            form.preorder_deposit_value
                        )
                        : null,

                preorder_supplier_eta:
                    form.preorder_enabled
                        ? form.preorder_supplier_eta ||
                        null
                        : null,

                preorder_batch_name:
                    form.preorder_enabled
                        ? form.preorder_batch_name ||
                        null
                        : null,

                preorder_storefront_message:
                    form.preorder_enabled
                        ? form.preorder_storefront_message ||
                        null
                        : null,

                reserved_preorders:
                    form.preorder_enabled
                        ? Number(
                            form.reserved_preorders ||
                            0
                        )
                        : 0,

                sell_only_as_preorder:
                    form.preorder_enabled
                        ? Boolean(
                            form.sell_only_as_preorder
                        )
                        : false,

                stop_preorders_after_release_date:
                    form.preorder_enabled
                        ? Boolean(
                            form.stop_preorders_after_release_date
                        )
                        : false,

                price:
                    nullableNumber(
                        form.price
                    ),

                compare_at_price:
                    nullableNumber(
                        form.compare_at_price
                    ),

                cost_per_item:
                    nullableNumber(
                        form.cost_per_item
                    ),

                charge_tax:
                    Boolean(
                        form.charge_tax
                    ),

                tax_class:
                    form.charge_tax
                        ? form.tax_class ||
                        null
                        : null,

                sku:
                    form.sku.trim() ||
                    null,

                barcode:
                    form.barcode.trim() ||
                    null,

                track_quantity:
                    Boolean(
                        form.track_quantity
                    ),

                continue_selling_when_out_of_stock:
                    Boolean(
                        form.continue_selling_when_out_of_stock
                    ),

                weight:
                    Number(
                        form.weight ||
                        0
                    ),

                weight_unit:
                    form.weight_unit,

                length:
                    Number(
                        form.length ||
                        0
                    ),

                width:
                    Number(
                        form.width ||
                        0
                    ),

                height:
                    Number(
                        form.height ||
                        0
                    ),

                size_unit:
                    form.size_unit,

                country_of_origin:
                    form.country_of_origin ||
                    null,

                hs_code:
                    form.hs_code ||
                    null,

                customs_description:
                    form.customs_description ||
                    null,

                seo_title:
                    form.seo_title ||
                    null,

                seo_description:
                    form.seo_description ||
                    null,

                collections:
                    selectedCollections.map(
                        (
                            collection,
                            index
                        ) => ({
                            collection_id:
                                Number(
                                    collection.collection_id
                                ),

                            display_order:
                                index + 1,
                        })
                    ),

                media:
                    buildMediaPayload(),

                global_variants:
                    selectedGlobalVariants.map(
                        (
                            variant,
                            index
                        ) => ({
                            global_variant_id:
                                Number(
                                    variant.global_variant_id
                                ),

                            display_order:
                                index + 1,

                            option_ids:
                                (
                                    variant.option_ids ||
                                    []
                                ).map(
                                    Number
                                ),
                        })
                    ),

                variants:
                    buildVariantPayload(),

                inventories:
                    variants.length > 0
                        ? []
                        : inventories.map(
                            (
                                inventory
                            ) => ({
                                ...(inventory.id
                                    ? {
                                        id: inventory.id,
                                    }
                                    : {}),

                                location_id:
                                    Number(
                                        inventory.location_id
                                    ),

                                product_variant_id:
                                    null,

                                quantity:
                                    Number(
                                        inventory.quantity ||
                                        0
                                    ),

                                reserved_quantity:
                                    Number(
                                        inventory.reserved_quantity ||
                                        0
                                    ),

                                incoming_quantity:
                                    Number(
                                        inventory.incoming_quantity ||
                                        0
                                    ),
                            })
                        ),
            };
        };


    /*
    |--------------------------------------------------------------------------
    | Validate Before Save
    |--------------------------------------------------------------------------
    */

    const validateForm =
        () => {
            if (
                !form.title.trim()
            ) {
                setError(
                    "Product title is required."
                );

                return false;
            }

            for (
                const group of selectedGlobalVariants
            ) {
                if (
                    !Array.isArray(
                        group.option_ids
                    ) ||
                    group.option_ids
                        .length === 0
                ) {
                    const globalVariant =
                        globalVariants.find(
                            (
                                item
                            ) =>
                                Number(
                                    item.id
                                ) ===
                                Number(
                                    group.global_variant_id
                                )
                        );

                    setError(
                        `${globalVariant
                            ?.name ||
                        "Variant"
                        } requires at least one option.`
                    );

                    return false;
                }
            }

            return true;
        };


    /*
    |--------------------------------------------------------------------------
    | Save Product
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async (
            event
        ) => {
            event.preventDefault();

            if (
                !validateForm()
            ) {
                window.scrollTo({
                    top: 0,
                    behavior:
                        "smooth",
                });

                return;
            }

            try {
                setSaving(true);
                setError("");
                setSuccessMessage("");

                const payload =
                    buildPayload();

                const response =
                    isEditing
                        ? await updateProduct(
                            id,
                            payload
                        )
                        : await createProduct(
                            payload
                        );

                const savedProduct =
                    response?.data;

                setSuccessMessage(
                    isEditing
                        ? "Product updated successfully."
                        : "Product created successfully."
                );

                if (
                    !isEditing &&
                    savedProduct?.id
                ) {
                    navigate(
                        `/admin/products/${savedProduct.id}/edit`,
                        {
                            replace:
                                true,
                        }
                    );
                }
            } catch (saveError) {
                console.error(
                    "Product save failed:",
                    saveError
                );

                const validationErrors =
                    saveError
                        ?.response
                        ?.data
                        ?.errors;

                if (
                    validationErrors
                ) {
                    const firstError =
                        Object.values(
                            validationErrors
                        )
                            .flat()
                            .find(Boolean);

                    setError(
                        firstError ||
                        "Product could not be saved."
                    );
                } else {
                    setError(
                        saveError
                            ?.response
                            ?.data
                            ?.message ||
                        "Product could not be saved."
                    );
                }

                window.scrollTo({
                    top: 0,
                    behavior:
                        "smooth",
                });
            } finally {
                setSaving(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <Loader2
                        size={18}
                        className="animate-spin"
                    />

                    Loading product...
                </div>
            </div>
        );
    }


    const handleStudioSave =
    async (file) => {
        if (!file) {
            return;
        }

        try {
            setError("");

            const response =
                await uploadProductImage(
                    file,
                    form.title
                );

            const uploaded =
                response?.data;

            if (!uploaded?.file_path) {
                throw new Error(
                    "Image upload failed."
                );
            }

            setMedia(
                (current) => [
                    ...current,
                    {
                        media_type:
                            "image",

                        file_path:
                            uploaded.file_path,

                        url:
                            uploaded.url,

                        external_url:
                            null,

                        alt_text:
                            form.title || "",

                        is_cover:
                            current.length === 0,

                        display_order:
                            current.length + 1,

                        _new_upload:
                            true,
                    },
                ]
            );

            setStudioOpen(false);
        } catch (error) {
            setError(
                error?.response
                    ?.data?.message ||
                    error?.message ||
                    "Could not save the edited product image."
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <>

          <form
    onSubmit={handleSubmit}
    className="mx-auto w-full max-w-[1120px] px-[18px] pb-[40px] pt-[18px] sm:px-[24px]"
>
    {/* Header */}

    <div className="mb-[18px] flex flex-wrap items-center justify-between gap-[12px]">
        <div className="flex min-w-0 items-center gap-[10px]">
            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/admin/products"
                    )
                }
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-[#dfe3e8] bg-white text-[#67717d] transition hover:bg-[#f7f8fa] hover:text-[#111827]"
            >
                <ArrowLeft
                    size={15}
                    strokeWidth={1.9}
                />
            </button>

            <div className="min-w-0">
                <h1 className="truncate text-[18px] font-semibold tracking-[-0.01em] text-[#111827]">
                    {isEditing
                        ? form.title ||
                          "Edit product"
                        : "Create product"}
                </h1>

                <p className="mt-[2px] text-[10px] text-[#818a95]">
                    {isEditing
                        ? "Manage product details, inventory, variants, and publishing."
                        : "Add product information, pricing, inventory, media, and publishing settings."}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-[8px]">
            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/admin/products"
                    )
                }
                disabled={saving}
                className="h-[35px] rounded-[9px] border border-[#d9dee4] bg-white px-[13px] text-[10.5px] font-medium text-[#4f5965] transition hover:bg-[#f8f9fa] disabled:opacity-50"
            >
                Cancel
            </button>

            <button
                type="submit"
                disabled={saving}
                className="inline-flex h-[35px] items-center justify-center gap-[6px] rounded-[9px] bg-[#4f7df3] hover:bg-[#3f6ee8] px-[14px] text-[10.5px] font-medium text-white transition hover:bg-[#292c31] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {saving ? (
                    <Loader2
                        size={13}
                        className="animate-spin"
                    />
                ) : (
                    <Save
                        size={13}
                        strokeWidth={1.9}
                    />
                )}

                {saving
                    ? "Saving..."
                    : isEditing
                      ? "Save changes"
                      : "Save"}
            </button>
        </div>
    </div>


    {/* Messages */}

    {error && (
        <div className="mb-[14px] rounded-[10px] border border-[#fecaca] bg-[#fff5f5] px-[12px] py-[9px] text-[10.5px] text-[#b42318]">
            {error}
        </div>
    )}

    {successMessage && (
        <div className="mb-[14px] rounded-[10px] border border-[#bbf7d0] bg-[#f3fff7] px-[12px] py-[9px] text-[10.5px] text-[#067647]">
            {successMessage}
        </div>
    )}


    {/* Main Layout */}

    <div className="grid items-start gap-[14px] xl:grid-cols-[minmax(0,1fr)_310px]">
        {/* Main column */}

        <div className="min-w-0 space-y-[14px]">
            <ProductDetailsSection
                form={form}
                onChange={handleChange}
                onOpenOverviewAi={() =>
                    setAiModal(
                        "overview"
                    )
                }
                onOpenDescriptionAi={() =>
                    setAiModal(
                        "description"
                    )
                }
            />

            <ProductMediaSection
                media={media}
                productTitle={
                    form.title
                }
                onChange={
                    setMedia
                }
                onOpenAiStudio={() =>
                    setStudioOpen(
                        true
                    )
                }
            />

            <ProductPricingSection
                form={form}
                onChange={
                    handleChange
                }
            />

            <ProductInventorySection
                form={form}
                locations={
                    locations
                }
                inventories={
                    inventories
                }
                onChange={
                    handleChange
                }
                onInventoriesChange={
                    setInventories
                }
                hasVariants={
                    variants.length >
                    0
                }
            />

            <ProductVariantsSection
                globalVariants={
                    globalVariants
                }
                locations={
                    locations
                }
                selectedGlobalVariants={
                    selectedGlobalVariants
                }
                variants={
                    variants
                }
                onGlobalVariantsChange={
                    setSelectedGlobalVariants
                }
                onVariantsChange={
                    setVariants
                }
            />

            <ProductShippingSection
                form={form}
                onChange={
                    handleChange
                }
            />

            <ProductReturnsPreorderSection
                form={form}
                onChange={
                    handleChange
                }
            />

            <ProductSeoSection
                form={form}
                onChange={
                    handleChange
                }
                seoAnalysis={
                    seoAnalysis
                }
                onGenerateSeo={() =>
                    setAiModal(
                        "seo"
                    )
                }
                onAnalyzeSeo={
                    handleAnalyzeSeo
                }
                analyzingSeo={
                    analyzingSeo
                }
            />
        </div>


        {/* Right sidebar */}

        <aside className="min-w-0 space-y-[12px] xl:sticky xl:top-[16px]">
            <ProductStatusSection
                form={form}
                onChange={
                    handleChange
                }
            />

            <ProductOrganizationSection
                form={form}
                brands={brands}
                categories={
                    categories
                }
                collections={
                    collections
                }
                selectedCollections={
                    selectedCollections
                }
                onChange={
                    handleChange
                }
                onCollectionsChange={
                    setSelectedCollections
                }
            />
        </aside>
    </div>


    {/* Bottom Actions */}

    <div className="mt-[18px] flex items-center justify-between border-t border-[#e3e6ea] pt-[16px]">
        <button
            type="button"
            onClick={() =>
                navigate(
                    "/admin/products"
                )
            }
            disabled={saving}
            className="h-[35px] rounded-[9px] border border-[#d9dee4] bg-white px-[13px] text-[10.5px] font-medium text-[#4f5965] transition hover:bg-[#f8f9fa] disabled:opacity-50"
        >
            Cancel
        </button>

        <button
            type="submit"
            disabled={saving}
            className="inline-flex h-[35px] items-center justify-center gap-[6px] rounded-[9px] bg-[#17191c] px-[15px] text-[10.5px] font-medium text-white transition hover:bg-[#292c31] disabled:cursor-not-allowed disabled:opacity-60"
        >
            {saving ? (
                <Loader2
                    size={13}
                    className="animate-spin"
                />
            ) : (
                <Save
                    size={13}
                    strokeWidth={1.9}
                />
            )}

            {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Save product"}
        </button>
    </div>
</form>

            <BrandImageStudio
    open={studioOpen}
    file={null}
    previewUrl=""
    entityLabel="product"
    mediaLabel="Media"
    defaultFileName="product-image.png"
    onClose={() =>
        setStudioOpen(false)
    }
    onSave={
        handleStudioSave
    }
/>


            <BrandAiModal
                open={
                    aiModal ===
                    "overview"
                }
                title="Generate product overview"
                description="Create a short product summary using the title, brand, category and existing product context."
                placeholder="Example: Focus on the main use case and key shopper benefit."
                loading={
                    aiLoading
                }
                onClose={() =>
                    setAiModal(null)
                }
                onGenerate={
                    handleGenerateOverview
                }
            />

            <BrandAiModal
                open={
                    aiModal ===
                    "description"
                }
                title="Generate product description"
                description="Create product copy using the available product details and organization context."
                placeholder="Example: Focus on materials, practical benefits, fit, use cases, or buying considerations."
                loading={
                    aiLoading
                }
                onClose={() =>
                    setAiModal(null)
                }
                onGenerate={
                    handleGenerateDescription
                }
            />

            <BrandAiModal
                open={
                    aiModal ===
                    "seo"
                }
                title="Generate SEO content"
                description="Generate a product page title, meta description and URL handle."
                placeholder="Example: Focus on high-intent ecommerce search terms without keyword stuffing."
                loading={
                    aiLoading
                }
                onClose={() =>
                    setAiModal(null)
                }
                onGenerate={
                    handleGenerateSeo
                }
            />


        </>



    );
}