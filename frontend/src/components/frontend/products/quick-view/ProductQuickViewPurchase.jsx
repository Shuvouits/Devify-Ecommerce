import {
    formatMoney,
} from "../card/productCardUtils";

const ProductQuickViewPurchase = ({
    price,
    compareAtPrice,
    quantity,
    setQuantity,
    onAddToCart,
    onBuyNow,
    isAvailable = true,
    isAddingToCart = false,
}) => {
    const decreaseQuantity = () => {
        setQuantity((current) =>
            Math.max(
                1,
                Number(current) - 1
            )
        );
    };

    const increaseQuantity = () => {
        setQuantity((current) =>
            Math.max(
                1,
                Number(current) + 1
            )
        );
    };

    const handleQuantityChange = (
        event
    ) => {
        const value = Number(
            event.target.value
        );

        if (
            Number.isNaN(value) ||
            value < 1
        ) {
            setQuantity(1);
            return;
        }

        setQuantity(
            Math.floor(value)
        );
    };

    return (
        <div>
            <div className="flex flex-wrap items-center gap-3">
                {price !== null &&
                    price !== undefined && (
                        <span className="text-[20px] font-bold text-[#252b35]">
                            {formatMoney(
                                price
                            )}
                        </span>
                    )}

                {compareAtPrice !== null &&
                    compareAtPrice !== undefined &&
                    price !== null &&
                    Number(
                        compareAtPrice
                    ) >
                        Number(price) && (
                        <span className="text-[14px] text-gray-400 line-through">
                            {formatMoney(
                                compareAtPrice
                            )}
                        </span>
                    )}
            </div>

            <div className="mt-5">
                <p className="mb-2 text-[13px] font-semibold text-[#252b35]">
                    Quantity
                </p>

                <div className="inline-flex h-11 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <button
                        type="button"
                        onClick={
                            decreaseQuantity
                        }
                        className="flex h-full w-10 items-center justify-center text-[18px] text-gray-500 transition hover:bg-gray-50 hover:text-[#252b35]"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <input
                        type="number"
                        min="1"
                        value={
                            quantity
                        }
                        onChange={
                            handleQuantityChange
                        }
                        className="h-full w-12 border-x border-gray-200 text-center text-[13px] font-semibold text-[#252b35] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />

                    <button
                        type="button"
                        onClick={
                            increaseQuantity
                        }
                        className="flex h-full w-10 items-center justify-center text-[18px] text-gray-500 transition hover:bg-gray-50 hover:text-[#252b35]"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={
                        onAddToCart
                    }
                    disabled={
                        !isAvailable ||
                        isAddingToCart
                    }
                    className="flex h-12 items-center justify-center rounded-lg bg-[#252b35] px-5 text-[13px] font-semibold text-white transition hover:bg-[#1c2129] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isAddingToCart
                        ? "Adding..."
                        : isAvailable
                          ? "Add to cart"
                          : "Unavailable"}
                </button>

                <button
                    type="button"
                    onClick={
                        onBuyNow
                    }
                    disabled={
                        !isAvailable
                    }
                    className="flex h-12 items-center justify-center rounded-lg border border-[#252b35] bg-white px-5 text-[13px] font-semibold text-[#252b35] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Buy it now
                </button>
            </div>
        </div>
    );
};

export default ProductQuickViewPurchase;