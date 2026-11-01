import { getProductImage } from "../productImage";

const ProductPickerCard = ({
    product,
    selected = false,
    onToggle,
}) => {
    const image =
        getProductImage(product);

    return (
        <button
            type="button"
            onClick={() =>
                onToggle(product)
            }
            className={`relative overflow-hidden rounded-xl border p-3 text-left transition ${
                selected
                    ? "border-[#4f7df3] bg-[#f6f8ff] ring-2 ring-[#4f7df3]/10"
                    : "border-gray-200 hover:border-gray-300"
            }`}
        >
            <div className="mb-2 flex h-[82px] items-center justify-center rounded-lg bg-gray-50 p-2">
                {image ? (
                    <img
                        src={image}
                        alt={
                            product?.title ||
                            "Product"
                        }
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <span className="text-[11px] text-gray-400">
                        No image
                    </span>
                )}
            </div>

            <p className="line-clamp-2 text-[12px] font-semibold leading-4 text-[#252b35]">
                {product?.title ||
                    "Untitled product"}
            </p>

            <p className="mt-1 line-clamp-1 text-[10px] text-gray-400">
                {product?.brand?.name ||
                    product?.category?.name ||
                    "Product"}
            </p>

            <span
                className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border ${
                    selected
                        ? "border-[#4f7df3] bg-[#4f7df3] text-white"
                        : "border-gray-300 bg-white"
                }`}
            >
                {selected && (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="h-3 w-3"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5 12 4 4L19 6"
                        />
                    </svg>
                )}
            </span>
        </button>
    );
};

export default ProductPickerCard;