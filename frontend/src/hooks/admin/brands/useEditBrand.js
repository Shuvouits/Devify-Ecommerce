import {
    useState,
} from "react";

import {
    deleteBrandLogo,
    updateBrand,
    uploadBrandLogo,
} from "../../../api/admin/brandApi";


const getErrorMessage = (
    error
) => {
    const errors =
        error?.response?.data
            ?.errors;

    if (errors) {
        const first =
            Object.values(
                errors
            )?.[0];

        if (
            Array.isArray(
                first
            )
        ) {
            return (
                first[0] ||
                "Something went wrong."
            );
        }
    }

    return (
        error?.response?.data
            ?.message ||
        "Unable to update brand."
    );
};


export default function useEditBrand() {
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


    const submit =
        async ({
            brandId,
            form,
            logoFile,
            removeExistingLogo,
        }) => {
            setLoading(
                true
            );

            setError("");


            try {
                const payload = {
                    name:
                        form.name.trim(),

                    slug:
                        form.slug.trim(),

                    description:
                        form.description.trim() ||
                        null,

                    website:
                        form.website.trim() ||
                        null,

                    status:
                        form.status,

                    is_featured:
                        Boolean(
                            form.is_featured
                        ),

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
                    await updateBrand(
                        brandId,
                        payload
                    );


                /*
                |--------------------------------------------------------------------------
                | Replace Logo
                |--------------------------------------------------------------------------
                */

                if (logoFile) {
                    await uploadBrandLogo(
                        brandId,
                        logoFile
                    );
                } else if (
                    removeExistingLogo
                ) {
                    await deleteBrandLogo(
                        brandId
                    );
                }


                return response;
            } catch (error) {
                setError(
                    getErrorMessage(
                        error
                    )
                );

                throw error;
            } finally {
                setLoading(
                    false
                );
            }
        };


    return {
        loading,
        error,
        setError,
        submit,
    };
}