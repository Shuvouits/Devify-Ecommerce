import {
    ChevronDown,
    Sparkles,
} from "lucide-react";

import {
    useState,
} from "react";


export default function BrandSeoSection({
    form,
    setForm,
    seoAnalysis,
    onGenerateSeo,
    onAnalyzeSeo,
    analyzingSeo,
}) {
    const [
        checklistOpen,
        setChecklistOpen,
    ] =
        useState(false);


    const updateField = (
        field,
        value
    ) => {
        setForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        );
    };


    const displayTitle =
        form.seo_title ||
        form.name ||
        "Brand name";

    const displayDescription =
        form.seo_description ||
        form.description ||
        "No description available.";

    const displaySlug =
        form.slug ||
        "brand";


    const score =
        seoAnalysis?.score ??
        0;


    const scoreColor =
        score >= 80
            ? "bg-[#22c55e]"
            : score >= 50
                ? "bg-[#f59e0b]"
                : "bg-[#ef4444]";


    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-[#e6e8ec] px-[20px] py-[13px]">

                <div>
                    <h2 className="text-[14px] font-semibold text-[#111827]">
                        Search Engine Listing
                    </h2>

                    <p className="mt-[2px] text-[10.5px] text-[#747d88]">
                        Auto-filled from title & excerpt. Customize to override.
                    </p>
                </div>


                <button
                    type="button"
                    onClick={onGenerateSeo}
                    title="Generate SEO with AI"
                    className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#ff9e46] via-[#ef4dd8] to-[#45c8ff] text-white shadow-sm"
                >
                    <Sparkles
                        size={14}
                    />
                </button>

            </div>


            <div className="p-[20px]">

                {/* Google Preview */}

                <div className="rounded-[13px] border border-[#e2e4e7] bg-[#f7f7f7] px-[14px] py-[13px]">

                    <div className="flex items-center gap-[8px]">

                        <div className="flex h-[17px] w-[17px] items-center justify-center rounded-[4px] bg-gradient-to-br from-[#316ff4] to-[#855df5] text-[8px] font-bold text-white">
                            D
                        </div>

                        <span className="text-[11px] font-semibold text-[#202833]">
                            Devify
                        </span>

                    </div>


                    <p className="mt-[4px] text-[10px] text-[#68717c]">
                        localhost:5173 › brands › {displaySlug}
                    </p>


                    <p className="mt-[4px] text-[14px] font-medium text-[#1747d1]">
                        {displayTitle}
                    </p>


                    <p className="mt-[2px] line-clamp-2 text-[10.5px] leading-[16px] text-[#66707c]">
                        {displayDescription}
                    </p>

                </div>


                <div className="my-[15px] h-px bg-[#e8eaed]" />


                {/* Page Title */}

                <div>

                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Page title
                    </label>

                    <input
                        type="text"
                        value={form.seo_title}
                        maxLength={70}
                        onChange={(event) =>
                            updateField(
                                "seo_title",
                                event.target.value
                            )
                        }
                        placeholder={form.name || "Brand name"}
                        className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] text-[12px] text-[#222b38] outline-none focus:border-[#7da0f8]"
                    />

                    <p className="mt-[5px] text-[10px] text-[#737c87]">
                        {form.seo_title.length}/70
                    </p>

                </div>


                {/* Meta Description */}

                <div className="mt-[15px]">

                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Meta description
                    </label>

                    <textarea
                        rows={3}
                        maxLength={160}
                        value={form.seo_description}
                        onChange={(event) =>
                            updateField(
                                "seo_description",
                                event.target.value
                            )
                        }
                        placeholder="Enter meta description for search engines"
                        className="min-h-[68px] w-full resize-y rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] py-[10px] text-[12px] leading-5 text-[#222b38] outline-none focus:border-[#7da0f8]"
                    />

                    <p className="mt-[5px] text-[10px] text-[#737c87]">
                        {form.seo_description.length}/160
                    </p>

                </div>


                {/* Slug */}

                <div className="mt-[15px]">

                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        URL handle
                    </label>


                    <div className="flex items-center gap-[4px]">

                        <span className="text-[11px] text-[#68717c]">
                            brands/
                        </span>

                        <input
                            type="text"
                            value={form.slug}
                            onChange={(event) =>
                                updateField(
                                    "slug",
                                    event.target.value
                                )
                            }
                            placeholder="brand-name"
                            className="h-[38px] min-w-0 flex-1 rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] text-[12px] text-[#222b38] outline-none focus:border-[#7da0f8]"
                        />

                    </div>


                    <p className="mt-[6px] text-[10px] text-[#777f89]">
                        http://localhost:5173/brands/{displaySlug}
                    </p>

                </div>


                {/* SEO Checklist */}

                <div className="mt-[15px] overflow-hidden rounded-[12px] border border-[#e0e3e7]">

                    <button
                        type="button"
                        onClick={() => {
                            if (!seoAnalysis) {
                                onAnalyzeSeo();
                            }

                            setChecklistOpen(
                                (current) =>
                                    !current
                            );
                        }}
                        disabled={analyzingSeo}
                        className="flex min-h-[40px] w-full items-center justify-between px-[12px] text-left"
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

                            <span className="text-[11.5px] font-semibold text-[#202833]">
                                SEO checklist
                            </span>

                            <span className="text-[10.5px] text-[#737c87]">
                                Score: {score}/100
                            </span>

                        </div>


                        <ChevronDown
                            size={14}
                            className={[
                                "text-[#747d88]",
                                "transition-transform",
                                checklistOpen
                                    ? "rotate-180"
                                    : "",
                            ].join(" ")}
                        />

                    </button>


                    {checklistOpen &&
                        seoAnalysis?.checks && (
                            <div className="border-t border-[#e5e7ea] px-[12px] py-[10px]">

                                <div className="space-y-[7px]">

                                    {seoAnalysis.checks.map(
                                        (check) => (
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
                                                        ].join(" ")}
                                                    />

                                                    <div>

                                                        <p className="text-[10px] font-medium text-[#444d59]">
                                                            {
                                                                check.label
                                                            }
                                                        </p>

                                                        <p className="mt-[1px] text-[9.5px] leading-[14px] text-[#858d97]">
                                                            {
                                                                check.message
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                <span className="shrink-0 text-[9.5px] text-[#8b929b]">
                                                    {
                                                        check.earned_points
                                                    }
                                                    /
                                                    {
                                                        check.points
                                                    }
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