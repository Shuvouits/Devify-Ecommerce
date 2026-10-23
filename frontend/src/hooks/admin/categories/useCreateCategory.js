import {
    useState,
} from "react";

import {
    createCategory,
    uploadCategoryIcon,
    uploadCategoryImage,
} from "../../../api/admin/categoryApi";


const getErrorMessage = (error) => {
    const errors =
        error?.response?.data
            ?.errors;

    if (errors) {
        const firstError =
            Object.values(
                errors
            )?.[0];

        if (
            Array.isArray(
                firstError
            )
        ) {
            return (
                firstError[0] ||
                "Something went wrong."
            );
        }
    }

    return (
        error?.response?.data
            ?.message ||
        error?.message ||
        "Unable to create category."
    );
};


export default function useCreateCategory() {
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
        imageFile = null,
        iconFile = null
    ) => {
        setLoading(
            true
        );

        setError(
            ""
        );


        try {
            const payload = {
                name:
                    form.name.trim(),

                slug:
                    form.slug.trim() ||
                    null,

                description:
                    form.description.trim() ||
                    null,

                parent_id:
                    form.parent_id ||
                    null,

                status:
                    form.status,

                is_featured:
                    Boolean(
                        form.is_featured
                    ),

                display_order:
                    Number(
                        form.display_order ||
                        0
                    ),

                tax_class:
                    form.tax_class ||
                    null,

                seo_title:
                    form.seo_title.trim() ||
                    null,

                seo_description:
                    form.seo_description.trim() ||
                    null,

                tags:
                    Array.isArray(
                        form.tags
                    )
                        ? form.tags
                        : [],
            };


            const response =
                await createCategory(
                    payload
                );


            const category =
                response?.data
                    ?.category;


            if (
                !category?.id
            ) {
                throw new Error(
                    "Category ID was not returned."
                );
            }


            if (
                imageFile
            ) {
                await uploadCategoryImage(
                    category.id,
                    imageFile
                );
            }


            if (
                iconFile
            ) {
                await uploadCategoryIcon(
                    category.id,
                    iconFile
                );
            }


            return category;
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