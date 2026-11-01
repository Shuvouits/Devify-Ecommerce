import ProductsOnSaleEditor from "./products-on-sale/admin/ProductsOnSaleEditor";
import ProductsOnSaleHidden from "./products-on-sale/ProductsOnSaleHidden";
import ProductsOnSaleSkeleton from "./products-on-sale/ProductsOnSaleSkeleton";
import ProductsOnSaleView from "./products-on-sale/ProductsOnSaleView";
import useProductsOnSale from "./products-on-sale/useProductsOnSale";

const ProductsOnSale = () => {
    const {
        products,
        section,
        isLoading,
        isAdmin,

        isEditorOpen,
        openEditor,
        closeEditor,

        isActive,
        setIsActive,

        availableProducts,
        selectedIds,
        selectedProducts,

        search,
        setSearch,

        isProductsLoading,
        isSaving,
        saveError,

        toggleProduct,
        removeProduct,
        moveProduct,
        handleSave,
    } = useProductsOnSale();

    if (isLoading) {
        return (
            <ProductsOnSaleSkeleton
                showEditButton={isAdmin}
                onEdit={openEditor}
            />
        );
    }

    if (
        !section?.is_active &&
        !isAdmin
    ) {
        return null;
    }

    return (
        <>
            {!section?.is_active &&
            isAdmin ? (
                <ProductsOnSaleHidden
                    onEdit={openEditor}
                />
            ) : (
                <ProductsOnSaleView
                    products={products}
                    isAdmin={isAdmin}
                    onEdit={openEditor}
                />
            )}

            {isEditorOpen && (
                <ProductsOnSaleEditor
                    isActive={isActive}
                    setIsActive={
                        setIsActive
                    }
                    availableProducts={
                        availableProducts
                    }
                    selectedIds={
                        selectedIds
                    }
                    selectedProducts={
                        selectedProducts
                    }
                    search={search}
                    setSearch={
                        setSearch
                    }
                    isProductsLoading={
                        isProductsLoading
                    }
                    isSaving={
                        isSaving
                    }
                    saveError={
                        saveError
                    }
                    onToggleProduct={
                        toggleProduct
                    }
                    onRemoveProduct={
                        removeProduct
                    }
                    onMoveProduct={
                        moveProduct
                    }
                    onClose={
                        closeEditor
                    }
                    onSave={
                        handleSave
                    }
                />
            )}
        </>
    );
};

export default ProductsOnSale;