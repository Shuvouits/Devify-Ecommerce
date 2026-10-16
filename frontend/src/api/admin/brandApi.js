import axios from "../axios";


/*
|--------------------------------------------------------------------------
| Get Brands
|--------------------------------------------------------------------------
*/

export const getBrands = async (
    params = {}
) => {
    const response =
        await axios.get(
            "/admin/brands",
            {
                params,
            }
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Single Brand
|--------------------------------------------------------------------------
*/

export const getBrand = async (
    brandId
) => {
    const response =
        await axios.get(
            `/admin/brands/${brandId}`
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Get Brand Logo Source
|--------------------------------------------------------------------------
*/

export const getBrandLogoSource = async (
    brandId
) => {
    const response =
        await axios.get(
            `/admin/brands/${brandId}/logo-source`,
            {
                responseType:
                    "blob",
            }
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Create Brand
|--------------------------------------------------------------------------
*/

export const createBrand = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/brands",
            payload
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Update Brand
|--------------------------------------------------------------------------
*/

export const updateBrand = async (
    brandId,
    payload
) => {
    const response =
        await axios.put(
            `/admin/brands/${brandId}`,
            payload
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Upload Brand Logo
|--------------------------------------------------------------------------
*/

export const uploadBrandLogo = async (
    brandId,
    file
) => {
    const formData =
        new FormData();


    formData.append(
        "logo",
        file
    );


    const response =
        await axios.post(
            `/admin/brands/${brandId}/logo`,
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );


    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Brand Logo
|--------------------------------------------------------------------------
*/

export const deleteBrandLogo = async (
    brandId
) => {
    const response =
        await axios.delete(
            `/admin/brands/${brandId}/logo`
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Archive Brand
|--------------------------------------------------------------------------
*/

export const archiveBrand = async (
    brandId
) => {
    const response =
        await axios.patch(
            `/admin/brands/${brandId}/archive`
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Restore Brand
|--------------------------------------------------------------------------
*/

export const restoreBrand = async (
    brandId
) => {
    const response =
        await axios.patch(
            `/admin/brands/${brandId}/restore`
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Delete Brand
|--------------------------------------------------------------------------
*/

export const deleteBrand = async (
    brandId
) => {
    const response =
        await axios.delete(
            `/admin/brands/${brandId}`
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Generate Brand Description
|--------------------------------------------------------------------------
*/

export const generateBrandDescription = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/brands/ai/description",
            payload
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Generate Brand SEO
|--------------------------------------------------------------------------
*/

export const generateBrandSeo = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/brands/ai/seo",
            payload
        );

    return response.data;
};


/*
|--------------------------------------------------------------------------
| Analyze Brand SEO
|--------------------------------------------------------------------------
*/

export const analyzeBrandSeo = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/brands/seo/analyze",
            payload
        );

    return response.data;
};