import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import BrandFormHeader from "../../../components/admin/brands/form/BrandFormHeader";
import BrandBasicInformation from "../../../components/admin/brands/form/BrandBasicInformation";
import BrandLogoUploader from "../../../components/admin/brands/form/BrandLogoUploader";
import BrandPublishing from "../../../components/admin/brands/form/BrandPublishing";
import BrandSeoSection from "../../../components/admin/brands/form/BrandSeoSection";
import BrandAiModal from "../../../components/admin/brands/form/BrandAiModal";

import BrandImageStudio from "../../../components/admin/brands/image-studio/BrandImageStudio";

import useCreateBrand from "../../../hooks/admin/brands/useCreateBrand";

import {
    analyzeBrandSeo,
    generateBrandDescription,
    generateBrandSeo,
} from "../../../api/admin/brandApi";


/*
|--------------------------------------------------------------------------
| Initial Form
|--------------------------------------------------------------------------
*/

const initialForm = {
    name: "",
    slug: "",
    description: "",
    website: "",
    status: "active",
    is_featured: false,
    display_order: 0,
    seo_title: "",
    seo_description: "",
};


const BrandCreate = () => {
    const navigate =
        useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Create Brand Hook
    |--------------------------------------------------------------------------
    */

    const {
        loading,
        error,
        setError,
        submit,
    } =
        useCreateBrand();


    /*
    |--------------------------------------------------------------------------
    | Form State
    |--------------------------------------------------------------------------
    */

    const [
        form,
        setForm,
    ] =
        useState(
            initialForm
        );


    /*
    |--------------------------------------------------------------------------
    | Logo State
    |--------------------------------------------------------------------------
    */

    const [
        logoFile,
        setLogoFile,
    ] =
        useState(null);

    const [
        previewUrl,
        setPreviewUrl,
    ] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | AI Modal State
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
    | SEO State
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
    | Image Studio State
    |--------------------------------------------------------------------------
    */

    const [
        studioOpen,
        setStudioOpen,
    ] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Track Manual Slug Changes
    |--------------------------------------------------------------------------
    */

    const slugEditedManually =
        useRef(false);


    /*
    |--------------------------------------------------------------------------
    | Logo Preview
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!logoFile) {
            setPreviewUrl("");

            return;
        }


        const url =
            URL.createObjectURL(
                logoFile
            );


        setPreviewUrl(
            url
        );


        return () => {
            URL.revokeObjectURL(
                url
            );
        };
    }, [
        logoFile,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Auto Generate Slug From Brand Name
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


                    /*
                    |--------------------------------------------------------------------------
                    | Detect Manual Slug Modification
                    |--------------------------------------------------------------------------
                    */

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
    | Save Brand
    |--------------------------------------------------------------------------
    */

    const handleSave =
        async () => {
            setError("");


            if (
                !form.name.trim()
            ) {
                setError(
                    "Brand name is required."
                );

                return;
            }


            try {
                await submit(
                    form,
                    logoFile
                );


                navigate(
                    "/admin/brands",
                    {
                        replace: true,
                    }
                );
            } catch {
                /*
                 * Error is already handled
                 * inside useCreateBrand.
                 */
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Generate AI Description
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
                    "Enter a brand name before using AI."
                );

                return;
            }


            setAiLoading(
                true
            );

            setError("");


            try {
                const response =
                    await generateBrandDescription(
                        {
                            brand_name:
                                form.name,

                            website:
                                form.website ||
                                null,

                            prompt:
                                prompt ||
                                null,

                            tone,
                        }
                    );


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
    | Generate AI SEO
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
                    "Enter a brand name before generating SEO."
                );

                return;
            }


            setAiLoading(
                true
            );

            setError("");


            try {
                const response =
                    await generateBrandSeo(
                        {
                            brand_name:
                                form.name,

                            description:
                                form.description ||
                                null,

                            website:
                                form.website ||
                                null,

                            prompt:
                                prompt ||
                                null,

                            tone,
                        }
                    );


                const seo =
                    response?.data
                        ?.seo;


                if (seo) {
                    /*
                    |--------------------------------------------------------------------------
                    | AI Generated Slug Should Not Be Replaced Automatically
                    |--------------------------------------------------------------------------
                    */

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
    | Analyze SEO
    |--------------------------------------------------------------------------
    */

    const handleAnalyzeSeo =
        async () => {
            if (
                !form.name.trim()
            ) {
                setError(
                    "Enter a brand name first."
                );

                return;
            }


            setAnalyzingSeo(
                true
            );

            setError("");


            try {
                const response =
                    await analyzeBrandSeo(
                        {
                            brand_name:
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

                            website:
                                form.website ||
                                null,

                            has_logo:
                                Boolean(
                                    logoFile
                                ),
                        }
                    );


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
    | Select Logo
    |--------------------------------------------------------------------------
    */

    const handleLogoSelect =
        (file) => {
            if (!file) {
                return;
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
                    "Logo must be a PNG, JPG, JPEG, or WebP image."
                );

                return;
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
                    "Logo must not exceed 5 MB."
                );

                return;
            }


            setError("");

            setLogoFile(
                file
            );


            /*
             * Logo has changed, so previous
             * SEO analysis may no longer be accurate.
             */
            setSeoAnalysis(
                null
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Remove Logo
    |--------------------------------------------------------------------------
    */

    const handleRemoveLogo =
        () => {
            setLogoFile(
                null
            );

            setSeoAnalysis(
                null
            );

            setStudioOpen(
                false
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Open Image Studio
    |--------------------------------------------------------------------------
    */

    const handleOpenStudio =
        () => {
            if (!logoFile) {
                setError(
                    "Upload a brand logo before opening Image Studio."
                );

                return;
            }


            setError("");

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


            setLogoFile(
                editedFile
            );

            setSeoAnalysis(
                null
            );

            setStudioOpen(
                false
            );

            setError("");
        };


    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack =
        () => {
            navigate(
                "/admin/brands"
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-full bg-[#f6f6f7]">

            <div className="mx-auto w-full max-w-[1060px] px-5 py-[22px]">

                {/* Page Header */}

                <BrandFormHeader
                    brandName={
                        form.name
                    }
                    status={
                        form.status
                    }
                    onBack={
                        handleBack
                    }
                    onSave={
                        handleSave
                    }
                    loading={
                        loading
                    }
                />


                {/* Error */}

                {error && (
                    <div className="mb-4 rounded-[11px] border border-[#f0d0d5] bg-[#fff6f7] px-[14px] py-[10px] text-[11px] font-medium text-[#c84956]">
                        {error}
                    </div>
                )}


                {/* Main Layout */}

                <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">

                    {/* Left Column */}

                    <div className="space-y-4">

                        {/* Details */}

                        <BrandBasicInformation
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


                        {/* Logo */}

                        <BrandLogoUploader
                            logoFile={
                                logoFile
                            }
                            previewUrl={
                                previewUrl
                            }
                            onSelect={
                                handleLogoSelect
                            }
                            onRemove={
                                handleRemoveLogo
                            }
                            onOpenStudio={
                                handleOpenStudio
                            }
                        />


                        {/* SEO */}

                        <BrandSeoSection
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


                    {/* Right Column */}

                    <BrandPublishing
                        form={
                            form
                        }
                        setForm={
                            setForm
                        }
                    />

                </div>

            </div>


            {/* AI Description Modal */}

            <BrandAiModal
                open={
                    aiModal ===
                    "description"
                }
                title="Generate brand description"
                description="Give AI a little context and choose the tone you want."
                placeholder="Example: Focus on consumer electronics, connected devices and reliability."
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


            {/* AI SEO Modal */}

            <BrandAiModal
                open={
                    aiModal ===
                    "seo"
                }
                title="Generate SEO content"
                description="Generate a page title, meta description and URL handle."
                placeholder="Example: Focus on ecommerce search intent for electronics and smart devices."
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


            {/* Image Studio */}

            <BrandImageStudio
                open={
                    studioOpen
                }
                file={
                    logoFile
                }
                previewUrl={
                    previewUrl
                }
                onClose={() =>
                    setStudioOpen(
                        false
                    )
                }
                onSave={
                    handleStudioSave
                }
            />

        </div>
    );
};


export default BrandCreate;


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
        "Something went wrong."
    );
};