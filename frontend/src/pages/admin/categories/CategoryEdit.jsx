import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import CategoryFormHeader from "../../../components/admin/categories/form/CategoryFormHeader";
import CategoryBasicInformation from "../../../components/admin/categories/form/CategoryBasicInformation";
import CategoryMediaField from "../../../components/admin/categories/form/CategoryMediaField";
import CategoryPublishing from "../../../components/admin/categories/form/CategoryPublishing";
import CategoryOrganization from "../../../components/admin/categories/form/CategoryOrganization";
import CategorySeoSection from "../../../components/admin/categories/form/CategorySeoSection";

import BrandAiModal from "../../../components/admin/brands/form/BrandAiModal";
import BrandImageStudio from "../../../components/admin/brands/image-studio/BrandImageStudio";

import {
    analyzeCategorySeo,
    deleteCategoryIcon,
    deleteCategoryImage,
    generateCategoryDescription,
    generateCategorySeo,
    getCategory,
    getCategoryParentOptions,
    updateCategory,
    uploadCategoryIcon,
    uploadCategoryImage,
} from "../../../api/admin/categoryApi";


const initialForm = {
    name: "",
    slug: "",
    description: "",
    parent_id: null,
    status: "active",
    is_featured: false,
    display_order: 0,
    tax_class: "",
    seo_title: "",
    seo_description: "",
    tags: [],
};


export default function CategoryEdit() {
    const navigate =
        useNavigate();

    const {
        id,
    } =
        useParams();

    const categoryId =
        Number(id);


    const [
        form,
        setForm,
    ] =
        useState(
            initialForm
        );


    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        saving,
        setSaving,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Existing Media
    |--------------------------------------------------------------------------
    */

    const [
        existingImageUrl,
        setExistingImageUrl,
    ] =
        useState("");

    const [
        existingIconUrl,
        setExistingIconUrl,
    ] =
        useState("");


    const [
    imageRemoved,
    setImageRemoved,
] = useState(false);

const [
    iconRemoved,
    setIconRemoved,
] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | New Media Files
    |--------------------------------------------------------------------------
    */

    const [
        imageFile,
        setImageFile,
    ] =
        useState(null);

    const [
        imagePreview,
        setImagePreview,
    ] =
        useState("");


    const [
        iconFile,
        setIconFile,
    ] =
        useState(null);

    const [
        iconPreview,
        setIconPreview,
    ] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Parent Options
    |--------------------------------------------------------------------------
    */

    const [
        parentOptions,
        setParentOptions,
    ] =
        useState([]);

    const [
        loadingParents,
        setLoadingParents,
    ] =
        useState(true);


    /*
    |--------------------------------------------------------------------------
    | AI
    |--------------------------------------------------------------------------
    */

    const [
        aiModal,
        setAiModal,
    ] =
        useState(null);

    const [
        aiLoading,
        setAiLoading,
    ] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | SEO
    |--------------------------------------------------------------------------
    */

    const [
        seoAnalysis,
        setSeoAnalysis,
    ] =
        useState(null);

    const [
        analyzingSeo,
        setAnalyzingSeo,
    ] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Image Studio
    |--------------------------------------------------------------------------
    */

    const [
        studioOpen,
        setStudioOpen,
    ] =
        useState(false);

    const [
        studioTarget,
        setStudioTarget,
    ] =
        useState(null);


    const slugEditedManually =
        useRef(true);


    /*
    |--------------------------------------------------------------------------
    | Load Category
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadCategory =
            async () => {
                setLoading(
                    true
                );

                setError("");

                try {
                    const response =
                        await getCategory(
                            categoryId
                        );

                    const category =
                        extractCategory(
                            response
                        );

                    if (
                        !category?.id
                    ) {
                        throw new Error(
                            "Category data was not returned."
                        );
                    }

                    setForm({
                        name:
                            category.name ||
                            "",

                        slug:
                            category.slug ||
                            category?.seo?.slug ||
                            "",

                        description:
                            category.description ||
                            "",

                        parent_id:
                            category.parent_id ||
                            null,

                        status:
                            category.status ||
                            "active",

                        is_featured:
                            Boolean(
                                category.is_featured
                            ),

                        display_order:
                            Number(
                                category.display_order ||
                                0
                            ),

                        tax_class:
                            category.tax_class ||
                            "",

                        seo_title:
                            category.seo_title ||
                            category?.seo?.title ||
                            "",

                        seo_description:
                            category.seo_description ||
                            category?.seo?.description ||
                            "",

                        tags:
                            Array.isArray(
                                category.tags
                            )
                                ? category.tags
                                : [],
                    });

                    setExistingImageUrl(
                        category.image_url ||
                        ""
                    );

                    setExistingIconUrl(
                        category.icon_url ||
                        ""
                    );
                } catch (error) {
                    setError(
                        getApiError(
                            error
                        )
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            };


        if (
            categoryId
        ) {
            loadCategory();
        }
    }, [
        categoryId,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Load Parent Options
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const loadParents =
            async () => {
                setLoadingParents(
                    true
                );

                try {
                    const response =
                        await getCategoryParentOptions({
                            exclude_id:
                                categoryId,
                        });

                    const options =
                        response?.data
                            ?.categories ||
                        response?.data ||
                        [];

                    setParentOptions(
                        Array.isArray(
                            options
                        )
                            ? options.filter(
                                (category) =>
                                    Number(
                                        category.id
                                    ) !==
                                    categoryId
                            )
                            : []
                    );
                } catch {
                    setParentOptions(
                        []
                    );
                } finally {
                    setLoadingParents(
                        false
                    );
                }
            };


        if (
            categoryId
        ) {
            loadParents();
        }
    }, [
        categoryId,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Local Image Preview
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(
                ""
            );

            return;
        }

        const url =
            URL.createObjectURL(
                imageFile
            );

        setImagePreview(
            url
        );

        return () =>
            URL.revokeObjectURL(
                url
            );
    }, [
        imageFile,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Local Icon Preview
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!iconFile) {
            setIconPreview(
                ""
            );

            return;
        }

        const url =
            URL.createObjectURL(
                iconFile
            );

        setIconPreview(
            url
        );

        return () =>
            URL.revokeObjectURL(
                url
            );
    }, [
        iconFile,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Form Update With Slug Tracking
    |--------------------------------------------------------------------------
    */

    const setFormWithSlugTracking =
        (updater) => {
            setForm(
                (current) => {
                    const next =
                        typeof updater ===
                        "function"
                            ? updater(
                                current
                            )
                            : updater;

                    if (
                        next.slug !==
                        current.slug
                    ) {
                        slugEditedManually.current =
                            true;
                    }

                    return next;
                }
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Validate Image
    |--------------------------------------------------------------------------
    */

    const validateImage =
        (file) => {
            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/webp",
            ];

            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {
                setError(
                    "Image must be PNG, JPG, JPEG, or WebP."
                );

                return false;
            }

            if (
                file.size >
                5 *
                    1024 *
                    1024
            ) {
                setError(
                    "Image must not exceed 5 MB."
                );

                return false;
            }

            setError("");

            return true;
        };


   const handleImageSelect =
    (file) => {
        if (
            !validateImage(
                file
            )
        ) {
            return;
        }

        setImageFile(
            file
        );

        setImageRemoved(
            false
        );

        setSeoAnalysis(
            null
        );
    };


    const handleIconSelect =
    (file) => {
        if (
            !validateImage(
                file
            )
        ) {
            return;
        }

        setIconFile(
            file
        );

        setIconRemoved(
            false
        );

        setSeoAnalysis(
            null
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Save Category
    |--------------------------------------------------------------------------
    */

   const handleSave =
    async () => {
        if (
            !form.name.trim()
        ) {
            setError(
                "Category name is required."
            );

            return;
        }

        setSaving(
            true
        );

        setError("");

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


            await updateCategory(
                categoryId,
                payload
            );


            /*
            |--------------------------------------------------------------------------
            | Category Image
            |--------------------------------------------------------------------------
            */

            if (
                imageFile
            ) {
                await uploadCategoryImage(
                    categoryId,
                    imageFile
                );
            } else if (
                imageRemoved
            ) {
                await deleteCategoryImage(
                    categoryId
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Category Icon
            |--------------------------------------------------------------------------
            */

            if (
                iconFile
            ) {
                await uploadCategoryIcon(
                    categoryId,
                    iconFile
                );
            } else if (
                iconRemoved
            ) {
                await deleteCategoryIcon(
                    categoryId
                );
            }


            navigate(
                "/admin/categories",
                {
                    replace: true,

                    state: {
                        successMessage:
                            `${form.name} updated successfully`,
                    },
                }
            );
        } catch (error) {
            setError(
                getApiError(
                    error
                )
            );
        } finally {
            setSaving(
                false
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | AI Description
    |--------------------------------------------------------------------------
    */

    const handleGenerateDescription =
        async ({
            prompt,
            tone,
        }) => {
            setAiLoading(
                true
            );

            setError("");

            try {
                const response =
                    await generateCategoryDescription({
                        category_name:
                            form.name,

                        parent_id:
                            form.parent_id ||
                            null,

                        prompt:
                            prompt ||
                            null,

                        tone,
                    });

                const description =
                    response?.data
                        ?.description;

                if (
                    description
                ) {
                    setForm(
                        (current) => ({
                            ...current,
                            description,
                        })
                    );
                }

                setAiModal(
                    null
                );
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setAiLoading(
                    false
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | AI SEO
    |--------------------------------------------------------------------------
    */

    const handleGenerateSeo =
        async ({
            prompt,
            tone,
        }) => {
            setAiLoading(
                true
            );

            setError("");

            try {
                const response =
                    await generateCategorySeo({
                        category_name:
                            form.name,

                        description:
                            form.description ||
                            null,

                        parent_id:
                            form.parent_id ||
                            null,

                        prompt:
                            prompt ||
                            null,

                        tone,
                    });

                const seo =
                    response?.data
                        ?.seo;

                if (
                    seo
                ) {
                    slugEditedManually.current =
                        true;

                    setForm(
                        (current) => ({
                            ...current,

                            seo_title:
                                seo.title ||
                                "",

                            seo_description:
                                seo.meta_description ||
                                "",

                            slug:
                                seo.slug ||
                                current.slug,
                        })
                    );
                }

                setSeoAnalysis(
                    null
                );

                setAiModal(
                    null
                );
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setAiLoading(
                    false
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | SEO Analysis
    |--------------------------------------------------------------------------
    */

    const handleAnalyzeSeo =
        async () => {
            setAnalyzingSeo(
                true
            );

            setError("");

            try {
                const response =
                    await analyzeCategorySeo({
                        category_name:
                            form.name,

                        description:
                            form.description ||
                            null,

                        seo_title:
                            form.seo_title ||
                            null,

                        seo_description:
                            form.seo_description ||
                            null,

                        slug:
                            form.slug ||
                            null,

                        has_image:
                            Boolean(
                                imageFile ||
                                existingImageUrl
                            ),

                        has_icon:
                            Boolean(
                                iconFile ||
                                existingIconUrl
                            ),
                    });

                setSeoAnalysis(
                    response?.data
                        ?.seo_analysis ||
                    null
                );
            } catch (error) {
                setError(
                    getApiError(
                        error
                    )
                );
            } finally {
                setAnalyzingSeo(
                    false
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Image Studio
    |--------------------------------------------------------------------------
    */

    const handleOpenStudio =
        (target) => {
            const file =
                target ===
                "image"
                    ? imageFile
                    : iconFile;

            if (!file) {
                setError(
                    target ===
                    "image"
                        ? "Upload or replace the category image before opening AI Studio."
                        : "Upload or replace the category icon before opening AI Studio."
                );

                return;
            }

            setStudioTarget(
                target
            );

            setStudioOpen(
                true
            );

            setError("");
        };


    const handleStudioSave =
        (editedFile) => {
            if (!editedFile) {
                return;
            }

            if (
                studioTarget ===
                "image"
            ) {
                setImageFile(
                    editedFile
                );
            }

            if (
                studioTarget ===
                "icon"
            ) {
                setIconFile(
                    editedFile
                );
            }

            setStudioOpen(
                false
            );

            setStudioTarget(
                null
            );
        };


    const studioFile =
        studioTarget ===
        "image"
            ? imageFile
            : iconFile;


    const studioPreview =
        studioTarget ===
        "image"
            ? imagePreview
            : iconPreview;


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (
        loading
    ) {
        return (
            <div className="min-h-full bg-[#f6f6f7]">
                <div className="mx-auto w-full max-w-[1120px] px-5 py-8">
                    <div className="h-[24px] w-[190px] animate-pulse rounded bg-[#e7e9ec]" />

                    <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">
                        <div className="h-[430px] animate-pulse rounded-[14px] bg-white" />
                        <div className="h-[330px] animate-pulse rounded-[14px] bg-white" />
                    </div>
                </div>
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-full bg-[#f6f6f7]">
            <div className="mx-auto w-full max-w-[1120px] px-5 py-[22px]">

                <CategoryFormHeader
                    categoryName={
                        form.name
                    }
                    status={
                        form.status
                    }
                    onBack={() =>
                        navigate(
                            "/admin/categories"
                        )
                    }
                    onSave={
                        handleSave
                    }
                    loading={
                        saving
                    }
                />


                {error && (
                    <div className="mb-4 rounded-[11px] border border-[#f0d0d5] bg-[#fff6f7] px-[14px] py-[10px] text-[11px] font-medium text-[#c84956]">
                        {error}
                    </div>
                )}


                <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">

                    <div className="space-y-4">

                        <CategoryBasicInformation
                            form={
                                form
                            }
                            setForm={
                                setFormWithSlugTracking
                            }
                            onOpenDescriptionAi={() =>
                                setAiModal(
                                    "description"
                                )
                            }
                        />


                        <CategoryMediaField
                            title="Media"
                            helper="Main category image used across storefront category cards and merchandising."
                            file={
                                imageFile
                            }
                            previewUrl={
                                imagePreview ||
                                existingImageUrl
                            }
                            onSelect={
                                handleImageSelect
                            }

                          

                            onRemove={() => {
    if (
        existingIconUrl
    ) {
        setIconRemoved(
            true
        );
    }

    setIconFile(
        null
    );

    setExistingIconUrl(
        ""
    );

    setSeoAnalysis(
        null
    );
}}




                            onOpenStudio={() =>
                                handleOpenStudio(
                                    "image"
                                )
                            }
                        />


                        <CategoryMediaField
                            title="Icon"
                            helper="Small icon used in navigation, mega menu, category headers, and compact category UI."
                            file={
                                iconFile
                            }
                            previewUrl={
                                iconPreview ||
                                existingIconUrl
                            }
                            onSelect={
                                handleIconSelect
                            }
                            onRemove={() => {
                                setIconFile(
                                    null
                                );

                                setExistingIconUrl(
                                    ""
                                );
                            }}
                            onOpenStudio={() =>
                                handleOpenStudio(
                                    "icon"
                                )
                            }
                        />


                        <CategorySeoSection
                            form={
                                form
                            }
                            setForm={
                                setFormWithSlugTracking
                            }
                            seoAnalysis={
                                seoAnalysis
                            }
                            analyzingSeo={
                                analyzingSeo
                            }
                            onGenerateSeo={() =>
                                setAiModal(
                                    "seo"
                                )
                            }
                            onAnalyzeSeo={
                                handleAnalyzeSeo
                            }
                        />

                    </div>


                    <div className="space-y-4">

                        <CategoryPublishing
                            form={
                                form
                            }
                            setForm={
                                setForm
                            }
                        />


                        <CategoryOrganization
                            form={
                                form
                            }
                            setForm={
                                setForm
                            }
                            parentOptions={
                                parentOptions
                            }
                            loadingParents={
                                loadingParents
                            }
                        />

                    </div>

                </div>

            </div>


            <BrandAiModal
                open={
                    aiModal ===
                    "description"
                }
                title="Generate category description"
                description="Give AI some context and choose the tone you want."
                placeholder="Example: Focus on the products and shopping intent within this category."
                loading={
                    aiLoading
                }
                onClose={() =>
                    setAiModal(
                        null
                    )
                }
                onGenerate={
                    handleGenerateDescription
                }
            />


            <BrandAiModal
                open={
                    aiModal ===
                    "seo"
                }
                title="Generate category SEO content"
                description="Generate a page title, meta description and URL handle."
                placeholder="Example: Focus on ecommerce search intent for this category."
                loading={
                    aiLoading
                }
                onClose={() =>
                    setAiModal(
                        null
                    )
                }
                onGenerate={
                    handleGenerateSeo
                }
            />


            <BrandImageStudio
                open={
                    studioOpen
                }
                file={
                    studioFile
                }
                previewUrl={
                    studioPreview
                }
                onClose={() => {
                    setStudioOpen(
                        false
                    );

                    setStudioTarget(
                        null
                    );
                }}
                onSave={
                    handleStudioSave
                }
            />

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Extract Category
|--------------------------------------------------------------------------
*/

function extractCategory(
    response
) {
    return (
        response?.data?.category ||
        response?.data?.data?.category ||
        response?.data ||
        response ||
        null
    );
}


/*
|--------------------------------------------------------------------------
| Error Helper
|--------------------------------------------------------------------------
*/

function getApiError(
    error
) {
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
        error?.message ||
        "Unable to complete this action."
    );
}