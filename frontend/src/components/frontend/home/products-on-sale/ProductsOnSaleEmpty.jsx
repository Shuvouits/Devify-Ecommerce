const ProductsOnSaleEmpty = ({
    isAdmin,
    onEdit,
}) => {
    return (
        <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                    No products selected
                </p>

                {isAdmin ? (
                    <>
                        <p className="mt-1 text-xs text-gray-500">
                            Choose products to display in this section.
                        </p>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="mt-4 rounded-lg bg-[#252b35] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#1c2129]"
                        >
                            Choose products
                        </button>
                    </>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">
                        No products are available right now.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductsOnSaleEmpty;