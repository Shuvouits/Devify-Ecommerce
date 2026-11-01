import PencilButton from "./PencilButton";

const ProductsOnSaleHidden = ({
    onEdit,
}) => {
    return (
        <section className="px-4 pt-12 sm:px-6 lg:px-8">
            <div className="flex min-h-[120px] items-center justify-between rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6">
                <div>
                    <h2 className="text-[22px] font-bold text-[#252b35]">
                        Product on Sale
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Hidden on storefront
                    </p>
                </div>

                <PencilButton
                    onClick={onEdit}
                />
            </div>
        </section>
    );
};

export default ProductsOnSaleHidden;