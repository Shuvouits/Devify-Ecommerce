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
    createCollection,
    getCollection,
    updateCollection,
} from "../../../../api/admin/collectionApi";

import CollectionDetailsSection from "./components/CollectionDetailsSection";
import CollectionStatusSection from "./components/CollectionStatusSection";
import CollectionKindSection from "./components/CollectionKindSection";
import CollectionProductsSection from "./components/CollectionProductsSection";
import CollectionSeoSection from "./components/CollectionSeoSection";


const initialForm = {
    title: "",
    slug: "",
    description: "",
    image_path: "",

    status: "draft",

    publish_online_store: true,
    publish_point_of_sale: false,

    kind: "collection",

    collection_type: "manual",

    automation_match_type: "all",
    automation_conditions: [],

    selected_products: [],
    product_ids: [],

    sort_order: "manual",
    display_position: 0,

    seo_title: "",
    seo_description: "",
};


export default function CollectionForm() {
    const navigate =
        useNavigate();

    const {
        id,
    } = useParams();

    const isEdit =
        Boolean(id);

    const [
        form,
        setForm,
    ] = useState(
        initialForm
    );

    const [
        loading,
        setLoading,
    ] = useState(
        isEdit
    );

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        fieldErrors,
        setFieldErrors,
    ] = useState({});


    /*
    |--------------------------------------------------------------------------
    | Load Collection
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!isEdit) {
            return;
        }

        const loadCollection =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await getCollection(
                            id
                        );

                    const collection =
                        response?.data ||
                        response;

                    const products =
                        Array.isArray(
                            collection?.products
                        )
                            ? collection.products
                            : [];

                    setForm({
                        title:
                            collection?.title ||
                            "",

                        slug:
                            collection?.slug ||
                            "",

                        description:
                            collection?.description ||
                            "",

                        image_path:
                            collection?.image_path ||
                            "",

                        status:
                            collection?.status ||
                            "draft",

                        publish_online_store:
                            Boolean(
                                collection
                                    ?.publish_online_store
                            ),

                        publish_point_of_sale:
                            Boolean(
                                collection
                                    ?.publish_point_of_sale
                            ),

                        kind:
                            collection?.kind ||
                            "collection",

                        collection_type:
                            collection
                                ?.collection_type ||
                            "manual",

                        automation_match_type:
                            collection
                                ?.automation_match_type ||
                            "all",

                        automation_conditions:
                            Array.isArray(
                                collection
                                    ?.automation_conditions
                            )
                                ? collection
                                      .automation_conditions
                                : [],

                        selected_products:
                            products,

                        product_ids:
                            products.map(
                                (product) =>
                                    product.id
                            ),

                        sort_order:
                            collection
                                ?.sort_order ||
                            "manual",

                        display_position:
                            collection
                                ?.display_position ??
                            0,

                        seo_title:
                            collection
                                ?.seo_title ||
                            "",

                        seo_description:
                            collection
                                ?.seo_description ||
                            "",
                    });
                } catch (loadError) {
                    console.error(
                        "Failed to load collection:",
                        loadError
                    );

                    setError(
                        loadError
                            ?.response
                            ?.data
                            ?.message ||
                            "Could not load the collection."
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadCollection();
    }, [
        id,
        isEdit,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        field,
        value
    ) => {
        setForm(
            (current) => ({
                ...current,
                [field]:
                    value,
            })
        );

        setFieldErrors(
            (current) => {
                if (
                    !current[field]
                ) {
                    return current;
                }

                const next = {
                    ...current,
                };

                delete next[
                    field
                ];

                return next;
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Payload
    |--------------------------------------------------------------------------
    */

    const buildPayload =
        () => {
            const productIds =
                Array.isArray(
                    form.product_ids
                )
                    ? form.product_ids
                          .map(
                              (productId) =>
                                  Number(
                                      productId
                                  )
                          )
                          .filter(
                              (productId) =>
                                  Number.isInteger(
                                      productId
                                  ) &&
                                  productId > 0
                          )
                    : [];

            const payload = {
                title:
                    form.title.trim(),

                slug:
                    form.slug.trim() ||
                    null,

                description:
                    form.description ||
                    null,

                image_path:
                    form.image_path ||
                    null,

                status:
                    form.status,

                publish_online_store:
                    Boolean(
                        form.publish_online_store
                    ),

                publish_point_of_sale:
                    Boolean(
                        form.publish_point_of_sale
                    ),

                kind:
                    form.kind,

                collection_type:
                    form.collection_type,

                product_ids:
                    form.collection_type ===
                    "manual"
                        ? productIds
                        : [],

                sort_order:
                    form.sort_order,

                display_position:
                    Number(
                        form.display_position ||
                            0
                    ),

                seo_title:
                    form.seo_title ||
                    null,

                seo_description:
                    form.seo_description ||
                    null,
            };

            if (
                form.collection_type ===
                "automated"
            ) {
                payload.automation_match_type =
                    form.automation_match_type;

                payload.automation_conditions =
                    form.automation_conditions;
            }

            return payload;
        };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            try {
                setSaving(true);
                setError("");
                setFieldErrors({});

                const payload =
                    buildPayload();

                const response =
                    isEdit
                        ? await updateCollection(
                              id,
                              payload
                          )
                        : await createCollection(
                              payload
                          );

                const saved =
                    response?.data;

                if (
                    !isEdit &&
                    saved?.id
                ) {
                    navigate(
                        `/admin/collections/${saved.id}/edit`
                    );

                    return;
                }

                navigate(
                    "/admin/collections"
                );
            } catch (saveError) {
                console.error(
                    "Failed to save collection:",
                    saveError
                );

                setFieldErrors(
                    saveError
                        ?.response
                        ?.data
                        ?.errors ||
                        {}
                );

                setError(
                    saveError
                        ?.response
                        ?.data
                        ?.message ||
                        "Could not save the collection."
                );
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
            <div className="flex min-h-[520px] items-center justify-center">
                <div className="flex items-center gap-2 text-[12px] text-[#68717c]">
                    <Loader2
                        size={16}
                        className="animate-spin"
                    />

                    Loading collection...
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6"
        >
            {/* Header */}

            <div className="mb-[18px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-[10px]">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/collections"
                            )
                        }
                        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border border-[#dfe3e8] bg-white text-[#606a76] transition hover:bg-[#f7f8fa]"
                    >
                        <ArrowLeft
                            size={15}
                        />
                    </button>

                    <div>
                        <h1 className="text-[18px] font-semibold text-[#111827]">
                            {isEdit
                                ? "Edit Collection"
                                : "Create Collection"}
                        </h1>

                        <p className="mt-[2px] text-[10.5px] text-[#7b8490]">
                            Organize products and control how this collection appears across your store.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-[8px]">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/collections"
                            )
                        }
                        className="h-[35px] rounded-[9px] border border-[#d9dee4] bg-white px-[13px] text-[10.5px] font-medium text-[#59636f] transition hover:bg-[#f7f8fa]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className="inline-flex h-[35px] items-center justify-center gap-[6px] rounded-[9px] bg-[#4f7df3] px-[14px] text-[10.5px] font-semibold text-white transition hover:bg-[#3f6ee8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <Loader2
                                size={13}
                                className="animate-spin"
                            />
                        ) : (
                            <Save
                                size={13}
                            />
                        )}

                        {saving
                            ? "Saving..."
                            : "Save"}
                    </button>
                </div>
            </div>


            {/* Errors */}

            {error && (
                <div className="mb-[14px] rounded-[10px] border border-red-100 bg-red-50 px-[12px] py-[9px] text-[10.5px] text-red-700">
                    {error}
                </div>
            )}


            {/* Content */}

            <div className="grid gap-[14px] xl:grid-cols-[minmax(0,1fr)_300px]">
                {/* Main */}

                <div className="space-y-[14px]">
                    <CollectionDetailsSection
                        form={
                            form
                        }
                        onChange={
                            handleChange
                        }
                        fieldErrors={
                            fieldErrors
                        }
                    />

                    <CollectionKindSection
                        form={
                            form
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <CollectionProductsSection
                        form={
                            form
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <CollectionSeoSection
                        form={
                            form
                        }
                        onChange={
                            handleChange
                        }
                    />
                </div>


                {/* Sidebar */}

                <aside className="space-y-[14px]">
                    <CollectionStatusSection
                        form={
                            form
                        }
                        onChange={
                            handleChange
                        }
                    />
                </aside>
            </div>


            {/* Bottom Actions */}

            <div className="mt-[16px] flex justify-end gap-[8px]">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/collections"
                        )
                    }
                    className="h-[35px] rounded-[9px] border border-[#d9dee4] bg-white px-[13px] text-[10.5px] font-medium text-[#59636f] transition hover:bg-[#f7f8fa]"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={
                        saving
                    }
                    className="inline-flex h-[35px] items-center justify-center gap-[6px] rounded-[9px] bg-[#4f7df3] px-[14px] text-[10.5px] font-semibold text-white transition hover:bg-[#3f6ee8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {saving ? (
                        <Loader2
                            size={13}
                            className="animate-spin"
                        />
                    ) : (
                        <Save
                            size={13}
                        />
                    )}

                    {saving
                        ? "Saving..."
                        : "Save Collection"}
                </button>
            </div>
        </form>
    );
}