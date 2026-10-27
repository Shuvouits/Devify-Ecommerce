import {
    useRef,
    useState,
} from "react";

import {
    Image as ImageIcon,
    Loader2,
    Sparkles,
    Star,
    Trash2,
    Upload,
    Video,
    X,
} from "lucide-react";

import {
    deleteProductImage,
    uploadProductImage,
} from "../../../../../api/admin/productApi";


export default function ProductMediaSection({
    media = [],
    productTitle = "",
    onChange,
    onOpenAiStudio,
    onSelectExisting,
    onAddVideo,
}) {
    const fileInputRef =
        useRef(null);

    const [
        uploading,
        setUploading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        videoModalOpen,
        setVideoModalOpen,
    ] = useState(false);

    const [
        videoUrl,
        setVideoUrl,
    ] = useState("");

    const [
        videoError,
        setVideoError,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Image URL
    |--------------------------------------------------------------------------
    */

    const getImageUrl = (
        item
    ) => {
        if (
            item?.media_type ===
            "video"
        ) {
            return null;
        }

        if (item?.url) {
            return item.url;
        }

        if (!item?.file_path) {
            return null;
        }

        if (
            item.file_path.startsWith(
                "http://"
            ) ||
            item.file_path.startsWith(
                "https://"
            )
        ) {
            return item.file_path;
        }

        return `http://127.0.0.1:8000/${item.file_path}`;
    };


    /*
    |--------------------------------------------------------------------------
    | Upload Images
    |--------------------------------------------------------------------------
    */

    const handleFiles =
        async (files) => {
            const selectedFiles =
                Array.from(
                    files || []
                ).filter(
                    (file) =>
                        file.type.startsWith(
                            "image/"
                        )
                );

            if (
                selectedFiles.length ===
                0
            ) {
                return;
            }

            try {
                setUploading(true);
                setError("");

                const uploadedItems =
                    [];

                for (
                    const file of selectedFiles
                ) {
                    const response =
                        await uploadProductImage(
                            file,
                            productTitle
                        );

                    const uploaded =
                        response?.data;

                    if (
                        !uploaded?.file_path
                    ) {
                        continue;
                    }

                    uploadedItems.push({
                        media_type:
                            "image",

                        file_path:
                            uploaded.file_path,

                        url:
                            uploaded.url,

                        external_url:
                            null,

                        alt_text:
                            productTitle ||
                            "",

                        is_cover:
                            media.length ===
                                0 &&
                            uploadedItems.length ===
                                0,

                        display_order:
                            media.length +
                            uploadedItems.length +
                            1,

                        _new_upload:
                            true,
                    });
                }

                if (
                    uploadedItems.length >
                    0
                ) {
                    onChange([
                        ...media,
                        ...uploadedItems,
                    ]);
                }
            } catch (uploadError) {
                console.error(
                    "Product image upload failed:",
                    uploadError
                );

                setError(
                    uploadError
                        ?.response
                        ?.data
                        ?.message ||
                        "Could not upload the image."
                );
            } finally {
                setUploading(false);

                if (
                    fileInputRef.current
                ) {
                    fileInputRef.current.value =
                        "";
                }
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Paste Image
    |--------------------------------------------------------------------------
    */

    const handlePaste = (
        event
    ) => {
        if (uploading) {
            return;
        }

        const files =
            Array.from(
                event.clipboardData
                    ?.files || []
            ).filter(
                (file) =>
                    file.type.startsWith(
                        "image/"
                    )
            );

        if (
            files.length === 0
        ) {
            return;
        }

        event.preventDefault();

        handleFiles(files);
    };


    /*
    |--------------------------------------------------------------------------
    | Remove Media
    |--------------------------------------------------------------------------
    */

    const handleRemove =
        async (
            item,
            index
        ) => {
            try {
                setError("");

                if (
                    item?._new_upload &&
                    item?.file_path
                ) {
                    await deleteProductImage(
                        item.file_path
                    );
                }

                const nextMedia =
                    media.filter(
                        (
                            _,
                            itemIndex
                        ) =>
                            itemIndex !==
                            index
                    );

                const hadCover =
                    item?.is_cover ===
                    true;

                let coverAssigned =
                    false;

                const normalized =
                    nextMedia.map(
                        (
                            mediaItem,
                            mediaIndex
                        ) => {
                            let isCover =
                                mediaItem.is_cover;

                            if (
                                hadCover
                            ) {
                                if (
                                    !coverAssigned &&
                                    mediaItem.media_type !==
                                        "video"
                                ) {
                                    isCover =
                                        true;

                                    coverAssigned =
                                        true;
                                } else {
                                    isCover =
                                        false;
                                }
                            }

                            return {
                                ...mediaItem,

                                is_cover:
                                    isCover,

                                display_order:
                                    mediaIndex +
                                    1,
                            };
                        }
                    );

                onChange(
                    normalized
                );
            } catch (removeError) {
                console.error(
                    "Product media delete failed:",
                    removeError
                );

                setError(
                    removeError
                        ?.response
                        ?.data
                        ?.message ||
                        "Could not remove the media."
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Set Cover
    |--------------------------------------------------------------------------
    */

    const handleSetCover = (
        selectedIndex
    ) => {
        const selected =
            media[
                selectedIndex
            ];

        if (
            selected?.media_type ===
            "video"
        ) {
            return;
        }

        const nextMedia =
            media.map(
                (
                    item,
                    index
                ) => ({
                    ...item,

                    is_cover:
                        index ===
                        selectedIndex,

                    display_order:
                        index + 1,
                })
            );

        onChange(
            nextMedia
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Video
    |--------------------------------------------------------------------------
    */

    const openVideo = () => {
        setVideoError("");
        setVideoUrl("");

        if (onAddVideo) {
            onAddVideo();
            return;
        }

        setVideoModalOpen(true);
    };

    const isSupportedVideoUrl = (
        value
    ) => {
        try {
            const parsed =
                new URL(value);

            const host =
                parsed.hostname
                    .replace(
                        "www.",
                        ""
                    )
                    .toLowerCase();

            return (
                host ===
                    "youtube.com" ||
                host.endsWith(
                    ".youtube.com"
                ) ||
                host ===
                    "youtu.be" ||
                host ===
                    "vimeo.com" ||
                host.endsWith(
                    ".vimeo.com"
                )
            );
        } catch {
            return false;
        }
    };

    const handleAddVideo =
        () => {
            const value =
                videoUrl.trim();

            if (!value) {
                setVideoError(
                    "Enter a video URL."
                );

                return;
            }

            if (
                !isSupportedVideoUrl(
                    value
                )
            ) {
                setVideoError(
                    "Use a valid YouTube or Vimeo URL."
                );

                return;
            }

            onChange([
                ...media,
                {
                    media_type:
                        "video",

                    file_path:
                        null,

                    url:
                        null,

                    external_url:
                        value,

                    alt_text:
                        productTitle ||
                        "",

                    is_cover:
                        false,

                    display_order:
                        media.length +
                        1,
                },
            ]);

            setVideoModalOpen(
                false
            );

            setVideoUrl("");
            setVideoError("");
        };


    return (
        <>
            <section
                onPaste={
                    handlePaste
                }
                className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
                <div className="p-[22px]">
                    {/* Header */}

                    <div className="mb-[15px] flex items-center justify-between gap-3">
                        <h2 className="text-[14px] font-semibold text-[#111827]">
                            Media
                        </h2>

                        <button
                            type="button"
                            onClick={
                                onOpenAiStudio
                            }
                            className="inline-flex h-[30px] items-center gap-[5px] rounded-[7px] bg-gradient-to-r from-[#ff9e46] via-[#f14fd8] to-[#49c8ff] px-[10px] text-[10.5px] font-semibold text-white shadow-sm transition hover:scale-[1.02]"
                        >
                            <Sparkles
                                size={
                                    13
                                }
                            />

                            AI Studio
                        </button>
                    </div>


                    {/* File input */}

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={(
                            event
                        ) =>
                            handleFiles(
                                event
                                    .target
                                    .files
                            )
                        }
                    />


                    {/* Upload area */}

                    <div className="rounded-[14px] border border-dashed border-[#d6dbe2] bg-[#fcfcfd] px-[15px] py-[17px]">
                        <div className="flex flex-wrap items-center justify-center gap-[7px]">
                            <button
                                type="button"
                                disabled={
                                    uploading
                                }
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="inline-flex h-[34px] items-center gap-[6px] rounded-[9px] border border-[#d9dde3] bg-white px-[11px] text-[10.5px] font-semibold text-[#2f3742] shadow-sm transition hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {uploading ? (
                                    <Loader2
                                        size={
                                            13
                                        }
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Upload
                                        size={
                                            13
                                        }
                                    />
                                )}

                                {uploading
                                    ? "Uploading..."
                                    : "Upload new"}
                            </button>

                            <button
                                type="button"
                                disabled={
                                    !onSelectExisting
                                }
                                onClick={() =>
                                    onSelectExisting?.()
                                }
                                title={
                                    onSelectExisting
                                        ? "Select existing media"
                                        : "Media library is not connected yet"
                                }
                                className="inline-flex h-[34px] items-center rounded-[9px] px-[11px] text-[10.5px] font-semibold text-[#424b57] transition hover:bg-[#f2f4f6] disabled:cursor-not-allowed disabled:text-[#a7adb5]"
                            >
                                Select existing
                            </button>

                            <div className="hidden h-[24px] w-px bg-[#e3e6ea] sm:block" />

                            <button
                                type="button"
                                onClick={
                                    openVideo
                                }
                                className="inline-flex h-[34px] items-center gap-[6px] rounded-[9px] border border-[#d9dde3] bg-white px-[11px] text-[10.5px] font-semibold text-[#2f3742] shadow-sm transition hover:bg-[#f8f9fa]"
                            >
                                <Video
                                    size={
                                        14
                                    }
                                    className="text-[#ef233c]"
                                />

                                Add YouTube or Vimeo
                            </button>
                        </div>

                        <p className="mt-[9px] text-center text-[9.5px] text-[#838c97]">
                            Upload JPG, PNG or WebP. You can also paste an image with Ctrl+V.
                        </p>
                    </div>


                    {/* Error */}

                    {error && (
                        <div className="mt-[10px] rounded-[9px] border border-red-100 bg-red-50 px-[10px] py-[8px] text-[10px] text-red-700">
                            {error}
                        </div>
                    )}


                    {/* Media */}

                    {media.length >
                        0 && (
                        <>
                            <div className="mt-[14px] flex flex-wrap gap-[9px]">
                                {media.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const imageUrl =
                                            getImageUrl(
                                                item
                                            );

                                        const isVideo =
                                            item.media_type ===
                                                "video" ||
                                            Boolean(
                                                item.external_url &&
                                                    !item.file_path
                                            );

                                        return (
                                            <div
                                                key={
                                                    item.id ||
                                                    item.file_path ||
                                                    item.external_url ||
                                                    index
                                                }
                                                className="group relative h-[142px] w-[142px] overflow-hidden rounded-[12px] border border-[#dde1e6] bg-[#f6f7f8]"
                                            >
                                                {isVideo ? (
                                                    <div className="flex h-full w-full flex-col items-center justify-center px-[10px] text-center">
                                                        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white shadow-sm">
                                                            <Video
                                                                size={
                                                                    18
                                                                }
                                                                className="text-[#ef233c]"
                                                            />
                                                        </div>

                                                        <p className="mt-[8px] max-w-full truncate text-[9.5px] font-medium text-[#4f5965]">
                                                            Video
                                                        </p>

                                                        <p className="mt-[2px] max-w-full truncate text-[8.5px] text-[#9098a2]">
                                                            {
                                                                item.external_url
                                                            }
                                                        </p>
                                                    </div>
                                                ) : imageUrl ? (
                                                    <img
                                                        src={
                                                            imageUrl
                                                        }
                                                        alt={
                                                            item.alt_text ||
                                                            productTitle ||
                                                            "Product"
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[#9aa2ad]">
                                                        <ImageIcon
                                                            size={
                                                                25
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {item.is_cover &&
                                                    !isVideo && (
                                                    <span className="absolute bottom-[6px] left-[6px] inline-flex items-center gap-[4px] rounded-[5px] bg-[#3f4650] px-[6px] py-[3px] text-[8.5px] font-semibold text-white">
                                                        <Star
                                                            size={
                                                                8
                                                            }
                                                            fill="currentColor"
                                                        />

                                                        Cover
                                                    </span>
                                                )}

                                                <div className="absolute right-[6px] top-[6px] flex gap-[4px] opacity-0 transition group-hover:opacity-100">
                                                    {!isVideo &&
                                                        !item.is_cover && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSetCover(
                                                                    index
                                                                )
                                                            }
                                                            title="Set as cover"
                                                            className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-white/95 text-[#4b5563] shadow-sm transition hover:bg-white"
                                                        >
                                                            <Star
                                                                size={
                                                                    12
                                                                }
                                                            />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(
                                                                item,
                                                                index
                                                            )
                                                        }
                                                        title="Remove media"
                                                        className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-white/95 text-[#6b7280] shadow-sm transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2
                                                            size={
                                                                12
                                                            }
                                                        />
                                                    </button>
                                                </div>

                                                <div className="absolute bottom-[6px] right-[6px] flex h-[19px] w-[19px] items-center justify-center rounded-[5px] bg-white/90 text-[#535c68] shadow-sm">
                                                    {isVideo ? (
                                                        <Video
                                                            size={
                                                                10
                                                            }
                                                        />
                                                    ) : (
                                                        <ImageIcon
                                                            size={
                                                                10
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>

                            <p className="mt-[10px] text-[9.5px] text-[#747d89]">
                                {media.length} / 250 files
                                {" · "}
                                Cover image is used on the storefront.
                            </p>
                        </>
                    )}
                </div>
            </section>


            {/* Video Modal */}

            {videoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[1px]">
                    <div className="w-full max-w-[430px] overflow-hidden rounded-[16px] border border-[#e2e4e8] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#eceef1] px-[18px] py-[14px]">
                            <div>
                                <h3 className="text-[13px] font-semibold text-[#111827]">
                                    Add video
                                </h3>

                                <p className="mt-[2px] text-[9.5px] text-[#858e99]">
                                    Add a YouTube or Vimeo video to this product.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setVideoModalOpen(
                                        false
                                    )
                                }
                                className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-[#818a95] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
                            >
                                <X
                                    size={
                                        14
                                    }
                                />
                            </button>
                        </div>

                        <div className="p-[18px]">
                            <label className="mb-[6px] block text-[10.5px] font-medium text-[#3f4854]">
                                Video URL
                            </label>

                            <input
                                type="url"
                                autoFocus
                                value={
                                    videoUrl
                                }
                                onChange={(
                                    event
                                ) => {
                                    setVideoUrl(
                                        event.target
                                            .value
                                    );

                                    setVideoError(
                                        ""
                                    );
                                }}
                                onKeyDown={(
                                    event
                                ) => {
                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        event.preventDefault();

                                        handleAddVideo();
                                    }
                                }}
                                placeholder="https://youtube.com/watch?v=..."
                                className="h-[38px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[11px] text-[11px] text-[#303945] outline-none transition placeholder:text-[#9da5af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                            />

                            {videoError && (
                                <p className="mt-[6px] text-[9.5px] text-red-600">
                                    {
                                        videoError
                                    }
                                </p>
                            )}

                            <p className="mt-[7px] text-[9px] leading-[14px] text-[#8a939e]">
                                Supported providers: YouTube and Vimeo.
                            </p>
                        </div>

                        <div className="flex justify-end gap-[7px] border-t border-[#eceef1] px-[18px] py-[12px]">
                            <button
                                type="button"
                                onClick={() =>
                                    setVideoModalOpen(
                                        false
                                    )
                                }
                                className="h-[33px] rounded-[8px] border border-[#d9dee4] bg-white px-[12px] text-[10px] font-medium text-[#4f5965] transition hover:bg-[#f8f9fa]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleAddVideo
                                }
                                className="h-[33px] rounded-[8px] bg-[#17191c] px-[13px] text-[10px] font-medium text-white transition hover:bg-[#292c31]"
                            >
                                Add video
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}