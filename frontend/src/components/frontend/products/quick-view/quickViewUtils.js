import {
    getMediaUrl,
} from "../../../../utils/mediaUrl";


export const getInitialSelectedOptions = (
    product
) => {
    const variants =
        Array.isArray(
            product?.variants
        )
            ? product.variants
            : [];

    const firstVariant =
        variants[0];

    if (firstVariant) {
        const optionValues =
            getVariantOptionValues(
                firstVariant
            );

        if (
            optionValues.length
        ) {
            return optionValues.reduce(
                (
                    selected,
                    item
                ) => {
                    const variantId =
                        getOptionVariantId(
                            item
                        );

                    const optionId =
                        getOptionId(
                            item
                        );

                    if (
                        variantId &&
                        optionId
                    ) {
                        selected[
                            variantId
                        ] = optionId;
                    }

                    return selected;
                },
                {}
            );
        }
    }

    const globalVariants =
        Array.isArray(
            product?.global_variants
        )
            ? product.global_variants
            : [];

    return globalVariants.reduce(
        (
            selected,
            variant
        ) => {
            const variantId =
                Number(
                    variant?.id ??
                    variant?.global_variant_id
                );

            const options =
                Array.isArray(
                    variant?.options
                )
                    ? variant.options
                    : [];

            const firstOption =
                options[0];

            const optionId =
                getOptionId(
                    firstOption
                );

            if (
                variantId &&
                optionId
            ) {
                selected[
                    variantId
                ] = optionId;
            }

            return selected;
        },
        {}
    );
};


export const findMatchingVariant = (
    product,
    selectedOptions = {}
) => {
    const variants =
        Array.isArray(
            product?.variants
        )
            ? product.variants
            : [];

    if (
        !variants.length
    ) {
        return null;
    }

    const selectedEntries =
        Object.entries(
            selectedOptions
        )
            .map(
                ([
                    variantId,
                    optionId,
                ]) => [
                    Number(
                        variantId
                    ),
                    Number(
                        optionId
                    ),
                ]
            )
            .filter(
                ([
                    variantId,
                    optionId,
                ]) =>
                    variantId > 0 &&
                    optionId > 0
            );

    if (
        !selectedEntries.length
    ) {
        return variants[0];
    }

    return (
        variants.find(
            (variant) => {
                const values =
                    getVariantOptionValues(
                        variant
                    );

                return selectedEntries.every(
                    ([
                        variantId,
                        optionId,
                    ]) =>
                        values.some(
                            (
                                value
                            ) =>
                                getOptionVariantId(
                                    value
                                ) ===
                                    variantId &&
                                getOptionId(
                                    value
                                ) ===
                                    optionId
                        )
                );
            }
        ) || null
    );
};


export const getQuickViewPricing = (
    product,
    variant = null
) => {
    const price =
        toNumberOrNull(
            variant?.price
        ) ??
        toNumberOrNull(
            product?.pricing?.price
        ) ??
        toNumberOrNull(
            product?.price
        );

    const compareAtPrice =
        toNumberOrNull(
            variant?.compare_at_price
        ) ??
        toNumberOrNull(
            product?.pricing
                ?.compare_at_price
        ) ??
        toNumberOrNull(
            product?.compare_at_price
        );

    return {
        price,
        compareAtPrice,
    };
};


export const getVariantAvailability = (
    product,
    variant = null
) => {
    const trackQuantity =
        product?.inventory_settings
            ?.track_quantity ??
        product?.inventory
            ?.track_quantity ??
        product?.track_quantity ??
        true;

    const continueSelling =
        product?.inventory_settings
            ?.continue_selling_when_out_of_stock ??
        product?.inventory
            ?.continue_selling_when_out_of_stock ??
        product?.continue_selling_when_out_of_stock ??
        false;

    if (
        !trackQuantity
    ) {
        return {
            isAvailable: true,
            availableQuantity:
                null,
        };
    }

    const inventories =
        variant
            ? getInventories(
                  variant
              )
            : getInventories(
                  product
              );

    if (
        !inventories.length
    ) {
        return {
            isAvailable:
                Boolean(
                    continueSelling
                ),

            availableQuantity:
                0,
        };
    }

    const availableQuantity =
        inventories.reduce(
            (
                total,
                inventory
            ) =>
                total +
                getAvailableQuantity(
                    inventory
                ),
            0
        );

    return {
        isAvailable:
            availableQuantity >
                0 ||
            Boolean(
                continueSelling
            ),

        availableQuantity,
    };
};


export const getSelectedVariantImage = (
    variant
) => {
    if (
        !variant
    ) {
        return null;
    }

    const value =
        variant?.image_url ||
        variant?.image?.url ||
        variant?.image
            ?.external_url ||
        variant?.image_path ||
        variant?.image
            ?.file_path ||
        null;

    return getMediaUrl(
        value
    );
};


export const areAllOptionsSelected = (
    product,
    selectedOptions
) => {
    const globalVariants =
        Array.isArray(
            product?.global_variants
        )
            ? product.global_variants
            : [];

    if (
        !globalVariants.length
    ) {
        return true;
    }

    return globalVariants.every(
        (variant) => {
            const variantId =
                Number(
                    variant?.id ??
                    variant?.global_variant_id
                );

            if (
                !variantId
            ) {
                return true;
            }

            return Boolean(
                Number(
                    selectedOptions?.[
                        variantId
                    ]
                )
            );
        }
    );
};


export const getAvailableGlobalVariants = (
    product
) => {
    const globalVariants =
        Array.isArray(
            product?.global_variants
        )
            ? product.global_variants
            : [];

    const productVariants =
        Array.isArray(
            product?.variants
        )
            ? product.variants
            : [];

    return globalVariants
        .map(
            (
                variantGroup
            ) => {
                const groupId =
                    Number(
                        variantGroup?.id ??
                        variantGroup?.global_variant_id
                    );

                const options =
                    Array.isArray(
                        variantGroup?.options
                    )
                        ? variantGroup.options
                        : [];

                const usedOptionIds =
                    new Set();

                const selectedOptionIds =
                    Array.isArray(
                        variantGroup
                            ?.selected_option_ids
                    )
                        ? variantGroup.selected_option_ids
                        : Array.isArray(
                              variantGroup
                                  ?.option_ids
                          )
                          ? variantGroup.option_ids
                          : [];

                selectedOptionIds
                    .map(
                        Number
                    )
                    .filter(
                        Boolean
                    )
                    .forEach(
                        (id) =>
                            usedOptionIds.add(
                                id
                            )
                    );

                productVariants.forEach(
                    (
                        productVariant
                    ) => {
                        const optionValues =
                            Array.isArray(
                                productVariant
                                    ?.option_values
                            )
                                ? productVariant.option_values
                                : [];

                        optionValues.forEach(
                            (
                                value
                            ) => {
                                const valueGroupId =
                                    Number(
                                        value?.global_variant_id ??
                                        value
                                            ?.global_variant
                                            ?.id ??
                                        0
                                    );

                                const optionId =
                                    Number(
                                        value?.global_variant_option_id ??
                                        value
                                            ?.global_variant_option
                                            ?.id ??
                                        value?.option_id ??
                                        0
                                    );

                                if (
                                    valueGroupId ===
                                        groupId &&
                                    optionId
                                ) {
                                    usedOptionIds.add(
                                        optionId
                                    );
                                }
                            }
                        );
                    }
                );

                const filteredOptions =
                    options.filter(
                        (
                            option
                        ) => {
                            const optionId =
                                Number(
                                    option?.id ??
                                    option?.global_variant_option_id
                                );

                            return (
                                optionId &&
                                usedOptionIds.has(
                                    optionId
                                )
                            );
                        }
                    );

                return {
                    ...variantGroup,

                    options:
                        filteredOptions,
                };
            }
        )
        .filter(
            (group) =>
                group.options
                    .length > 0
        );
};


const getVariantOptionValues = (
    variant
) => {
    if (
        Array.isArray(
            variant?.option_values
        )
    ) {
        return variant.option_values;
    }

    if (
        Array.isArray(
            variant?.optionValues
        )
    ) {
        return variant.optionValues;
    }

    if (
        Array.isArray(
            variant?.options
        )
    ) {
        return variant.options;
    }

    return [];
};


const getOptionVariantId = (
    item
) =>
    Number(
        item?.global_variant_id ??
        item?.global_variant?.id ??
        item?.globalVariant?.id ??
        0
    );


const getOptionId = (
    item
) =>
    Number(
        item?.global_variant_option_id ??
        item?.global_variant_option
            ?.id ??
        item?.globalVariantOption
            ?.id ??
        item?.id ??
        0
    );


const getInventories = (
    item
) => {
    if (
        Array.isArray(
            item?.inventories
        )
    ) {
        return item.inventories;
    }

    if (
        Array.isArray(
            item?.inventory
        )
    ) {
        return item.inventory;
    }

    return [];
};


const getAvailableQuantity = (
    inventory
) => {
    const direct =
        toNumberOrNull(
            inventory
                ?.available_quantity
        );

    if (
        direct !== null
    ) {
        return Math.max(
            0,
            direct
        );
    }

    const quantity =
        Number(
            inventory?.quantity ??
            0
        );

    const reserved =
        Number(
            inventory
                ?.reserved_quantity ??
            0
        );

    return Math.max(
        0,
        quantity - reserved
    );
};


const toNumberOrNull = (
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

    return Number.isNaN(
        number
    )
        ? null
        : number;
};