export default function CategoryPublishing({
    form,
    setForm,
}) {
    return (
        <section className="rounded-[14px] border border-[#e0e3e7] bg-white p-[20px] shadow-sm">

            <h2 className="mb-[16px] text-[14px] font-semibold text-[#171d25]">
                Status
            </h2>


            <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                Status
            </label>


            <select
                value={form.status}
                onChange={(event) =>
                    setForm(
                        (current) => ({
                            ...current,
                            status: event.target.value,
                        })
                    )
                }
                className="h-[39px] w-full rounded-[9px] border border-[#d7dce2] bg-white px-[11px] text-[12px] text-[#303944] outline-none focus:border-[#7ca1f7]"
            >
                <option value="active">
                    Active
                </option>

                <option value="inactive">
                    Inactive
                </option>
            </select>


            <div className="mt-[14px] flex items-center justify-between rounded-[11px] border border-[#e2e5e9] p-[12px]">

                <div>

                    <p className="text-[11.5px] font-medium text-[#202833]">
                        Featured category
                    </p>

                    <p className="mt-[2px] max-w-[190px] text-[10px] leading-[14px] text-[#7e8792]">
                        Show this category in the storefront featured categories section.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setForm(
                            (current) => ({
                                ...current,
                                is_featured:
                                    !current.is_featured,
                            })
                        )
                    }
                    className={[
                        "relative",
                        "h-[21px]",
                        "w-[38px]",
                        "shrink-0",
                        "rounded-full",
                        "transition",
                        form.is_featured
                            ? "bg-[#316ff4]"
                            : "bg-[#cbd1d7]",
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
                            "shadow",
                            "transition-all",
                            form.is_featured
                                ? "left-[20px]"
                                : "left-[3px]",
                        ].join(" ")}
                    />
                </button>

            </div>

        </section>
    );
}