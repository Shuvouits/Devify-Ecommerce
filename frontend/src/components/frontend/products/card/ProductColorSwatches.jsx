const ProductColorSwatches = ({
    colors = [],
    maxVisible = 6,
}) => {
    if (!colors.length) {
        return null;
    }

    const visibleColors =
        colors.slice(
            0,
            maxVisible
        );

    const remaining =
        colors.length -
        visibleColors.length;

    return (
        <div className="mt-3 flex items-center gap-1.5">
            {visibleColors.map(
                (
                    color,
                    index
                ) => (
                    <span
                        key={`${color}-${index}`}
                        className="h-4 w-4 rounded-full border border-black/10"
                        style={{
                            backgroundColor:
                                color,
                        }}
                    />
                )
            )}

            {remaining > 0 && (
                <span className="ml-0.5 text-[10px] font-medium text-gray-400">
                    +{remaining}
                </span>
            )}
        </div>
    );
};

export default ProductColorSwatches;