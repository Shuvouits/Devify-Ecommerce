import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get Storefront Collections
|--------------------------------------------------------------------------
*/

export const getStorefrontCollections = async () => {
    const response = await api.get(
        "/collections"
    );

    return response.data;
};