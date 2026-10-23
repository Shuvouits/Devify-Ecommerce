export default function CategoryOrganization({
    form,
    setForm,
    parentOptions,
    loadingParents,
}) {
    return (
        <section className="rounded-[14px] border border-[#e0e3e7] bg-white p-[20px] shadow-sm">

            <h2 className="mb-[16px] text-[14px] font-semibold text-[#171d25]">
                Organization
            </h2>


            <div>

                <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                    Parent category
                </label>


                <select
                    value={
                        form.parent_id ||
                        ""
                    }
                    disabled={
                        loadingParents
                    }
                    onChange={(event) =>
                        setForm(
                            (current) => ({
                                ...current,

                                parent_id:
                                    event.target.value
                                        ? Number(
                                            event.target.value
                                        )
                                        : null,
                            })
                        )
                    }
                    className="h-[39px] w-full rounded-[9px] border border-[#d7dce2] bg-white px-[11px] text-[11.5px] text-[#303944] outline-none focus:border-[#7ca1f7] disabled:bg-[#f7f8f9]"
                >
                    <option value="">
                        None (root category)
                    </option>


                    {parentOptions.map(
                        (category) => (
                            <option
                                key={
                                    category.id
                                }
                                value={
                                    category.id
                                }
                            >
                                {category.path ||
                                    category.name}
                            </option>
                        )
                    )}

                </select>


                <p className="mt-[5px] text-[10.5px] text-[#7f8893]">
                    Select a parent to create a sub-category.
                </p>

            </div>


            <div className="mt-[14px] rounded-[11px] border border-[#e4e7eb] bg-[#fbfbfc] p-[11px]">

                <p className="mb-[8px] text-[10.5px] font-semibold text-[#222a34]">
                    How this nests in the mega menu
                </p>


                <HierarchyRow
                    level="L1"
                    active
                    text="Main category → Rail row"
                />

                <HierarchyRow
                    level="L2"
                    text="Sub-category → Column"
                />

                <HierarchyRow
                    level="L3"
                    text="Sub-sub-category → Link"
                />

                <HierarchyRow
                    level="L4"
                    warning
                    text="Level 4 → not allowed"
                />


                <p className="mt-[9px] text-[9.5px] leading-[14px] text-[#818a94]">
                    With no parent this becomes a row in the mega menu&apos;s left rail.
                </p>

            </div>


            <div className="mt-[15px]">

                <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                    Display order
                </label>

                <input
                    type="number"
                    min="0"
                    value={
                        form.display_order
                    }
                    onChange={(event) =>
                        setForm(
                            (current) => ({
                                ...current,

                                display_order:
                                    Number(
                                        event.target.value
                                    ),
                            })
                        )
                    }
                    className="h-[39px] w-full rounded-[9px] border border-[#d7dce2] bg-white px-[11px] text-[12px] text-[#303944] outline-none focus:border-[#7ca1f7]"
                />

                <p className="mt-[5px] text-[10.5px] text-[#7f8893]">
                    Lower numbers appear first.
                </p>

            </div>


            <div className="mt-[15px]">

                <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                    Tax
                </label>


                <select
                    value={
                        form.tax_class
                    }
                    onChange={(event) =>
                        setForm(
                            (current) => ({
                                ...current,

                                tax_class:
                                    event.target.value,
                            })
                        )
                    }
                    className="h-[39px] w-full rounded-[9px] border border-[#d7dce2] bg-white px-[11px] text-[11.5px] text-[#303944] outline-none focus:border-[#7ca1f7]"
                >
                    <option value="">
                        Same as its parent category
                    </option>

                    <option value="standard">
                        Standard
                    </option>

                    <option value="reduced">
                        Reduced
                    </option>

                    <option value="zero">
                        Zero rated
                    </option>
                </select>

            </div>

        </section>
    );
}


function HierarchyRow({
    level,
    text,
    active = false,
    warning = false,
}) {
    return (
        <div
            className={[
                "mb-[3px]",
                "flex",
                "items-center",
                "gap-[7px]",
                "rounded-[7px]",
                "px-[7px]",
                "py-[4px]",
                active
                    ? "bg-[#e9f0ff]"
                    : "",
            ].join(" ")}
        >

            <span
                className={[
                    "rounded",
                    "px-[4px]",
                    "py-[1px]",
                    "text-[8px]",
                    "font-semibold",
                    warning
                        ? "bg-[#fff1cb] text-[#b67b00]"
                        : "bg-[#e7edff] text-[#5279e8]",
                ].join(" ")}
            >
                {level}
            </span>


            <span
                className={[
                    "text-[9.5px]",
                    warning
                        ? "text-[#8e6b19]"
                        : "text-[#46505b]",
                ].join(" ")}
            >
                {text}
            </span>

        </div>
    );
}