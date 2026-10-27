import {
    Boxes,
    Check,
    MapPin,
    Plus,
    Trash2,
    X,
} from "lucide-react";

export default function ProductVariantsSection({
    globalVariants = [],
    locations = [],
    selectedGlobalVariants = [],
    variants = [],
    onGlobalVariantsChange,
    onVariantsChange,
}) {
    const getGlobalVariant = (variantId) => {
        return globalVariants.find(
            (item) =>
                Number(item.id) ===
                Number(variantId)
        );
    };

    const getOption = (
        globalVariantId,
        optionId
    ) => {
        const variant =
            getGlobalVariant(
                globalVariantId
            );

        return variant?.options?.find(
            (option) =>
                Number(option.id) ===
                Number(optionId)
        );
    };

    const isGlobalVariantSelected = (
        variantId
    ) => {
        return selectedGlobalVariants.some(
            (item) =>
                Number(
                    item.global_variant_id
                ) ===
                Number(variantId)
        );
    };

    const addGlobalVariant = (
        variantId
    ) => {
        const id =
            Number(variantId);

        if (
            !id ||
            isGlobalVariantSelected(id)
        ) {
            return;
        }

        const next = [
            ...selectedGlobalVariants,
            {
                global_variant_id:
                    id,

                display_order:
                    selectedGlobalVariants.length +
                    1,

                option_ids: [],
            },
        ];

        onGlobalVariantsChange(
            next
        );
    };

    const removeGlobalVariant = (
        variantId
    ) => {
        const next =
            selectedGlobalVariants
                .filter(
                    (item) =>
                        Number(
                            item.global_variant_id
                        ) !==
                        Number(
                            variantId
                        )
                )
                .map(
                    (
                        item,
                        index
                    ) => ({
                        ...item,

                        display_order:
                            index + 1,
                    })
                );

        onGlobalVariantsChange(
            next
        );

        regenerateVariants(next);
    };

    const toggleOption = (
        globalVariantId,
        optionId
    ) => {
        const next =
            selectedGlobalVariants.map(
                (item) => {
                    if (
                        Number(
                            item.global_variant_id
                        ) !==
                        Number(
                            globalVariantId
                        )
                    ) {
                        return item;
                    }

                    const optionIds =
                        Array.isArray(
                            item.option_ids
                        )
                            ? item.option_ids
                            : [];

                    const exists =
                        optionIds.some(
                            (id) =>
                                Number(
                                    id
                                ) ===
                                Number(
                                    optionId
                                )
                        );

                    return {
                        ...item,

                        option_ids:
                            exists
                                ? optionIds.filter(
                                      (id) =>
                                          Number(
                                              id
                                          ) !==
                                          Number(
                                              optionId
                                          )
                                  )
                                : [
                                      ...optionIds,
                                      Number(
                                          optionId
                                      ),
                                  ],
                    };
                }
            );

        onGlobalVariantsChange(
            next
        );

        regenerateVariants(next);
    };

    const getCombinationKey = (
        optionValues = []
    ) => {
        return optionValues
            .map(
                (item) =>
                    `${item.global_variant_id}:${item.global_variant_option_id}`
            )
            .sort()
            .join("|");
    };

    const buildCombinations = (
        selectedGroups
    ) => {
        const validGroups =
            selectedGroups.filter(
                (group) =>
                    Array.isArray(
                        group.option_ids
                    ) &&
                    group.option_ids
                        .length > 0
            );

        if (
            validGroups.length ===
            0
        ) {
            return [];
        }

        let combinations = [
            [],
        ];

        validGroups.forEach(
            (group) => {
                const next = [];

                combinations.forEach(
                    (combination) => {
                        group.option_ids.forEach(
                            (
                                optionId
                            ) => {
                                next.push([
                                    ...combination,
                                    {
                                        global_variant_id:
                                            Number(
                                                group.global_variant_id
                                            ),

                                        global_variant_option_id:
                                            Number(
                                                optionId
                                            ),
                                    },
                                ]);
                            }
                        );
                    }
                );

                combinations =
                    next;
            }
        );

        return combinations;
    };

    const buildVariantTitle = (
        optionValues
    ) => {
        return optionValues
            .map((item) => {
                const option =
                    getOption(
                        item.global_variant_id,
                        item.global_variant_option_id
                    );

                return (
                    option?.value ||
                    ""
                );
            })
            .filter(Boolean)
            .join(" / ");
    };

    const regenerateVariants = (
        selectedGroups
    ) => {
        const combinations =
            buildCombinations(
                selectedGroups
            );

        if (
            combinations.length ===
            0
        ) {
            onVariantsChange(
                []
            );

            return;
        }

        const existingMap =
            new Map();

        variants.forEach(
            (variant) => {
                existingMap.set(
                    getCombinationKey(
                        variant.option_values
                    ),
                    variant
                );
            }
        );

        const nextVariants =
            combinations.map(
                (
                    optionValues,
                    index
                ) => {
                    const key =
                        getCombinationKey(
                            optionValues
                        );

                    const existing =
                        existingMap.get(
                            key
                        );

                    if (existing) {
                        return {
                            ...existing,

                            title:
                                buildVariantTitle(
                                    optionValues
                                ),

                            option_values:
                                optionValues,

                            display_order:
                                index + 1,
                        };
                    }

                    return {
                        title:
                            buildVariantTitle(
                                optionValues
                            ),

                        sku: "",
                        barcode: "",
                        price: "",

                        compare_at_price:
                            "",

                        cost_per_item:
                            "",

                        image_path:
                            null,

                        is_active: true,

                        display_order:
                            index + 1,

                        is_final_sale:
                            null,

                        return_window_days:
                            null,

                        option_values:
                            optionValues,

                        inventories:
                            [],
                    };
                }
            );

        onVariantsChange(
            nextVariants
        );
    };

    const updateVariant = (
        index,
        field,
        value
    ) => {
        const next =
            variants.map(
                (
                    variant,
                    variantIndex
                ) =>
                    variantIndex ===
                    index
                        ? {
                              ...variant,
                              [field]:
                                  value,
                          }
                        : variant
            );

        onVariantsChange(
            next
        );
    };

    const removeVariant = (
        index
    ) => {
        const next =
            variants
                .filter(
                    (
                        _,
                        variantIndex
                    ) =>
                        variantIndex !==
                        index
                )
                .map(
                    (
                        variant,
                        variantIndex
                    ) => ({
                        ...variant,

                        display_order:
                            variantIndex +
                            1,
                    })
                );

        onVariantsChange(
            next
        );
    };

    const getVariantInventory = (
        variant,
        locationId
    ) => {
        return (
            variant.inventories?.find(
                (item) =>
                    Number(
                        item.location_id
                    ) ===
                    Number(
                        locationId
                    )
            ) || null
        );
    };

    const updateVariantInventory = (
        variantIndex,
        locationId,
        field,
        value
    ) => {
        const variant =
            variants[
                variantIndex
            ];

        const inventories =
            Array.isArray(
                variant.inventories
            )
                ? variant.inventories
                : [];

        const existing =
            inventories.find(
                (item) =>
                    Number(
                        item.location_id
                    ) ===
                    Number(
                        locationId
                    )
            );

        let nextInventories;

        if (existing) {
            nextInventories =
                inventories.map(
                    (item) =>
                        Number(
                            item.location_id
                        ) ===
                        Number(
                            locationId
                        )
                            ? {
                                  ...item,
                                  [field]:
                                      value,
                              }
                            : item
                );
        } else {
            nextInventories = [
                ...inventories,
                {
                    location_id:
                        Number(
                            locationId
                        ),

                    quantity:
                        field ===
                        "quantity"
                            ? value
                            : 0,

                    reserved_quantity:
                        field ===
                        "reserved_quantity"
                            ? value
                            : 0,

                    incoming_quantity:
                        field ===
                        "incoming_quantity"
                            ? value
                            : 0,
                },
            ];
        }

        updateVariant(
            variantIndex,
            "inventories",
            nextInventories
        );
    };

    const availableGlobalVariants =
        globalVariants.filter(
            (variant) =>
                !isGlobalVariantSelected(
                    variant.id
                )
        );

    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                <div>
                    <h2 className="text-[14px] font-semibold text-[#111827]">
                        Variants
                    </h2>

                    <p className="mt-[3px] text-[10px] leading-[16px] text-[#7a838f]">
                        Add options like size,
                        color, storage, or other
                        product variations.
                    </p>
                </div>

                <div className="mt-[15px]">
                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Add option
                    </label>

                    <div className="flex gap-[8px]">
                        <select
                            defaultValue=""
                            disabled={
                                availableGlobalVariants.length ===
                                0
                            }
                            onChange={(
                                event
                            ) => {
                                addGlobalVariant(
                                    event
                                        .target
                                        .value
                                );

                                event.target.value =
                                    "";
                            }}
                            className="h-[38px] flex-1 rounded-[11px] border border-[#ccd3dc] bg-white px-[11px] text-[12px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff] disabled:bg-[#f8f9fa] disabled:text-[#9ca3af]"
                        >
                            <option value="">
                                {availableGlobalVariants.length >
                                0
                                    ? "Select an option"
                                    : "All options added"}
                            </option>

                            {availableGlobalVariants.map(
                                (
                                    variant
                                ) => (
                                    <option
                                        key={
                                            variant.id
                                        }
                                        value={
                                            variant.id
                                        }
                                    >
                                        {
                                            variant.name
                                        }
                                    </option>
                                )
                            )}
                        </select>

                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#d7dce2] bg-[#f8f9fa] text-[#727c88]">
                            <Plus
                                size={
                                    15
                                }
                                strokeWidth={
                                    1.8
                                }
                            />
                        </div>
                    </div>
                </div>

                {selectedGlobalVariants.length ===
                0 ? (
                    <div className="mt-[15px] rounded-[12px] border border-dashed border-[#d7dce2] bg-[#fafbfc] px-5 py-7 text-center">
                        <Boxes
                            size={20}
                            strokeWidth={
                                1.6
                            }
                            className="mx-auto text-[#98a1ad]"
                        />

                        <p className="mt-[8px] text-[11.5px] font-medium text-[#505966]">
                            No variants added
                        </p>

                        <p className="mx-auto mt-[3px] max-w-[360px] text-[10px] leading-[16px] text-[#8a939e]">
                            Add an option if
                            this product comes
                            in different
                            versions.
                        </p>
                    </div>
                ) : (
                    <div className="mt-[15px] space-y-[10px]">
                        {selectedGlobalVariants.map(
                            (
                                selected
                            ) => {
                                const globalVariant =
                                    getGlobalVariant(
                                        selected.global_variant_id
                                    );

                                if (
                                    !globalVariant
                                ) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={
                                            selected.global_variant_id
                                        }
                                        className="rounded-[12px] border border-[#e1e5ea] bg-white"
                                    >
                                        <div className="flex items-center justify-between gap-3 border-b border-[#edf0f2] px-[13px] py-[10px]">
                                            <div>
                                                <p className="text-[11.5px] font-semibold text-[#303946]">
                                                    {
                                                        globalVariant.name
                                                    }
                                                </p>

                                                <p className="mt-[2px] text-[9.5px] text-[#89929d]">
                                                    Select
                                                    values
                                                    available
                                                    for this
                                                    product.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeGlobalVariant(
                                                        selected.global_variant_id
                                                    )
                                                }
                                                className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-[#929aa5] transition hover:bg-[#fff1f1] hover:text-[#dc2626]"
                                            >
                                                <Trash2
                                                    size={
                                                        13
                                                    }
                                                    strokeWidth={
                                                        1.8
                                                    }
                                                />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-[7px] p-[12px]">
                                            {globalVariant.options?.map(
                                                (
                                                    option
                                                ) => {
                                                    const selectedOption =
                                                        selected.option_ids?.some(
                                                            (
                                                                id
                                                            ) =>
                                                                Number(
                                                                    id
                                                                ) ===
                                                                Number(
                                                                    option.id
                                                                )
                                                        );

                                                    return (
                                                        <button
                                                            key={
                                                                option.id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                toggleOption(
                                                                    globalVariant.id,
                                                                    option.id
                                                                )
                                                            }
                                                            className={[
                                                                "inline-flex",
                                                                "h-[31px]",
                                                                "items-center",
                                                                "gap-[6px]",
                                                                "rounded-[8px]",
                                                                "border",
                                                                "px-[9px]",
                                                                "text-[10.5px]",
                                                                "font-medium",
                                                                "transition",
                                                                selectedOption
                                                                    ? "border-[#111827] bg-[#111827] text-white"
                                                                    : "border-[#d8dde3] bg-white text-[#515b67] hover:bg-[#f8f9fa]",
                                                            ].join(
                                                                " "
                                                            )}
                                                        >
                                                            {globalVariant.visual_type ===
                                                                "color" && (
                                                                <span
                                                                    className="h-[11px] w-[11px] rounded-full border border-black/10"
                                                                    style={{
                                                                        backgroundColor:
                                                                            option.color_hex ||
                                                                            "#D1D5DB",
                                                                    }}
                                                                />
                                                            )}

                                                            {
                                                                option.value
                                                            }

                                                            {selectedOption && (
                                                                <Check
                                                                    size={
                                                                        11
                                                                    }
                                                                    strokeWidth={
                                                                        2.2
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {variants.length >
                    0 && (
                    <>
                        <div className="my-[17px] h-px bg-[#e8eaed]" />

                        <div className="mb-[10px] flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-[12px] font-semibold text-[#222b38]">
                                    Generated variants
                                </h3>

                                <p className="mt-[2px] text-[10px] text-[#818a95]">
                                    {
                                        variants.length
                                    }{" "}
                                    variant
                                    {variants.length !==
                                    1
                                        ? "s"
                                        : ""}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-[10px]">
                            {variants.map(
                                (
                                    variant,
                                    variantIndex
                                ) => (
                                    <VariantCard
                                        key={
                                            variant.id ||
                                            getCombinationKey(
                                                variant.option_values
                                            ) ||
                                            variantIndex
                                        }
                                        variant={
                                            variant
                                        }
                                        index={
                                            variantIndex
                                        }
                                        locations={
                                            locations
                                        }
                                        getInventory={
                                            getVariantInventory
                                        }
                                        onUpdate={
                                            updateVariant
                                        }
                                        onInventoryUpdate={
                                            updateVariantInventory
                                        }
                                        onRemove={
                                            removeVariant
                                        }
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}


function VariantCard({
    variant,
    index,
    locations,
    getInventory,
    onUpdate,
    onInventoryUpdate,
    onRemove,
}) {
    return (
        <div className="overflow-hidden rounded-[12px] border border-[#e1e5ea]">
            <div className="flex items-center justify-between gap-3 bg-[#f8f9fa] px-[13px] py-[9px]">
                <div className="min-w-0">
                    <p className="truncate text-[11.5px] font-semibold text-[#303946]">
                        {variant.title ||
                            `Variant ${
                                index + 1
                            }`}
                    </p>
                </div>

                <div className="flex items-center gap-[8px]">
                    <span className="text-[9.5px] text-[#7d8692]">
                        Active
                    </span>

                    <Toggle
                        checked={
                            variant.is_active !==
                            false
                        }
                        onChange={(
                            checked
                        ) =>
                            onUpdate(
                                index,
                                "is_active",
                                checked
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={() =>
                            onRemove(
                                index
                            )
                        }
                        className="flex h-[27px] w-[27px] items-center justify-center rounded-[7px] text-[#919aa5] transition hover:bg-[#fff1f1] hover:text-[#dc2626]"
                    >
                        <X
                            size={13}
                            strokeWidth={
                                1.9
                            }
                        />
                    </button>
                </div>
            </div>

            <div className="p-[13px]">
                <div className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-5">
                    <VariantInput
                        label="SKU"
                        value={
                            variant.sku ||
                            ""
                        }
                        placeholder="SKU"
                        onChange={(
                            value
                        ) =>
                            onUpdate(
                                index,
                                "sku",
                                value
                            )
                        }
                    />

                    <VariantInput
                        label="Barcode"
                        value={
                            variant.barcode ||
                            ""
                        }
                        placeholder="Barcode"
                        onChange={(
                            value
                        ) =>
                            onUpdate(
                                index,
                                "barcode",
                                value
                            )
                        }
                    />

                    <VariantInput
                        label="Price"
                        type="number"
                        value={
                            variant.price ??
                            ""
                        }
                        placeholder="0.00"
                        onChange={(
                            value
                        ) =>
                            onUpdate(
                                index,
                                "price",
                                value
                            )
                        }
                    />

                    <VariantInput
                        label="Compare-at"
                        type="number"
                        value={
                            variant.compare_at_price ??
                            ""
                        }
                        placeholder="0.00"
                        onChange={(
                            value
                        ) =>
                            onUpdate(
                                index,
                                "compare_at_price",
                                value
                            )
                        }
                    />

                    <VariantInput
                        label="Cost"
                        type="number"
                        value={
                            variant.cost_per_item ??
                            ""
                        }
                        placeholder="0.00"
                        onChange={(
                            value
                        ) =>
                            onUpdate(
                                index,
                                "cost_per_item",
                                value
                            )
                        }
                    />
                </div>

                {locations.length >
                    0 && (
                    <>
                        <div className="my-[13px] h-px bg-[#edf0f2]" />

                        <div className="mb-[8px] flex items-center gap-[6px]">
                            <MapPin
                                size={
                                    12
                                }
                                strokeWidth={
                                    1.8
                                }
                                className="text-[#8b95a1]"
                            />

                            <p className="text-[10px] font-semibold text-[#5e6874]">
                                Inventory by
                                location
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-[9px] border border-[#e2e6eb]">
                            <div className="min-w-[570px]">
                                <div className="grid grid-cols-[1fr_95px_95px_95px] bg-[#f8f9fa] px-[10px] py-[7px]">
                                    <TableHeader>
                                        Location
                                    </TableHeader>

                                    <TableHeader>
                                        On hand
                                    </TableHeader>

                                    <TableHeader>
                                        Reserved
                                    </TableHeader>

                                    <TableHeader>
                                        Incoming
                                    </TableHeader>
                                </div>

                                {locations.map(
                                    (
                                        location
                                    ) => {
                                        const inventory =
                                            getInventory(
                                                variant,
                                                location.id
                                            );

                                        return (
                                            <div
                                                key={
                                                    location.id
                                                }
                                                className="grid grid-cols-[1fr_95px_95px_95px] items-center border-t border-[#edf0f2] px-[10px] py-[8px]"
                                            >
                                                <span className="truncate pr-3 text-[10.5px] font-medium text-[#4e5864]">
                                                    {
                                                        location.name
                                                    }
                                                </span>

                                                <InventoryInput
                                                    value={
                                                        inventory?.quantity ??
                                                        0
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onInventoryUpdate(
                                                            index,
                                                            location.id,
                                                            "quantity",
                                                            value
                                                        )
                                                    }
                                                />

                                                <InventoryInput
                                                    value={
                                                        inventory?.reserved_quantity ??
                                                        0
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onInventoryUpdate(
                                                            index,
                                                            location.id,
                                                            "reserved_quantity",
                                                            value
                                                        )
                                                    }
                                                />

                                                <InventoryInput
                                                    value={
                                                        inventory?.incoming_quantity ??
                                                        0
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onInventoryUpdate(
                                                            index,
                                                            location.id,
                                                            "incoming_quantity",
                                                            value
                                                        )
                                                    }
                                                />
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}


function VariantInput({
    label,
    type = "text",
    value,
    placeholder,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[5px] block text-[9.5px] font-medium text-[#69737f]">
                {label}
            </label>

            <input
                type={type}
                min={
                    type === "number"
                        ? 0
                        : undefined
                }
                step={
                    type === "number"
                        ? "0.01"
                        : undefined
                }
                value={value}
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder={
                    placeholder
                }
                className="h-[33px] w-full rounded-[8px] border border-[#d3d9e0] bg-white px-[9px] text-[10.5px] text-[#313a46] outline-none transition placeholder:text-[#a0a7b0] focus:border-[#7da0f8]"
            />
        </div>
    );
}


function InventoryInput({
    value,
    onChange,
}) {
    return (
        <input
            type="number"
            min="0"
            step="1"
            value={value}
            onChange={(
                event
            ) =>
                onChange(
                    event.target
                        .value === ""
                        ? 0
                        : Number(
                              event
                                  .target
                                  .value
                          )
                )
            }
            className="h-[29px] w-[76px] rounded-[7px] border border-[#d7dce2] bg-white px-[7px] text-[10px] text-[#303945] outline-none transition focus:border-[#7da0f8]"
        />
    );
}


function Toggle({
    checked,
    onChange,
}) {
    return (
        <button
            type="button"
            onClick={() =>
                onChange(
                    !checked
                )
            }
            className={[
                "relative",
                "h-[20px]",
                "w-[35px]",
                "shrink-0",
                "rounded-full",
                "transition",
                checked
                    ? "bg-[#316ff4]"
                    : "bg-[#d7dbe0]",
            ].join(" ")}
        >
            <span
                className={[
                    "absolute",
                    "top-[3px]",
                    "h-[14px]",
                    "w-[14px]",
                    "rounded-full",
                    "bg-white",
                    "shadow-sm",
                    "transition-all",
                    checked
                        ? "left-[18px]"
                        : "left-[3px]",
                ].join(" ")}
            />
        </button>
    );
}


function TableHeader({
    children,
}) {
    return (
        <span className="text-[8.5px] font-semibold uppercase tracking-[0.04em] text-[#838d98]">
            {children}
        </span>
    );
}