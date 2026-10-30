import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get Active Homepage Sliders
|--------------------------------------------------------------------------
*/

export const getHomepageSliders = async () => {
    const response = await api.get(
        "/homepage-sliders"
    );

    return response.data;
};