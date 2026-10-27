import {
    ChevronDown,
    ExternalLink,
    Pencil,
    Sparkles,
} from "lucide-react";

import {
    useState,
} from "react";


export default function CollectionSeoSection({
    form,
    onChange,
}) {
    const [
        editingSeo,
        setEditingSeo,
    ] = useState(false);

    const [
        checklistOpen,
        setChecklistOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Preview Values
    |--------------------------------------------------------------------------
    */

    const displayTitle =
        form.seo_title ||
        form.title ||
        "Collection title";

    const displayDescription =
        form.seo_description ||
        form.description ||
        "No description available.";

    const displaySlug =
        form.slug ||
        "collection-handle";


    /*
    |--------------------------------------------------------------------------
    | Basic SEO Score
    |--------------------------------------------------------------------------
    */

    const checks = [
        {
            key: "title",
            label: "SEO title",
            passed:
                Boolean(
                    form.seo_title ||
                    form.title
                ),
            message:
                form.seo_title ||
                form.title
                    ? "A page title is available."
                    : "Add a page title.",
            points: 25,
        },
        {
            key: "description",
            label: "Meta description",
            passed:
                Boolean(
                    form.seo_description ||
                    form.description
                ),
            message:
                form.seo_description ||
                form.description
                    ? "A search description is available."
                    : "Add a meta description.",
            points: 25,
        },
        {
            key: "slug",
            label: "URL handle",
            passed:
                Boolean(
                    form.slug
                ),
            message:
                form.slug
                    ? "A URL handle is set."
                    : "Add a URL handle.",
            points: 25,
        },
        {
            key: "title_length",
            label: "Title length",
            passed:
                displayTitle.length <=
                    70 &&
                displayTitle.length >
                    0,
            message:
                displayTitle.length <=
                    70 &&
                displayTitle.length >
                    0
                    ? "Title length is within the recommended limit."
                    : "Keep the title within 70 characters.",
            points: 25,
        },
    ];

    const score =
        checks.reduce(
            (
                total,
                check
            ) =>
                total +
                (check.passed
                    ? check.points
                    : 0),
            0
        );

    const scoreColor =
        score >= 80
            ? "bg-[#22c55e]"
            : score >= 50
              ? "bg-[#f59e0b]"
              : "bg-[#ef4444]";


    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {/* Header */}

            <div className="flex items-center justify-between gap-3 border-b border-[#e7e9ec] px-[20px] py-[14px]">
                <div>
                    <h2 className="text-[14px] font-semibold text-[#111827]">
                        Search Engine Listing
                    </h2>

                    <p className="mt-[2px] text-[10.5px] text-[#747d88]">
                        Auto-filled from collection details. Customize to override.
                    </p>
                </div>

                <div className="flex items-center gap-[7px]">
                    <button
                        type="button"
                        title="Generate SEO with AI"
                        className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#ff9e46] via-[#ef4dd8] to-[#45c8ff] text-white shadow-sm transition hover:scale-[1.04]"
                    >
                        <Sparkles
                            size={14}
                            strokeWidth={1.8}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setEditingSeo(
                                (current) =>
                                    !current
                            )
                        }
                        className="inline-flex h-[31px] items-center gap-[6px] rounded-[8px] border border-[#d9dee4] bg-white px-[10px] text-[10px] font-medium text-[#59636f] transition hover:bg-[#f7f8fa]"
                    >
                        <Pencil
                            size={12}
                            strokeWidth={1.8}
                        />

                        {editingSeo
                            ? "Hide SEO"
                            : "Edit SEO"}
                    </button>
                </div>
            </div>


            <div className="p-[20px]">
                {/* Preview */}

                <div className="rounded-[12px] border border-[#e2e4e7] bg-[#f7f7f7] px-[14px] py-[13px]">
                    <div className="flex items-center gap-[7px]">
                        <div className="flex h-[17px] w-[17px] items-center justify-center rounded-[4px] bg-gradient-to-br from-[#316ff4] to-[#855df5] text-[8px] font-bold text-white">
                            D
                        </div>

                        <span className="text-[10.5px] font-semibold text-[#202833]">
                            Devify
                        </span>
                    </div>

                    <p className="mt-[4px] text-[9.5px] text-[#68717c]">
                        localhost:5173
                        {" › "}
                        collections
                        {" › "}
                        {displaySlug}
                    </p>

                    <p className="mt-[4px] text-[14px] font-medium leading-[18px] text-[#1a0dab]">
                        {displayTitle}
                    </p>

                    <p className="mt-[2px] line-clamp-2 text-[10.5px] leading-[16px] text-[#66707c]">
                        {displayDescription}
                    </p>
                </div>


                {!editingSeo && (
                    <div className="mt-[10px] flex items-center gap-[6px] text-[9.5px] text-[#7d8691]">
                        <ExternalLink
                            size={11}
                            strokeWidth={1.8}
                        />

                        Showing auto-filled values from title and description.
                    </div>
                )}


                {/* Editable Fields */}

                {editingSeo && (
                    <div className="mt-[15px] rounded-[12px] border border-[#e2e5e9] bg-[#fafbfc] p-[13px]">
                        {/* Page title */}

                        <div>
                            <div className="mb-[6px] flex items-center justify-between gap-3">
                                <label className="text-[10.5px] font-medium text-[#303946]">
                                    Page title
                                </label>

                                <span className="text-[9px] text-[#7f8893]">
                                    {form.seo_title?.length || 0}
                                    /70
                                </span>
                            </div>

                            <input
                                type="text"
                                maxLength={70}
                                value={
                                    form.seo_title ||
                                    ""
                                }
                                onChange={(event) =>
                                    onChange(
                                        "seo_title",
                                        event.target.value
                                    )
                                }
                                placeholder={
                                    form.title ||
                                    "Collection title"
                                }
                                className="h-[36px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                            />
                        </div>


                        {/* Description */}

                        <div className="mt-[11px]">
                            <div className="mb-[6px] flex items-center justify-between gap-3">
                                <label className="text-[10.5px] font-medium text-[#303946]">
                                    Meta description
                                </label>

                                <span className="text-[9px] text-[#7f8893]">
                                    {form.seo_description?.length || 0}
                                    /160
                                </span>
                            </div>

                            <textarea
                                rows={3}
                                maxLength={160}
                                value={
                                    form.seo_description ||
                                    ""
                                }
                                onChange={(event) =>
                                    onChange(
                                        "seo_description",
                                        event.target.value
                                    )
                                }
                                placeholder="Enter meta description for search engines"
                                className="min-h-[68px] w-full resize-y rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] py-[8px] text-[10.5px] leading-[16px] text-[#303945] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                            />
                        </div>


                        {/* URL */}

                        <div className="mt-[11px]">
                            <label className="mb-[6px] block text-[10.5px] font-medium text-[#303946]">
                                URL handle
                            </label>

                            <div className="flex items-center gap-[6px]">
                                <span className="shrink-0 text-[10px] text-[#6d7681]">
                                    collections/
                                </span>

                                <input
                                    type="text"
                                    value={
                                        form.slug ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        onChange(
                                            "slug",
                                            event.target.value
                                        )
                                    }
                                    placeholder="collection-handle"
                                    className="h-[36px] min-w-0 flex-1 rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#9ca3af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                                />
                            </div>
                        </div>
                    </div>
                )}


                {/* Checklist */}

                <div className="mt-[13px] overflow-hidden rounded-[11px] border border-[#e0e3e7]">
                    <button
                        type="button"
                        onClick={() =>
                            setChecklistOpen(
                                (current) =>
                                    !current
                            )
                        }
                        className="flex min-h-[39px] w-full items-center justify-between px-[11px] text-left transition hover:bg-[#fafbfc]"
                    >
                        <div className="flex items-center gap-[7px]">
                            <span
                                className={[
                                    "h-[7px]",
                                    "w-[7px]",
                                    "rounded-full",
                                    scoreColor,
                                ].join(" ")}
                            />

                            <span className="text-[10.5px] font-semibold text-[#202833]">
                                SEO checklist
                            </span>

                            <span className="text-[9.5px] text-[#737c87]">
                                Score: {score}/100
                            </span>
                        </div>

                        <ChevronDown
                            size={13}
                            className={[
                                "text-[#747d88]",
                                "transition-transform",
                                checklistOpen
                                    ? "rotate-180"
                                    : "",
                            ].join(" ")}
                        />
                    </button>

                    {checklistOpen && (
                        <div className="border-t border-[#e5e7ea] px-[11px] py-[10px]">
                            <div className="space-y-[7px]">
                                {checks.map(
                                    (
                                        check
                                    ) => (
                                        <div
                                            key={
                                                check.key
                                            }
                                            className="flex items-start justify-between gap-4"
                                        >
                                            <div className="flex items-start gap-[7px]">
                                                <span
                                                    className={[
                                                        "mt-[5px]",
                                                        "h-[6px]",
                                                        "w-[6px]",
                                                        "shrink-0",
                                                        "rounded-full",
                                                        check.passed
                                                            ? "bg-[#22c55e]"
                                                            : "bg-[#ef4444]",
                                                    ].join(
                                                        " "
                                                    )}
                                                />

                                                <div>
                                                    <p className="text-[9.5px] font-medium text-[#444d59]">
                                                        {
                                                            check.label
                                                        }
                                                    </p>

                                                    <p className="mt-[1px] text-[9px] leading-[13px] text-[#858d97]">
                                                        {
                                                            check.message
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="shrink-0 text-[9px] text-[#8b929b]">
                                                {check.passed
                                                    ? check.points
                                                    : 0}
                                                /
                                                {check.points}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}