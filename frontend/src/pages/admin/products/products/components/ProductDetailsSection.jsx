import {
    useState,
} from "react";

import {
    AlignLeft,
    Bold,
    Code2,
    Italic,
    Link2,
    List,
    ListOrdered,
    Minus,
    Plus,
    Quote,
    Redo2,
    Sparkles,
    Strikethrough,
    Trash2,
    Underline,
    Undo2,
} from "lucide-react";


export default function ProductDetailsSection({
    form,
    onChange,
    onOpenOverviewAi,
    onOpenDescriptionAi,
}) {
    const [
        activeTab,
        setActiveTab,
    ] = useState(
        "description"
    );

    const specifications =
        Array.isArray(
            form.specifications
        )
            ? form.specifications
            : [];


    /*
    |--------------------------------------------------------------------------
    | Specifications
    |--------------------------------------------------------------------------
    */

    const addSpecification =
        () => {
            onChange(
                "specifications",
                [
                    ...specifications,
                    {
                        name: "",
                        value: "",
                    },
                ]
            );
        };

    const updateSpecification =
        (
            index,
            field,
            value
        ) => {
            const next =
                specifications.map(
                    (
                        item,
                        itemIndex
                    ) =>
                        itemIndex ===
                        index
                            ? {
                                  ...item,
                                  [field]:
                                      value,
                              }
                            : item
                );

            onChange(
                "specifications",
                next
            );
        };

    const removeSpecification =
        (index) => {
            onChange(
                "specifications",
                specifications.filter(
                    (
                        _,
                        itemIndex
                    ) =>
                        itemIndex !==
                        index
                )
            );
        };


    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                {/* Heading */}

                <h2 className="text-[14px] font-semibold text-[#111827]">
                    Details
                </h2>


                {/* Title */}

                <div className="mt-[14px]">
                    <label className="mb-[6px] block text-[11px] font-medium text-[#202833]">
                        Title
                        <span className="ml-[2px] text-[#dc2626]">
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        value={
                            form.title
                        }
                        onChange={(
                            event
                        ) =>
                            onChange(
                                "title",
                                event.target
                                    .value
                            )
                        }
                        placeholder="Short sleeve t-shirt"
                        className="h-[38px] w-full rounded-[10px] border border-[#ccd3dc] bg-white px-[11px] text-[11.5px] text-[#303945] outline-none transition placeholder:text-[#929aa4] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />
                </div>


                {/* URL Handle */}

                <div className="mt-[13px]">
                    <label className="mb-[6px] block text-[11px] font-medium text-[#202833]">
                        URL handle
                    </label>

                    <div className="flex items-center">
                        <span className="mr-[7px] shrink-0 text-[10.5px] text-[#7b8490]">
                            products/
                        </span>

                        <input
                            type="text"
                            value={
                                form.slug ||
                                ""
                            }
                            onChange={(
                                event
                            ) =>
                                onChange(
                                    "slug",
                                    event.target
                                        .value
                                )
                            }
                            placeholder="product-handle"
                            className="h-[38px] min-w-0 flex-1 rounded-[10px] border border-[#ccd3dc] bg-white px-[11px] text-[11.5px] text-[#303945] outline-none transition placeholder:text-[#929aa4] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                        />
                    </div>
                </div>


                {/* Overview */}

                <div className="mt-[14px]">
                    <div className="mb-[6px] flex items-center justify-between">
                        <label className="text-[11px] font-medium text-[#202833]">
                            Overview
                        </label>

                        <button
                            type="button"
                            onClick={
                                onOpenOverviewAi
                            }
                            title="Write overview with AI"
                            className="flex h-[27px] w-[27px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#ff9e46] via-[#f14fd8] to-[#49c8ff] text-white shadow-sm transition hover:scale-[1.04]"
                        >
                            <Sparkles
                                size={
                                    14
                                }
                                strokeWidth={
                                    1.8
                                }
                            />
                        </button>
                    </div>

                    <textarea
                        value={
                            form.overview
                        }
                        onChange={(
                            event
                        ) =>
                            onChange(
                                "overview",
                                event.target
                                    .value
                            )
                        }
                        rows={3}
                        maxLength={350}
                        placeholder="Short description of the product"
                        className="min-h-[62px] w-full resize-y rounded-[10px] border border-[#ccd3dc] bg-white px-[11px] py-[9px] text-[11.5px] leading-[17px] text-[#303945] outline-none transition placeholder:text-[#929aa4] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />
                </div>


                {/* Tabs */}

                <div className="mt-[13px]">
                    <div className="inline-flex rounded-[20px] bg-[#f3f4f6] p-[2px]">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveTab(
                                    "description"
                                )
                            }
                            className={[
                                "h-[28px]",
                                "rounded-[18px]",
                                "px-[10px]",
                                "text-[10.5px]",
                                "font-medium",
                                "transition",
                                activeTab ===
                                "description"
                                    ? "bg-white text-[#202833] shadow-sm"
                                    : "text-[#5e6874]",
                            ].join(
                                " "
                            )}
                        >
                            Description
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setActiveTab(
                                    "specifications"
                                )
                            }
                            className={[
                                "h-[28px]",
                                "rounded-[18px]",
                                "px-[10px]",
                                "text-[10.5px]",
                                "font-medium",
                                "transition",
                                activeTab ===
                                "specifications"
                                    ? "bg-white text-[#202833] shadow-sm"
                                    : "text-[#5e6874]",
                            ].join(
                                " "
                            )}
                        >
                            Specifications
                        </button>
                    </div>
                </div>


                {/* Description */}

                {activeTab ===
                    "description" && (
                    <div className="mt-[14px]">
                        <div className="mb-[6px] flex items-center justify-between">
                            <label className="text-[11px] font-medium text-[#202833]">
                                Description
                                <span className="ml-[2px] text-[#dc2626]">
                                    *
                                </span>
                            </label>

                            <button
                                type="button"
                                onClick={
                                    onOpenDescriptionAi
                                }
                                title="Write description with AI"
                                className="flex h-[27px] w-[27px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#ff9e46] via-[#f14fd8] to-[#49c8ff] text-white shadow-sm transition hover:scale-[1.04]"
                            >
                                <Sparkles
                                    size={
                                        14
                                    }
                                    strokeWidth={
                                        1.8
                                    }
                                />
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-[11px] border border-[#d5d9df] bg-white focus-within:border-[#aeb7c2]">
                            {/* Toolbar */}

                            <div className="flex flex-wrap items-center gap-[2px] border-b border-[#e6e8eb] px-[7px] py-[6px]">
                                <ToolbarButton
                                    icon={
                                        Undo2
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Redo2
                                    }
                                />

                                <Divider />

                                <TextButton>
                                    H1
                                </TextButton>

                                <TextButton>
                                    H2
                                </TextButton>

                                <TextButton>
                                    H3
                                </TextButton>

                                <TextButton>
                                    ¶
                                </TextButton>

                                <Divider />

                                <ToolbarButton
                                    icon={
                                        Bold
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Italic
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Underline
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Strikethrough
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Code2
                                    }
                                />

                                <Divider />

                                <ToolbarButton
                                    icon={
                                        List
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        ListOrdered
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Quote
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        AlignLeft
                                    }
                                />

                                <ToolbarButton
                                    icon={
                                        Link2
                                    }
                                />
                            </div>

                            <textarea
                                value={
                                    form.description
                                }
                                onChange={(
                                    event
                                ) =>
                                    onChange(
                                        "description",
                                        event.target
                                            .value
                                    )
                                }
                                rows={9}
                                placeholder="Write a detailed product description..."
                                className="min-h-[150px] w-full resize-y border-0 bg-white px-[12px] py-[11px] text-[11.5px] leading-[18px] text-[#303945] outline-none placeholder:text-[#929aa4]"
                            />
                        </div>
                    </div>
                )}


                {/* Specifications */}

                {activeTab ===
                    "specifications" && (
                    <div className="mt-[14px]">
                        <div className="mb-[9px] flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[11px] font-medium text-[#202833]">
                                    Specifications
                                </p>

                                <p className="mt-[2px] text-[9.5px] text-[#858e99]">
                                    Add structured product attributes.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    addSpecification
                                }
                                className="inline-flex h-[30px] items-center gap-[5px] rounded-[8px] border border-[#d9dee4] bg-white px-[9px] text-[9.5px] font-medium text-[#4d5763] transition hover:bg-[#f7f8fa]"
                            >
                                <Plus
                                    size={
                                        12
                                    }
                                />

                                Add
                            </button>
                        </div>

                        {specifications.length ===
                        0 ? (
                            <button
                                type="button"
                                onClick={
                                    addSpecification
                                }
                                className="flex w-full items-center justify-center gap-[6px] rounded-[10px] border border-dashed border-[#d6dbe2] bg-[#fafbfc] px-4 py-[22px] text-[10px] font-medium text-[#707986] transition hover:bg-[#f6f7f8]"
                            >
                                <Plus
                                    size={
                                        13
                                    }
                                />

                                Add specification
                            </button>
                        ) : (
                            <div className="space-y-[8px]">
                                {specifications.map(
                                    (
                                        specification,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_30px] gap-[7px]"
                                        >
                                            <input
                                                type="text"
                                                value={
                                                    specification.name ||
                                                    ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateSpecification(
                                                        index,
                                                        "name",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Name"
                                                className="h-[36px] min-w-0 rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#9aa2ad] focus:border-[#7da0f8]"
                                            />

                                            <input
                                                type="text"
                                                value={
                                                    specification.value ||
                                                    ""
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateSpecification(
                                                        index,
                                                        "value",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Value"
                                                className="h-[36px] min-w-0 rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#9aa2ad] focus:border-[#7da0f8]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSpecification(
                                                        index
                                                    )
                                                }
                                                title="Remove specification"
                                                className="flex h-[36px] w-[30px] items-center justify-center rounded-[8px] text-[#8b95a1] transition hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2
                                                    size={
                                                        13
                                                    }
                                                />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}


function ToolbarButton({
    icon: Icon,
}) {
    return (
        <button
            type="button"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#353d48] transition hover:bg-[#f1f2f4]"
        >
            <Icon
                size={13}
                strokeWidth={1.8}
            />
        </button>
    );
}


function TextButton({
    children,
}) {
    return (
        <button
            type="button"
            className="flex h-[26px] min-w-[26px] items-center justify-center rounded-[5px] px-[4px] text-[9px] font-semibold text-[#353d48] transition hover:bg-[#f1f2f4]"
        >
            {children}
        </button>
    );
}


function Divider() {
    return (
        <span className="mx-[3px] h-[20px] w-px bg-[#e1e4e8]" />
    );
}