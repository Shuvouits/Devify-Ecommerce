
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    getHomepageSliders as getPublicHomepageSliders,
} from "../../../api/storefront/homepageSliderApi";

import {
    getHomepageSliders as getAdminHomepageSliders,
    createHomepageSlider,
    updateHomepageSlider,
    deleteHomepageSlider,
    uploadHomepageSliderImage,
} from "../../../api/admin/homepageSliderApi";

import { getStoredUser } from "../../../utils/auth";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/i, "");


const EMPTY_FORM = {
    title: "",
    image_path: "",
    link_url: "",
    is_active: true,
    display_order: 0,
};


const getImageUrl = (path) => {
    if (!path) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${API_ORIGIN}/${path.replace(/^\/+/, "")}`;
};


const isActive = (value) => {
    return value === true || value === 1 || value === "1";
};


const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
};


const HomepageSlider = () => {
    const [slides, setSlides] = useState([]);
    const [adminSlides, setAdminSlides] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isPaused, setIsPaused] = useState(false);

    const [isAdmin, setIsAdmin] = useState(() => {
        return (
            Boolean(localStorage.getItem("token")) &&
            getStoredUser()?.role === "admin"
        );
    });

    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const [form, setForm] = useState({ ...EMPTY_FORM });

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // --------------------------------------------------
    // Load public sliders and admin slider records
    // --------------------------------------------------

    const loadSliders = useCallback(async () => {
        const adminMode =
            Boolean(localStorage.getItem("token")) &&
            getStoredUser()?.role === "admin";

        setIsAdmin(adminMode);

        try {
            const response = await getPublicHomepageSliders();

            const publicSlides = Array.isArray(response?.data)
                ? response.data
                : [];

            setSlides(publicSlides);
        } catch (err) {
            console.error(
                "Failed to load homepage sliders:",
                err
            );

            setSlides([]);
        }

        if (adminMode) {
            try {
                const response = await getAdminHomepageSliders();

                setAdminSlides(
                    Array.isArray(response?.data)
                        ? response.data
                        : []
                );
            } catch (err) {
                console.error(
                    "Failed to load admin homepage sliders:",
                    err
                );

                setAdminSlides([]);
            }
        } else {
            setAdminSlides([]);
        }

        setLoading(false);
    }, []);


    useEffect(() => {
        loadSliders();
    }, [loadSliders]);


    // --------------------------------------------------
    // Automatic sliding
    // --------------------------------------------------

    useEffect(() => {
        if (
            slides.length < 2 ||
            isPaused ||
            isManagerOpen
        ) {
            return undefined;
        }

        const interval = window.setInterval(() => {
            setCurrentIndex((previousIndex) => (
                (previousIndex + 1) % slides.length
            ));
        }, 5000);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        slides.length,
        isPaused,
        isManagerOpen,
    ]);


    useEffect(() => {
        if (currentIndex >= slides.length) {
            setCurrentIndex(0);
        }
    }, [currentIndex, slides.length]);


    // --------------------------------------------------
    // Open management panel
    // --------------------------------------------------

    const openManager = async () => {
        setError("");
        setSuccess("");

        setIsManagerOpen(true);

        await loadSliders();
    };


    const closeManager = () => {
        setIsManagerOpen(false);
        setDeleteTarget(null);
        setError("");
        setSuccess("");
    };


    // --------------------------------------------------
    // Create a new slider
    // --------------------------------------------------

    const startCreate = () => {
        setEditingId(null);
        setForm({ ...EMPTY_FORM });

        setError("");
        setSuccess("");
    };


    // --------------------------------------------------
    // Edit an existing slider
    // --------------------------------------------------

    const startEdit = (slide) => {
        setEditingId(slide.id);

        setForm({
            title: slide.title || "",
            image_path: slide.image_path || "",
            link_url: slide.link_url || "",
            is_active: isActive(slide.is_active),
            display_order: Number(slide.display_order) || 0,
        });

        setError("");
        setSuccess("");
    };


    // --------------------------------------------------
    // Upload slider image
    // --------------------------------------------------

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccess("");
        setIsUploading(true);

        try {
            const response = await uploadHomepageSliderImage(
                file,
                form.title
            );

            const imagePath =
                response?.data?.file_path ||
                response?.file_path;

            if (!imagePath) {
                throw new Error(
                    "The uploaded image path was not returned."
                );
            }

            setForm((previous) => ({
                ...previous,
                image_path: imagePath,
            }));

            setSuccess("Image uploaded successfully.");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };


    // --------------------------------------------------
    // Save new or updated slider
    // --------------------------------------------------

    const handleSave = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!form.title.trim()) {
            setError("Please enter a banner title.");
            return;
        }

        if (!form.image_path) {
            setError("Please upload a banner image.");
            return;
        }

        const payload = {
            title: form.title.trim(),
            image_path: form.image_path,
            link_url: form.link_url.trim() || null,
            is_active: Boolean(form.is_active),
            display_order: Number(form.display_order) || 0,
        };

        setIsSaving(true);

        try {
            const response = editingId
                ? await updateHomepageSlider(editingId, payload)
                : await createHomepageSlider(payload);

            if (response?.success === false) {
                throw new Error(
                    response.message || "Failed to save the banner."
                );
            }

            await loadSliders();

            setEditingId(null);
            setForm({ ...EMPTY_FORM });

            setSuccess(
                editingId
                    ? "Banner updated successfully."
                    : "Banner created successfully."
            );
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };


    // --------------------------------------------------
    // Show or hide an individual slider
    // --------------------------------------------------

    const handleToggleActive = async (slide) => {
        setError("");
        setSuccess("");
        setIsSaving(true);

        const nextActive = !isActive(slide.is_active);

        const payload = {
            title: slide.title,
            image_path: slide.image_path,
            link_url: slide.link_url || null,
            is_active: nextActive,
            display_order: Number(slide.display_order) || 0,
        };

        try {
            const response = await updateHomepageSlider(
                slide.id,
                payload
            );

            if (response?.success === false) {
                throw new Error(
                    response.message || "Failed to update banner status."
                );
            }

            await loadSliders();

            setSuccess(
                nextActive
                    ? "Banner is now visible."
                    : "Banner has been hidden."
            );
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };


    // --------------------------------------------------
    // Delete slider
    // --------------------------------------------------

    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        setError("");
        setSuccess("");
        setIsSaving(true);

        try {
            const response = await deleteHomepageSlider(
                deleteTarget.id
            );

            if (response?.success === false) {
                throw new Error(
                    response.message || "Failed to delete banner."
                );
            }

            if (editingId === deleteTarget.id) {
                setEditingId(null);
                setForm({ ...EMPTY_FORM });
            }

            setDeleteTarget(null);

            await loadSliders();

            setSuccess("Banner deleted successfully.");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsSaving(false);
        }
    };


    // --------------------------------------------------
    // Current slide
    // --------------------------------------------------

    const currentSlide =
        slides[currentIndex] || slides[0] || null;

    const linkUrl = currentSlide?.link_url?.trim() || "";

    const isExternalLink =
        /^https?:\/\//i.test(linkUrl);

    const internalLink = linkUrl
        ? linkUrl.startsWith("/")
            ? linkUrl
            : `/${linkUrl}`
        : null;


    const bannerImage = currentSlide ? (
        <img
            src={getImageUrl(currentSlide.image_path)}
            alt={
                currentSlide.title ||
                "Homepage promotional banner"
            }
            className="absolute inset-0 h-full w-full object-cover"
            draggable="false"
        />
    ) : null;


    // Public visitors should not see an empty slider.
    // Admins can still open the editor when all banners are hidden.

    if (!loading && slides.length === 0 && !isAdmin) {
        return null;
    }


    return (
        <>
            {/* ==========================================
                HOMEPAGE SLIDER
            ========================================== */}

            <section
                className="relative w-full overflow-hidden rounded-2xl bg-gray-100"
                aria-label="Homepage promotional slider"
            >
                <div className="relative aspect-[16/7] min-h-[220px] max-h-[340px] w-full">

                    {/* Banner image or empty state */}

                    {currentSlide ? (
                        linkUrl ? (
                            isExternalLink ? (
                                <a
                                    href={linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 block"
                                    aria-label={
                                        currentSlide.title ||
                                        "View promotion"
                                    }
                                >
                                    {bannerImage}
                                </a>
                            ) : (
                                <Link
                                    to={internalLink}
                                    className="absolute inset-0 block"
                                    aria-label={
                                        currentSlide.title ||
                                        "View promotion"
                                    }
                                >
                                    {bannerImage}
                                </Link>
                            )
                        ) : (
                            bannerImage
                        )
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-100 text-center">
                            {loading ? (
                                <div className="h-full w-full animate-pulse bg-gray-200" />
                            ) : (
                                <>
                                    <p className="text-lg font-semibold text-gray-600">
                                        No active homepage banners
                                    </p>

                                    {isAdmin && (
                                        <p className="text-sm text-gray-500">
                                            Click the pencil icon to manage banners.
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}


                    {/* ==================================
                        ADMIN PENCIL BUTTON
                    ================================== */}

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={openManager}
                            aria-label="Manage homepage sliders"
                            title="Manage homepage sliders"
                            className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-lg transition hover:bg-gray-50 hover:text-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                            </svg>
                        </button>
                    )}


                    {/* ==================================
                        PAUSE / PLAY AND SLIDE DOTS
                    ================================== */}

                    {slides.length > 1 && (
                        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">

                            <button
                                type="button"
                                onClick={() => {
                                    setIsPaused((previous) => !previous);
                                }}
                                aria-label={
                                    isPaused
                                        ? "Play slider"
                                        : "Pause slider"
                                }
                                title={
                                    isPaused
                                        ? "Play slider"
                                        : "Pause slider"
                                }
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm transition hover:bg-white"
                            >
                                {isPaused ? (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                ) : (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 5h4v14H7zM15 5h4v14h-4z" />
                                    </svg>
                                )}
                            </button>

                            {slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    aria-current={
                                        index === currentIndex
                                            ? "true"
                                            : undefined
                                    }
                                    className={`shrink-0 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? "h-1.5 w-5 bg-[#252525]"
                                            : "h-1.5 w-1.5 bg-[#a3a3a3] hover:bg-[#555]"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>


            {/* ==========================================
                ADMIN SLIDER MANAGEMENT MODAL
            ========================================== */}

            {isManagerOpen && isAdmin && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeManager();
                        }
                    }}
                >
                    <div className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* Modal header */}

                        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Homepage Slider Settings
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add banners, manage visibility and configure links.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeManager}
                                aria-label="Close slider settings"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                                &times;
                            </button>
                        </div>


                        <div className="grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_360px]">

                            {/* ==================================
                                EXISTING BANNERS
                            ================================== */}

                            <div>
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h3 className="text-base font-bold text-gray-900">
                                        Existing Banners
                                    </h3>

                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                        {adminSlides.length} total
                                    </span>
                                </div>


                                {adminSlides.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-gray-300 px-5 py-12 text-center">
                                        <p className="font-semibold text-gray-700">
                                            No banners created yet
                                        </p>

                                        <p className="mt-2 text-sm text-gray-500">
                                            Use the form to add your first homepage banner.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {adminSlides.map((slide) => (
                                            <div
                                                key={slide.id}
                                                className="rounded-xl border border-gray-200 p-3 sm:p-4"
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row">

                                                    {/* Thumbnail */}

                                                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-36">
                                                        {slide.image_path ? (
                                                            <img
                                                                src={getImageUrl(slide.image_path)}
                                                                alt={slide.title || "Banner preview"}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>


                                                    {/* Details */}

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h4 className="break-words font-semibold text-gray-900">
                                                                {slide.title || "Untitled banner"}
                                                            </h4>

                                                            <span
                                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                    isActive(slide.is_active)
                                                                        ? "bg-green-50 text-green-700"
                                                                        : "bg-gray-100 text-gray-600"
                                                                }`}
                                                            >
                                                                {isActive(slide.is_active)
                                                                    ? "Visible"
                                                                    : "Hidden"}
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 break-all text-xs text-gray-500">
                                                            Link: {slide.link_url || "No link"}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Display order: {slide.display_order ?? 0}
                                                        </p>


                                                        {/* Banner actions */}

                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => startEdit(slide)}
                                                                className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={isSaving}
                                                                onClick={() => handleToggleActive(slide)}
                                                                className={`rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                                                                    isActive(slide.is_active)
                                                                        ? "border border-amber-300 text-amber-700 hover:bg-amber-50"
                                                                        : "border border-green-300 text-green-700 hover:bg-green-50"
                                                                }`}
                                                            >
                                                                {isActive(slide.is_active)
                                                                    ? "Hide"
                                                                    : "Show"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => setDeleteTarget(slide)}
                                                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>


                            {/* ==================================
                                CREATE / EDIT FORM
                            ================================== */}

                            <div className="h-fit rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <h3 className="font-bold text-gray-900">
                                        {editingId ? "Edit Banner" : "Add New Banner"}
                                    </h3>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={startCreate}
                                            className="text-xs font-semibold text-blue-600 hover:underline"
                                        >
                                            Cancel edit
                                        </button>
                                    )}
                                </div>


                                <form
                                    onSubmit={handleSave}
                                    className="space-y-4"
                                >
                                    {/* Title */}

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Banner Title
                                        </label>

                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(event) => {
                                                setForm((previous) => ({
                                                    ...previous,
                                                    title: event.target.value,
                                                }));
                                            }}
                                            placeholder="Homepage Banner 1"
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>


                                    {/* Image upload */}

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Banner Image
                                        </label>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            disabled={isUploading}
                                            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                                        />

                                        {isUploading && (
                                            <p className="mt-2 text-xs text-blue-600">
                                                Uploading image...
                                            </p>
                                        )}

                                        {form.image_path && (
                                            <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                                                <img
                                                    src={getImageUrl(form.image_path)}
                                                    alt="Selected banner preview"
                                                    className="h-32 w-full object-cover"
                                                />

                                                <p className="break-all px-2 py-2 text-xs text-gray-500">
                                                    {form.image_path}
                                                </p>
                                            </div>
                                        )}
                                    </div>


                                    {/* Link */}

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Destination Link
                                        </label>

                                        <input
                                            type="text"
                                            value={form.link_url}
                                            onChange={(event) => {
                                                setForm((previous) => ({
                                                    ...previous,
                                                    link_url: event.target.value,
                                                }));
                                            }}
                                            placeholder="/collections or https://example.com"
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        <p className="mt-1.5 text-xs text-gray-500">
                                            Leave empty if the banner should not link anywhere.
                                        </p>
                                    </div>


                                    {/* Display order */}

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                            Display Order
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={form.display_order}
                                            onChange={(event) => {
                                                setForm((previous) => ({
                                                    ...previous,
                                                    display_order: event.target.value,
                                                }));
                                            }}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>


                                    {/* Visibility */}

                                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(form.is_active)}
                                            onChange={(event) => {
                                                setForm((previous) => ({
                                                    ...previous,
                                                    is_active: event.target.checked,
                                                }));
                                            }}
                                            className="h-4 w-4 accent-blue-600"
                                        />

                                        <span>
                                            <span className="block text-sm font-semibold text-gray-800">
                                                Show on homepage
                                            </span>

                                            <span className="mt-0.5 block text-xs text-gray-500">
                                                Hidden banners will not appear publicly.
                                            </span>
                                        </span>
                                    </label>


                                    {/* Error and success */}

                                    {error && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                                            {success}
                                        </div>
                                    )}


                                    {/* Form actions */}

                                    <button
                                        type="submit"
                                        disabled={isSaving || isUploading}
                                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSaving
                                            ? "Saving..."
                                            : editingId
                                                ? "Update Banner"
                                                : "Create Banner"}
                                    </button>

                                    {!editingId && (
                                        <button
                                            type="button"
                                            onClick={startCreate}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                        >
                                            Clear Form
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>


                        {/* Modal footer */}

                        <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 sm:px-7">
                            <p className="text-xs text-gray-500">
                                Changes are saved to the backend. Public visitors only see active banners.
                            </p>
                        </div>
                    </div>
                </div>
            )}


            {/* ==========================================
                DELETE CONFIRMATION MODAL
            ========================================== */}

            {isManagerOpen && isAdmin && deleteTarget && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="h-1.5 bg-red-500" />

                        <div className="p-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M8 6V4h8v2" />
                                            <path d="m19 6-1 14H6L5 6" />
                                            <path d="M10 11v5M14 11v5" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            Delete Banner
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(null)}
                                    aria-label="Close delete confirmation"
                                    className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                                >
                                    &times;
                                </button>
                            </div>

                            <p className="mt-5 text-sm text-gray-700">
                                Are you sure you want to delete{" "}
                                <strong>
                                    {deleteTarget.title || "this banner"}
                                </strong>
                                ?
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() => setDeleteTarget(null)}
                                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={handleDelete}
                                    className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isSaving ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomepageSlider;
