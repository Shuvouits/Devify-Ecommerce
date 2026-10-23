import {
    CheckCircle2,
    Search,
    Sparkles,
    X,
} from "lucide-react";

import {
    useState,
} from "react";


export default function CategorySeoSection({
    form,
    setForm,
    seoAnalysis,
    analyzingSeo,
    onGenerateSeo,
    onAnalyzeSeo,
}) {
    const [
        tagInput,
        setTagInput,
    ] = useState("");


    const addTag = () => {
        const tag =
            tagInput.trim();

        if (!tag) {
            return;
        }


        setForm(
            (current) => ({
                ...current,

                tags: [
                    ...new Set([
                        ...current.tags,
                        tag,
                    ]),
                ],
            })
        );


        setTagInput("");
    };


    const removeTag = (
        tag
    ) => {
        setForm(
            (current) => ({
                ...current,

                tags:
                    current.tags.filter(
                        (item) =>
                            item !==
                            tag
                    ),
            })
        );
    };


    return (
        <section className="overflow-hidden rounded-[14px] border border-[#e0e3e7] bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-[#e6e8eb] px-[20px] py-[16px]">

                <div>

                    <h2 className="text-[14px] font-semibold text-[#171d25]">
                        Search Engine Listing
                    </h2>

                    <p className="mt-[2px] text-[10.5px] text-[#7f8893]">
                        Auto-filled from category information. Customize to override.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={
                        onGenerateSeo
                    }
                    className="flex h-[30px] items-center gap-[5px] rounded-[8px] bg-gradient-to-r from-[#ffb83f] via-[#ef42cf] to-[#3ddbed] px-[10px] text-[10.5px] font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    <Sparkles
                        size={12}
                    />

                    AI SEO
                </button>

            </div>


            <div className="p-[20px]">

                <div className="rounded-[11px] border border-[#e1e4e8] bg-[#f7f7f7] p-[14px]">

                    <div className="flex items-center gap-[7px] text-[10px] font-semibold text-[#252d37]">

                        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[#316ff4] text-[8px] font-bold text-white">
                            D
                        </span>

                        Devify

                    </div>


                    <p className="mt-[4px] text-[9.5px] text-[#737c87]">
                        yourstore.com › categories › {form.slug || "category-handle"}
                    </p>


                    <p className="mt-[6px] text-[14px] font-medium text-[#1919b8]">
                        {form.seo_title ||
                            form.name ||
                            "Untitled Category"}
                    </p>


                    <p className="mt-[3px] text-[10.5px] text-[#656e78]">
                        {form.seo_description ||
                            form.description ||
                            "No description available."}
                    </p>

                </div>


                <div className="mt-[17px]">

                    <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                        Page title
                    </label>

                    <input
                        type="text"
                        maxLength={70}
                        value={
                            form.seo_title
                        }
                        onChange={(event) =>
                            setForm(
                                (current) => ({
                                    ...current,

                                    seo_title:
                                        event.target.value,
                                })
                            )
                        }
                        placeholder="Category name"
                        className="h-[39px] w-full rounded-[9px] border border-[#d7dce2] px-[11px] text-[12px] outline-none focus:border-[#7ca1f7]"
                    />

                    <p className="mt-[4px] text-[10px] text-[#8c949d]">
                        {form.seo_title.length}/70
                    </p>

                </div>


                <div className="mt-[14px]">

                    <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                        Meta description
                    </label>

                    <textarea
                        maxLength={160}
                        value={
                            form.seo_description
                        }
                        onChange={(event) =>
                            setForm(
                                (current) => ({
                                    ...current,

                                    seo_description:
                                        event.target.value,
                                })
                            )
                        }
                        placeholder="Enter meta description for search engines"
                        className="min-h-[65px] w-full resize-y rounded-[9px] border border-[#d7dce2] px-[11px] py-[9px] text-[12px] outline-none focus:border-[#7ca1f7]"
                    />

                    <p className="mt-[4px] text-[10px] text-[#8c949d]">
                        {form.seo_description.length}/160
                    </p>

                </div>


                <div className="mt-[14px]">

                    <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                        URL handle
                    </label>


                    <div className="flex items-center gap-[7px]">

                        <span className="text-[10.5px] text-[#707984]">
                            categories/
                        </span>

                        <input
                            type="text"
                            value={
                                form.slug
                            }
                            onChange={(event) =>
                                setForm(
                                    (current) => ({
                                        ...current,

                                        slug:
                                            event.target.value,
                                    })
                                )
                            }
                            placeholder="electronics"
                            className="h-[39px] min-w-0 flex-1 rounded-[9px] border border-[#d7dce2] px-[11px] text-[12px] outline-none focus:border-[#7ca1f7]"
                        />

                    </div>

                </div>


                <div className="mt-[14px]">

                    <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                        Tags
                    </label>


                    <div className="flex min-h-[39px] flex-wrap items-center gap-[6px] rounded-[9px] border border-[#d7dce2] px-[8px]">

                        {form.tags.map(
                            (tag) => (
                                <span
                                    key={
                                        tag
                                    }
                                    className="flex items-center gap-[4px] rounded-[6px] bg-[#edf2ff] px-[7px] py-[4px] text-[9.5px] font-medium text-[#426ad5]"
                                >
                                    {tag}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeTag(
                                                tag
                                            )
                                        }
                                    >
                                        <X
                                            size={10}
                                        />
                                    </button>

                                </span>
                            )
                        )}


                        <input
                            type="text"
                            value={
                                tagInput
                            }
                            onChange={(event) =>
                                setTagInput(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    event.preventDefault();

                                    addTag();
                                }
                            }}
                            placeholder="Add a tag and press Enter"
                            className="h-[34px] min-w-[180px] flex-1 border-0 bg-transparent text-[11px] outline-none"
                        />

                    </div>

                </div>


                <button
                    type="button"
                    onClick={
                        onAnalyzeSeo
                    }
                    disabled={
                        analyzingSeo
                    }
                    className="mt-[15px] flex h-[38px] w-full items-center justify-between rounded-[9px] border border-[#e2e5e8] bg-white px-[11px] transition hover:bg-[#fafbfc] disabled:opacity-60"
                >

                    <span className="flex items-center gap-[7px]">

                        <Search
                            size={13}
                            className="text-[#316ff4]"
                        />

                        <span className="text-[11px] font-semibold text-[#28313b]">
                            SEO checklist
                        </span>

                    </span>


                    <span className="flex items-center gap-[5px] text-[10px] text-[#747d87]">

                        {seoAnalysis && (
                            <CheckCircle2
                                size={12}
                                className="text-[#20a566]"
                            />
                        )}


                        {analyzingSeo
                            ? "Analyzing..."
                            : seoAnalysis?.score !==
                                undefined
                                ? `Score: ${seoAnalysis.score}/100`
                                : "Analyze"}

                    </span>

                </button>

            </div>

        </section>
    );
}