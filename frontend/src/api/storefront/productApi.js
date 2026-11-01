import api from "../axios";

export const getProductsOnSale = async () => {
    const response = await api.get(
        "/products/on-sale"
    );

    return response.data;
};

export const getProductQuickView = async (
    id
) => {
    const response = await api.get(
        `/products/${id}/quick-view`
    );

    return response.data;
};