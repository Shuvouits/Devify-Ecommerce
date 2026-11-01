import { formatMoney } from "./productCardUtils";

const ProductCardPrice = ({
    price,
    compareAtPrice,
}) => {
    if (price === null) {
        return null;
    }

    return (
        <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-[#31a84b] px-2.5 py-1 text-[13px] font-semibold text-[#21843a]">
                {formatMoney(price)}
            </span>

            {compareAtPrice !== null &&
                compareAtPrice > price && (
                    <span className="text-[12px] text-gray-400 line-through">
                        {formatMoney(
                            compareAtPrice
                        )}
                    </span>
                )}
        </div>
    );
};

export default ProductCardPrice;