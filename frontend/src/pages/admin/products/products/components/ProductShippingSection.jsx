import {
    Globe2,
    Ruler,
    Scale,
} from "lucide-react";

export default function ProductShippingSection({
    form,
    onChange,
}) {
    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                <h2 className="text-[14px] font-semibold text-[#111827]">
                    Shipping
                </h2>

                <div className="mt-[15px]">
                    <SectionHeading
                        icon={Scale}
                        title="Weight"
                    />

                    <div className="mt-[10px] grid gap-[12px] sm:grid-cols-[1fr_120px]">
                        <Field
                            label="Product weight"
                            type="number"
                            value={form.weight}
                            placeholder="0"
                            step="0.001"
                            onChange={(value) =>
                                onChange(
                                    "weight",
                                    value
                                )
                            }
                        />

                        <SelectField
                            label="Unit"
                            value={
                                form.weight_unit
                            }
                            onChange={(value) =>
                                onChange(
                                    "weight_unit",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "kg",
                                    label: "kg",
                                },
                                {
                                    value: "g",
                                    label: "g",
                                },
                                {
                                    value: "lb",
                                    label: "lb",
                                },
                                {
                                    value: "oz",
                                    label: "oz",
                                },
                            ]}
                        />
                    </div>
                </div>

                <Divider />

                <div>
                    <SectionHeading
                        icon={Ruler}
                        title="Package dimensions"
                    />

                    <div className="mt-[10px] grid gap-[12px] sm:grid-cols-2 lg:grid-cols-4">
                        <Field
                            label="Length"
                            type="number"
                            value={form.length}
                            placeholder="0"
                            step="0.01"
                            onChange={(value) =>
                                onChange(
                                    "length",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Width"
                            type="number"
                            value={form.width}
                            placeholder="0"
                            step="0.01"
                            onChange={(value) =>
                                onChange(
                                    "width",
                                    value
                                )
                            }
                        />

                        <Field
                            label="Height"
                            type="number"
                            value={form.height}
                            placeholder="0"
                            step="0.01"
                            onChange={(value) =>
                                onChange(
                                    "height",
                                    value
                                )
                            }
                        />

                        <SelectField
                            label="Unit"
                            value={
                                form.size_unit
                            }
                            onChange={(value) =>
                                onChange(
                                    "size_unit",
                                    value
                                )
                            }
                            options={[
                                {
                                    value: "cm",
                                    label: "cm",
                                },
                                {
                                    value: "mm",
                                    label: "mm",
                                },
                                {
                                    value: "in",
                                    label: "in",
                                },
                            ]}
                        />
                    </div>
                </div>

                <Divider />

                <div>
                    <SectionHeading
                        icon={Globe2}
                        title="Customs information"
                        description="Used for international shipping."
                    />

                    <div className="mt-[10px] grid gap-[12px] md:grid-cols-2">
                        <Field
                            label="Country of origin"
                            value={
                                form.country_of_origin
                            }
                            placeholder="e.g. Bangladesh"
                            onChange={(value) =>
                                onChange(
                                    "country_of_origin",
                                    value
                                )
                            }
                        />

                        <Field
                            label="HS code"
                            value={
                                form.hs_code
                            }
                            placeholder="e.g. 6109.10"
                            onChange={(value) =>
                                onChange(
                                    "hs_code",
                                    value
                                )
                            }
                        />
                    </div>

                    <div className="mt-[12px]">
                        <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                            Customs description
                        </label>

                        <textarea
                            value={
                                form.customs_description
                            }
                            onChange={(event) =>
                                onChange(
                                    "customs_description",
                                    event.target.value
                                )
                            }
                            rows={3}
                            maxLength={500}
                            placeholder="Short description for customs documentation."
                            className="min-h-[82px] w-full resize-none rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] py-[9px] text-[12px] leading-[18px] text-[#222b38] outline-none transition placeholder:text-[#a0a7b0] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                        />

                        <div className="mt-[4px] text-right text-[9.5px] text-[#929aa4]">
                            {form
                                .customs_description
                                ?.length || 0}
                            /500
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


function SectionHeading({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-[8px]">
            <div className="mt-[1px] flex h-[24px] w-[24px] items-center justify-center rounded-[7px] bg-[#f3f4f6] text-[#737d89]">
                <Icon
                    size={13}
                    strokeWidth={1.8}
                />
            </div>

            <div>
                <h3 className="text-[11.5px] font-semibold text-[#2a3340]">
                    {title}
                </h3>

                {description && (
                    <p className="mt-[2px] text-[10px] leading-[15px] text-[#7e8792]">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}


function Field({
    label,
    type = "text",
    value,
    placeholder,
    step,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                {label}
            </label>

            <input
                type={type}
                min={
                    type === "number"
                        ? "0"
                        : undefined
                }
                step={step}
                value={value ?? ""}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder={placeholder}
                className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[12px] text-[12px] text-[#222b38] outline-none transition placeholder:text-[#a0a7b0] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
            />
        </div>
    );
}


function SelectField({
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div>
            <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                {label}
            </label>

            <select
                value={value ?? ""}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white px-[10px] text-[12px] text-[#222b38] outline-none transition focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
            >
                {options.map(
                    (option) => (
                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >
                            {
                                option.label
                            }
                        </option>
                    )
                )}
            </select>
        </div>
    );
}


function Divider() {
    return (
        <div className="my-[17px] h-px bg-[#e8eaed]" />
    );
}