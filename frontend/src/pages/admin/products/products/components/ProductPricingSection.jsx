export default function ProductPricingSection({
    form,
    onChange,
}) {
    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                <h2 className="mb-[15px] text-[14px] font-semibold text-[#111827]">
                    Pricing
                </h2>


                {/* Price Row */}

                <div className="grid gap-[12px] md:grid-cols-3">
                    <PriceField
                        label="Price"
                        value={form.price}
                        onChange={(value) =>
                            onChange(
                                "price",
                                value
                            )
                        }
                    />

                    <PriceField
                        label="Compare-at price"
                        value={
                            form.compare_at_price
                        }
                        onChange={(value) =>
                            onChange(
                                "compare_at_price",
                                value
                            )
                        }
                    />

                    <PriceField
                        label="Cost per item"
                        value={
                            form.cost_per_item
                        }
                        onChange={(value) =>
                            onChange(
                                "cost_per_item",
                                value
                            )
                        }
                    />
                </div>


                {/* Helpers */}

                <div className="mt-[7px] grid gap-[12px] md:grid-cols-3">
                    <div />

                    <p className="text-[10px] leading-[15px] text-[#7a838f]">
                        To show a reduced price, set this higher than the product price.
                    </p>

                    <p className="text-[10px] leading-[15px] text-[#7a838f]">
                        Customers will not see this value.
                    </p>
                </div>


                {/* Divider */}

                <div className="my-[17px] h-px bg-[#e8eaed]" />


                {/* Tax */}

                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-[11.5px] font-medium text-[#202833]">
                            Charge tax on this product
                        </p>

                        <p className="mt-[3px] text-[10px] leading-[16px] text-[#7a838f]">
                            Taxes are calculated according to your store tax settings.
                        </p>
                    </div>

                    <Toggle
                        checked={Boolean(
                            form.charge_tax
                        )}
                        onChange={(checked) =>
                            onChange(
                                "charge_tax",
                                checked
                            )
                        }
                    />
                </div>


                {/* Tax Class */}

                {form.charge_tax && (
                    <div className="mt-[15px]">
                        <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                            Tax class
                        </label>

                        <input
                            type="text"
                            value={
                                form.tax_class
                            }
                            onChange={(event) =>
                                onChange(
                                    "tax_class",
                                    event.target.value
                                )
                            }
                            placeholder="Default"
                            className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] text-[12px] text-[#222b38] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                        />

                        <p className="mt-[5px] text-[10px] text-[#7a838f]">
                            Leave empty to use the store&apos;s default tax class.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}


function PriceField({
    label,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                {label}
            </label>

            <div className="flex h-[38px] overflow-hidden rounded-[11px] border border-[#ccd3dc] bg-white transition focus-within:border-[#7da0f8] focus-within:ring-2 focus-within:ring-[#eef3ff]">
                <div className="flex shrink-0 items-center border-r border-[#e2e5e9] bg-[#fafafa] px-[10px] text-[11px] font-medium text-[#656f7b]">
                    USD
                </div>

                <div className="relative min-w-0 flex-1">
                    <span className="absolute left-[10px] top-1/2 -translate-y-1/2 text-[11px] text-[#7b8490]">
                        $
                    </span>

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={
                            value ?? ""
                        }
                        onChange={(event) =>
                            onChange(
                                event.target.value
                            )
                        }
                        placeholder="0.00"
                        className="h-full w-full border-0 bg-transparent pl-[27px] pr-[10px] text-[12px] text-[#222b38] outline-none placeholder:text-[#a0a7b0]"
                    />
                </div>
            </div>
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
                    ? "bg-[#316ff4]"
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