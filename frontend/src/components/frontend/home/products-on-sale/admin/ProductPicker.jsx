import ProductPickerCard from "./ProductPickerCard";

const ProductPicker = ({
    products = [],
    selectedIds = [],
    search = "",
    setSearch,
    isLoading = false,
    onToggleProduct,
}) => {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h4 className="text-[15px] font-bold text-[#252b35]">
                        Available Products
                    </h4>

                    <p className="mt-1 text-[12px] text-gray-500">
                        Select up to 24 products.
                    </p>
                </div>

                <span className="text-[12px] font-semibold text-gray-500">
                    {selectedIds.length} selected
                </span>
            </div>

            <div className="relative mb-4">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                >
                    <circle
                        cx="11"
                        cy="11"
                        r="7"
                    />

                    <path
                        strokeLinecap="round"
                        d="m20 20-3.5-3.5"
                    />
                </svg>

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Search products..."
                    className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-[13px] outline-none transition focus:border-[#4f7df3] focus:ring-2 focus:ring-[#4f7df3]/10"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {Array.from({
                        length: 6,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="h-[155px] animate-pulse rounded-xl bg-gray-100"
                        />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {products.map((product) => {
                        const selected =
                            selectedIds.includes(
                                Number(product.id)
                            );

                        return (
                            <ProductPickerCard
                                key={product.id}
                                product={product}
                                selected={selected}
                                onToggle={onToggleProduct}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center text-sm text-gray-500">
                    No products found.
                </div>
            )}
        </div>
    );
};

export default ProductPicker;