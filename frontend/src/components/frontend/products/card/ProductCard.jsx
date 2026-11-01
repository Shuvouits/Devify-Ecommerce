import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductCardMedia from "./ProductCardMedia";
import ProductCardPrice from "./ProductCardPrice";
import ProductColorSwatches from "./ProductColorSwatches";
import ProductQuickViewModal from "../quick-view/ProductQuickViewModal";

import {
    getProductCardData,
} from "./productCardUtils";

const ProductCard = ({
    product,
    onWishlist,
    onCompare,
    onAddToCart,
    onBuyNow,
    onProductClick,
}) => {
    const navigate = useNavigate();

    const [isQuickViewOpen, setIsQuickViewOpen] =
        useState(false);

    const {
        price,
        compareAtPrice,
        discount,
        image,
        colors,
        subtitle,
    } = getProductCardData(product);

    const handleProductClick = () => {
        if (onProductClick) {
            onProductClick(product);
            return;
        }

        if (!product?.slug) {
            return;
        }

        navigate(
            `/products/${product.slug}`
        );
    };

    const openQuickView = () => {
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
    };

    const handleWishlist = () => {
        if (onWishlist) {
            onWishlist(product);
        }
    };

    const handleCompare = () => {
        if (onCompare) {
            onCompare(product);
        }
    };

    const handleAddToCart = async (payload) => {
        if (!onAddToCart) {
            console.log(
                "Add to cart:",
                payload
            );

            return;
        }

        await onAddToCart(
            payload
        );
    };

    const handleBuyNow = async (payload) => {
        if (!onBuyNow) {
            console.log(
                "Buy now:",
                payload
            );

            return;
        }

        await onBuyNow(
            payload
        );
    };

    return (
        <>
            <article
                className="group min-w-0 cursor-pointer"
                onClick={
                    handleProductClick
                }
            >
                <ProductCardMedia
                    image={image}
                    title={
                        product?.title
                    }
                    discount={
                        discount
                    }
                    onChooseOptions={
                        openQuickView
                    }
                    onQuickView={
                        openQuickView
                    }
                    onWishlist={
                        handleWishlist
                    }
                    onCompare={
                        handleCompare
                    }
                />

                <ProductColorSwatches
                    colors={
                        colors
                    }
                />

              
              <h3
    title={product?.title || "Untitled product"}
    className="mt-3 truncate text-[14px] font-semibold leading-5 text-[#252b35] transition-colors group-hover:text-[#4f7df3]"
>
    {product?.title || "Untitled product"}
</h3>



                {subtitle && (
                    <p className="mt-1 line-clamp-1 text-[12px] text-gray-500">
                        {subtitle}
                    </p>
                )}

                <ProductCardPrice
                    price={
                        price
                    }
                    compareAtPrice={
                        compareAtPrice
                    }
                />
            </article>

            <ProductQuickViewModal
                productId={
                    product?.id
                }
                isOpen={
                    isQuickViewOpen
                }
                onClose={
                    closeQuickView
                }
                onAddToCart={
                    handleAddToCart
                }
                onBuyNow={
                    handleBuyNow
                }
            />
        </>
    );
};

export default ProductCard;