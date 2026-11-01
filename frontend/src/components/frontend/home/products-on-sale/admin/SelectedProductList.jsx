import SelectedProductItem from "./SelectedProductItem";
import { getProductImage } from "../productImage";

const SelectedProductList = ({
    products = [],
    onMoveProduct,
    onRemoveProduct,
}) => {
    return (
        <div>
            <div className="mb-4">
                <h4 className="text-[15px] font-bold text-[#252b35]">
                    Homepage Order
                </h4>

                <p className="mt-1 text-[12px] text-gray-500">
                    Use the arrows to arrange selected products.
                </p>
            </div>

            <div className="space-y-2">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <SelectedProductItem
                            key={product.id}
                            product={product}
                            index={index}
                            total={products.length}
                            image={getProductImage(product)}
                            onMoveProduct={onMoveProduct}
                            onRemoveProduct={onRemoveProduct}
                        />
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 px-5 py-10 text-center">
                        <p className="text-[13px] font-semibold text-gray-600">
                            No products selected
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                            Choose products from the left.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectedProductList;