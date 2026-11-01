import ProductsOnSaleEmpty from "./ProductsOnSaleEmpty";
import ProductsOnSaleHeader from "./ProductsOnSaleHeader";
import ProductsOnSaleSlider from "./ProductsOnSaleSlider";
import useProductSlider from "./useProductSlider";

const ProductsOnSaleView = ({
    products = [],
    isAdmin = false,
    onEdit,
}) => {
    const {
        sliderRef,
        visibleCount,
        canScrollLeft,
        canScrollRight,
        updateScrollState,
        scrollPrevious,
        scrollNext,
    } = useProductSlider(
        products
    );

    const showSliderControls =
        products.length >
        visibleCount;

    return (
        <section className="px-4 pt-12 sm:px-6 lg:px-8">
            <ProductsOnSaleHeader
                isAdmin={isAdmin}
                showSliderControls={
                    showSliderControls
                }
                canScrollLeft={
                    canScrollLeft
                }
                canScrollRight={
                    canScrollRight
                }
                onPrevious={
                    scrollPrevious
                }
                onNext={
                    scrollNext
                }
                onEdit={
                    onEdit
                }
            />

            {products.length > 0 ? (
                <ProductsOnSaleSlider
                    products={
                        products
                    }
                    sliderRef={
                        sliderRef
                    }
                    visibleCount={
                        visibleCount
                    }
                    onScroll={
                        updateScrollState
                    }
                />
            ) : (
                <ProductsOnSaleEmpty
                    isAdmin={
                        isAdmin
                    }
                    onEdit={
                        onEdit
                    }
                />
            )}
        </section>
    );
};

export default ProductsOnSaleView;