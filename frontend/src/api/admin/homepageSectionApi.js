import axios from "../axios";

export const getHomepageSection = async (
    sectionKey
) => {
    const response = await axios.get(
        `/admin/homepage-sections/${sectionKey}`
    );

    return response.data;
};

export const updateHomepageSection = async (
    sectionKey,
    payload
) => {
    const response = await axios.put(
        `/admin/homepage-sections/${sectionKey}`,
        payload
    );

    return response.data;
};