import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get Collections
|--------------------------------------------------------------------------
*/

export const getCollections = async (params = {}) => {
    const response = await api.get(
        "/admin/collections",
        {
            params,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Collection
|--------------------------------------------------------------------------
*/

export const getCollection = async (id) => {
    const response = await api.get(
        `/admin/collections/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Ordered Collections
|--------------------------------------------------------------------------
*/

export const getOrderedCollections = async () => {
    const response = await api.get(
        "/admin/collections/ordered"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Collection
|--------------------------------------------------------------------------
*/

export const createCollection = async (payload) => {
    const response = await api.post(
        "/admin/collections",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Collection
|--------------------------------------------------------------------------
*/

export const updateCollection = async (
    id,
    payload
) => {
    const response = await api.put(
        `/admin/collections/${id}`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Collection
|--------------------------------------------------------------------------
*/

export const deleteCollection = async (id) => {
    const response = await api.delete(
        `/admin/collections/${id}`
    );

    return response.data;
};