import {
    Sparkles,
} from "lucide-react";


export default function BrandBasicInformation({
    form,
    setForm,
    onOpenDescriptionAi,
}) {
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


    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">

            <div className="p-[22px]">

                <h2 className="mb-[14px] text-[14px] font-semibold text-[#111827]">
                    Details
                </h2>


                {/* Name */}

                <div>
                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Name *
                    </label>

                    <input
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                            updateField(
                                "name",
                                event.target.value
                            )
                        }
                        placeholder="Brand name"
                        className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] text-[12px] text-[#222b38] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />
                </div>


                {/* Description */}

                <div className="mt-[17px]">

                    <div className="mb-[7px] flex items-center justify-between gap-3">

                        <label className="text-[11.5px] font-medium text-[#111827]">
                            Description
                        </label>


                        <button
                            type="button"
                            onClick={onOpenDescriptionAi}
                            title="Write with AI"
                            className="flex h-[27px] w-[27px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#ff9e46] via-[#f14fd8] to-[#49c8ff] text-white shadow-sm transition hover:scale-[1.04]"
                        >
                            <Sparkles
                                size={14}
                                strokeWidth={1.8}
                            />
                        </button>

                    </div>


                    <textarea
                        value={form.description}
                        onChange={(event) =>
                            updateField(
                                "description",
                                event.target.value.slice(
                                    0,
                                    500
                                )
                            )
                        }
                        rows={3}
                        placeholder="Describe this brand..."
                        className="min-h-[76px] w-full resize-y rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] py-[10px] text-[12px] leading-5 text-[#222b38] outline-none transition placeholder:text-[#9299a3] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />


                    <p className="mt-[5px] text-[10.5px] text-[#727b87]">
                        {form.description.length}/500 characters
                    </p>

                </div>


                {/* Website */}

                <div className="mt-[17px]">

                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Website
                    </label>

                    <input
                        type="url"
                        value={form.website}
                        onChange={(event) =>
                            updateField(
                                "website",
                                event.target.value
                            )
                        }
                        placeholder="https://brand.com"
                        className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] text-[12px] text-[#222b38] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />

                    <p className="mt-[6px] text-[10.5px] text-[#727b87]">
                        Optional link to the brand&apos;s official website.
                    </p>

                </div>

            </div>

        </section>
    );
}