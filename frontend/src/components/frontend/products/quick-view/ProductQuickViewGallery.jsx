import {
    useEffect,
    useMemo,
    useState,
} from "react";

const ProductQuickViewGallery = ({
    media = [],
    title = "Product",
    selectedImage = null,
}) => {
    const images =
        useMemo(() => {
            if (
                !Array.isArray(
                    media
                )
            ) {
                return [];
            }

            return media
                .map((item) => {
                    const url =
                        item?.url ||
                        item?.external_url ||
                        getMediaUrl(
                            item?.file_path
                        );

                    if (!url) {
                        return null;
                    }

                    return {
                        id:
                            item?.id ??
                            url,

                        url,

                        alt:
                            item?.alt_text ||
                            title,

                        isCover:
                            Boolean(
                                item?.is_cover
                            ),
                    };
                })
                .filter(Boolean);
        }, [
            media,
            title,
        ]);

    const orderedImages =
        useMemo(() => {
            const sorted = [
                ...images,
            ].sort(
                (a, b) =>
                    Number(
                        b.isCover
                    ) -
                    Number(
                        a.isCover
                    )
            );

            if (!selectedImage) {
                return sorted;
            }

            const normalizedSelected =
                normalizeUrl(
                    selectedImage
                );

            const existingIndex =
                sorted.findIndex(
                    (image) =>
                        normalizeUrl(
                            image.url
                        ) ===
                        normalizedSelected
                );

            if (
                existingIndex >= 0
            ) {
                return sorted;
            }

            return [
                {
                    id:
                        `variant-${selectedImage}`,

                    url:
                        selectedImage,

                    alt:
                        title,

                    isCover:
                        false,

                    isVariant:
                        true,
                },

                ...sorted,
            ];
        }, [
            images,
            selectedImage,
            title,
        ]);

    const [
        activeIndex,
        setActiveIndex,
    ] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [
        media,
    ]);

    useEffect(() => {
        if (!selectedImage) {
            return;
        }

        const normalizedSelected =
            normalizeUrl(
                selectedImage
            );

        const imageIndex =
            orderedImages.findIndex(
                (image) =>
                    normalizeUrl(
                        image.url
                    ) ===
                    normalizedSelected
            );

        if (
            imageIndex >= 0
        ) {
            setActiveIndex(
                imageIndex
            );
        }
    }, [
        selectedImage,
        orderedImages,
    ]);

    const activeImage =
        orderedImages[
            activeIndex
        ] || null;

    const showPrevious =
        () => {
            if (
                orderedImages.length <=
                1
            ) {
                return;
            }

            setActiveIndex(
                (current) =>
                    current <= 0
                        ? orderedImages.length -
                          1
                        : current -
                          1
            );
        };

    const showNext = () => {
        if (
            orderedImages.length <=
            1
        ) {
            return;
        }

        setActiveIndex(
            (current) =>
                current >=
                orderedImages.length -
                    1
                    ? 0
                    : current +
                      1
        );
    };

    return (
        <div className="min-w-0">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[16px] bg-[#f5f6f7] p-6">
                {activeImage ? (
                    <img
                        key={
                            activeImage.url
                        }
                        src={
                            activeImage.url
                        }
                        alt={
                            activeImage.alt
                        }
                        className="h-full w-full object-contain transition-opacity duration-200"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No image available
                    </div>
                )}

                {orderedImages.length >
                    1 && (
                    <>
                        <GalleryArrow
                            direction="previous"
                            onClick={
                                showPrevious
                            }
                        />

                        <GalleryArrow
                            direction="next"
                            onClick={
                                showNext
                            }
                        />
                    </>
                )}
            </div>

            {orderedImages.length >
                1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {orderedImages.map(
                        (
                            image,
                            index
                        ) => (
                            <button
                                key={
                                    image.id
                                }
                                type="button"
                                onClick={() =>
                                    setActiveIndex(
                                        index
                                    )
                                }
                                className={`flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border bg-[#f7f7f8] p-1.5 transition ${
                                    activeIndex ===
                                    index
                                        ? "border-[#4f7df3] ring-2 ring-[#4f7df3]/10"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <img
                                    src={
                                        image.url
                                    }
                                    alt={
                                        image.alt
                                    }
                                    className="h-full w-full object-contain"
                                />
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

const GalleryArrow = ({
    direction,
    onClick,
}) => {
    const isPrevious =
        direction ===
        "previous";

    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={`absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-600 shadow-sm transition hover:bg-white hover:text-[#252b35] ${
                isPrevious
                    ? "left-3"
                    : "right-3"
            }`}
            aria-label={
                isPrevious
                    ? "Previous image"
                    : "Next image"
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

const getMediaUrl = (
    path
) => {
    if (!path) {
        return null;
    }

    if (
        path.startsWith(
            "http://"
        ) ||
        path.startsWith(
            "https://"
        )
    ) {
        return path;
    }

    return `http://127.0.0.1:8000/${path.replace(
        /^\/+/,
        ""
    )}`;
};

const normalizeUrl = (
    url
) => {
    return String(
        url || ""
    )
        .trim()
        .replace(
            /\/+$/,
            ""
        );
};

export default ProductQuickViewGallery;