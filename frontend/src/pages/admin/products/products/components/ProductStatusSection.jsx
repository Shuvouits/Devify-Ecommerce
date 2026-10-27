import {
    MonitorSmartphone,
    Star,
    Store,
} from "lucide-react";

export default function ProductStatusSection({
    form,
    onChange,
}) {
    return (
        <div className="space-y-[12px]">
            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <h2 className="text-[13px] font-semibold text-[#111827]">
                        Status
                    </h2>

                    <div className="mt-[13px]">
                        <select
                            value={form.status}
                            onChange={(event) =>
                                onChange(
                                    "status",
                                    event.target.value
                                )
                            }
                            className="h-[38px] w-full rounded-[10px] border border-[#ccd3dc] bg-white px-[11px] text-[11.5px] text-[#303945] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                        >
                            <option value="draft">
                                Draft
                            </option>

                            <option value="active">
                                Active
                            </option>
                        </select>

                        <p className="mt-[6px] text-[9.5px] leading-[15px] text-[#858e99]">
                            Draft products are hidden from customers.
                        </p>
                    </div>

                    <div className="my-[14px] h-px bg-[#e9ecef]" />

                    <ToggleRow
                        icon={Star}
                        title="Featured product"
                        description="Show this product in featured placements."
                        checked={Boolean(
                            form.is_featured
                        )}
                        onChange={(checked) =>
                            onChange(
                                "is_featured",
                                checked
                            )
                        }
                    />
                </div>
            </section>

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <div>
                        <h2 className="text-[13px] font-semibold text-[#111827]">
                            Publishing
                        </h2>

                        <p className="mt-[3px] text-[9.5px] leading-[15px] text-[#858e99]">
                            Choose where this product is available.
                        </p>
                    </div>

                    <div className="mt-[14px] space-y-[13px]">
                        <ToggleRow
                            icon={MonitorSmartphone}
                            title="Online store"
                            description="Available on the ecommerce storefront."
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

                        <div className="h-px bg-[#edf0f2]" />

                        <ToggleRow
                            icon={Store}
                            title="Point of sale"
                            description="Available for in-store sales."
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
                    </div>
                </div>
            </section>
        </div>
    );
}


function ToggleRow({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="flex items-start justify-between gap-[10px]">
            <div className="flex min-w-0 gap-[9px]">
                <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6] text-[#747e8a]">
                    <Icon
                        size={13}
                        strokeWidth={1.8}
                    />
                </div>

                <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#303946]">
                        {title}
                    </p>

                    <p className="mt-[2px] text-[9.5px] leading-[14px] text-[#858e99]">
                        {description}
                    </p>
                </div>
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
                "mt-[2px]",
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