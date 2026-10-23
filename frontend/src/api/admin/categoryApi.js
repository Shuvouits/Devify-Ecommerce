import axios from "../axios";


export const getCategories = async (
    params = {}
) => {
    const response =
        await axios.get(
            "/admin/categories",
            {
                params,
            }
        );

    return response.data;
};


export const getCategoryParentOptions = async (
    params = {}
) => {
    const response =
        await axios.get(
            "/admin/categories/parent-options",
            {
                params,
            }
        );

    return response.data;
};


export const createCategory = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/categories",
            payload
        );

    return response.data;
};


export const getCategory = async (
    categoryId
) => {
    const response =
        await axios.get(
            `/admin/categories/${categoryId}`
        );

    return response.data;
};


export const updateCategory = async (
    categoryId,
    payload
) => {
    const response =
        await axios.put(
            `/admin/categories/${categoryId}`,
            payload
        );

    return response.data;
};


export const archiveCategory = async (
    categoryId
) => {
    const response =
        await axios.patch(
            `/admin/categories/${categoryId}/archive`
        );

    return response.data;
};


export const restoreCategory = async (
    categoryId
) => {
    const response =
        await axios.patch(
            `/admin/categories/${categoryId}/restore`
        );

    return response.data;
};


export const deleteCategory = async (
    categoryId
) => {
    const response =
        await axios.delete(
            `/admin/categories/${categoryId}`
        );

    return response.data;
};



export const restoreDeletedCategory = async (
    categoryId
) => {
    const response =
        await axios.patch(
            `/admin/categories/${categoryId}/trash/restore`
        );

    return response.data;
};


export const forceDeleteCategory = async (
    categoryId
) => {
    const response =
        await axios.delete(
            `/admin/categories/${categoryId}/trash/force`
        );

    return response.data;
};



export const generateCategoryDescription = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/categories/ai/description",
            payload
        );

    return response.data;
};


export const generateCategorySeo = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/categories/ai/seo",
            payload
        );

    return response.data;
};


export const analyzeCategorySeo = async (
    payload
) => {
    const response =
        await axios.post(
            "/admin/categories/seo/analyze",
            payload
        );

    return response.data;
};


export const uploadCategoryImage = async (
    categoryId,
    file
) => {
    const formData =
        new FormData();

    formData.append(
        "image",
        file
    );

    const response =
        await axios.post(
            `/admin/categories/${categoryId}/image`,
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


export const deleteCategoryImage = async (
    categoryId
) => {
    const response =
        await axios.delete(
            `/admin/categories/${categoryId}/image`
        );

    return response.data;
};


export const uploadCategoryIcon = async (
    categoryId,
    file
) => {
    const formData =
        new FormData();

    formData.append(
        "icon",
        file
    );

    const response =
        await axios.post(
            `/admin/categories/${categoryId}/icon`,
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


export const deleteCategoryIcon = async (
    categoryId
) => {
    const response =
        await axios.delete(
            `/admin/categories/${categoryId}/icon`
        );

    return response.data;
};