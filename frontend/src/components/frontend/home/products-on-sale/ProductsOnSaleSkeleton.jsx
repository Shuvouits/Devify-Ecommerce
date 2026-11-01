import PencilButton from "./PencilButton";

const ProductsOnSaleSkeleton = ({
    showEditButton = false,
    onEdit,
}) => {
    return (
        <section className="px-4 pt-12 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-center justify-between">
                <h2 className="text-[24px] font-bold text-[#252b35]">
                    Product on Sale
                </h2>

                {showEditButton && (
                    <PencilButton
                        onClick={onEdit}
                    />
                )}
            </div>

            <div className="flex gap-5 overflow-hidden">
                {Array.from({
                    length: 4,
                }).map((_, index) => (
                    <div
                        key={index}
                        className="shrink-0"
                        style={{
                            width: "calc((100% - 60px) / 4)",
                        }}
                    >
                        <div className="aspect-square animate-pulse rounded-lg bg-gray-100" />

                        <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-100" />

                        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductsOnSaleSkeleton;