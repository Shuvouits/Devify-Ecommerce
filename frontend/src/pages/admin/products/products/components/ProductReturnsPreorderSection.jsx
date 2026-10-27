import {
    CalendarDays,
    RotateCcw,
    ShoppingBag,
} from "lucide-react";

export default function ProductReturnsPreorderSection({
    form,
    onChange,
}) {
    return (
        <div className="space-y-[12px]">
            {/* Returns */}

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <div className="flex items-center gap-[7px]">
                        <RotateCcw
                            size={13}
                            strokeWidth={1.8}
                            className="text-[#7e8792]"
                        />

                        <h2 className="text-[13px] font-semibold text-[#111827]">
                            Returns
                        </h2>
                    </div>

                    <div className="mt-[14px]">
                        <ToggleRow
                            title="Final sale"
                            description="Mark this product as non-returnable."
                            checked={Boolean(
                                form.is_final_sale
                            )}
                            onChange={(checked) =>
                                onChange(
                                    "is_final_sale",
                                    checked
                                )
                            }
                        />

                        {!form.is_final_sale && (
                            <>
                                <div className="my-[14px] h-px bg-[#edf0f2]" />

                                <div>
                                    <label className="mb-[6px] block text-[10.5px] font-medium text-[#454f5b]">
                                        Return window
                                    </label>

                                    <div className="flex items-center gap-[7px]">
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={
                                                form.return_window_days
                                            }
                                            onChange={(event) =>
                                                onChange(
                                                    "return_window_days",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Store default"
                                            className="h-[36px] min-w-0 flex-1 rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#9da5af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                                        />

                                        <span className="text-[10px] text-[#7c8590]">
                                            days
                                        </span>
                                    </div>

                                    <p className="mt-[5px] text-[9px] leading-[14px] text-[#9098a2]">
                                        Leave empty to use the store default.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>


            {/* Pre-orders */}

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <div className="flex items-center gap-[7px]">
                        <ShoppingBag
                            size={13}
                            strokeWidth={1.8}
                            className="text-[#7e8792]"
                        />

                        <h2 className="text-[13px] font-semibold text-[#111827]">
                            Pre-orders
                        </h2>
                    </div>

                    <div className="mt-[14px]">
                        <ToggleRow
                            title="Enable pre-orders"
                            description="Allow customers to order before regular stock is available."
                            checked={Boolean(
                                form.preorder_enabled
                            )}
                            onChange={(checked) =>
                                onChange(
                                    "preorder_enabled",
                                    checked
                                )
                            }
                        />
                    </div>

                    {form.preorder_enabled && (
                        <div className="mt-[15px] rounded-[12px] border border-[#e2e5e9] bg-[#fafbfc] p-[13px]">
                            <div className="grid gap-[11px] md:grid-cols-2">
                                <DateField
                                    label="Expected ship date"
                                    value={
                                        form.preorder_expected_ship_date
                                    }
                                    onChange={(value) =>
                                        onChange(
                                            "preorder_expected_ship_date",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Pre-order limit"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={
                                        form.preorder_limit
                                    }
                                    placeholder="0"
                                    onChange={(value) =>
                                        onChange(
                                            "preorder_limit",
                                            value
                                        )
                                    }
                                />
                            </div>

                            <p className="mt-[4px] text-right text-[8.5px] text-[#929aa4]">
                                0 means no fixed limit
                            </p>

                            <div className="my-[13px] h-px bg-[#e8ebef]" />

                            <SelectField
                                label="Payment collection"
                                value={
                                    form.preorder_payment_collection
                                }
                                onChange={(value) =>
                                    onChange(
                                        "preorder_payment_collection",
                                        value
                                    )
                                }
                            >
                                <option value="pay_later">
                                    Pay later
                                </option>

                                <option value="pay_now">
                                    Pay in full now
                                </option>

                                <option value="deposit">
                                    Collect deposit
                                </option>
                            </SelectField>

                            {form.preorder_payment_collection ===
                                "deposit" && (
                                <div className="mt-[11px] grid gap-[11px] md:grid-cols-2">
                                    <SelectField
                                        label="Deposit type"
                                        value={
                                            form.preorder_deposit_type ||
                                            ""
                                        }
                                        onChange={(value) =>
                                            onChange(
                                                "preorder_deposit_type",
                                                value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="fixed">
                                            Fixed amount
                                        </option>

                                        <option value="percentage">
                                            Percentage
                                        </option>
                                    </SelectField>

                                    <Field
                                        label="Deposit value"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.preorder_deposit_value
                                        }
                                        placeholder={
                                            form.preorder_deposit_type ===
                                            "percentage"
                                                ? "e.g. 25"
                                                : "0.00"
                                        }
                                        onChange={(value) =>
                                            onChange(
                                                "preorder_deposit_value",
                                                value
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <div className="my-[13px] h-px bg-[#e8ebef]" />

                            <div className="grid gap-[11px] md:grid-cols-2">
                                <DateField
                                    label="Supplier ETA"
                                    value={
                                        form.preorder_supplier_eta
                                    }
                                    onChange={(value) =>
                                        onChange(
                                            "preorder_supplier_eta",
                                            value
                                        )
                                    }
                                />

                                <Field
                                    label="Batch name"
                                    value={
                                        form.preorder_batch_name
                                    }
                                    placeholder="e.g. November 2026 Batch"
                                    onChange={(value) =>
                                        onChange(
                                            "preorder_batch_name",
                                            value
                                        )
                                    }
                                />
                            </div>

                            <div className="mt-[11px]">
                                <label className="mb-[6px] block text-[10.5px] font-medium text-[#454f5b]">
                                    Storefront message
                                </label>

                                <textarea
                                    rows={3}
                                    value={
                                        form.preorder_storefront_message
                                    }
                                    onChange={(event) =>
                                        onChange(
                                            "preorder_storefront_message",
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Ships from November 15. Limited first batch available."
                                    className="min-h-[76px] w-full resize-none rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] py-[8px] text-[10.5px] leading-[16px] text-[#303945] outline-none transition placeholder:text-[#9da5af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                                />
                            </div>

                            <div className="my-[13px] h-px bg-[#e8ebef]" />

                            <div className="space-y-[12px]">
                                <ToggleRow
                                    title="Sell only as pre-order"
                                    description="Keep this product in pre-order mode even when stock is available."
                                    checked={Boolean(
                                        form.sell_only_as_preorder
                                    )}
                                    onChange={(checked) =>
                                        onChange(
                                            "sell_only_as_preorder",
                                            checked
                                        )
                                    }
                                />

                                <div className="h-px bg-[#edf0f2]" />

                                <ToggleRow
                                    title="Stop after release date"
                                    description="Stop taking pre-orders after the expected release date."
                                    checked={Boolean(
                                        form.stop_preorders_after_release_date
                                    )}
                                    onChange={(checked) =>
                                        onChange(
                                            "stop_preorders_after_release_date",
                                            checked
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


function ToggleRow({
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="flex items-start justify-between gap-[10px]">
            <div className="min-w-0">
                <p className="text-[10.5px] font-medium text-[#303946]">
                    {title}
                </p>

                <p className="mt-[2px] text-[9px] leading-[14px] text-[#858e99]">
                    {description}
                </p>
            </div>

            <Toggle
                checked={checked}
                onChange={onChange}
            />
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
                onChange(!checked)
            }
            className={[
                "relative",
                "mt-[1px]",
                "h-[20px]",
                "w-[35px]",
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
                    "h-[14px]",
                    "w-[14px]",
                    "rounded-full",
                    "bg-white",
                    "shadow-sm",
                    "transition-all",
                    checked
                        ? "left-[18px]"
                        : "left-[3px]",
                ].join(" ")}
            />
        </button>
    );
}


function Field({
    label,
    type = "text",
    min,
    step,
    value,
    placeholder,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[6px] block text-[10.5px] font-medium text-[#454f5b]">
                {label}
            </label>

            <input
                type={type}
                min={min}
                step={step}
                value={value ?? ""}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder={placeholder}
                className="h-[36px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition placeholder:text-[#9da5af] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
            />
        </div>
    );
}


function DateField({
    label,
    value,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[6px] block text-[10.5px] font-medium text-[#454f5b]">
                {label}
            </label>

            <div className="relative">
                <CalendarDays
                    size={13}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-[10px] top-1/2 -translate-y-1/2 text-[#8a939e]"
                />

                <input
                    type="date"
                    value={value ?? ""}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="h-[36px] w-full rounded-[9px] border border-[#ccd3dc] bg-white pl-[31px] pr-[9px] text-[10.5px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                />
            </div>
        </div>
    );
}


function SelectField({
    label,
    value,
    onChange,
    children,
}) {
    return (
        <div>
            <label className="mb-[6px] block text-[10.5px] font-medium text-[#454f5b]">
                {label}
            </label>

            <select
                value={value ?? ""}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="h-[36px] w-full rounded-[9px] border border-[#ccd3dc] bg-white px-[10px] text-[10.5px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
            >
                {children}
            </select>
        </div>
    );
}