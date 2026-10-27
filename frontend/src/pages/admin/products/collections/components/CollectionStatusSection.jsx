export default function CollectionStatusSection({
    form,
    onChange,
}) {
    return (
        <div className="space-y-[14px]">
            {/* Status */}

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <h2 className="text-[13px] font-semibold text-[#111827]">
                        Status
                    </h2>

                    <select
                        value={
                            form.status
                        }
                        onChange={(event) =>
                            onChange(
                                "status",
                                event.target.value
                            )
                        }
                        className="mt-[12px] h-[37px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    >
                        <option value="draft">
                            Draft
                        </option>

                        <option value="active">
                            Active
                        </option>
                    </select>
                </div>
            </section>


            {/* Publishing */}

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <h2 className="text-[13px] font-semibold text-[#111827]">
                        Publishing
                    </h2>

                    <div className="mt-[13px] space-y-[14px]">
                        <SettingRow
                            title="Online Store"
                            description="Publish this collection on the storefront."
                        >
                            <Toggle
                                checked={Boolean(
                                    form.publish_online_store
                                )}
                                onChange={(checked) =>
                                    onChange(
                                        "publish_online_store",
                                        checked
                                    )
                                }
                            />
                        </SettingRow>

                        <div className="h-px bg-[#eceef1]" />

                        <SettingRow
                            title="Point of Sale"
                            description="Make this collection available in POS."
                        >
                            <Toggle
                                checked={Boolean(
                                    form.publish_point_of_sale
                                )}
                                onChange={(checked) =>
                                    onChange(
                                        "publish_point_of_sale",
                                        checked
                                    )
                                }
                            />
                        </SettingRow>
                    </div>
                </div>
            </section>


            {/* Sort Order */}

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <h2 className="text-[13px] font-semibold text-[#111827]">
                        Sort Order
                    </h2>

                    <select
                        value={
                            form.sort_order
                        }
                        onChange={(event) =>
                            onChange(
                                "sort_order",
                                event.target.value
                            )
                        }
                        className="mt-[12px] h-[37px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    >
                        <option value="manual">
                            Manual
                        </option>

                        <option value="best_selling">
                            Best selling
                        </option>

                        <option value="alphabetical_asc">
                            Alphabetically, A-Z
                        </option>

                        <option value="alphabetical_desc">
                            Alphabetically, Z-A
                        </option>

                        <option value="price_asc">
                            Price, low to high
                        </option>

                        <option value="price_desc">
                            Price, high to low
                        </option>

                        <option value="newest">
                            Newest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>
                    </select>
                </div>
            </section>


            {/* Display Position */}

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <h2 className="text-[13px] font-semibold text-[#111827]">
                        Display Position
                    </h2>

                    <p className="mt-[3px] text-[9.5px] leading-[14px] text-[#818a95]">
                        Lower numbers appear first when collections are displayed in order.
                    </p>

                    <input
                        type="number"
                        min="0"
                        value={
                            form.display_position
                        }
                        onChange={(event) =>
                            onChange(
                                "display_position",
                                event.target.value
                            )
                        }
                        className="mt-[12px] h-[37px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />
                </div>
            </section>
        </div>
    );
}


function SettingRow({
    title,
    description,
    children,
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-[10.5px] font-medium text-[#303945]">
                    {title}
                </p>

                <p className="mt-[2px] text-[9px] leading-[13px] text-[#858e99]">
                    {description}
                </p>
            </div>

            {children}
        </div>
    );
}


function Toggle({
    checked,
    onChange,
}) {
    return (
        <button
            type="button"
            onClick={() =>
                onChange(
                    !checked
                )
            }
            className={[
                "relative",
                "h-[22px]",
                "w-[38px]",
                "shrink-0",
                "rounded-full",
                "transition",
                checked
                    ? "bg-[#4f7df3]"
                    : "bg-[#d7dbe0]",
            ].join(" ")}
        >
            <span
                className={[
                    "absolute",
                    "top-[3px]",
                    "h-[16px]",
                    "w-[16px]",
                    "rounded-full",
                    "bg-white",
                    "shadow-sm",
                    "transition-all",
                    checked
                        ? "left-[19px]"
                        : "left-[3px]",
                ].join(" ")}
            />
        </button>
    );
}