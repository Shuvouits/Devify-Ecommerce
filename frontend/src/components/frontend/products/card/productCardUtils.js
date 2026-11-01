export const formatMoney = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return "$0.00";
    }

    return `$${number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

export const getProductPrice = (product) => {
    const value =
        product?.pricing?.price ??
        product?.price;

    if (
        value !== null &&
        value !== undefined &&
        value !== ""
    ) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
            return number;
        }
    }

    const variantPrices = Array.isArray(
        product?.variants
    )
        ? product.variants
              .map((variant) =>
                  Number(variant?.price)
              )
              .filter(
                  (price) =>
                      !Number.isNaN(price)
              )
        : [];

    if (!variantPrices.length) {
        return null;
    }

    return Math.min(
        ...variantPrices
    );
};

export const getCompareAtPrice = (product) => {
    const value =
        product?.pricing
            ?.compare_at_price ??
        product?.compare_at_price;

    if (
        value !== null &&
        value !== undefined &&
        value !== ""
    ) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
            return number;
        }
    }

    const variantPrices = Array.isArray(
        product?.variants
    )
        ? product.variants
              .map((variant) =>
                  Number(
                      variant?.compare_at_price
                  )
              )
              .filter(
                  (price) =>
                      !Number.isNaN(price) &&
                      price > 0
              )
        : [];

    if (!variantPrices.length) {
        return null;
    }

    return Math.max(
        ...variantPrices
    );
};

export const calculateDiscount = (
    price,
    compareAtPrice
) => {
    if (
        price === null ||
        compareAtPrice === null ||
        compareAtPrice <= price ||
        compareAtPrice <= 0
    ) {
        return 0;
    }

    return Math.round(
        ((compareAtPrice - price) /
            compareAtPrice) *
            100
    );
};

export const getProductImage = (product) => {
    const media = Array.isArray(
        product?.media
    )
        ? product.media
        : [];

    const cover =
        media.find(
            (item) =>
                item?.is_cover
        ) || media[0];

    if (!cover) {
        return null;
    }

    if (cover.url) {
        return cover.url;
    }

    if (cover.external_url) {
        return cover.external_url;
    }

    const path =
        cover.file_path;

    if (!path) {
        return null;
    }

    if (
        path.startsWith(
            "http://"
        ) ||
        path.startsWith(
            "https://"
        )
    ) {
        return path;
    }

    return `http://127.0.0.1:8000/${path.replace(
        /^\/+/,
        ""
    )}`;
};

export const getProductColors = (product) => {
    const globalVariants = Array.isArray(
        product?.global_variants
    )
        ? product.global_variants
        : [];

    const productVariants = Array.isArray(
        product?.variants
    )
        ? product.variants
        : [];

    const colors = [];

    globalVariants.forEach(
        (variantGroup) => {
            const groupId = Number(
                variantGroup?.id ??
                    variantGroup
                        ?.global_variant_id
            );

            const options = Array.isArray(
                variantGroup?.options
            )
                ? variantGroup.options
                : [];

            const groupName = String(
                variantGroup?.name ||
                    ""
            ).toLowerCase();

            const groupType = String(
                variantGroup?.visual_type ||
                    variantGroup?.type ||
                    ""
            ).toLowerCase();

            const isColorGroup =
                groupName.includes(
                    "color"
                ) ||
                groupName.includes(
                    "colour"
                ) ||
                groupType.includes(
                    "color"
                ) ||
                options.some(
                    (option) =>
                        option?.color_hex ||
                        option?.hex ||
                        option?.color
                );

            if (!isColorGroup) {
                return;
            }

            const usedOptionIds =
                new Set();

            /*
            |--------------------------------------------------------------------------
            | Selected option IDs configured on product
            |--------------------------------------------------------------------------
            */

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
                .map(Number)
                .filter(Boolean)
                .forEach(
                    (optionId) => {
                        usedOptionIds.add(
                            optionId
                        );
                    }
                );

            /*
            |--------------------------------------------------------------------------
            | Actual color options used by generated variants
            |--------------------------------------------------------------------------
            */

            productVariants.forEach(
                (productVariant) => {
                    const optionValues =
                        Array.isArray(
                            productVariant
                                ?.option_values
                        )
                            ? productVariant.option_values
                            : [];

                    optionValues.forEach(
                        (value) => {
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
                                        value
                                            ?.option_id ??
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

            /*
            |--------------------------------------------------------------------------
            | Convert only used options into swatches
            |--------------------------------------------------------------------------
            */

            options.forEach(
                (option) => {
                    const optionId =
                        Number(
                            option?.id ??
                                option
                                    ?.global_variant_option_id
                        );

                    if (
                        !optionId ||
                        !usedOptionIds.has(
                            optionId
                        )
                    ) {
                        return;
                    }

                    const color =
                        option?.color_hex ||
                        option?.hex ||
                        option?.color;

                    if (color) {
                        colors.push(
                            color
                        );
                    }
                }
            );
        }
    );

    return [
        ...new Set(colors),
    ];
};

export const getProductSubtitle = (product) => {
    const firstVariant =
        Array.isArray(
            product?.variants
        )
            ? product.variants[0]
            : null;

    if (firstVariant?.title) {
        return firstVariant.title;
    }

    if (product?.brand?.name) {
        return product.brand.name;
    }

    if (product?.category?.name) {
        return product.category.name;
    }

    return "";
};

export const getProductCardData = (product) => {
    const price =
        getProductPrice(product);

    const compareAtPrice =
        getCompareAtPrice(product);

    return {
        price,
        compareAtPrice,

        discount:
            calculateDiscount(
                price,
                compareAtPrice
            ),

        image:
            getProductImage(
                product
            ),

        colors:
            getProductColors(
                product
            ),

        subtitle:
            getProductSubtitle(
                product
            ),
    };
};