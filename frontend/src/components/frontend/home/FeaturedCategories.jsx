import {
    Link,
} from "react-router-dom";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    getFeaturedCategories,
} from "../../../api/storefront/categoryApi";

import {
    updateHomepageSection,
} from "../../../api/admin/homepageSectionApi";

import {
    getStoredUser,
} from "../../../utils/auth";


const FeaturedCategories = () => {
    const sliderRef = useRef(null);

    const [categories, setCategories] =
        useState([]);

    const [section, setSection] =
        useState({
            is_active: true,
            item_limit: 8,
        });

    const [form, setForm] =
        useState({
            is_active: true,
            item_limit: 8,
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSettingsOpen, setIsSettingsOpen] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [visibleCount, setVisibleCount] =
        useState(8);

    const [canScrollLeft, setCanScrollLeft] =
        useState(false);

    const [canScrollRight, setCanScrollRight] =
        useState(false);


    const user =
        getStoredUser();

    const isAdmin =
        Boolean(
            localStorage.getItem("token")
        ) &&
        user?.role === "admin";


    useEffect(() => {
        loadCategories();
    }, []);


    useEffect(() => {
        const updateVisibleCount = () => {
            const width =
                window.innerWidth;

            if (width < 640) {
                setVisibleCount(2);
                return;
            }

            if (width < 1024) {
                setVisibleCount(4);
                return;
            }

            setVisibleCount(8);
        };

        updateVisibleCount();

        window.addEventListener(
            "resize",
            updateVisibleCount
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateVisibleCount
            );
        };
    }, []);


    useEffect(() => {
        const timer =
            setTimeout(() => {
                updateScrollState();
            }, 50);

        return () =>
            clearTimeout(timer);
    }, [
        categories,
        visibleCount,
    ]);


    const loadCategories = async () => {
        try {
            setIsLoading(true);

            const response =
                await getFeaturedCategories();

            const sectionData = {
                is_active:
                    response?.section
                        ?.is_active ??
                    true,

                item_limit:
                    response?.section
                        ?.item_limit ??
                    8,
            };

            setSection(
                sectionData
            );

            setForm(
                sectionData
            );

            setCategories(
                Array.isArray(
                    response?.data
                )
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load featured categories:",
                error
            );

            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };


    const updateScrollState = () => {
        const slider =
            sliderRef.current;

        if (!slider) {
            return;
        }

        const maxScroll =
            slider.scrollWidth -
            slider.clientWidth;

        setCanScrollLeft(
            slider.scrollLeft > 5
        );

        setCanScrollRight(
            slider.scrollLeft <
                maxScroll - 5
        );
    };


    const scrollSlider = (
        direction
    ) => {
        const slider =
            sliderRef.current;

        if (!slider) {
            return;
        }

        const distance =
            slider.clientWidth;

        slider.scrollBy({
            left:
                direction === "next"
                    ? distance
                    : -distance,

            behavior:
                "smooth",
        });
    };


    const openSettings = () => {
        setForm({
            is_active:
                section.is_active,

            item_limit:
                section.item_limit,
        });

        setIsSettingsOpen(
            true
        );
    };


    const closeSettings = () => {
        if (isSaving) {
            return;
        }

        setIsSettingsOpen(
            false
        );
    };


    const handleSave = async () => {
        try {
            setIsSaving(true);

            const itemLimit =
                Math.min(
                    24,
                    Math.max(
                        1,
                        Number(
                            form.item_limit
                        ) || 1
                    )
                );

            await updateHomepageSection(
                "featured_categories",
                {
                    is_active:
                        Boolean(
                            form.is_active
                        ),

                    item_limit:
                        itemLimit,

                    settings: [],
                }
            );

            setIsSettingsOpen(
                false
            );

            await loadCategories();
        } catch (error) {
            console.error(
                "Failed to update featured categories settings:",
                error
            );
        } finally {
            setIsSaving(false);
        }
    };


    const PencilButton = () => {
        if (!isAdmin) {
            return null;
        }

        return (
            <button
                type="button"
                onClick={openSettings}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                aria-label="Edit featured categories"
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-[17px] w-[17px]"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L8.25 18.463 3.75 19.5l1.037-4.5L16.862 3.487Z"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.75 5.6 3.65 3.65"
                    />
                </svg>
            </button>
        );
    };


    const SliderButton = ({
        direction,
        disabled,
    }) => {
        const isPrevious =
            direction === "previous";

        return (
            <button
                type="button"
                disabled={disabled}
                onClick={() =>
                    scrollSlider(
                        isPrevious
                            ? "previous"
                            : "next"
                    )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-default disabled:opacity-30"
                aria-label={
                    isPrevious
                        ? "Previous categories"
                        : "Next categories"
                }
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                            isPrevious
                                ? "M15 18l-6-6 6-6"
                                : "M9 6l6 6-6 6"
                        }
                    />
                </svg>
            </button>
        );
    };


    if (isLoading) {
        return (
            <section className="px-4 pt-12 sm:px-6 lg:px-8">
                <div className="mb-7 flex items-center justify-between">
                    <h2 className="text-[24px] font-bold text-[#252b35]">
                        Featured Categories
                    </h2>

                    <PencilButton />
                </div>

                <div className="flex gap-6 overflow-hidden">
                    {Array.from({
                        length:
                            visibleCount,
                    }).map(
                        (
                            _,
                            index
                        ) => (
                            <div
                                key={
                                    index
                                }
                                className="flex shrink-0 flex-col items-center"
                                style={{
                                    width: `calc((100% - ${
                                        (
                                            visibleCount -
                                            1
                                        ) *
                                        24
                                    }px) / ${visibleCount})`,
                                }}
                            >
                                <div className="h-[110px] w-full animate-pulse rounded-xl bg-gray-100" />

                                <div className="mt-3 h-4 w-20 animate-pulse rounded bg-gray-100" />
                            </div>
                        )
                    )}
                </div>
            </section>
        );
    }


    if (
        !section.is_active &&
        !isAdmin
    ) {
        return null;
    }


    if (
        !section.is_active &&
        isAdmin
    ) {
        return (
            <>
                <section className="px-4 pt-12 sm:px-6 lg:px-8">
                    <div className="flex min-h-[110px] items-center justify-between rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6">
                        <div>
                            <h2 className="text-[20px] font-bold text-[#252b35]">
                                Featured Categories
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Hidden on storefront
                            </p>
                        </div>

                        <PencilButton />
                    </div>
                </section>

                {isSettingsOpen && (
                    <SettingsModal
                        form={form}
                        setForm={
                            setForm
                        }
                        isSaving={
                            isSaving
                        }
                        onClose={
                            closeSettings
                        }
                        onSave={
                            handleSave
                        }
                    />
                )}
            </>
        );
    }


    if (
        !categories.length &&
        !isAdmin
    ) {
        return null;
    }


    return (
        <>
            <section className="relative px-4 pt-12 sm:px-6 lg:px-8">
                <div className="mb-7 flex items-center justify-between gap-4">
                    <h2 className="text-[24px] font-bold text-[#252b35]">
                        Featured Categories
                    </h2>

                    <div className="flex items-center gap-2">
                        {categories.length >
                            visibleCount && (
                            <>
                                <SliderButton
                                    direction="previous"
                                    disabled={
                                        !canScrollLeft
                                    }
                                />

                                <SliderButton
                                    direction="next"
                                    disabled={
                                        !canScrollRight
                                    }
                                />
                            </>
                        )}

                        <PencilButton />
                    </div>
                </div>


                {categories.length >
                0 ? (
                    <div
                        ref={
                            sliderRef
                        }
                        onScroll={
                            updateScrollState
                        }
                        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {categories.map(
                            (
                                category
                            ) => (
                                <Link
                                    key={
                                        category.id
                                    }
                                    to={`/categories/${category.slug}`}
                                    className="group flex shrink-0 snap-start flex-col items-center text-center"
                                    style={{
                                        width: `calc((100% - ${
                                            (
                                                visibleCount -
                                                1
                                            ) *
                                            24
                                        }px) / ${visibleCount})`,
                                    }}
                                >
                                    <div className="flex h-[110px] w-full items-center justify-center">
                                        {category.image_url ? (
                                            <img
                                                src={
                                                    category.image_url
                                                }
                                                alt={
                                                    category.name
                                                }
                                                className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : category.icon_url ? (
                                            <img
                                                src={
                                                    category.icon_url
                                                }
                                                alt={
                                                    category.name
                                                }
                                                className="h-[80px] w-[80px] object-contain transition-transform duration-200 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-[100px] w-[100px] items-center justify-center rounded-xl bg-gray-100 px-3 text-center text-xs text-gray-400">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <span className="mt-3 line-clamp-2 text-[14px] font-semibold leading-5 text-[#252b35] transition-colors group-hover:text-[#4f7df3]">
                                        {
                                            category.name
                                        }
                                    </span>
                                </Link>
                            )
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-8 text-center">
                        <p className="text-sm font-medium text-gray-600">
                            No featured categories available.
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Mark categories as featured from the admin category settings.
                        </p>
                    </div>
                )}
            </section>


            {isSettingsOpen && (
                <SettingsModal
                    form={form}
                    setForm={
                        setForm
                    }
                    isSaving={
                        isSaving
                    }
                    onClose={
                        closeSettings
                    }
                    onSave={
                        handleSave
                    }
                />
            )}
        </>
    );
};


const SettingsModal = ({
    form,
    setForm,
    isSaving,
    onClose,
    onSave,
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[460px] overflow-hidden rounded-[20px] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h3 className="text-[18px] font-bold text-[#252b35]">
                            Featured Categories
                        </h3>

                        <p className="mt-1 text-[13px] text-gray-500">
                            Manage homepage visibility and category count.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            isSaving
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-[18px] w-[18px]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 6l12 12M18 6 6 18"
                            />
                        </svg>
                    </button>
                </div>


                <div className="space-y-6 px-6 py-6">
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-4">
                        <div className="pr-6">
                            <p className="text-[14px] font-semibold text-[#252b35]">
                                Show on homepage
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-gray-500">
                                Turn this off to hide the entire Featured Categories section.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setForm(
                                    (
                                        current
                                    ) => ({
                                        ...current,

                                        is_active:
                                            !current.is_active,
                                    })
                                )
                            }
                            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                form.is_active
                                    ? "bg-[#4f7df3]"
                                    : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ${
                                    form.is_active
                                        ? "left-[23px]"
                                        : "left-[3px]"
                                }`}
                            />
                        </button>
                    </div>


                    <div>
                        <label
                            htmlFor="featured-category-count"
                            className="mb-2 block text-[14px] font-semibold text-[#252b35]"
                        >
                            Number of categories
                        </label>

                        <input
                            id="featured-category-count"
                            type="number"
                            min="1"
                            max="24"
                            value={
                                form.item_limit
                            }
                            onChange={(
                                event
                            ) =>
                                setForm(
                                    (
                                        current
                                    ) => ({
                                        ...current,

                                        item_limit:
                                            event
                                                .target
                                                .value,
                                    })
                                )
                            }
                            className="h-11 w-full rounded-xl border border-gray-200 px-4 text-[14px] text-[#252b35] outline-none transition focus:border-[#4f7df3] focus:ring-2 focus:ring-[#4f7df3]/10"
                        />

                        <p className="mt-2 text-[12px] text-gray-500">
                            Choose between 1 and 24 featured categories.
                        </p>
                    </div>
                </div>


                <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        disabled={
                            isSaving
                        }
                        className="h-10 rounded-xl border border-gray-200 bg-white px-5 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={
                            onSave
                        }
                        disabled={
                            isSaving
                        }
                        className="flex h-10 min-w-[92px] items-center justify-center rounded-xl bg-[#4f7df3] px-5 text-[14px] font-semibold text-white transition hover:bg-[#416fe0] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default FeaturedCategories;