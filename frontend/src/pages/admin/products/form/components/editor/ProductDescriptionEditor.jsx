import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code2,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Loader2,
    Minus,
    Quote,
    Redo2,
    Strikethrough,
    Trash2,
    Underline,
    Undo2,
} from "lucide-react";

import {
    uploadProductImage,
} from "../../../../../../api/admin/productApi";

const ProductDescriptionEditor = ({
    value = "",
    productTitle = "",
    onChange,
}) => {
    const editorRef =
        useRef(null);

    const wrapperRef =
        useRef(null);

    const fileInputRef =
        useRef(null);

    const savedRangeRef =
        useRef(null);

    const lastHtmlRef =
        useRef("");

    const [
        uploadingImage,
        setUploadingImage,
    ] = useState(false);

    const [
        selectedImage,
        setSelectedImage,
    ] = useState(null);

    const [
        imageToolsPosition,
        setImageToolsPosition,
    ] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load external value
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const html =
            normalizeEditorData(
                value
            );

        if (
            html ===
            lastHtmlRef.current
        ) {
            return;
        }

        if (
            editorRef.current
                .innerHTML !== html
        ) {
            editorRef.current.innerHTML =
                html;
        }

        lastHtmlRef.current =
            html;
    }, [
        value,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Emit HTML
    |--------------------------------------------------------------------------
    */

    const emitChange =
        useCallback(() => {
            if (
                !editorRef.current
            ) {
                return;
            }

            const html =
                editorRef.current
                    .innerHTML;

            lastHtmlRef.current =
                html;

            onChange(html);
        }, [
            onChange,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Selection
    |--------------------------------------------------------------------------
    */

    const saveSelection = () => {
        const selection =
            window.getSelection();

        if (
            !selection ||
            selection.rangeCount ===
                0 ||
            !editorRef.current
        ) {
            return;
        }

        const range =
            selection.getRangeAt(
                0
            );

        if (
            editorRef.current.contains(
                range.commonAncestorContainer
            )
        ) {
            savedRangeRef.current =
                range.cloneRange();
        }
    };

    const restoreSelection =
        () => {
            const range =
                savedRangeRef.current;

            if (!range) {
                return false;
            }

            const selection =
                window.getSelection();

            selection.removeAllRanges();
            selection.addRange(
                range
            );

            return true;
        };

    /*
    |--------------------------------------------------------------------------
    | Native formatting
    |--------------------------------------------------------------------------
    */

    const executeCommand = (
        command,
        commandValue = null
    ) => {
        editorRef.current?.focus();

        restoreSelection();

        document.execCommand(
            command,
            false,
            commandValue
        );

        saveSelection();
        emitChange();
    };

    const formatBlock = (
        tag
    ) => {
        executeCommand(
            "formatBlock",
            tag
        );
    };

    const createLink = () => {
        restoreSelection();

        const url =
            window.prompt(
                "Enter link URL"
            );

        if (!url) {
            return;
        }

        executeCommand(
            "createLink",
            normalizeUrl(url)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Image uploader
    |--------------------------------------------------------------------------
    */

    const openImagePicker =
        () => {
            saveSelection();

            fileInputRef.current?.click();
        };

    const uploadAndInsertImage =
        async (
            file
        ) => {
            if (
                !file ||
                !file.type.startsWith(
                    "image/"
                )
            ) {
                return;
            }

            try {
                setUploadingImage(
                    true
                );

                const response =
                    await uploadProductImage(
                        file,
                        productTitle ||
                            "product-description"
                    );

                const uploaded =
                    response?.data;

                const imageUrl =
                    uploaded?.url ||
                    uploaded?.external_url;

                if (!imageUrl) {
                    throw new Error(
                        "Uploaded image URL was not returned."
                    );
                }

                insertImage(
                    imageUrl,
                    file.name
                );
            } catch (error) {
                console.error(
                    "Description image upload failed:",
                    error
                );

                window.alert(
                    error?.response
                        ?.data
                        ?.message ||
                        error?.message ||
                        "Could not upload image."
                );
            } finally {
                setUploadingImage(
                    false
                );

                if (
                    fileInputRef.current
                ) {
                    fileInputRef.current.value =
                        "";
                }
            }
        };

    const insertImage = (
        imageUrl,
        altText = ""
    ) => {
        const editor =
            editorRef.current;

        if (!editor) {
            return;
        }

        editor.focus();

        let restored =
            restoreSelection();

        const selection =
            window.getSelection();

        if (
            !restored ||
            !selection ||
            selection.rangeCount ===
                0
        ) {
            const range =
                document.createRange();

            range.selectNodeContents(
                editor
            );

            range.collapse(
                false
            );

            selection.removeAllRanges();
            selection.addRange(
                range
            );
        }

        const range =
            selection.getRangeAt(
                0
            );

        const figure =
            document.createElement(
                "figure"
            );

        figure.setAttribute(
            "data-product-editor-image",
            "true"
        );

        figure.setAttribute(
            "contenteditable",
            "false"
        );

        figure.style.width =
            "100%";

        figure.style.maxWidth =
            "100%";

        figure.style.margin =
            "24px auto";

        figure.style.position =
            "relative";

        const image =
            document.createElement(
                "img"
            );

        image.src =
            imageUrl;

        image.alt =
            altText;

        image.style.width =
            "100%";

        image.style.height =
            "auto";

        image.style.display =
            "block";

        image.style.borderRadius =
            "8px";

        figure.appendChild(
            image
        );

        const nextParagraph =
            document.createElement(
                "p"
            );

        nextParagraph.innerHTML =
            "<br>";

        range.deleteContents();

        range.insertNode(
            figure
        );

        figure.insertAdjacentElement(
            "afterend",
            nextParagraph
        );

        const nextRange =
            document.createRange();

        nextRange.setStart(
            nextParagraph,
            0
        );

        nextRange.collapse(
            true
        );

        selection.removeAllRanges();
        selection.addRange(
            nextRange
        );

        savedRangeRef.current =
            nextRange.cloneRange();

        emitChange();

        setSelectedImage(
            image
        );

        requestAnimationFrame(
            updateImageTools
        );
    };

    const handleImageInput = (
        event
    ) => {
        const file =
            event.target
                .files?.[0];

        uploadAndInsertImage(
            file
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Paste image
    |--------------------------------------------------------------------------
    */

    const handlePaste = (
        event
    ) => {
        const items =
            Array.from(
                event.clipboardData
                    ?.items || []
            );

        const imageItem =
            items.find(
                (item) =>
                    item.type.startsWith(
                        "image/"
                    )
            );

        if (!imageItem) {
            return;
        }

        const file =
            imageItem.getAsFile();

        if (!file) {
            return;
        }

        event.preventDefault();

        saveSelection();

        uploadAndInsertImage(
            file
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Drop image
    |--------------------------------------------------------------------------
    */

    const handleDragOver = (
        event
    ) => {
        const files =
            Array.from(
                event.dataTransfer
                    ?.files || []
            );

        if (
            files.some((file) =>
                file.type.startsWith(
                    "image/"
                )
            )
        ) {
            event.preventDefault();
        }
    };

    const handleDrop = (
        event
    ) => {
        const file =
            Array.from(
                event.dataTransfer
                    ?.files || []
            ).find((item) =>
                item.type.startsWith(
                    "image/"
                )
            );

        if (!file) {
            return;
        }

        event.preventDefault();

        const dropRange =
            document.caretRangeFromPoint?.(
                event.clientX,
                event.clientY
            );

        if (dropRange) {
            savedRangeRef.current =
                dropRange.cloneRange();
        }

        uploadAndInsertImage(
            file
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Selected image controls
    |--------------------------------------------------------------------------
    */

    const updateImageTools =
        useCallback(() => {
            if (
                !selectedImage ||
                !wrapperRef.current
            ) {
                setImageToolsPosition(
                    null
                );

                return;
            }

            if (
                !document.body.contains(
                    selectedImage
                )
            ) {
                setSelectedImage(
                    null
                );

                setImageToolsPosition(
                    null
                );

                return;
            }

            const figure =
                selectedImage.closest(
                    "figure"
                );

            if (!figure) {
                return;
            }

            const figureRect =
                figure.getBoundingClientRect();

            const wrapperRect =
                wrapperRef.current.getBoundingClientRect();

            setImageToolsPosition({
                top:
                    figureRect.top -
                    wrapperRect.top +
                    8,

                left:
                    figureRect.left -
                    wrapperRect.left +
                    8,

                right:
                    wrapperRect.right -
                    figureRect.right +
                    8,
            });
        }, [
            selectedImage,
        ]);

    useEffect(() => {
        if (!selectedImage) {
            return;
        }

        updateImageTools();

        window.addEventListener(
            "resize",
            updateImageTools
        );

        window.addEventListener(
            "scroll",
            updateImageTools,
            true
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateImageTools
            );

            window.removeEventListener(
                "scroll",
                updateImageTools,
                true
            );
        };
    }, [
        selectedImage,
        updateImageTools,
    ]);

    const handleEditorClick =
        (event) => {
            if (
                event.target
                    ?.tagName ===
                "IMG"
            ) {
                setSelectedImage(
                    event.target
                );

                requestAnimationFrame(
                    updateImageTools
                );

                return;
            }

            setSelectedImage(
                null
            );

            setImageToolsPosition(
                null
            );

            saveSelection();
        };

    const updateSelectedFigure = (
        callback
    ) => {
        if (!selectedImage) {
            return;
        }

        const figure =
            selectedImage.closest(
                "figure"
            );

        if (!figure) {
            return;
        }

        callback(figure);

        emitChange();

        requestAnimationFrame(
            updateImageTools
        );
    };

    const resizeImage = (
        width
    ) => {
        updateSelectedFigure(
            (figure) => {
                figure.style.width =
                    `${width}%`;

                figure.style.maxWidth =
                    "100%";
            }
        );
    };

    const alignImage = (
        alignment
    ) => {
        updateSelectedFigure(
            (figure) => {
                if (
                    alignment ===
                    "left"
                ) {
                    figure.style.marginLeft =
                        "0";

                    figure.style.marginRight =
                        "auto";
                }

                if (
                    alignment ===
                    "center"
                ) {
                    figure.style.marginLeft =
                        "auto";

                    figure.style.marginRight =
                        "auto";
                }

                if (
                    alignment ===
                    "right"
                ) {
                    figure.style.marginLeft =
                        "auto";

                    figure.style.marginRight =
                        "0";
                }
            }
        );
    };

    const removeImage = () => {
        if (!selectedImage) {
            return;
        }

        const figure =
            selectedImage.closest(
                "figure"
            );

        if (!figure) {
            return;
        }

        figure.remove();

        setSelectedImage(
            null
        );

        setImageToolsPosition(
            null
        );

        emitChange();
    };

    return (
        <div
            ref={wrapperRef}
            className="product-react-editor relative overflow-visible"
        >
            <EditorToolbar
                onCommand={
                    executeCommand
                }
                onFormatBlock={
                    formatBlock
                }
                onCreateLink={
                    createLink
                }
                onImage={
                    openImagePicker
                }
                uploadingImage={
                    uploadingImage
                }
            />

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={
                    emitChange
                }
                onClick={
                    handleEditorClick
                }
                onMouseUp={
                    saveSelection
                }
                onKeyUp={
                    saveSelection
                }
                onFocus={
                    saveSelection
                }
                onPaste={
                    handlePaste
                }
                onDragOver={
                    handleDragOver
                }
                onDrop={
                    handleDrop
                }
                data-placeholder="Write a detailed product description..."
                className="product-react-editor__content"
            />

            {selectedImage &&
                imageToolsPosition && (
                    <>
                        <div
                            className="absolute z-30 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                            style={{
                                top:
                                    imageToolsPosition.top,

                                left:
                                    imageToolsPosition.left,
                            }}
                        >
                            <ImageControlButton
                                title="25%"
                                onClick={() =>
                                    resizeImage(
                                        25
                                    )
                                }
                            >
                                25
                            </ImageControlButton>

                            <ImageControlButton
                                title="50%"
                                onClick={() =>
                                    resizeImage(
                                        50
                                    )
                                }
                            >
                                50
                            </ImageControlButton>

                            <ImageControlButton
                                title="75%"
                                onClick={() =>
                                    resizeImage(
                                        75
                                    )
                                }
                            >
                                75
                            </ImageControlButton>

                            <ImageControlButton
                                title="100%"
                                onClick={() =>
                                    resizeImage(
                                        100
                                    )
                                }
                            >
                                100
                            </ImageControlButton>

                            <div className="mx-1 h-5 w-px bg-gray-200" />

                            <IconControlButton
                                title="Align left"
                                onClick={() =>
                                    alignImage(
                                        "left"
                                    )
                                }
                                icon={
                                    AlignLeft
                                }
                            />

                            <IconControlButton
                                title="Align center"
                                onClick={() =>
                                    alignImage(
                                        "center"
                                    )
                                }
                                icon={
                                    AlignCenter
                                }
                            />

                            <IconControlButton
                                title="Align right"
                                onClick={() =>
                                    alignImage(
                                        "right"
                                    )
                                }
                                icon={
                                    AlignRight
                                }
                            />
                        </div>

                        <button
                            type="button"
                            title="Remove image"
                            onClick={
                                removeImage
                            }
                            className="absolute z-30 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-md transition hover:bg-red-50 hover:text-red-600"
                            style={{
                                top:
                                    imageToolsPosition.top,

                                right:
                                    imageToolsPosition.right,
                            }}
                        >
                            <Trash2
                                size={14}
                            />
                        </button>
                    </>
                )}

            {uploadingImage && (
                <div className="absolute inset-0 z-40 flex items-center justify-center rounded-b-[10px] bg-white/65 backdrop-blur-[1px]">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-medium text-gray-600 shadow-lg">
                        <Loader2
                            size={15}
                            className="animate-spin"
                        />

                        Uploading image...
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                    handleImageInput
                }
                className="hidden"
            />

            <EditorStyles />
        </div>
    );
};

const EditorToolbar = ({
    onCommand,
    onFormatBlock,
    onCreateLink,
    onImage,
    uploadingImage,
}) => {
    const keepSelection = (
        event
    ) => {
        event.preventDefault();
    };

    return (
        <div
            className="product-react-editor__toolbar"
            onMouseDown={
                keepSelection
            }
        >
            <ToolbarIcon
                icon={Undo2}
                title="Undo"
                onClick={() =>
                    onCommand(
                        "undo"
                    )
                }
            />

            <ToolbarIcon
                icon={Redo2}
                title="Redo"
                onClick={() =>
                    onCommand(
                        "redo"
                    )
                }
            />

            <ToolbarDivider />

            <ToolbarText
                onClick={() =>
                    onFormatBlock(
                        "H1"
                    )
                }
            >
                H1
            </ToolbarText>

            <ToolbarText
                onClick={() =>
                    onFormatBlock(
                        "H2"
                    )
                }
            >
                H2
            </ToolbarText>

            <ToolbarText
                onClick={() =>
                    onFormatBlock(
                        "H3"
                    )
                }
            >
                H3
            </ToolbarText>

            <ToolbarText
                onClick={() =>
                    onFormatBlock(
                        "P"
                    )
                }
            >
                ¶
            </ToolbarText>

            <ToolbarDivider />

            <ToolbarIcon
                icon={Bold}
                title="Bold"
                onClick={() =>
                    onCommand(
                        "bold"
                    )
                }
            />

            <ToolbarIcon
                icon={Italic}
                title="Italic"
                onClick={() =>
                    onCommand(
                        "italic"
                    )
                }
            />

            <ToolbarIcon
                icon={Underline}
                title="Underline"
                onClick={() =>
                    onCommand(
                        "underline"
                    )
                }
            />

            <ToolbarIcon
                icon={
                    Strikethrough
                }
                title="Strikethrough"
                onClick={() =>
                    onCommand(
                        "strikeThrough"
                    )
                }
            />

            <ToolbarIcon
                icon={Code2}
                title="Code block"
                onClick={() =>
                    onFormatBlock(
                        "PRE"
                    )
                }
            />

            <ToolbarDivider />

            <ToolbarIcon
                icon={List}
                title="Bulleted list"
                onClick={() =>
                    onCommand(
                        "insertUnorderedList"
                    )
                }
            />

            <ToolbarIcon
                icon={
                    ListOrdered
                }
                title="Numbered list"
                onClick={() =>
                    onCommand(
                        "insertOrderedList"
                    )
                }
            />

            <ToolbarIcon
                icon={Quote}
                title="Quote"
                onClick={() =>
                    onFormatBlock(
                        "BLOCKQUOTE"
                    )
                }
            />

            <ToolbarDivider />

            <ToolbarIcon
                icon={AlignLeft}
                title="Align left"
                onClick={() =>
                    onCommand(
                        "justifyLeft"
                    )
                }
            />

            <ToolbarIcon
                icon={
                    AlignCenter
                }
                title="Align center"
                onClick={() =>
                    onCommand(
                        "justifyCenter"
                    )
                }
            />

            <ToolbarIcon
                icon={
                    AlignRight
                }
                title="Align right"
                onClick={() =>
                    onCommand(
                        "justifyRight"
                    )
                }
            />

            <ToolbarIcon
                icon={Minus}
                title="Horizontal line"
                onClick={() =>
                    onCommand(
                        "insertHorizontalRule"
                    )
                }
            />

            <ToolbarDivider />

            <ToolbarIcon
                icon={ImagePlus}
                title="Upload image"
                disabled={
                    uploadingImage
                }
                onClick={
                    onImage
                }
            />

            <ToolbarIcon
                icon={Link2}
                title="Add link"
                onClick={
                    onCreateLink
                }
            />
        </div>
    );
};

const ToolbarIcon = ({
    icon: Icon,
    title,
    onClick,
    disabled = false,
}) => {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#343b45] transition hover:bg-[#f1f3f5] disabled:cursor-not-allowed disabled:opacity-40"
        >
            <Icon
                size={15}
                strokeWidth={1.8}
            />
        </button>
    );
};

const ToolbarText = ({
    children,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-[11px] font-semibold text-[#343b45] transition hover:bg-[#f1f3f5]"
        >
            {children}
        </button>
    );
};

const ToolbarDivider = () => {
    return (
        <span className="mx-1 h-6 w-px shrink-0 bg-[#e3e6ea]" />
    );
};

const ImageControlButton = ({
    children,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="h-7 min-w-8 rounded-md px-1.5 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-100"
        >
            {children}
        </button>
    );
};

const IconControlButton = ({
    icon: Icon,
    title,
    onClick,
}) => {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
            <Icon
                size={13}
            />
        </button>
    );
};

const EditorStyles = () => {
    return (
        <style>
            {`
                .product-react-editor {
                    width: 100%;
                    background: #fff;
                }

                .product-react-editor__toolbar {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 2px;
                    min-height: 52px;
                    padding: 7px 10px;
                    border: 1px solid #d9dee5;
                    border-bottom: 1px solid #e5e7eb;
                    border-radius: 10px 10px 0 0;
                    background: #fff;
                }

                .product-react-editor__content {
                    min-height: 360px;
                    max-height: 680px;
                    overflow-y: auto;
                    padding: 24px 20px;
                    border: 1px solid #d9dee5;
                    border-top: 0;
                    border-radius: 0 0 10px 10px;
                    background: #fff;
                    color: #242b35;
                    font-size: 14px;
                    line-height: 1.75;
                    outline: none;
                    transition:
                        border-color 0.15s ease,
                        box-shadow 0.15s ease;
                }

                .product-react-editor__content:focus {
                    border-color: #89a7f5;
                    box-shadow: 0 0 0 1px #89a7f5;
                }

                .product-react-editor__content:empty::before {
                    content: attr(data-placeholder);
                    color: #8b949f;
                    pointer-events: none;
                }

                .product-react-editor__content p {
                    margin: 0 0 16px;
                }

                .product-react-editor__content h1 {
                    margin: 26px 0 13px;
                    font-size: 28px;
                    font-weight: 700;
                    line-height: 1.25;
                    color: #111827;
                }

                .product-react-editor__content h2 {
                    margin: 24px 0 11px;
                    font-size: 22px;
                    font-weight: 700;
                    line-height: 1.3;
                    color: #111827;
                }

                .product-react-editor__content h3 {
                    margin: 21px 0 9px;
                    font-size: 18px;
                    font-weight: 650;
                    line-height: 1.35;
                    color: #111827;
                }

                .product-react-editor__content ul,
                .product-react-editor__content ol {
                    margin: 12px 0 18px;
                    padding-left: 26px;
                }

                .product-react-editor__content ul {
                    list-style: disc;
                }

                .product-react-editor__content ol {
                    list-style: decimal;
                }

                .product-react-editor__content blockquote {
                    margin: 18px 0;
                    padding: 10px 15px;
                    border-left: 3px solid #cbd5e1;
                    background: #f8fafc;
                    color: #4b5563;
                }

                .product-react-editor__content a {
                    color: #3768e8;
                    text-decoration: underline;
                }

                .product-react-editor__content pre {
                    margin: 16px 0;
                    overflow-x: auto;
                    border-radius: 8px;
                    background: #f4f5f7;
                    padding: 12px 14px;
                    font-family: monospace;
                    font-size: 13px;
                }

                .product-react-editor__content hr {
                    margin: 22px 0;
                    border: 0;
                    border-top: 1px solid #e5e7eb;
                }

                .product-react-editor__content figure[data-product-editor-image="true"] {
                    transition:
                        outline 0.15s ease,
                        box-shadow 0.15s ease;
                }

                .product-react-editor__content figure[data-product-editor-image="true"]:hover {
                    outline: 1px solid #9db5f5;
                }

                .product-react-editor__content figure[data-product-editor-image="true"] img {
                    max-width: 100%;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .product-react-editor__content {
                        min-height: 280px;
                        padding: 18px 15px;
                    }
                }
            `}
        </style>
    );
};

const normalizeEditorData = (
    value
) => {
    if (!value) {
        return "";
    }

    const text =
        String(value);

    const containsHtml =
        /<\/?[a-z][\s\S]*>/i.test(
            text
        );

    if (containsHtml) {
        return text;
    }

    return text
        .split(/\n{2,}/)
        .map((paragraph) => {
            const lines =
                paragraph
                    .trim()
                    .split("\n")
                    .map(
                        escapeHtml
                    )
                    .join("<br>");

            return lines
                ? `<p>${lines}</p>`
                : "";
        })
        .join("");
};

const escapeHtml = (
    value
) => {
    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        );
};

const normalizeUrl = (
    url
) => {
    const value =
        String(url).trim();

    if (
        /^https?:\/\//i.test(
            value
        )
    ) {
        return value;
    }

    return `https://${value}`;
};

export default ProductDescriptionEditor;