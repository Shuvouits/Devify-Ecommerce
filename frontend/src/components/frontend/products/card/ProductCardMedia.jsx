import ProductCardActions from "./ProductCardActions";

const ProductCardMedia = ({
    image,
    title,
    discount = 0,
    onChooseOptions,
    onQuickView,
    onWishlist,
    onCompare,
}) => {
    return (
        <div className="relative aspect-square overflow-hidden rounded-[8px] bg-[#f4f5f6] p-5">
            {discount > 0 && (
                <span className="absolute left-2.5 top-2.5 z-20 rounded-full border border-[#d6e8d8] bg-white/95 px-2 py-[3px] text-[10px] font-semibold text-[#27873b] shadow-sm backdrop-blur-sm">
                    -{discount}%
                </span>
            )}

            {image ? (
                <img
                    src={image}
                    alt={title || "Product"}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.025]"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                    No image
                </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/[0.04] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <ProductCardActions
                onChooseOptions={onChooseOptions}
                onQuickView={onQuickView}
                onWishlist={onWishlist}
                onCompare={onCompare}
            />
        </div>
    );
};

export default ProductCardMedia;