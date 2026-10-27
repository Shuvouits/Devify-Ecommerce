import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get Products
|--------------------------------------------------------------------------
*/

export const getProducts = async (params = {}) => {
    const response = await api.get(
        "/admin/products",
        {
            params,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Product
|--------------------------------------------------------------------------
*/

export const getProduct = async (id) => {
    const response = await api.get(
        `/admin/products/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Product Select Options
|--------------------------------------------------------------------------
*/

export const getProductOptions = async (params = {}) => {
    const response = await api.get(
        "/admin/products/select",
        {
            params,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Product Stats
|--------------------------------------------------------------------------
*/

export const getProductStats = async () => {
    const response = await api.get(
        "/admin/products/stats"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export const createProduct = async (payload) => {
    const response = await api.post(
        "/admin/products",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export const updateProduct = async (
    id,
    payload
) => {
    const response = await api.put(
        `/admin/products/${id}`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export const deleteProduct = async (id) => {
    const response = await api.delete(
        `/admin/products/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Upload Product Image
|--------------------------------------------------------------------------
*/

export const uploadProductImage = async (
    image,
    productTitle = ""
) => {
    const formData = new FormData();

    formData.append(
        "image",
        image
    );

    if (productTitle) {
        formData.append(
            "product_title",
            productTitle
        );
    }

    const response = await api.post(
        "/admin/products/upload-image",
        formData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Product Image
|--------------------------------------------------------------------------
*/

export const deleteProductImage = async (path) => {
    const response = await api.delete(
        "/admin/products/delete-image",
        {
            data: {
                path,
            },
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Generate Product Description
|--------------------------------------------------------------------------
*/

export const generateProductDescription = async (
    payload
) => {
    const response = await api.post(
        "/admin/products/ai/description",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Generate Product SEO
|--------------------------------------------------------------------------
*/

export const generateProductSeo = async (
    payload
) => {
    const response = await api.post(
        "/admin/products/ai/seo",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Analyze Product SEO
|--------------------------------------------------------------------------
*/

export const analyzeProductSeo = async (
    payload
) => {
    const response = await api.post(
        "/admin/products/seo/analyze",
        payload
    );

    return response.data;
};