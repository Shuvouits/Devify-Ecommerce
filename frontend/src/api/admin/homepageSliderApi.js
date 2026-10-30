import api from "../axios";

/*
|--------------------------------------------------------------------------
| Get All Homepage Sliders
|--------------------------------------------------------------------------
*/

export const getHomepageSliders = async () => {
    const response = await api.get(
        "/admin/homepage-sliders"
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Homepage Slider
|--------------------------------------------------------------------------
*/

export const getHomepageSlider = async (id) => {
    const response = await api.get(
        `/admin/homepage-sliders/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Homepage Slider
|--------------------------------------------------------------------------
*/

export const createHomepageSlider = async (payload) => {
    const response = await api.post(
        "/admin/homepage-sliders",
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Homepage Slider
|--------------------------------------------------------------------------
*/

export const updateHomepageSlider = async (
    id,
    payload
) => {
    const response = await api.put(
        `/admin/homepage-sliders/${id}`,
        payload
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Homepage Slider
|--------------------------------------------------------------------------
*/

export const deleteHomepageSlider = async (id) => {
    const response = await api.delete(
        `/admin/homepage-sliders/${id}`
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Upload Homepage Slider Image
|--------------------------------------------------------------------------
*/

export const uploadHomepageSliderImage = async (
    file,
    title = ""
) => {
    const formData = new FormData();

    formData.append(
        "image",
        file
    );

    if (title) {
        formData.append(
            "title",
            title
        );
    }

    const response = await api.post(
        "/admin/homepage-sliders/upload-image",
        formData
    );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Homepage Slider Image
|--------------------------------------------------------------------------
*/

export const deleteHomepageSliderImage = async (
    path
) => {
    const response = await api.delete(
        "/admin/homepage-sliders/delete-image",
        {
            data: {
                path,
            },
        }
    );

    return response.data;
};