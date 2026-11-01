import PencilButton from "./PencilButton";
import SliderButton from "./SliderButton";

const ProductsOnSaleHeader = ({
    isAdmin,
    showSliderControls,
    canScrollLeft,
    canScrollRight,
    onPrevious,
    onNext,
    onEdit,
}) => {
    return (
        <div className="mb-7 flex items-center justify-between gap-4">
            <h2 className="text-[24px] font-bold text-[#252b35]">
                Product on Sale
            </h2>

            <div className="flex items-center gap-2">
                {showSliderControls && (
                    <>
                        <SliderButton
                            direction="previous"
                            disabled={!canScrollLeft}
                            onClick={onPrevious}
                        />

                        <SliderButton
                            direction="next"
                            disabled={!canScrollRight}
                            onClick={onNext}
                        />
                    </>
                )}

                {isAdmin && (
                    <PencilButton
                        onClick={onEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductsOnSaleHeader;