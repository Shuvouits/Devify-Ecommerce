export default function BrandPublishing({
    form,
    setForm,
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
        <div className="space-y-4">

            {/* Status */}

            <section className="rounded-[18px] border border-[#e2e4e8] bg-white p-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">

                <h2 className="mb-[16px] text-[14px] font-semibold text-[#111827]">
                    Status
                </h2>


                <div>
                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Status
                    </label>

                    <select
                        value={form.status}
                        onChange={(event) =>
                            updateField(
                                "status",
                                event.target.value
                            )
                        }
                        className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[11px] text-[12px] text-[#202833] outline-none focus:border-[#7da0f8]"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>
                    </select>
                </div>


                <div className="mt-[16px] flex items-start justify-between gap-3 rounded-[13px] border border-[#e1e4e8] p-[12px]">

                    <div>
                        <p className="text-[11.5px] font-medium text-[#202833]">
                            Featured brand
                        </p>

                        <p className="mt-[2px] max-w-[210px] text-[10.5px] leading-[15px] text-[#717a86]">
                            Highlight this brand in the storefront featured brands section.
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            updateField(
                                "is_featured",
                                !form.is_featured
                            )
                        }
                        className={[
                            "relative",
                            "mt-[2px]",
                            "h-[21px]",
                            "w-[38px]",
                            "shrink-0",
                            "rounded-full",
                            "transition",
                            form.is_featured
                                ? "bg-[#316ff4]"
                                : "bg-[#cdd3da]",
                        ].join(" ")}
                    >
                        <span
                            className={[
                                "absolute",
                                "top-[3px]",
                                "h-[15px]",
                                "w-[15px]",
                                "rounded-full",
                                "bg-white",
                                "shadow-sm",
                                "transition-all",
                                form.is_featured
                                    ? "left-[20px]"
                                    : "left-[3px]",
                            ].join(" ")}
                        />
                    </button>

                </div>

            </section>


            {/* Organization */}

            <section className="rounded-[18px] border border-[#e2e4e8] bg-white p-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">

                <h2 className="mb-[16px] text-[14px] font-semibold text-[#111827]">
                    Organization
                </h2>


                <div>
                    <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                        Display order
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={form.display_order}
                        onChange={(event) =>
                            updateField(
                                "display_order",
                                event.target.value
                            )
                        }
                        className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[11px] text-[12px] text-[#202833] outline-none focus:border-[#7da0f8]"
                    />

                    <p className="mt-[6px] text-[10.5px] text-[#717a86]">
                        Lower numbers appear first.
                    </p>
                </div>


                <div className="mt-[16px] flex items-center justify-between rounded-[13px] border border-[#e1e4e8] px-[12px] py-[11px]">

                    <div>
                        <p className="text-[11.5px] font-medium text-[#202833]">
                            Products
                        </p>

                        <p className="mt-[2px] text-[10px] text-[#7e8792]">
                            Products assigned to this brand.
                        </p>
                    </div>

                    <span className="text-[12px] font-semibold text-[#111827]">
                        0
                    </span>

                </div>

            </section>

        </div>
    );
}