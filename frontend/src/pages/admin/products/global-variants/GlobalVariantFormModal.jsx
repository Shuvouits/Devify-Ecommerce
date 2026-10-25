import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
    GripVertical,
    Plus,
    Trash2,
    X,
} from "lucide-react";

export default function GlobalVariantFormModal({
    open,
    editingVariant,
    form,
    errors,
    saving,
    onClose,
    onChange,
    onOptionsChange,
    onSubmit,
}) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !saving) {
                onClose?.();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open, saving, onClose]);

    if (!open) {
        return null;
    }

    const isEditing = Boolean(editingVariant);
    const isColor = form.visual_type === "color";

    const addOption = () => {
        onOptionsChange([
            ...form.options,
            {
                id: null,
                value: "",
                color_hex: "",
                is_active: true,
            },
        ]);
    };

    const updateOption = (
        index,
        field,
        value
    ) => {
        const updatedOptions =
            form.options.map(
                (option, optionIndex) => {
                    if (optionIndex !== index) {
                        return option;
                    }

                    return {
                        ...option,
                        [field]: value,
                    };
                }
            );

        onOptionsChange(updatedOptions);
    };

    const removeOption = (index) => {
        if (form.options.length <= 1) {
            return;
        }

        onOptionsChange(
            form.options.filter(
                (_, optionIndex) =>
                    optionIndex !== index
            )
        );
    };

    const getOptionError = (
        index,
        field
    ) => {
        return (
            errors?.[
                `options.${index}.${field}`
            ] ?? null
        );
    };

    const handleBackdropClick = (event) => {
        if (
            event.target === event.currentTarget &&
            !saving
        ) {
            onClose?.();
        }
    };

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 py-6"
            onMouseDown={handleBackdropClick}
        >
            <div
                className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isEditing
                                ? "Edit Global Variant"
                                : "Add Global Variant"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {isEditing
                                ? "Update the variant and its option values."
                                : "Create a reusable variant for your products."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {errors?.general && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Variant Name */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                Variant Name
                            </label>

                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                    onChange(
                                        "name",
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Size, Color, Storage"
                                className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                                    errors?.name
                                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                }`}
                            />

                            {errors?.name && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Visual Type */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-800">
                                Visual Type
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange(
                                            "visual_type",
                                            "rectangle"
                                        )
                                    }
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                        form.visual_type ===
                                        "rectangle"
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <span className="h-6 w-8 rounded border border-gray-300 bg-white" />
                                            <span className="h-6 w-8 rounded border border-gray-300 bg-white" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Rectangle
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Text options
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange(
                                            "visual_type",
                                            "color"
                                        )
                                    }
                                    className={`rounded-xl border px-4 py-3 text-left transition ${
                                        form.visual_type ===
                                        "color"
                                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                            : "border-gray-200 bg-white hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1">
                                            <span className="h-6 w-6 rounded-full bg-orange-400" />
                                            <span className="h-6 w-6 rounded-full bg-blue-500" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Color
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Color swatches
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {errors?.visual_type && (
                                <p className="mt-1.5 text-xs text-red-600">
                                    {
                                        errors.visual_type
                                    }
                                </p>
                            )}
                        </div>

                        {/* Options */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <label className="block text-sm font-medium text-gray-800">
                                        Option Values
                                    </label>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Add the values customers
                                        can choose from.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    <Plus size={14} />
                                    Add Option
                                </button>
                            </div>

                            {errors?.options && (
                                <p className="mb-2 text-xs text-red-600">
                                    {errors.options}
                                </p>
                            )}

                            <div className="space-y-2">
                                {form.options.map(
                                    (option, index) => {
                                        const valueError =
                                            getOptionError(
                                                index,
                                                "value"
                                            );

                                        const colorError =
                                            getOptionError(
                                                index,
                                                "color_hex"
                                            );

                                        return (
                                            <div
                                                key={
                                                    option.id ??
                                                    `new-${index}`
                                                }
                                                className="rounded-xl border border-gray-200 bg-gray-50/50 p-3"
                                            >
                                                <div className="flex items-start gap-2">
                                                    <div className="mt-2.5 shrink-0 text-gray-300">
                                                        <GripVertical
                                                            size={
                                                                17
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div
                                                            className={`grid gap-2 ${
                                                                isColor
                                                                    ? "grid-cols-[1fr_145px]"
                                                                    : "grid-cols-1"
                                                            }`}
                                                        >
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        updateOption(
                                                                            index,
                                                                            "value",
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder={`Option ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 ${
                                                                        valueError
                                                                            ? "border-red-400 focus:border-red-500"
                                                                            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                    }`}
                                                                />

                                                                {valueError && (
                                                                    <p className="mt-1 text-xs text-red-600">
                                                                        {
                                                                            valueError
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {isColor && (
                                                                <div>
                                                                    <div className="flex h-10 overflow-hidden rounded-lg border border-gray-200 bg-white">
                                                                        <input
                                                                            type="color"
                                                                            value={
                                                                                /^#[0-9A-Fa-f]{6}$/.test(
                                                                                    option.color_hex ||
                                                                                        ""
                                                                                )
                                                                                    ? option.color_hex
                                                                                    : "#000000"
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                updateOption(
                                                                                    index,
                                                                                    "color_hex",
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="h-10 w-11 cursor-pointer border-0 bg-transparent p-1"
                                                                        />

                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                option.color_hex
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                updateOption(
                                                                                    index,
                                                                                    "color_hex",
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="#000000"
                                                                            className="min-w-0 flex-1 border-0 px-2 text-xs uppercase text-gray-700 outline-none"
                                                                        />
                                                                    </div>

                                                                    {colorError && (
                                                                        <p className="mt-1 text-xs text-red-600">
                                                                            {
                                                                                colorError
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeOption(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            form
                                                                .options
                                                                .length <=
                                                            1
                                                        }
                                                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                                        aria-label="Remove option"
                                                    >
                                                        <Trash2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* Active */}
                        {isEditing && (
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Active
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Make this variant
                                        available for use.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={
                                        form.is_active
                                    }
                                    onClick={() =>
                                        onChange(
                                            "is_active",
                                            !form.is_active
                                        )
                                    }
                                    className={`relative h-6 w-11 rounded-full transition ${
                                        form.is_active
                                            ? "bg-blue-600"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                            form.is_active
                                                ? "left-[22px]"
                                                : "left-0.5"
                                        }`}
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={saving}
                        className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? "Saving..."
                            : isEditing
                              ? "Save Changes"
                              : "Create Variant"}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(
        modal,
        document.body
    );
}