import axios from "../axios";

export const getFeaturedCategories = async () => {
    const response = await axios.get(
        "/categories/featured"
    );

    return response.data;
};