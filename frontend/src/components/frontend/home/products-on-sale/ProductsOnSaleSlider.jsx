import ProductCard from "../../products/card/ProductCard";

const ProductsOnSaleSlider = ({
    products = [],
    sliderRef,
    visibleCount,
    onScroll,
}) => {
    return (
        <div
            ref={sliderRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {products.map((product) => (
                <div
                    key={product.id}
                    className="shrink-0 snap-start"
                    style={{
                        width: `calc((100% - ${
                            (visibleCount - 1) * 20
                        }px) / ${visibleCount})`,
                    }}
                >
                    <ProductCard
                        product={product}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductsOnSaleSlider;