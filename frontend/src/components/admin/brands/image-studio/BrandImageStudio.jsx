import {
    Eye,
    ImagePlus,
    Maximize,
    Minus,
    Plus,
    WandSparkles,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import ImageStudioEffects from "./ImageStudioEffects";
import ImageStudioQuickPrompt from "./ImageStudioQuickPrompt";


const initialEffects = {
    brightness: 0,
    exposure: 0,
    contrast: 0,
    highlights: 0,
    shadows: 0,
    vignette: 0,
    saturation: 0,
    warmth: 0,
};


const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 520;


export default function BrandImageStudio({
    open,
    file,
    previewUrl,
    onClose,
    onSave,
    entityLabel = "brand",
    mediaLabel = "Logo",
    defaultFileName = "brand-image.png",
}) {
    const canvasRef = useRef(null);

    const imageRef = useRef(null);

    const transparentImageCanvasRef =
        useRef(null);

    const localObjectUrlRef =
        useRef(null);


    const [
        tab,
        setTab,
    ] = useState("quick");


    const [
        effects,
        setEffects,
    ] = useState(initialEffects);


    const [
        background,
        setBackground,
    ] = useState("white");


    const [
        zoom,
        setZoom,
    ] = useState(100);


    const [
        compare,
        setCompare,
    ] = useState(false);


    const [
        backgroundRemoved,
        setBackgroundRemoved,
    ] = useState(false);


    const [
        processingBackground,
        setProcessingBackground,
    ] = useState(false);


    const [
        workingPreviewUrl,
        setWorkingPreviewUrl,
    ] = useState("");


    const [
        workingFile,
        setWorkingFile,
    ] = useState(null);


    useEffect(() => {
        if (!open) {
            return;
        }

        setWorkingPreviewUrl(
            previewUrl || ""
        );

        setWorkingFile(
            file || null
        );

        setEffects({
            ...initialEffects,
        });

        setBackground("white");
        setZoom(100);
        setCompare(false);
        setBackgroundRemoved(false);

        transparentImageCanvasRef.current =
            null;
    }, [
        open,
        previewUrl,
        file,
    ]);


    useEffect(() => {
        return () => {
            if (
                localObjectUrlRef.current
            ) {
                URL.revokeObjectURL(
                    localObjectUrlRef.current
                );
            }
        };
    }, []);


    useEffect(() => {
        if (
            !open ||
            !workingPreviewUrl
        ) {
            return;
        }

        const image =
            new Image();

        image.onload = () => {
            imageRef.current =
                image;

            transparentImageCanvasRef.current =
                null;

            setBackgroundRemoved(
                false
            );

            requestAnimationFrame(
                () => {
                    renderCanvas();
                }
            );
        };

        image.onerror = () => {
            console.error(
                "Unable to load image into Image Studio."
            );
        };

        image.src =
            workingPreviewUrl;
    }, [
        open,
        workingPreviewUrl,
    ]);


    useEffect(() => {
        if (
            open &&
            imageRef.current
        ) {
            renderCanvas();
        }
    }, [
        effects,
        background,
        zoom,
        compare,
        backgroundRemoved,
        open,
    ]);


    const renderCanvas = () => {
        const canvas =
            canvasRef.current;

        const image =
            imageRef.current;

        if (
            !canvas ||
            !image
        ) {
            return;
        }

        const context =
            canvas.getContext(
                "2d",
                {
                    willReadFrequently: true,
                }
            );

        if (!context) {
            return;
        }

        canvas.width =
            CANVAS_WIDTH;

        canvas.height =
            CANVAS_HEIGHT;


        context.clearRect(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
        );


        context.imageSmoothingEnabled =
            true;

        context.imageSmoothingQuality =
            "high";

        context.globalAlpha =
            1;

        context.globalCompositeOperation =
            "source-over";

        context.filter =
            "none";


        if (compare) {
            drawBackground(
                context,
                CANVAS_WIDTH,
                CANVAS_HEIGHT,
                "white"
            );

            drawSourceImage({
                context,
                source: image,
                canvasWidth:
                    CANVAS_WIDTH,
                canvasHeight:
                    CANVAS_HEIGHT,
                zoom,
                applyEffects: false,
                effects:
                    initialEffects,
            });

            return;
        }


        drawBackground(
            context,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            background
        );


        const source =
            backgroundRemoved &&
                transparentImageCanvasRef.current
                ? transparentImageCanvasRef.current
                : image;


        drawSourceImage({
            context,
            source,
            canvasWidth:
                CANVAS_WIDTH,
            canvasHeight:
                CANVAS_HEIGHT,
            zoom,
            applyEffects: true,
            effects,
        });
    };


    const handleBackgroundChange =
        async (type) => {
            setBackground(type);

            /*
             * White background does not need
             * automatic background removal.
             */
            if (
                type ===
                "white"
            ) {
                return;
            }

            /*
             * Remove the original image background
             * only once before applying another preset.
             */
            if (
                !backgroundRemoved &&
                imageRef.current
            ) {
                await removeBackground(
                    true
                );
            }
        };


    const removeBackground =
        async (
            silent = false
        ) => {
            const image =
                imageRef.current;

            if (
                !image ||
                processingBackground
            ) {
                return;
            }

            setProcessingBackground(
                true
            );

            try {
                /*
                 * Preserve more of the original
                 * image resolution while processing.
                 */
                const maxDimension =
                    2200;

                const naturalWidth =
                    image.naturalWidth ||
                    image.width;

                const naturalHeight =
                    image.naturalHeight ||
                    image.height;

                const processingScale =
                    Math.min(
                        1,
                        maxDimension /
                        Math.max(
                            naturalWidth,
                            naturalHeight
                        )
                    );

                const width =
                    Math.max(
                        1,
                        Math.round(
                            naturalWidth *
                            processingScale
                        )
                    );

                const height =
                    Math.max(
                        1,
                        Math.round(
                            naturalHeight *
                            processingScale
                        )
                    );


                const sourceCanvas =
                    document.createElement(
                        "canvas"
                    );

                sourceCanvas.width =
                    width;

                sourceCanvas.height =
                    height;


                const sourceContext =
                    sourceCanvas.getContext(
                        "2d",
                        {
                            willReadFrequently:
                                true,
                        }
                    );

                if (!sourceContext) {
                    throw new Error(
                        "Unable to create image processing canvas."
                    );
                }


                sourceContext.clearRect(
                    0,
                    0,
                    width,
                    height
                );

                sourceContext.imageSmoothingEnabled =
                    true;

                sourceContext.imageSmoothingQuality =
                    "high";


                sourceContext.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                const imageData =
                    sourceContext.getImageData(
                        0,
                        0,
                        width,
                        height
                    );

                const data =
                    imageData.data;


                /*
                 * If the logo is already a transparent
                 * PNG/WebP, preserve it exactly.
                 */
                const transparentBorderRatio =
                    getTransparentBorderRatio(
                        data,
                        width,
                        height
                    );

                if (
                    transparentBorderRatio >=
                    0.55
                ) {
                    transparentImageCanvasRef.current =
                        sourceCanvas;

                    setBackgroundRemoved(
                        true
                    );

                    requestAnimationFrame(
                        () => {
                            renderCanvas();
                        }
                    );

                    return;
                }


                /*
                 * Detect the source background by
                 * sampling the four corners.
                 */
                const cornerColors =
                    getCornerBackgroundColors(
                        data,
                        width,
                        height
                    );


                const totalPixels =
                    width *
                    height;

                const visited =
                    new Uint8Array(
                        totalPixels
                    );

                const queue =
                    new Int32Array(
                        totalPixels
                    );

                let queueStart =
                    0;

                let queueEnd =
                    0;


                /*
                 * Lower threshold = safer foreground.
                 *
                 * 28 removes pixels that are clearly
                 * background.
                 *
                 * 60 gives a small feather zone around
                 * anti-aliased edges.
                 */
                const solidBackgroundThreshold =
                    28;

                const featherEndThreshold =
                    60;


                const getDistance = (
                    x,
                    y
                ) => {
                    const pixelIndex =
                        (
                            y *
                            width +
                            x
                        ) *
                        4;

                    return getBackgroundDistance(
                        data,
                        pixelIndex,
                        x,
                        y,
                        width,
                        height,
                        cornerColors
                    );
                };


                const addCandidate = (
                    x,
                    y
                ) => {
                    if (
                        x < 0 ||
                        y < 0 ||
                        x >= width ||
                        y >= height
                    ) {
                        return;
                    }

                    const pixel =
                        y *
                        width +
                        x;

                    if (
                        visited[
                        pixel
                        ]
                    ) {
                        return;
                    }

                    const dataIndex =
                        pixel *
                        4;

                    const alpha =
                        data[
                        dataIndex +
                        3
                        ];

                    /*
                     * Existing transparent pixel.
                     */
                    if (
                        alpha <=
                        10
                    ) {
                        visited[
                            pixel
                        ] = 1;

                        queue[
                            queueEnd
                        ] = pixel;

                        queueEnd++;

                        return;
                    }

                    const distance =
                        getDistance(
                            x,
                            y
                        );

                    /*
                     * Do not enter logo/object pixels.
                     */
                    if (
                        distance >
                        featherEndThreshold
                    ) {
                        return;
                    }

                    visited[
                        pixel
                    ] = 1;

                    queue[
                        queueEnd
                    ] = pixel;

                    queueEnd++;
                };


                /*
                 * Start only from outer border.
                 */
                for (
                    let x = 0;
                    x < width;
                    x++
                ) {
                    addCandidate(
                        x,
                        0
                    );

                    addCandidate(
                        x,
                        height - 1
                    );
                }


                for (
                    let y = 1;
                    y <
                    height - 1;
                    y++
                ) {
                    addCandidate(
                        0,
                        y
                    );

                    addCandidate(
                        width - 1,
                        y
                    );
                }


                while (
                    queueStart <
                    queueEnd
                ) {
                    const pixel =
                        queue[
                        queueStart
                        ];

                    queueStart++;


                    const x =
                        pixel %
                        width;

                    const y =
                        Math.floor(
                            pixel /
                            width
                        );

                    const dataIndex =
                        pixel *
                        4;

                    const originalAlpha =
                        data[
                        dataIndex +
                        3
                        ];

                    const distance =
                        getDistance(
                            x,
                            y
                        );


                    if (
                        originalAlpha <=
                        10
                    ) {
                        data[
                            dataIndex +
                            3
                        ] = 0;
                    } else if (
                        distance <=
                        solidBackgroundThreshold
                    ) {
                        /*
                         * True background.
                         */
                        data[
                            dataIndex +
                            3
                        ] = 0;
                    } else {
                        /*
                         * Small feather zone.
                         *
                         * This preserves smooth logo edges
                         * without making the entire logo faded.
                         */
                        const progress =
                            (
                                distance -
                                solidBackgroundThreshold
                            ) /
                            (
                                featherEndThreshold -
                                solidBackgroundThreshold
                            );

                        const safeProgress =
                            Math.max(
                                0,
                                Math.min(
                                    1,
                                    progress
                                )
                            );

                        data[
                            dataIndex +
                            3
                        ] =
                            Math.round(
                                originalAlpha *
                                safeProgress
                            );
                    }


                    addCandidate(
                        x - 1,
                        y
                    );

                    addCandidate(
                        x + 1,
                        y
                    );

                    addCandidate(
                        x,
                        y - 1
                    );

                    addCandidate(
                        x,
                        y + 1
                    );
                }


                sourceContext.putImageData(
                    imageData,
                    0,
                    0
                );


                transparentImageCanvasRef.current =
                    sourceCanvas;


                setBackgroundRemoved(
                    true
                );


                requestAnimationFrame(
                    () => {
                        renderCanvas();
                    }
                );
            } catch (error) {
                console.error(
                    "Background removal failed:",
                    error
                );

                if (!silent) {
                    alert(
                        "Unable to remove this image background."
                    );
                }
            } finally {
                setProcessingBackground(
                    false
                );
            }
        };


    const enhanceImage = () => {
        setEffects({
            brightness: 4,
            exposure: 3,
            contrast: 10,
            highlights: -6,
            shadows: 7,
            vignette: 0,
            saturation: 10,
            warmth: 2,
        });
    };


    const resetEffects = () => {
        setEffects({
            ...initialEffects,
        });
    };


    const fitImage = () => {
        setZoom(100);
    };


    const handleStudioUpload =
        (event) => {
            const selectedFile =
                event.target
                    .files?.[0];

            if (!selectedFile) {
                return;
            }

            const allowedTypes = [
                "image/png",
                "image/jpeg",
                "image/webp",
            ];

            if (
                !allowedTypes.includes(
                    selectedFile.type
                )
            ) {
                return;
            }

            if (
                localObjectUrlRef.current
            ) {
                URL.revokeObjectURL(
                    localObjectUrlRef.current
                );
            }

            const objectUrl =
                URL.createObjectURL(
                    selectedFile
                );

            localObjectUrlRef.current =
                objectUrl;

            setWorkingFile(
                selectedFile
            );

            setWorkingPreviewUrl(
                objectUrl
            );

            setEffects({
                ...initialEffects,
            });

            setBackground(
                "white"
            );

            setBackgroundRemoved(
                false
            );

            transparentImageCanvasRef.current =
                null;

            event.target.value =
                "";
        };


    const saveImage = () => {
        const canvas =
            canvasRef.current;

        if (!canvas) {
            return;
        }

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    return;
                }

                const originalName =
                    workingFile?.name ||
                    file?.name ||
                    defaultFileName;

                const baseName =
                    originalName.replace(
                        /\.[^.]+$/,
                        ""
                    );

                const editedFile =
                    new File(
                        [
                            blob,
                        ],
                        `${baseName}-edited.png`,
                        {
                            type:
                                "image/png",
                        }
                    );

                onSave(
                    editedFile
                );
            },
            "image/png",
            1
        );
    };


    const exportImage = () => {
        const canvas =
            canvasRef.current;

        if (!canvas) {
            return;
        }

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    return;
                }

                const url =
                    URL.createObjectURL(
                        blob
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    url;

                link.download =
                    defaultFileName;

                document.body.appendChild(
                    link
                );

                link.click();

                document.body.removeChild(
                    link
                );

                URL.revokeObjectURL(
                    url
                );
            },
            "image/png",
            1
        );
    };


    const handleClose = () => {
        setCompare(false);

        onClose();
    };


    if (!open) {
        return null;
    }


    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#f5f5f5]">

            <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-[#e4e6e9] bg-white px-[24px]">

                <div className="flex items-center gap-[8px] text-[12px]">

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        className="text-[#343d48]"
                    >
                        ←
                    </button>


                    <span className="text-[#565f69]">
                        Edit {entityLabel}
                    </span>


                    <span className="text-[#9ba1a9]">
                        /
                    </span>


                    <span className="text-[#565f69]">
                        {mediaLabel}
                    </span>



                    <span className="text-[#9ba1a9]">
                        /
                    </span>

                    <span className="font-semibold text-[#171d25]">
                        AI Image Studio
                    </span>

                </div>


                <button
                    type="button"
                    onClick={
                        handleClose
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#737c87] transition hover:bg-[#f3f4f6]"
                >
                    <X
                        size={16}
                    />
                </button>

            </div>


            <div className="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)_315px] gap-[8px] p-[12px]">

                <aside className="overflow-hidden rounded-[12px] border border-[#e0e3e7] bg-white">

                    <div className="px-[15px] py-[14px] text-[12px] font-semibold text-[#151b24]">
                        Media
                    </div>


                    <div className="grid grid-cols-2 gap-[10px] px-[15px]">

                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-[9px] border border-[#dfe3e8] text-[#316ff4] transition hover:border-[#316ff4] hover:bg-[#f8faff]">

                            <ImagePlus
                                size={20}
                            />

                            <span className="mt-2 text-[9px] text-[#717985]">
                                Upload Image
                            </span>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={
                                    handleStudioUpload
                                }
                                className="hidden"
                            />

                        </label>


                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[9px] border-2 border-[#316ff4] bg-white p-2">

                            {workingPreviewUrl ? (
                                <img
                                    src={
                                        workingPreviewUrl
                                    }
                                    alt="Brand"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-[9px] text-[#9aa1aa]">
                                    No image
                                </span>
                            )}

                        </div>

                    </div>

                </aside>


                <main className="flex min-w-0 flex-col gap-[8px]">

                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-[#e0e3e7] bg-white">

                        <div className="flex h-[45px] shrink-0 items-center justify-between border-b border-[#e5e7ea] px-[10px]">

                            <div className="flex items-center gap-[6px]">

                                <div className="flex h-[32px] items-center overflow-hidden rounded-[9px] border border-[#e0e3e7] bg-white">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setZoom(
                                                (
                                                    current
                                                ) =>
                                                    Math.max(
                                                        25,
                                                        current -
                                                        10
                                                    )
                                            )
                                        }
                                        className="flex h-full w-8 items-center justify-center transition hover:bg-[#f6f7f8]"
                                    >
                                        <Minus
                                            size={13}
                                        />
                                    </button>


                                    <span className="min-w-[53px] text-center text-[10.5px] font-medium text-[#343d48]">
                                        {zoom}%
                                    </span>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setZoom(
                                                (
                                                    current
                                                ) =>
                                                    Math.min(
                                                        200,
                                                        current +
                                                        10
                                                    )
                                            )
                                        }
                                        className="flex h-full w-8 items-center justify-center transition hover:bg-[#f6f7f8]"
                                    >
                                        <Plus
                                            size={13}
                                        />
                                    </button>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        fitImage
                                    }
                                    className="inline-flex h-[32px] items-center gap-1 rounded-[9px] border border-[#e0e3e7] bg-white px-[10px] text-[10.5px] text-[#343d48] transition hover:bg-[#f6f7f8]"
                                >
                                    <Maximize
                                        size={13}
                                    />

                                    Fit
                                </button>


                                <button
                                    type="button"
                                    onMouseDown={() =>
                                        setCompare(
                                            true
                                        )
                                    }
                                    onMouseUp={() =>
                                        setCompare(
                                            false
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setCompare(
                                            false
                                        )
                                    }
                                    onTouchStart={() =>
                                        setCompare(
                                            true
                                        )
                                    }
                                    onTouchEnd={() =>
                                        setCompare(
                                            false
                                        )
                                    }
                                    className="inline-flex h-[32px] items-center gap-1 rounded-[9px] border border-[#e0e3e7] bg-white px-[10px] text-[10.5px] text-[#343d48] transition hover:bg-[#f6f7f8]"
                                >
                                    <Eye
                                        size={13}
                                    />

                                    Compare
                                </button>

                            </div>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        handleClose
                                    }
                                    className="h-[32px] rounded-[10px] border border-[#e0e3e7] bg-white px-[15px] text-[10.5px] font-medium text-[#303944] transition hover:bg-[#f6f7f8]"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        saveImage
                                    }
                                    className="h-[32px] rounded-[10px] bg-[#7e9ff4] px-[17px] text-[10.5px] font-semibold text-white transition hover:bg-[#668bef]"
                                >
                                    Save
                                </button>

                            </div>

                        </div>


                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#f7f7f7] p-[18px]">

                            <canvas
                                ref={
                                    canvasRef
                                }
                                className="max-h-full max-w-full bg-white shadow-sm"
                            />

                        </div>

                    </div>


                    <div className="relative min-h-[170px] overflow-hidden rounded-[12px] border border-[#e0e3e7] bg-white p-[15px]">

                        <div className="absolute inset-x-0 bottom-0 h-[7px] bg-gradient-to-r from-[#d331e7] via-[#fa42b3] via-[#ffd84c] to-[#ffaf00]" />


                        <div className="flex flex-wrap gap-[18px]">

                            <ToolButton
                                label={
                                    processingBackground
                                        ? "Removing..."
                                        : backgroundRemoved
                                            ? "Background Removed"
                                            : "Remove Background"
                                }
                                onClick={() =>
                                    removeBackground(
                                        false
                                    )
                                }
                                disabled={
                                    processingBackground
                                }
                                active={
                                    backgroundRemoved
                                }
                            />


                            <ToolButton
                                label="Enhance"
                                onClick={
                                    enhanceImage
                                }
                            />


                            <ToolButton
                                label="Upscale"
                                disabled
                                title="Upscale will be connected in the next image tools step."
                            />


                            <ToolButton
                                label="Erase Object"
                                disabled
                                title="Manual object erasing will be connected in the next image tools step."
                            />


                            <ToolButton
                                label="Resize"
                                disabled
                                title="Resize will be connected in the next image tools step."
                            />


                            <ToolButton
                                label="Expand"
                                disabled
                                title="Expand will be connected in the next image tools step."
                            />


                            <ToolButton
                                label="Export"
                                onClick={
                                    exportImage
                                }
                            />

                        </div>


                        <p className="mt-[22px] text-[11px] text-[#7e8792]">
                            Choose a background, enhance the logo, adjust effects, or export the final result.
                        </p>


                        {backgroundRemoved && (
                            <p className="mt-[6px] text-[10px] font-medium text-[#19a567]">
                                Background separated. Background presets are now applied behind the logo.
                            </p>
                        )}

                    </div>

                </main>


                <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#e0e3e7] bg-white">

                    <div className="grid h-[43px] shrink-0 grid-cols-2 border-b border-[#e4e7eb]">

                        <button
                            type="button"
                            onClick={() =>
                                setTab(
                                    "quick"
                                )
                            }
                            className={[
                                "relative",
                                "text-[11px]",
                                tab ===
                                    "quick"
                                    ? "font-medium text-[#316ff4]"
                                    : "text-[#555e69]",
                            ].join(" ")}
                        >
                            Quick Prompt

                            {tab ===
                                "quick" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#316ff4]" />
                                )}
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                setTab(
                                    "effects"
                                )
                            }
                            className={[
                                "relative",
                                "text-[11px]",
                                tab ===
                                    "effects"
                                    ? "font-medium text-[#316ff4]"
                                    : "text-[#555e69]",
                            ].join(" ")}
                        >
                            Effects

                            {tab ===
                                "effects" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#316ff4]" />
                                )}
                        </button>

                    </div>


                    <div className="min-h-0 flex-1">

                        {tab ===
                            "quick" ? (
                            <ImageStudioQuickPrompt
                                background={
                                    background
                                }
                                onBackgroundChange={
                                    handleBackgroundChange
                                }
                            />
                        ) : (
                            <ImageStudioEffects
                                effects={
                                    effects
                                }
                                setEffects={
                                    setEffects
                                }
                                onApply={
                                    renderCanvas
                                }
                                onReset={
                                    resetEffects
                                }
                            />
                        )}

                    </div>

                </aside>

            </div>

        </div>
    );
}


function ToolButton({
    label,
    onClick,
    disabled = false,
    active = false,
    title = "",
}) {
    return (
        <button
            type="button"
            onClick={
                disabled
                    ? undefined
                    : onClick
            }
            disabled={
                disabled
            }
            title={
                title
            }
            className={[
                "inline-flex",
                "items-center",
                "gap-[6px]",
                "text-[10.5px]",
                "font-medium",
                "transition",
                disabled
                    ? "cursor-not-allowed text-[#b4bac1]"
                    : active
                        ? "text-[#18a567]"
                        : "text-[#343d48] hover:text-[#316ff4]",
            ].join(" ")}
        >
            <WandSparkles
                size={13}
            />

            {label}
        </button>
    );
}


function drawSourceImage({
    context,
    source,
    canvasWidth,
    canvasHeight,
    zoom,
    applyEffects,
    effects,
}) {
    const sourceWidth =
        source.naturalWidth ||
        source.width;

    const sourceHeight =
        source.naturalHeight ||
        source.height;


    if (
        !sourceWidth ||
        !sourceHeight
    ) {
        return;
    }


    const objectCanvas =
        document.createElement(
            "canvas"
        );

    objectCanvas.width =
        canvasWidth;

    objectCanvas.height =
        canvasHeight;


    const objectContext =
        objectCanvas.getContext(
            "2d",
            {
                willReadFrequently:
                    true,
            }
        );

    if (!objectContext) {
        return;
    }


    /*
     * Important for sharp logo rendering.
     */
    objectContext.imageSmoothingEnabled =
        true;

    objectContext.imageSmoothingQuality =
        "high";

    objectContext.globalAlpha =
        1;

    objectContext.globalCompositeOperation =
        "source-over";

    objectContext.filter =
        "none";


    const availableWidth =
        canvasWidth *
        0.72;

    const availableHeight =
        canvasHeight *
        0.72;


    const fitScale =
        Math.min(
            availableWidth /
            sourceWidth,
            availableHeight /
            sourceHeight,
            1
        );


    const scale =
        fitScale *
        (
            zoom /
            100
        );


    const drawWidth =
        sourceWidth *
        scale;

    const drawHeight =
        sourceHeight *
        scale;


    const x =
        (
            canvasWidth -
            drawWidth
        ) /
        2;

    const y =
        (
            canvasHeight -
            drawHeight
        ) /
        2;


    objectContext.drawImage(
        source,
        x,
        y,
        drawWidth,
        drawHeight
    );


    if (applyEffects) {
        applyPixelEffects(
            objectContext,
            canvasWidth,
            canvasHeight,
            effects
        );
    }


    context.save();

    context.imageSmoothingEnabled =
        true;

    context.imageSmoothingQuality =
        "high";

    context.globalAlpha =
        1;

    context.globalCompositeOperation =
        "source-over";

    context.filter =
        "none";


    context.drawImage(
        objectCanvas,
        0,
        0
    );


    context.restore();
}


function drawBackground(
    context,
    width,
    height,
    type
) {
    context.save();

    context.globalAlpha =
        1;

    context.globalCompositeOperation =
        "source-over";

    context.filter =
        "none";


    if (
        type ===
        "white"
    ) {
        context.fillStyle =
            "#ffffff";

        context.fillRect(
            0,
            0,
            width,
            height
        );

        context.restore();

        return;
    }


    if (
        type ===
        "lifestyle"
    ) {
        const wall =
            context.createLinearGradient(
                0,
                0,
                width,
                height *
                0.72
            );

        wall.addColorStop(
            0,
            "#f8f2e9"
        );

        wall.addColorStop(
            1,
            "#dce8df"
        );

        context.fillStyle =
            wall;

        context.fillRect(
            0,
            0,
            width,
            height *
            0.72
        );


        const floor =
            context.createLinearGradient(
                0,
                height *
                0.72,
                0,
                height
            );

        floor.addColorStop(
            0,
            "#d2c4b3"
        );

        floor.addColorStop(
            1,
            "#b29e88"
        );

        context.fillStyle =
            floor;

        context.fillRect(
            0,
            height *
            0.72,
            width,
            height *
            0.28
        );


        const light =
            context.createRadialGradient(
                width *
                0.25,
                height *
                0.18,
                10,
                width *
                0.25,
                height *
                0.18,
                width *
                0.48
            );

        light.addColorStop(
            0,
            "rgba(255,255,255,0.85)"
        );

        light.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        context.fillStyle =
            light;

        context.fillRect(
            0,
            0,
            width,
            height
        );

        context.restore();

        return;
    }


    if (
        type ===
        "desk"
    ) {
        const wall =
            context.createLinearGradient(
                0,
                0,
                width,
                height
            );

        wall.addColorStop(
            0,
            "#f1f3f5"
        );

        wall.addColorStop(
            1,
            "#b9c2cc"
        );

        context.fillStyle =
            wall;

        context.fillRect(
            0,
            0,
            width,
            height
        );


        context.fillStyle =
            "#c59b72";

        context.fillRect(
            0,
            height *
            0.73,
            width,
            height *
            0.27
        );


        context.fillStyle =
            "rgba(255,255,255,0.35)";

        context.fillRect(
            width *
            0.08,
            height *
            0.12,
            width *
            0.25,
            height *
            0.38
        );

        context.restore();

        return;
    }


    if (
        type ===
        "gradient"
    ) {
        const gradient =
            context.createLinearGradient(
                0,
                0,
                width,
                height
            );

        gradient.addColorStop(
            0,
            "#dbeafe"
        );

        gradient.addColorStop(
            0.45,
            "#ede9fe"
        );

        gradient.addColorStop(
            1,
            "#fce7f3"
        );

        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            width,
            height
        );


        const glow =
            context.createRadialGradient(
                width *
                0.65,
                height *
                0.4,
                20,
                width *
                0.65,
                height *
                0.4,
                width *
                0.5
            );

        glow.addColorStop(
            0,
            "rgba(255,255,255,0.6)"
        );

        glow.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        context.fillStyle =
            glow;

        context.fillRect(
            0,
            0,
            width,
            height
        );

        context.restore();

        return;
    }


    if (
        type ===
        "neon"
    ) {
        const gradient =
            context.createLinearGradient(
                0,
                0,
                width,
                height
            );

        gradient.addColorStop(
            0,
            "#080d1a"
        );

        gradient.addColorStop(
            0.45,
            "#282369"
        );

        gradient.addColorStop(
            1,
            "#9d174d"
        );

        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            width,
            height
        );


        const cyanGlow =
            context.createRadialGradient(
                width *
                0.25,
                height *
                0.35,
                10,
                width *
                0.25,
                height *
                0.35,
                width *
                0.35
            );

        cyanGlow.addColorStop(
            0,
            "rgba(34,211,238,0.35)"
        );

        cyanGlow.addColorStop(
            1,
            "rgba(34,211,238,0)"
        );

        context.fillStyle =
            cyanGlow;

        context.fillRect(
            0,
            0,
            width,
            height
        );


        const pinkGlow =
            context.createRadialGradient(
                width *
                0.75,
                height *
                0.55,
                10,
                width *
                0.75,
                height *
                0.55,
                width *
                0.35
            );

        pinkGlow.addColorStop(
            0,
            "rgba(236,72,153,0.45)"
        );

        pinkGlow.addColorStop(
            1,
            "rgba(236,72,153,0)"
        );

        context.fillStyle =
            pinkGlow;

        context.fillRect(
            0,
            0,
            width,
            height
        );

        context.restore();

        return;
    }


    context.fillStyle =
        "#ffffff";

    context.fillRect(
        0,
        0,
        width,
        height
    );

    context.restore();
}


function applyPixelEffects(
    context,
    width,
    height,
    effects
) {
    let imageData;

    try {
        imageData =
            context.getImageData(
                0,
                0,
                width,
                height
            );
    } catch (error) {
        console.error(
            "Canvas pixel access failed.",
            error
        );

        return;
    }


    const data =
        imageData.data;


    const contrastValue =
        Math.max(
            -254,
            Math.min(
                254,
                effects.contrast
            )
        );


    const contrastFactor =
        (
            259 *
            (
                contrastValue +
                255
            )
        ) /
        (
            255 *
            (
                259 -
                contrastValue
            )
        );


    for (
        let index = 0;
        index <
        data.length;
        index += 4
    ) {
        if (
            data[
            index + 3
            ] === 0
        ) {
            continue;
        }


        let red =
            data[index];

        let green =
            data[
            index + 1
            ];

        let blue =
            data[
            index + 2
            ];


        const brightness =
            effects.brightness *
            1.5;

        red +=
            brightness;

        green +=
            brightness;

        blue +=
            brightness;


        const exposureMultiplier =
            Math.pow(
                2,
                effects.exposure /
                100
            );

        red *=
            exposureMultiplier;

        green *=
            exposureMultiplier;

        blue *=
            exposureMultiplier;


        red =
            contrastFactor *
            (
                red -
                128
            ) +
            128;

        green =
            contrastFactor *
            (
                green -
                128
            ) +
            128;

        blue =
            contrastFactor *
            (
                blue -
                128
            ) +
            128;


        const luminance =
            0.299 *
            red +
            0.587 *
            green +
            0.114 *
            blue;


        if (
            effects.highlights !==
            0
        ) {
            const highlightWeight =
                Math.pow(
                    Math.max(
                        0,
                        luminance /
                        255
                    ),
                    2
                );

            const highlightAdjustment =
                effects.highlights *
                0.75 *
                highlightWeight;

            red +=
                highlightAdjustment;

            green +=
                highlightAdjustment;

            blue +=
                highlightAdjustment;
        }


        if (
            effects.shadows !==
            0
        ) {
            const shadowWeight =
                Math.pow(
                    Math.max(
                        0,
                        1 -
                        luminance /
                        255
                    ),
                    2
                );

            const shadowAdjustment =
                effects.shadows *
                0.75 *
                shadowWeight;

            red +=
                shadowAdjustment;

            green +=
                shadowAdjustment;

            blue +=
                shadowAdjustment;
        }


        const gray =
            0.299 *
            red +
            0.587 *
            green +
            0.114 *
            blue;


        const saturation =
            1 +
            effects.saturation /
            100;


        red =
            gray +
            (
                red -
                gray
            ) *
            saturation;

        green =
            gray +
            (
                green -
                gray
            ) *
            saturation;

        blue =
            gray +
            (
                blue -
                gray
            ) *
            saturation;


        const warmth =
            effects.warmth *
            0.55;

        red +=
            warmth;

        green +=
            warmth *
            0.08;

        blue -=
            warmth;


        data[index] =
            clamp(
                red
            );

        data[
            index + 1
        ] =
            clamp(
                green
            );

        data[
            index + 2
        ] =
            clamp(
                blue
            );
    }


    context.putImageData(
        imageData,
        0,
        0
    );


    if (
        effects.vignette >
        0
    ) {
        const gradient =
            context.createRadialGradient(
                width / 2,
                height / 2,
                Math.min(
                    width,
                    height
                ) *
                0.23,
                width / 2,
                height / 2,
                Math.max(
                    width,
                    height
                ) *
                0.68
            );

        gradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        gradient.addColorStop(
            1,
            `rgba(0,0,0,${effects.vignette /
            170
            })`
        );

        context.fillStyle =
            gradient;

        context.fillRect(
            0,
            0,
            width,
            height
        );
    }
}


function getTransparentBorderRatio(
    data,
    width,
    height
) {
    let transparent =
        0;

    let total =
        0;


    const checkPixel = (
        x,
        y
    ) => {
        const index =
            (
                y *
                width +
                x
            ) *
            4 +
            3;

        total++;

        if (
            data[index] <=
            20
        ) {
            transparent++;
        }
    };


    for (
        let x = 0;
        x < width;
        x++
    ) {
        checkPixel(
            x,
            0
        );

        checkPixel(
            x,
            height - 1
        );
    }


    for (
        let y = 1;
        y <
        height - 1;
        y++
    ) {
        checkPixel(
            0,
            y
        );

        checkPixel(
            width - 1,
            y
        );
    }


    if (!total) {
        return 0;
    }


    return (
        transparent /
        total
    );
}


function getCornerBackgroundColors(
    data,
    width,
    height
) {
    const patchSize =
        Math.max(
            3,
            Math.min(
                18,
                Math.round(
                    Math.min(
                        width,
                        height
                    ) *
                    0.035
                )
            )
        );


    return {
        topLeft:
            sampleCornerColor(
                data,
                width,
                height,
                0,
                0,
                patchSize
            ),

        topRight:
            sampleCornerColor(
                data,
                width,
                height,
                width -
                patchSize,
                0,
                patchSize
            ),

        bottomLeft:
            sampleCornerColor(
                data,
                width,
                height,
                0,
                height -
                patchSize,
                patchSize
            ),

        bottomRight:
            sampleCornerColor(
                data,
                width,
                height,
                width -
                patchSize,
                height -
                patchSize,
                patchSize
            ),
    };
}


function sampleCornerColor(
    data,
    width,
    height,
    startX,
    startY,
    size
) {
    const reds = [];
    const greens = [];
    const blues = [];


    const endX =
        Math.min(
            width,
            startX +
            size
        );

    const endY =
        Math.min(
            height,
            startY +
            size
        );


    for (
        let y =
            Math.max(
                0,
                startY
            );
        y < endY;
        y++
    ) {
        for (
            let x =
                Math.max(
                    0,
                    startX
                );
            x < endX;
            x++
        ) {
            const index =
                (
                    y *
                    width +
                    x
                ) *
                4;

            const alpha =
                data[
                index +
                3
                ];

            if (
                alpha <=
                20
            ) {
                continue;
            }

            reds.push(
                data[index]
            );

            greens.push(
                data[
                index +
                1
                ]
            );

            blues.push(
                data[
                index +
                2
                ]
            );
        }
    }


    if (!reds.length) {
        return {
            red: 255,
            green: 255,
            blue: 255,
        };
    }


    return {
        red:
            median(
                reds
            ),

        green:
            median(
                greens
            ),

        blue:
            median(
                blues
            ),
    };
}


function getExpectedBackgroundColor(
    x,
    y,
    width,
    height,
    corners
) {
    const horizontal =
        width > 1
            ? x /
            (
                width -
                1
            )
            : 0;

    const vertical =
        height > 1
            ? y /
            (
                height -
                1
            )
            : 0;


    const topRed =
        lerp(
            corners.topLeft.red,
            corners.topRight.red,
            horizontal
        );

    const topGreen =
        lerp(
            corners.topLeft.green,
            corners.topRight.green,
            horizontal
        );

    const topBlue =
        lerp(
            corners.topLeft.blue,
            corners.topRight.blue,
            horizontal
        );


    const bottomRed =
        lerp(
            corners.bottomLeft.red,
            corners.bottomRight.red,
            horizontal
        );

    const bottomGreen =
        lerp(
            corners.bottomLeft.green,
            corners.bottomRight.green,
            horizontal
        );

    const bottomBlue =
        lerp(
            corners.bottomLeft.blue,
            corners.bottomRight.blue,
            horizontal
        );


    return {
        red:
            lerp(
                topRed,
                bottomRed,
                vertical
            ),

        green:
            lerp(
                topGreen,
                bottomGreen,
                vertical
            ),

        blue:
            lerp(
                topBlue,
                bottomBlue,
                vertical
            ),
    };
}


function getBackgroundDistance(
    data,
    index,
    x,
    y,
    width,
    height,
    corners
) {
    const expected =
        getExpectedBackgroundColor(
            x,
            y,
            width,
            height,
            corners
        );


    const red =
        data[index] -
        expected.red;

    const green =
        data[
        index +
        1
        ] -
        expected.green;

    const blue =
        data[
        index +
        2
        ] -
        expected.blue;


    return Math.sqrt(
        red *
        red +
        green *
        green +
        blue *
        blue
    );
}


function median(
    values
) {
    const sorted =
        [
            ...values,
        ].sort(
            (
                first,
                second
            ) =>
                first -
                second
        );

    const middle =
        Math.floor(
            sorted.length /
            2
        );

    if (
        sorted.length %
        2 ===
        0
    ) {
        return (
            sorted[
            middle -
            1
            ] +
            sorted[
            middle
            ]
        ) /
            2;
    }

    return sorted[
        middle
    ];
}


function lerp(
    start,
    end,
    amount
) {
    return (
        start +
        (
            end -
            start
        ) *
        amount
    );
}


function clamp(
    value
) {
    return Math.max(
        0,
        Math.min(
            255,
            Math.round(
                value
            )
        )
    );
}