import {
    useState,
} from "react";

import {
    createBrand,
    uploadBrandLogo,
} from "../../../api/admin/brandApi";


const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        Object.values(
            error?.response?.data?.errors || {}
        )?.[0]?.[0] ||
        "Something went wrong. Please try again."
    );
};


export default function useCreateBrand() {
    const [
        loading,
        setLoading,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState("");


    const submit = async (
        form,
        logoFile
    ) => {
        setLoading(true);
        setError("");


        try {
            const payload = {
                name:
                    form.name.trim(),

                slug:
                    form.slug.trim() ||
                    undefined,

                description:
                    form.description.trim() ||
                    null,

                website:
                    form.website.trim() ||
                    null,

                status:
                    form.status,

                is_featured:
                    form.is_featured,

                display_order:
                    Number(
                        form.display_order
                    ),

                seo_title:
                    form.seo_title.trim() ||
                    null,

                seo_description:
                    form.seo_description.trim() ||
                    null,
            };


            const response =
                await createBrand(
                    payload
                );


            const brand =
                response?.data?.brand;


            if (!brand?.id) {
                throw new Error(
                    "Brand ID was not returned."
                );
            }


            if (logoFile) {
                await uploadBrandLogo(
                    brand.id,
                    logoFile
                );
            }


            return brand;
        } catch (error) {
            const message =
                getErrorMessage(
                    error
                );

            setError(
                message
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };


    return {
        loading,
        error,
        setError,
        submit,
    };
}