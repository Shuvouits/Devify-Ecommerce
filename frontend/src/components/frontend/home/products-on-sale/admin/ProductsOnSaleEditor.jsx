import ProductPicker from "./ProductPicker";
import SelectedProductList from "./SelectedProductList";
import VisibilityToggle from "./VisibilityToggle";

const ProductsOnSaleEditor = ({
    isActive,
    setIsActive,
    availableProducts = [],
    selectedIds = [],
    selectedProducts = [],
    search = "",
    setSearch,
    isProductsLoading = false,
    isSaving = false,
    saveError = "",
    onToggleProduct,
    onRemoveProduct,
    onMoveProduct,
    onClose,
    onSave,
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6">
            <div className="flex max-h-[92vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-[20px] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h3 className="text-[19px] font-bold text-[#252b35]">
                            Product on Sale
                        </h3>

                        <p className="mt-1 text-[13px] text-gray-500">
                            Choose products and arrange their homepage order.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close editor"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 6l12 12M18 6 6 18"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <VisibilityToggle
                        isActive={isActive}
                        onChange={setIsActive}
                    />

                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <ProductPicker
                            products={availableProducts}
                            selectedIds={selectedIds}
                            search={search}
                            setSearch={setSearch}
                            isLoading={isProductsLoading}
                            onToggleProduct={onToggleProduct}
                        />

                        <SelectedProductList
                            products={selectedProducts}
                            onMoveProduct={onMoveProduct}
                            onRemoveProduct={onRemoveProduct}
                        />
                    </div>

                    {saveError && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                            {saveError}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p className="text-[12px] text-gray-500">
                        {selectedIds.length} product
                        {selectedIds.length === 1 ? "" : "s"} selected
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="h-10 rounded-xl border border-gray-200 bg-white px-5 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onSave}
                            disabled={isSaving}
                            className="flex h-10 min-w-[92px] items-center justify-center rounded-xl bg-[#4f7df3] px-5 text-[14px] font-semibold text-white transition hover:bg-[#416fe0] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSaving
                                ? "Saving..."
                                : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsOnSaleEditor;