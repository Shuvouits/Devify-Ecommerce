import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get Locations
|--------------------------------------------------------------------------
*/

export const getLocations = async (params = {}) => {
    const response = await api.get("/admin/locations", {
        params,
    });

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Location
|--------------------------------------------------------------------------
*/

export const getLocation = async (id) => {
    const response = await api.get(
        `/admin/locations/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Location
|--------------------------------------------------------------------------
*/

export const createLocation = async (payload) => {
    const response = await api.post(
        "/admin/locations",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Location
|--------------------------------------------------------------------------
*/

export const updateLocation = async (
    id,
    payload
) => {
    const response = await api.put(
        `/admin/locations/${id}`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Location
|--------------------------------------------------------------------------
*/

export const deleteLocation = async (id) => {
    const response = await api.delete(
        `/admin/locations/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Set Default Location
|--------------------------------------------------------------------------
*/

export const setDefaultLocation = async (
    locationId
) => {
    const response = await api.patch(
        "/admin/locations/default",
        {
            location_id: locationId,
        }
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Delivery Order
|--------------------------------------------------------------------------
*/

export const getLocationDeliveryOrder =
    async () => {
        const response = await api.get(
            "/admin/locations/delivery-order"
        );

        return response.data;
    };


/*
|--------------------------------------------------------------------------
| Update Delivery Order
|--------------------------------------------------------------------------
*/

export const updateLocationDeliveryOrder =
    async (locationIds) => {
        const response = await api.put(
            "/admin/locations/delivery-order",
            {
                locations: locationIds,
            }
        );

        return response.data;
    };