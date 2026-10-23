import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import CategoryFormHeader from "../../../components/admin/categories/form/CategoryFormHeader";
import CategoryBasicInformation from "../../../components/admin/categories/form/CategoryBasicInformation";
import CategoryMediaField from "../../../components/admin/categories/form/CategoryMediaField";
import CategoryPublishing from "../../../components/admin/categories/form/CategoryPublishing";
import CategoryOrganization from "../../../components/admin/categories/form/CategoryOrganization";
import CategorySeoSection from "../../../components/admin/categories/form/CategorySeoSection";

import BrandAiModal from "../../../components/admin/brands/form/BrandAiModal";
import BrandImageStudio from "../../../components/admin/brands/image-studio/BrandImageStudio";

import useCreateCategory from "../../../hooks/admin/categories/useCreateCategory";

import {
    analyzeCategorySeo,
    generateCategoryDescription,
    generateCategorySeo,
    getCategoryParentOptions,
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


const CategoryCreate = () => {
    const navigate =
        useNavigate();


    const {
        loading,
        error,
        setError,
        submit,
    } = useCreateCategory();


    const [
        form,
        setForm,
    ] = useState(
        initialForm
    );


    /*
    |--------------------------------------------------------------------------
    | Media State
    |--------------------------------------------------------------------------
    */

    const [
        imageFile,
        setImageFile,
    ] = useState(null);

    const [
        imagePreview,
        setImagePreview,
    ] = useState("");


    const [
        iconFile,
        setIconFile,
    ] = useState(null);

    const [
        iconPreview,
        setIconPreview,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Parent Categories
    |--------------------------------------------------------------------------
    */

    const [
        parentOptions,
        setParentOptions,
    ] = useState([]);

    const [
        loadingParents,
        setLoadingParents,
    ] = useState(true);


    /*
    |--------------------------------------------------------------------------
    | AI State
    |--------------------------------------------------------------------------
    */

    const [
        aiModal,
        setAiModal,
    ] = useState(null);

    const [
        aiLoading,
        setAiLoading,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | SEO State
    |--------------------------------------------------------------------------
    */

    const [
        seoAnalysis,
        setSeoAnalysis,
    ] = useState(null);

    const [
        analyzingSeo,
        setAnalyzingSeo,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Image Studio State
    |--------------------------------------------------------------------------
    */

    const [
        studioOpen,
        setStudioOpen,
    ] = useState(false);

    const [
        studioTarget,
        setStudioTarget,
    ] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | Slug Tracking
    |--------------------------------------------------------------------------
    */

    const slugEditedManually =
        useRef(false);


    /*
    |--------------------------------------------------------------------------
    | Load Parent Categories
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
                        await getCategoryParentOptions();


                    setParentOptions(
                        response?.data
                            ?.categories ||
                        []
                    );
                } catch (error) {
                    console.error(
                        "Unable to load parent categories.",
                        error
                    );
                } finally {
                    setLoadingParents(
                        false
                    );
                }
            };


        loadParents();
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Image Preview
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!imageFile) {
            setImagePreview("");

            return;
        }


        const url =
            URL.createObjectURL(
                imageFile
            );


        setImagePreview(
            url
        );


        return () => {
            URL.revokeObjectURL(
                url
            );
        };
    }, [
        imageFile,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Icon Preview
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!iconFile) {
            setIconPreview("");

            return;
        }


        const url =
            URL.createObjectURL(
                iconFile
            );


        setIconPreview(
            url
        );


        return () => {
            URL.revokeObjectURL(
                url
            );
        };
    }, [
        iconFile,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Auto Generate Slug
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            slugEditedManually.current
        ) {
            return;
        }


        setForm(
            (current) => ({
                ...current,

                slug:
                    slugify(
                        current.name
                    ),
            })
        );
    }, [
        form.name,
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
                        const automaticSlug =
                            slugify(
                                next.name
                            );


                        if (
                            next.slug !==
                            automaticSlug
                        ) {
                            slugEditedManually.current =
                                true;
                        }
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
            if (!file) {
                return false;
            }


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


            const maxSize =
                5 *
                1024 *
                1024;


            if (
                file.size >
                maxSize
            ) {
                setError(
                    "Image must not exceed 5 MB."
                );

                return false;
            }


            setError("");

            return true;
        };


    /*
    |--------------------------------------------------------------------------
    | Select Category Image
    |--------------------------------------------------------------------------
    */

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

            setSeoAnalysis(
                null
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Select Category Icon
    |--------------------------------------------------------------------------
    */

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


        try {
            await submit(
                form,
                imageFile,
                iconFile
            );


            navigate(
                "/admin/categories",
                {
                    replace: true,

                    state: {
                        successMessage:
                            `${form.name} created successfully`,
                    },
                }
            );
        } catch {
            /*
             * Error is already handled
             * inside useCreateCategory.
             */
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
            if (
                !form.name.trim()
            ) {
                setError(
                    "Enter a category name before using AI."
                );

                return;
            }


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


                if (description) {
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
            if (
                !form.name.trim()
            ) {
                setError(
                    "Enter a category name before generating SEO."
                );

                return;
            }


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


                if (seo) {
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
    | SEO Analyze
    |--------------------------------------------------------------------------
    */

    const handleAnalyzeSeo =
        async () => {
            if (
                !form.name.trim()
            ) {
                setError(
                    "Enter a category name first."
                );

                return;
            }


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
                                imageFile
                            ),

                        has_icon:
                            Boolean(
                                iconFile
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
    | Open Image Studio
    |--------------------------------------------------------------------------
    */

    const handleOpenStudio =
        (target) => {
            const selectedFile =
                target ===
                "image"
                    ? imageFile
                    : iconFile;


            if (!selectedFile) {
                setError(
                    target ===
                    "image"
                        ? "Upload a category image before opening AI Studio."
                        : "Upload a category icon before opening AI Studio."
                );

                return;
            }


            setError("");

            setStudioTarget(
                target
            );

            setStudioOpen(
                true
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Save Image Studio Result
    |--------------------------------------------------------------------------
    */

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

            setSeoAnalysis(
                null
            );

            setError("");
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
                        loading
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
                                imagePreview
                            }
                            onSelect={
                                handleImageSelect
                            }
                            onRemove={() => {
                                setImageFile(
                                    null
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
                                iconPreview
                            }
                            onSelect={
                                handleIconSelect
                            }
                            onRemove={() => {
                                setIconFile(
                                    null
                                );

                                setSeoAnalysis(
                                    null
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
                placeholder="Example: Focus on electronics, devices, accessories and the products customers will find in this category."
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
                placeholder="Example: Focus on ecommerce search intent and the main products within this category."
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
};


export default CategoryCreate;


/*
|--------------------------------------------------------------------------
| Slug Helper
|--------------------------------------------------------------------------
*/

const slugify = (
    value
) => {
    return String(
        value ||
        ""
    )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );
};


/*
|--------------------------------------------------------------------------
| API Error Helper
|--------------------------------------------------------------------------
*/

const getApiError = (
    error
) => {
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
        "Unable to complete this action."
    );
};