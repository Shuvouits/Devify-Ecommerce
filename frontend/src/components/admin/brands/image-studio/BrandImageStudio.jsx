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


/*
|--------------------------------------------------------------------------
| Default Effects
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Brand Image Studio
|--------------------------------------------------------------------------
*/

export default function BrandImageStudio({
    open,
    file,
    previewUrl,
    onClose,
    onSave,
}) {
    /*
    |--------------------------------------------------------------------------
    | Refs
    |--------------------------------------------------------------------------
    */

    const canvasRef =
        useRef(null);

    const imageRef =
        useRef(null);

    const transparentImageCanvasRef =
        useRef(null);

    const localObjectUrlRef =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | General State
    |--------------------------------------------------------------------------
    */

    const [
        tab,
        setTab,
    ] =
        useState("quick");

    const [
        effects,
        setEffects,
    ] =
        useState(
            initialEffects
        );

    const [
        background,
        setBackground,
    ] =
        useState("white");

    const [
        zoom,
        setZoom,
    ] =
        useState(100);

    const [
        compare,
        setCompare,
    ] =
        useState(false);

    const [
        backgroundRemoved,
        setBackgroundRemoved,
    ] =
        useState(false);

    const [
        processingBackground,
        setProcessingBackground,
    ] =
        useState(false);

    const [
        workingPreviewUrl,
        setWorkingPreviewUrl,
    ] =
        useState("");

    const [
        workingFile,
        setWorkingFile,
    ] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Reset Studio When Opened
    |--------------------------------------------------------------------------
    */

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

        setBackground(
            "white"
        );

        setZoom(
            100
        );

        setCompare(
            false
        );

        setBackgroundRemoved(
            false
        );

        transparentImageCanvasRef.current =
            null;
    }, [
        open,
        previewUrl,
        file,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Cleanup Local Object URL
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Load Source Image
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (
            !open ||
            !workingPreviewUrl
        ) {
            return;
        }


        const image =
            new Image();


        image.onload =
            () => {
                imageRef.current =
                    image;

                transparentImageCanvasRef.current =
                    null;

                setBackgroundRemoved(
                    false
                );

                renderCanvas();
            };


        image.onerror =
            () => {
                console.error(
                    "Unable to load image into Image Studio."
                );
            };


        /*
         * Normally BrandEdit should give this component
         * a local blob/object URL.
         *
         * If the URL is same-origin this also works.
         */
        image.src =
            workingPreviewUrl;
    }, [
        open,
        workingPreviewUrl,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Re-render Canvas
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Main Canvas Renderer
    |--------------------------------------------------------------------------
    */

    const renderCanvas =
        () => {
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
                        willReadFrequently:
                            true,
                    }
                );


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


            /*
            |--------------------------------------------------------------------------
            | Compare Mode
            |--------------------------------------------------------------------------
            |
            | Hold Compare button:
            | show original source without modifications.
            |
            */

            if (compare) {
                drawBackground(
                    context,
                    CANVAS_WIDTH,
                    CANVAS_HEIGHT,
                    "white"
                );


                drawSourceImage({
                    context,
                    source:
                        image,
                    canvasWidth:
                        CANVAS_WIDTH,
                    canvasHeight:
                        CANVAS_HEIGHT,
                    zoom,
                    applyEffects:
                        false,
                    effects:
                        initialEffects,
                });


                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Draw Selected Background
            |--------------------------------------------------------------------------
            */

            drawBackground(
                context,
                CANVAS_WIDTH,
                CANVAS_HEIGHT,
                background
            );


            /*
            |--------------------------------------------------------------------------
            | Source
            |--------------------------------------------------------------------------
            */

            const source =
                backgroundRemoved &&
                transparentImageCanvasRef.current
                    ? transparentImageCanvasRef.current
                    : image;


            /*
            |--------------------------------------------------------------------------
            | Draw Image/Object With Effects
            |--------------------------------------------------------------------------
            */

            drawSourceImage({
                context,
                source,
                canvasWidth:
                    CANVAS_WIDTH,
                canvasHeight:
                    CANVAS_HEIGHT,
                zoom,
                applyEffects:
                    true,
                effects,
            });
        };


    /*
    |--------------------------------------------------------------------------
    | Background Preset Change
    |--------------------------------------------------------------------------
    |
    | If the original image has its own opaque background,
    | changing the canvas background alone cannot be seen.
    |
    | So selecting a preset first attempts to separate the
    | foreground from the connected background.
    |
    */

    const handleBackgroundChange =
        async (type) => {
            setBackground(
                type
            );


            if (
                !backgroundRemoved &&
                imageRef.current
            ) {
                await removeBackground(
                    true
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Remove Background
    |--------------------------------------------------------------------------
    |
    | Browser-only implementation.
    |
    | It starts from image borders and flood-fills through
    | visually smooth connected areas. This works much better
    | than "remove white only" for gradients and studio-style
    | backgrounds.
    |
    */

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
                |--------------------------------------------------------------------------
                | Limit Processing Size
                |--------------------------------------------------------------------------
                */

                const maxDimension =
                    1400;


                const naturalWidth =
                    image.naturalWidth ||
                    image.width;

                const naturalHeight =
                    image.naturalHeight ||
                    image.height;


                const scale =
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
                                scale
                        )
                    );

                const height =
                    Math.max(
                        1,
                        Math.round(
                            naturalHeight *
                                scale
                        )
                    );


                /*
                |--------------------------------------------------------------------------
                | Working Canvas
                |--------------------------------------------------------------------------
                */

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


                sourceContext.clearRect(
                    0,
                    0,
                    width,
                    height
                );


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
                |--------------------------------------------------------------------------
                | Flood Fill Connected Background
                |--------------------------------------------------------------------------
                */

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


                const addPixel =
                    (
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


                        const pixelIndex =
                            y *
                                width +
                            x;


                        if (
                            visited[
                                pixelIndex
                            ]
                        ) {
                            return;
                        }


                        visited[
                            pixelIndex
                        ] =
                            1;


                        queue[
                            queueEnd
                        ] =
                            pixelIndex;


                        queueEnd++;
                    };


                /*
                |--------------------------------------------------------------------------
                | Seed Entire Border
                |--------------------------------------------------------------------------
                */

                for (
                    let x = 0;
                    x < width;
                    x++
                ) {
                    addPixel(
                        x,
                        0
                    );

                    addPixel(
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
                    addPixel(
                        0,
                        y
                    );

                    addPixel(
                        width - 1,
                        y
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Local Smoothness Threshold
                |--------------------------------------------------------------------------
                |
                | Gradient backgrounds change slowly pixel-to-pixel.
                | Logo/object edges normally change much faster.
                |
                */

                const localTolerance =
                    42;

                const edgeBarrier =
                    68;


                while (
                    queueStart <
                    queueEnd
                ) {
                    const currentPixel =
                        queue[
                            queueStart
                        ];


                    queueStart++;


                    const currentX =
                        currentPixel %
                        width;

                    const currentY =
                        Math.floor(
                            currentPixel /
                                width
                        );


                    const currentDataIndex =
                        currentPixel *
                        4;


                    /*
                    |--------------------------------------------------------------------------
                    | Remove Background Pixel
                    |--------------------------------------------------------------------------
                    */

                    data[
                        currentDataIndex +
                            3
                    ] =
                        0;


                    const neighbours = [
                        [
                            currentX - 1,
                            currentY,
                        ],
                        [
                            currentX + 1,
                            currentY,
                        ],
                        [
                            currentX,
                            currentY - 1,
                        ],
                        [
                            currentX,
                            currentY + 1,
                        ],
                    ];


                    for (
                        const [
                            nextX,
                            nextY,
                        ] of neighbours
                    ) {
                        if (
                            nextX < 0 ||
                            nextY < 0 ||
                            nextX >=
                                width ||
                            nextY >=
                                height
                        ) {
                            continue;
                        }


                        const nextPixel =
                            nextY *
                                width +
                            nextX;


                        if (
                            visited[
                                nextPixel
                            ]
                        ) {
                            continue;
                        }


                        const nextDataIndex =
                            nextPixel *
                            4;


                        /*
                        |--------------------------------------------------------------------------
                        | Transparent Pixels Are Background
                        |--------------------------------------------------------------------------
                        */

                        if (
                            data[
                                nextDataIndex +
                                    3
                            ] <
                            10
                        ) {
                            visited[
                                nextPixel
                            ] =
                                1;

                            queue[
                                queueEnd
                            ] =
                                nextPixel;

                            queueEnd++;

                            continue;
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Compare Current Pixel To Candidate
                        |--------------------------------------------------------------------------
                        */

                        const localDistance =
                            colorDistance(
                                data,
                                currentDataIndex,
                                nextDataIndex
                            );


                        /*
                        |--------------------------------------------------------------------------
                        | Edge Strength
                        |--------------------------------------------------------------------------
                        */

                        const candidateEdgeStrength =
                            getPixelEdgeStrength(
                                data,
                                width,
                                height,
                                nextX,
                                nextY
                            );


                        if (
                            localDistance <=
                                localTolerance &&
                            candidateEdgeStrength <=
                                edgeBarrier
                        ) {
                            visited[
                                nextPixel
                            ] =
                                1;

                            queue[
                                queueEnd
                            ] =
                                nextPixel;

                            queueEnd++;
                        }
                    }
                }


                /*
                |--------------------------------------------------------------------------
                | Put Transparent Result Back
                |--------------------------------------------------------------------------
                */

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


                /*
                 * React state render will also call renderCanvas,
                 * but this makes the result feel instant.
                 */
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


    /*
    |--------------------------------------------------------------------------
    | Enhance Image
    |--------------------------------------------------------------------------
    */

    const enhanceImage =
        () => {
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


    /*
    |--------------------------------------------------------------------------
    | Reset Effects
    |--------------------------------------------------------------------------
    */

    const resetEffects =
        () => {
            setEffects({
                ...initialEffects,
            });
        };


    /*
    |--------------------------------------------------------------------------
    | Fit Image
    |--------------------------------------------------------------------------
    */

    const fitImage =
        () => {
            setZoom(
                100
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Upload Different Image Inside Studio
    |--------------------------------------------------------------------------
    */

    const handleStudioUpload =
        (
            event
        ) => {
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
        };


    /*
    |--------------------------------------------------------------------------
    | Save Edited File
    |--------------------------------------------------------------------------
    */

    const saveImage =
        () => {
            const canvas =
                canvasRef.current;


            if (!canvas) {
                return;
            }


            canvas.toBlob(
                (
                    blob
                ) => {
                    if (!blob) {
                        return;
                    }


                    const originalName =
                        workingFile?.name ||
                        file?.name ||
                        "brand-logo.png";


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


    /*
    |--------------------------------------------------------------------------
    | Export Image
    |--------------------------------------------------------------------------
    */

    const exportImage =
        () => {
            const canvas =
                canvasRef.current;


            if (!canvas) {
                return;
            }


            canvas.toBlob(
                (
                    blob
                ) => {
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
                        "brand-image.png";


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


    /*
    |--------------------------------------------------------------------------
    | Close
    |--------------------------------------------------------------------------
    */

    const handleClose =
        () => {
            setCompare(
                false
            );


            onClose();
        };


    /*
    |--------------------------------------------------------------------------
    | Hidden State
    |--------------------------------------------------------------------------
    */

    if (!open) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#f5f5f5]">

            {/* Header */}

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
                        Edit brand
                    </span>

                    <span className="text-[#9ba1a9]">
                        /
                    </span>

                    <span className="text-[#565f69]">
                        Logo
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


            {/* Editor */}

            <div className="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)_315px] gap-[8px] p-[12px]">

                {/* Media */}

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


                {/* Main */}

                <main className="flex min-w-0 flex-col gap-[8px]">

                    {/* Main Canvas Card */}

                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-[#e0e3e7] bg-white">

                        {/* Toolbar */}

                        <div className="flex h-[45px] shrink-0 items-center justify-between border-b border-[#e5e7ea] px-[10px]">

                            <div className="flex items-center gap-[6px]">

                                {/* Zoom */}

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


                                {/* Fit */}

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


                                {/* Compare */}

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


                            {/* Save / Cancel */}

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


                        {/* Canvas */}

                        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#f7f7f7] p-[18px]">

                            <canvas
                                ref={
                                    canvasRef
                                }
                                className="max-h-full max-w-full bg-white shadow-sm"
                            />

                        </div>

                    </div>


                    {/* Bottom Tools */}

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


                {/* Right Panel */}

                <aside className="flex min-h-0 flex-col overflow-hidden rounded-[12px] border border-[#e0e3e7] bg-white">

                    {/* Tabs */}

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


                    {/* Tab Content */}

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


/*
|--------------------------------------------------------------------------
| Tool Button
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| Draw Image/Object
|--------------------------------------------------------------------------
*/

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
        source.width;

    const sourceHeight =
        source.height;


    if (
        !sourceWidth ||
        !sourceHeight
    ) {
        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Object Rendering Canvas
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Fit Image To Canvas
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Apply Effects To Object Layer Only
    |--------------------------------------------------------------------------
    */

    if (applyEffects) {
        applyPixelEffects(
            objectContext,
            canvasWidth,
            canvasHeight,
            effects
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Composite
    |--------------------------------------------------------------------------
    */

    context.drawImage(
        objectCanvas,
        0,
        0
    );
}


/*
|--------------------------------------------------------------------------
| Background Renderer
|--------------------------------------------------------------------------
*/

function drawBackground(
    context,
    width,
    height,
    type
) {
    /*
    |--------------------------------------------------------------------------
    | Clean White
    |--------------------------------------------------------------------------
    */

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

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Lifestyle Room
    |--------------------------------------------------------------------------
    */

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


        /*
         * Soft light
         */
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


        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Desk Setup
    |--------------------------------------------------------------------------
    */

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


        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Gradient Studio
    |--------------------------------------------------------------------------
    */

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


        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Neon Accent
    |--------------------------------------------------------------------------
    */

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


        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Fallback
    |--------------------------------------------------------------------------
    */

    context.fillStyle =
        "#ffffff";

    context.fillRect(
        0,
        0,
        width,
        height
    );
}


/*
|--------------------------------------------------------------------------
| Pixel Effects
|--------------------------------------------------------------------------
*/

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
        /*
         * Do not process transparent pixels.
         */
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


        /*
        |--------------------------------------------------------------------------
        | Brightness
        |--------------------------------------------------------------------------
        */

        const brightness =
            effects.brightness *
            1.5;


        red +=
            brightness;

        green +=
            brightness;

        blue +=
            brightness;


        /*
        |--------------------------------------------------------------------------
        | Exposure
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Contrast
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Luminance
        |--------------------------------------------------------------------------
        */

        const luminance =
            0.299 *
                red +
            0.587 *
                green +
            0.114 *
                blue;


        /*
        |--------------------------------------------------------------------------
        | Highlights
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Shadows
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Saturation
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Warmth
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Clamp
        |--------------------------------------------------------------------------
        */

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


    /*
    |--------------------------------------------------------------------------
    | Vignette
    |--------------------------------------------------------------------------
    */

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
            `rgba(0,0,0,${
                effects.vignette /
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


/*
|--------------------------------------------------------------------------
| Background Detection Helpers
|--------------------------------------------------------------------------
*/

function colorDistance(
    data,
    indexA,
    indexB
) {
    const red =
        data[indexA] -
        data[indexB];

    const green =
        data[
            indexA + 1
        ] -
        data[
            indexB + 1
        ];

    const blue =
        data[
            indexA + 2
        ] -
        data[
            indexB + 2
        ];


    return Math.sqrt(
        red * red +
        green * green +
        blue * blue
    );
}


function getPixelEdgeStrength(
    data,
    width,
    height,
    x,
    y
) {
    const centerPixel =
        (
            y *
                width +
            x
        ) *
        4;


    let maximumDistance =
        0;


    const neighbours = [
        [
            x - 1,
            y,
        ],
        [
            x + 1,
            y,
        ],
        [
            x,
            y - 1,
        ],
        [
            x,
            y + 1,
        ],
    ];


    for (
        const [
            nextX,
            nextY,
        ] of neighbours
    ) {
        if (
            nextX < 0 ||
            nextY < 0 ||
            nextX >= width ||
            nextY >= height
        ) {
            continue;
        }


        const neighbourPixel =
            (
                nextY *
                    width +
                nextX
            ) *
            4;


        const distance =
            colorDistance(
                data,
                centerPixel,
                neighbourPixel
            );


        maximumDistance =
            Math.max(
                maximumDistance,
                distance
            );
    }


    return maximumDistance;
}


/*
|--------------------------------------------------------------------------
| Clamp
|--------------------------------------------------------------------------
*/

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