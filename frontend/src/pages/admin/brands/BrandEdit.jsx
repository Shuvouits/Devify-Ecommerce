import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import BrandFormHeader from "../../../components/admin/brands/form/BrandFormHeader";
import BrandBasicInformation from "../../../components/admin/brands/form/BrandBasicInformation";
import BrandLogoUploader from "../../../components/admin/brands/form/BrandLogoUploader";
import BrandPublishing from "../../../components/admin/brands/form/BrandPublishing";
import BrandSeoSection from "../../../components/admin/brands/form/BrandSeoSection";
import BrandAiModal from "../../../components/admin/brands/form/BrandAiModal";
import BrandImageStudio from "../../../components/admin/brands/image-studio/BrandImageStudio";
import BrandToast from "../../../components/admin/brands/BrandToast";

import useEditBrand from "../../../hooks/admin/brands/useEditBrand";



import {
    analyzeBrandSeo,
    generateBrandDescription,
    generateBrandSeo,
    getBrand,
    getBrandLogoSource,
} from "../../../api/admin/brandApi";


const emptyForm = {
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


const BrandEdit = () => {
    const {
        id,
    } =
        useParams();

    const navigate =
        useNavigate();


    const {
        loading: saving,
        error,
        setError,
        submit,
    } =
        useEditBrand();


    /*
    |--------------------------------------------------------------------------
    | Brand State
    |--------------------------------------------------------------------------
    */

    const [
        form,
        setForm,
    ] =
        useState(
            emptyForm
        );

    const [
        loading,
        setLoading,
    ] =
        useState(true);


    /*
    |--------------------------------------------------------------------------
    | Existing Logo
    |--------------------------------------------------------------------------
    */

    const [
        existingLogoUrl,
        setExistingLogoUrl,
    ] =
        useState("");

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

    const [
        removeExistingLogo,
        setRemoveExistingLogo,
    ] =
        useState(false);


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


    /*
    |--------------------------------------------------------------------------
    | Toast
    |--------------------------------------------------------------------------
    */

    const [
        toast,
        setToast,
    ] =
        useState({
            open: false,
            message: "",
        });

    const toastTimer =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Load Brand
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const load =
            async () => {
                setLoading(
                    true
                );

                setError("");


                try {
                    const response =
                        await getBrand(
                            id
                        );


                    const brand =
                        extractBrand(
                            response
                        );


                    if (!brand) {
                        throw new Error(
                            "Brand not found."
                        );
                    }


                    setForm({
                        name:
                            brand.name ||
                            "",

                        slug:
                            brand.slug ||
                            "",

                        description:
                            brand.description ||
                            "",

                        website:
                            brand.website ||
                            "",

                        status:
                            brand.status ||
                            "active",

                        is_featured:
                            Boolean(
                                brand.is_featured
                            ),

                        display_order:
                            brand.display_order ??
                            0,

                        seo_title:
                            brand.seo?.title ||
                            brand.seo_title ||
                            "",

                        seo_description:
                            brand.seo?.description ||
                            brand.seo_description ||
                            "",
                    });


                    setExistingLogoUrl(
                        brand.logo_url ||
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


        load();
    }, [
        id,
        setError,
    ]);


    /*
    |--------------------------------------------------------------------------
    | New Logo Preview
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!logoFile) {
            setPreviewUrl(
                removeExistingLogo
                    ? ""
                    : existingLogoUrl
            );

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
        existingLogoUrl,
        removeExistingLogo,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    const handleSave =
        async () => {
            if (
                !form.name.trim()
            ) {
                setError(
                    "Brand name is required."
                );

                return;
            }


            try {
                await submit({
                    brandId:
                        id,

                    form,

                    logoFile,

                    removeExistingLogo,
                });


                showToast(
                    "Brand updated successfully"
                );


                setTimeout(
                    () => {
                        navigate(
                            "/admin/brands"
                        );
                    },
                    650
                );
            } catch {
                //
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Logo Select
    |--------------------------------------------------------------------------
    */

    const handleLogoSelect =
        (file) => {
            if (!file) {
                return;
            }


            const allowed = [
                "image/png",
                "image/jpeg",
                "image/webp",
            ];


            if (
                !allowed.includes(
                    file.type
                )
            ) {
                setError(
                    "Logo must be PNG, JPG, JPEG, or WebP."
                );

                return;
            }


            if (
                file.size >
                5 *
                    1024 *
                    1024
            ) {
                setError(
                    "Logo must not exceed 5 MB."
                );

                return;
            }


            setLogoFile(
                file
            );

            setRemoveExistingLogo(
                false
            );

            setSeoAnalysis(
                null
            );

            setError("");
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

            setRemoveExistingLogo(
                true
            );

            setSeoAnalysis(
                null
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Image Studio
    |--------------------------------------------------------------------------
    */

   const handleOpenStudio =
    async () => {
        setError("");


        /*
        |--------------------------------------------------------------------------
        | New/replaced local logo already exists
        |--------------------------------------------------------------------------
        */

        if (logoFile) {
            setStudioOpen(
                true
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Existing backend logo
        |--------------------------------------------------------------------------
        */

        if (!existingLogoUrl) {
            setError(
                "Upload a logo before opening Image Studio."
            );

            return;
        }


        try {
            const blob =
                await getBrandLogoSource(
                    id
                );


            const extension =
                getExtensionFromMime(
                    blob.type
                );


            const localFile =
                new File(
                    [
                        blob,
                    ],
                    `brand-${id}-logo.${extension}`,
                    {
                        type:
                            blob.type ||
                            "image/png",
                    }
                );


            /*
             * From this point the editor receives
             * a local browser File, not a remote URL.
             */

            setLogoFile(
                localFile
            );

            setRemoveExistingLogo(
                false
            );


            /*
             * previewUrl is generated by existing
             * logoFile useEffect.
             */

            setTimeout(
                () => {
                    setStudioOpen(
                        true
                    );
                },
                0
            );
        } catch (error) {
            setError(
                getApiError(
                    error
                )
            );
        }
    };


    const handleStudioSave =
        (editedFile) => {
            setLogoFile(
                editedFile
            );

            setRemoveExistingLogo(
                false
            );

            setStudioOpen(
                false
            );

            setSeoAnalysis(
                null
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Description AI
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
                    "Enter a brand name first."
                );

                return;
            }


            setAiLoading(
                true
            );


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
    | SEO AI
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
            setAnalyzingSeo(
                true
            );


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
                                    previewUrl
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
    | Toast
    |--------------------------------------------------------------------------
    */

    const showToast =
        (message) => {
            if (
                toastTimer.current
            ) {
                clearTimeout(
                    toastTimer.current
                );
            }


            setToast({
                open: true,
                message,
            });


            toastTimer.current =
                setTimeout(
                    () => {
                        setToast({
                            open: false,
                            message: "",
                        });
                    },
                    3200
                );
        };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-[#f6f6f7]">

                <div className="flex items-center gap-3 text-[12px] text-slate-500">

                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#316ff4] border-t-transparent" />

                    Loading brand...

                </div>

            </div>
        );
    }


    const getExtensionFromMime = (
    mime
) => {
    switch (mime) {
        case "image/jpeg":
            return "jpg";

        case "image/webp":
            return "webp";

        case "image/png":
        default:
            return "png";
    }
};


    return (
        <div className="min-h-full bg-[#f6f6f7]">

            <div className="mx-auto w-full max-w-[1060px] px-5 py-[22px]">

                <BrandFormHeader
                    brandName={
                        form.name
                    }
                    status={
                        form.status
                    }
                    onBack={() =>
                        navigate(
                            "/admin/brands"
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
                    <div className="mb-4 rounded-[11px] border border-red-200 bg-red-50 px-4 py-3 text-[11px] font-medium text-red-600">
                        {error}
                    </div>
                )}


                <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_310px]">

                    <div className="space-y-4">

                        <BrandBasicInformation
                            form={
                                form
                            }
                            setForm={
                                setForm
                            }
                            onOpenDescriptionAi={() =>
                                setAiModal(
                                    "description"
                                )
                            }
                        />


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


                        <BrandSeoSection
                            form={
                                form
                            }
                            setForm={
                                setForm
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


            <BrandAiModal
                open={
                    aiModal ===
                    "description"
                }
                title="Generate brand description"
                description="Give AI a little context and choose the tone you want."
                placeholder="Focus on the brand's main products, positioning and customer value."
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
                title="Generate SEO content"
                description="Generate a page title, meta description and URL handle."
                placeholder="Focus on relevant ecommerce search intent."
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


            <BrandToast
                open={
                    toast.open
                }
                message={
                    toast.message
                }
                onClose={() =>
                    setToast({
                        open: false,
                        message: "",
                    })
                }
            />

        </div>
    );
};


export default BrandEdit;


/*
|--------------------------------------------------------------------------
| Extract Brand
|--------------------------------------------------------------------------
*/

const extractBrand = (
    response
) => {
    const root =
        response?.data ??
        response;


    return (
        root?.brand ??
        root?.data?.brand ??
        root?.data ??
        null
    );
};


/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

const getApiError = (
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
        error?.message ||
        "Unable to complete this action."
    );
};