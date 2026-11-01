import OrderButton from "./OrderButton";

const SelectedProductItem = ({
    product,
    index,
    total,
    image,
    onMoveProduct,
    onRemoveProduct,
}) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-1">
                {image ? (
                    <img
                        src={image}
                        alt={product?.title || "Product"}
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <span className="text-[9px] text-gray-400">
                        No image
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-[#252b35]">
                    {product?.title || "Untitled product"}
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                    Position {index + 1}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                <OrderButton
                    direction="up"
                    disabled={index === 0}
                    onClick={() =>
                        onMoveProduct(
                            index,
                            "up"
                        )
                    }
                />

                <OrderButton
                    direction="down"
                    disabled={
                        index === total - 1
                    }
                    onClick={() =>
                        onMoveProduct(
                            index,
                            "down"
                        )
                    }
                />

                <button
                    type="button"
                    onClick={() =>
                        onRemoveProduct(
                            Number(product.id)
                        )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove product"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6l12 12M18 6 6 18"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SelectedProductItem;