import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get Global Variants
|--------------------------------------------------------------------------
*/

export const getGlobalVariants = async (params = {}) => {
    const response = await api.get(
        "/admin/global-variants",
        {
            params,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Global Variant
|--------------------------------------------------------------------------
*/

export const getGlobalVariant = async (id) => {
    const response = await api.get(
        `/admin/global-variants/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Ordered Global Variants
|--------------------------------------------------------------------------
*/

export const getOrderedGlobalVariants = async () => {
    const response = await api.get(
        "/admin/global-variants/ordered"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Global Variant
|--------------------------------------------------------------------------
*/

export const createGlobalVariant = async (payload) => {
    const response = await api.post(
        "/admin/global-variants",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Global Variant
|--------------------------------------------------------------------------
*/

export const updateGlobalVariant = async (
    id,
    payload
) => {
    const response = await api.put(
        `/admin/global-variants/${id}`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Global Variant
|--------------------------------------------------------------------------
*/

export const deleteGlobalVariant = async (id) => {
    const response = await api.delete(
        `/admin/global-variants/${id}`
    );

    return response.data;
};