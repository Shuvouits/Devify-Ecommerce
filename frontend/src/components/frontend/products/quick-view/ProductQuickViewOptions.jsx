const ProductQuickViewOptions = ({
    globalVariants = [],
    selectedOptions = {},
    onSelectOption,
}) => {
    if (
        !Array.isArray(globalVariants) ||
        globalVariants.length === 0
    ) {
        return null;
    }

    return (
        <div className="space-y-5">
            {globalVariants.map((variant) => {
                const variantId =
                    Number(
                        variant?.id ??
                            variant?.global_variant_id
                    );

                const variantName =
                    variant?.name ||
                    variant?.title ||
                    "Option";

                const options =
                    Array.isArray(variant?.options)
                        ? variant.options
                        : [];

                if (!options.length) {
                    return null;
                }

                const selectedOptionId =
                    Number(
                        selectedOptions[
                            variantId
                        ] || 0
                    );

                const isColor =
                    String(
                        variant?.visual_type ||
                            variant?.type ||
                            ""
                    ).toLowerCase() ===
                        "color" ||
                    options.some(
                        (option) =>
                            option?.color_hex ||
                            option?.hex ||
                            option?.color
                    );

                const selectedOption =
                    options.find(
                        (option) =>
                            Number(
                                option?.id ??
                                    option?.global_variant_option_id
                            ) ===
                            selectedOptionId
                    );

                return (
                    <div
                        key={
                            variantId ||
                            variantName
                        }
                    >
                        <div className="mb-2.5 flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#252b35]">
                                {variantName}
                            </span>

                            {selectedOption && (
                                <span className="text-[12px] text-gray-500">
                                    {
                                        getOptionLabel(
                                            selectedOption
                                        )
                                    }
                                </span>
                            )}
                        </div>

                        {isColor ? (
                            <ColorOptions
                                options={
                                    options
                                }
                                selectedOptionId={
                                    selectedOptionId
                                }
                                onSelect={(
                                    option
                                ) =>
                                    handleSelect(
                                        variantId,
                                        option,
                                        onSelectOption
                                    )
                                }
                            />
                        ) : (
                            <StandardOptions
                                options={
                                    options
                                }
                                selectedOptionId={
                                    selectedOptionId
                                }
                                onSelect={(
                                    option
                                ) =>
                                    handleSelect(
                                        variantId,
                                        option,
                                        onSelectOption
                                    )
                                }
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const ColorOptions = ({
    options,
    selectedOptionId,
    onSelect,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const optionId =
                    Number(
                        option?.id ??
                            option?.global_variant_option_id
                    );

                const selected =
                    selectedOptionId ===
                    optionId;

                const color =
                    option?.color_hex ||
                    option?.hex ||
                    option?.color ||
                    "#e5e7eb";

                const label =
                    getOptionLabel(
                        option
                    );

                return (
                    <button
                        key={
                            optionId ||
                            label
                        }
                        type="button"
                        onClick={() =>
                            onSelect(
                                option
                            )
                        }
                        title={label}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                            selected
                                ? "border-[#252b35] ring-2 ring-[#252b35]/10"
                                : "border-gray-200 hover:border-gray-400"
                        }`}
                    >
                        <span
                            className="h-7 w-7 rounded-full border border-black/10"
                            style={{
                                backgroundColor:
                                    color,
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
};

const StandardOptions = ({
    options,
    selectedOptionId,
    onSelect,
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => {
                const optionId =
                    Number(
                        option?.id ??
                            option?.global_variant_option_id
                    );

                const selected =
                    selectedOptionId ===
                    optionId;

                const label =
                    getOptionLabel(
                        option
                    );

                return (
                    <button
                        key={
                            optionId ||
                            label
                        }
                        type="button"
                        onClick={() =>
                            onSelect(
                                option
                            )
                        }
                        className={`min-w-[46px] rounded-lg border px-3 py-2 text-[12px] font-semibold transition ${
                            selected
                                ? "border-[#252b35] bg-[#252b35] text-white"
                                : "border-gray-200 bg-white text-[#4b5563] hover:border-gray-400"
                        }`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};

const handleSelect = (
    variantId,
    option,
    onSelectOption
) => {
    if (!onSelectOption) {
        return;
    }

    const optionId =
        Number(
            option?.id ??
                option?.global_variant_option_id
        );

    onSelectOption(
        variantId,
        optionId,
        option
    );
};

const getOptionLabel = (
    option
) => {
    return (
        option?.name ||
        option?.value ||
        option?.title ||
        option?.label ||
        "Option"
    );
};

export default ProductQuickViewOptions;