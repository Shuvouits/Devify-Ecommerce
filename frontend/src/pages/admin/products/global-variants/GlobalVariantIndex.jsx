import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { Plus } from "lucide-react";

import {
    createGlobalVariant,
    getGlobalVariants,
    updateGlobalVariant,
} from "../../../../api/admin/globalVariantApi";

import BrandToast from "../../../../components/admin/brands/BrandToast";

import GlobalVariantCard from "./GlobalVariantCard";
import GlobalVariantFormModal from "./GlobalVariantFormModal";

const EMPTY_FORM = {
    name: "",
    visual_type: "rectangle",
    is_active: true,
    options: [
        {
            id: null,
            value: "",
            color_hex: "",
            is_active: true,
        },
    ],
};

export default function GlobalVariantIndex() {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingVariant, setEditingVariant] =
        useState(null);

    const [form, setForm] = useState({
        ...EMPTY_FORM,
        options: [
            {
                id: null,
                value: "",
                color_hex: "",
                is_active: true,
            },
        ],
    });

    const [formOpen, setFormOpen] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    const [toast, setToast] = useState({
        show: false,
        message: "",
    });

    const showToast = (message) => {
        setToast({
            show: true,
            message,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Load Variants
    |--------------------------------------------------------------------------
    */

    const fetchVariants =
        useCallback(async () => {
            setLoading(true);

            try {
                const response =
                    await getGlobalVariants({
                        per_page: 100,
                        sort_by: "display_order",
                        sort_direction: "asc",
                    });

                setVariants(
                    response?.data ?? []
                );
            } catch (error) {
                console.error(
                    "Failed to load global variants:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchVariants();
    }, [fetchVariants]);

    /*
    |--------------------------------------------------------------------------
    | Create Modal
    |--------------------------------------------------------------------------
    */

    const openCreateModal = () => {
        setEditingVariant(null);
        setErrors({});

        setForm({
            name: "",
            visual_type: "rectangle",
            is_active: true,
            options: [
                {
                    id: null,
                    value: "",
                    color_hex: "",
                    is_active: true,
                },
            ],
        });

        setFormOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Edit Modal
    |--------------------------------------------------------------------------
    */

    const openEditModal = (variant) => {
        setEditingVariant(variant);
        setErrors({});

        setForm({
            name: variant?.name ?? "",

            visual_type:
                variant?.visual_type ??
                "rectangle",

            is_active:
                variant?.is_active ??
                true,

            options:
                variant?.options?.length
                    ? variant.options.map(
                          (option) => ({
                              id: option.id,

                              value:
                                  option.value ??
                                  "",

                              color_hex:
                                  option.color_hex ??
                                  "",

                              is_active:
                                  option.is_active ??
                                  true,
                          })
                      )
                    : [
                          {
                              id: null,
                              value: "",
                              color_hex: "",
                              is_active: true,
                          },
                      ],
        });

        setFormOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Close Modal
    |--------------------------------------------------------------------------
    */

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setFormOpen(false);
        setEditingVariant(null);
        setErrors({});
    };

    /*
    |--------------------------------------------------------------------------
    | Form Change
    |--------------------------------------------------------------------------
    */

    const handleFormChange = (
        field,
        value
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Options Change
    |--------------------------------------------------------------------------
    */

    const handleOptionsChange = (
        options
    ) => {
        setForm((current) => ({
            ...current,
            options,
        }));

        setErrors((current) => ({
            ...current,
            options: undefined,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Prepare API Payload
    |--------------------------------------------------------------------------
    */

    const preparePayload = () => {
        return {
            name: form.name.trim(),

            visual_type:
                form.visual_type,

            is_active:
                Boolean(
                    form.is_active
                ),

            options: form.options
                .filter(
                    (option) =>
                        option.value.trim() !==
                        ""
                )
                .map(
                    (
                        option,
                        index
                    ) => {
                        const payload = {
                            value:
                                option.value.trim(),

                            display_order:
                                index + 1,

                            is_active:
                                option.is_active !==
                                false,
                        };

                        if (option.id) {
                            payload.id =
                                option.id;
                        }

                        if (
                            form.visual_type ===
                            "color"
                        ) {
                            payload.color_hex =
                                option.color_hex?.trim() ||
                                null;
                        }

                        return payload;
                    }
                ),
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Create / Update
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async () => {
        setSaving(true);
        setErrors({});

        try {
            const payload =
                preparePayload();

            if (editingVariant?.id) {
                await updateGlobalVariant(
                    editingVariant.id,
                    payload
                );

                showToast(
                    "Global variant updated successfully."
                );
            } else {
                await createGlobalVariant(
                    payload
                );

                showToast(
                    "Global variant created successfully."
                );
            }

            setFormOpen(false);
            setEditingVariant(null);

            await fetchVariants();
        } catch (error) {
            const validationErrors =
                error?.response?.data
                    ?.errors;

            if (validationErrors) {
                const normalizedErrors =
                    {};

                Object.entries(
                    validationErrors
                ).forEach(
                    ([
                        key,
                        messages,
                    ]) => {
                        normalizedErrors[
                            key
                        ] =
                            Array.isArray(
                                messages
                            )
                                ? messages[0]
                                : messages;
                    }
                );

                setErrors(
                    normalizedErrors
                );
            } else {
                setErrors({
                    general:
                        error?.response?.data
                            ?.message ??
                        "Something went wrong. Please try again.",
                });
            }
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-full bg-[#f7f7f7] px-6 py-6">
            <div className="mx-auto w-full max-w-[746px]">
                {/* Header Card */}
                <div className="rounded-[22px] border border-gray-200 bg-white px-6 py-6 shadow-sm">
                    <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-gray-950">
                        Global Variants
                    </h1>

                    <p className="mt-2 text-[14px] text-gray-500">
                        Create one variant once
                        and use it to any product
                        in the store.
                    </p>
                </div>

                {/* Variant List */}
                <div className="mt-4 space-y-3">
                    {loading ? (
                        <>
                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-[68px] animate-pulse rounded-[20px] border border-gray-200 bg-white"
                                    />
                                )
                            )}
                        </>
                    ) : (
                        <>
                            {variants.map(
                                (variant) => (
                                    <GlobalVariantCard
                                        key={
                                            variant.id
                                        }
                                        variant={
                                            variant
                                        }
                                        onEdit={() =>
                                            openEditModal(
                                                variant
                                            )
                                        }
                                    />
                                )
                            )}

                            {/* Create Variant Row */}
                            <button
                                type="button"
                                onClick={
                                    openCreateModal
                                }
                                className="flex h-[58px] w-full items-center rounded-[20px] border border-gray-200 bg-white px-5 text-left transition hover:border-gray-300 hover:bg-gray-50"
                            >
                                <span className="mr-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-700 text-gray-700">
                                    <Plus
                                        size={13}
                                        strokeWidth={2}
                                    />
                                </span>

                                <span className="text-[15px] font-semibold text-gray-900">
                                    Create Variant
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <GlobalVariantFormModal
                open={formOpen}
                editingVariant={
                    editingVariant
                }
                form={form}
                errors={errors}
                saving={saving}
                onClose={
                    closeFormModal
                }
                onChange={
                    handleFormChange
                }
                onOptionsChange={
                    handleOptionsChange
                }
                onSubmit={
                    handleSubmit
                }
            />

            {toast.show && (
                <BrandToast
                    message={
                        toast.message
                    }
                    onClose={() =>
                        setToast({
                            show: false,
                            message: "",
                        })
                    }
                />
            )}
        </div>
    );
}