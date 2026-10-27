import {
    Layers3,
    Sparkles,
} from "lucide-react";


export default function CollectionKindSection({
    form,
    onChange,
}) {
    const isAutomated =
        form.collection_type ===
        "automated";

    const conditions =
        Array.isArray(
            form.automation_conditions
        )
            ? form.automation_conditions
            : [];


    const addCondition = () => {
        onChange(
            "automation_conditions",
            [
                ...conditions,
                {
                    field: "title",
                    operator: "contains",
                    value: "",
                },
            ]
        );
    };


    const updateCondition = (
        index,
        field,
        value
    ) => {
        const next =
            conditions.map(
                (
                    item,
                    itemIndex
                ) =>
                    itemIndex ===
                    index
                        ? {
                              ...item,
                              [field]:
                                  value,
                          }
                        : item
            );

        onChange(
            "automation_conditions",
            next
        );
    };


    const removeCondition = (
        index
    ) => {
        onChange(
            "automation_conditions",
            conditions.filter(
                (
                    _,
                    itemIndex
                ) =>
                    itemIndex !==
                    index
            )
        );
    };


    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                <h2 className="text-[14px] font-semibold text-[#111827]">
                    Collection Configuration
                </h2>


                {/* Kind */}

                <div className="mt-[14px]">
                    <p className="mb-[7px] text-[11px] font-medium text-[#202833]">
                        Kind
                    </p>

                    <div className="grid gap-[9px] sm:grid-cols-2">
                        <OptionCard
                            active={
                                form.kind ===
                                "collection"
                            }
                            title="Collection"
                            description="A standard group of products."
                            icon={
                                Layers3
                            }
                            onClick={() =>
                                onChange(
                                    "kind",
                                    "collection"
                                )
                            }
                        />

                        <OptionCard
                            active={
                                form.kind ===
                                "look"
                            }
                            title="Look"
                            description="A curated visual grouping for merchandising."
                            icon={
                                Sparkles
                            }
                            onClick={() =>
                                onChange(
                                    "kind",
                                    "look"
                                )
                            }
                        />
                    </div>
                </div>


                {/* Collection Type */}

                <div className="mt-[17px]">
                    <p className="mb-[7px] text-[11px] font-medium text-[#202833]">
                        Collection Type
                    </p>

                    <div className="grid gap-[9px] sm:grid-cols-2">
                        <TypeCard
                            active={
                                form.collection_type ===
                                "manual"
                            }
                            title="Manual"
                            description="Choose the products you want to include."
                            onClick={() =>
                                onChange(
                                    "collection_type",
                                    "manual"
                                )
                            }
                        />

                        <TypeCard
                            active={
                                form.collection_type ===
                                "automated"
                            }
                            title="Automated"
                            description="Products are matched using conditions."
                            onClick={() =>
                                onChange(
                                    "collection_type",
                                    "automated"
                                )
                            }
                        />
                    </div>
                </div>


                {/* Automated Rules */}

                {isAutomated && (
                    <div className="mt-[17px] rounded-[13px] border border-[#e1e5e9] bg-[#fafbfc] p-[13px]">
                        <div className="flex flex-col gap-[8px] sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10.5px] font-medium text-[#303945]">
                                    Match products when
                                </p>

                                <p className="mt-[2px] text-[9px] text-[#858e99]">
                                    Define the rules used to build this collection.
                                </p>
                            </div>

                            <select
                                value={
                                    form.automation_match_type
                                }
                                onChange={(event) =>
                                    onChange(
                                        "automation_match_type",
                                        event.target
                                            .value
                                    )
                                }
                                className="h-[34px] rounded-[8px] border border-[#ccd3dc] bg-white px-[9px] text-[10px] text-[#303945] outline-none focus:border-[#7da0f8]"
                            >
                                <option value="all">
                                    All conditions
                                </option>

                                <option value="any">
                                    Any condition
                                </option>
                            </select>
                        </div>


                        <div className="mt-[11px] space-y-[8px]">
                            {conditions.map(
                                (
                                    condition,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="grid gap-[7px] rounded-[10px] border border-[#e4e7eb] bg-white p-[8px] sm:grid-cols-[1fr_1fr_1.2fr_30px]"
                                    >
                                        <select
                                            value={
                                                condition.field
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateCondition(
                                                    index,
                                                    "field",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="h-[34px] rounded-[8px] border border-[#ccd3dc] bg-white px-[8px] text-[10px] text-[#303945] outline-none focus:border-[#7da0f8]"
                                        >
                                            <option value="title">
                                                Product title
                                            </option>

                                            <option value="vendor">
                                                Vendor
                                            </option>

                                            <option value="category">
                                                Category
                                            </option>

                                            <option value="price">
                                                Price
                                            </option>

                                            <option value="tag">
                                                Tag
                                            </option>
                                        </select>

                                        <select
                                            value={
                                                condition.operator
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateCondition(
                                                    index,
                                                    "operator",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="h-[34px] rounded-[8px] border border-[#ccd3dc] bg-white px-[8px] text-[10px] text-[#303945] outline-none focus:border-[#7da0f8]"
                                        >
                                            <option value="contains">
                                                Contains
                                            </option>

                                            <option value="equals">
                                                Equals
                                            </option>

                                            <option value="not_equals">
                                                Does not equal
                                            </option>

                                            <option value="greater_than">
                                                Greater than
                                            </option>

                                            <option value="less_than">
                                                Less than
                                            </option>
                                        </select>

                                        <input
                                            type="text"
                                            value={
                                                condition.value ??
                                                ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateCondition(
                                                    index,
                                                    "value",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Value"
                                            className="h-[34px] rounded-[8px] border border-[#ccd3dc] bg-white px-[9px] text-[10px] text-[#303945] outline-none placeholder:text-[#9aa2ad] focus:border-[#7da0f8]"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeCondition(
                                                    index
                                                )
                                            }
                                            className="flex h-[34px] w-[30px] items-center justify-center rounded-[8px] text-[14px] text-[#8b95a1] transition hover:bg-red-50 hover:text-red-600"
                                            title="Remove condition"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )
                            )}
                        </div>


                        <button
                            type="button"
                            onClick={
                                addCondition
                            }
                            className="mt-[9px] h-[31px] rounded-[8px] border border-[#d9dee4] bg-white px-[10px] text-[9.5px] font-medium text-[#4f5965] transition hover:bg-[#f7f8fa]"
                        >
                            Add condition
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}


function OptionCard({
    active,
    title,
    description,
    icon: Icon,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={[
                "flex",
                "min-h-[86px]",
                "items-start",
                "gap-[10px]",
                "rounded-[12px]",
                "border",
                "p-[11px]",
                "text-left",
                "transition",
                active
                    ? "border-[#4f7df3] bg-[#f4f7ff] ring-1 ring-[#dce6ff]"
                    : "border-[#e0e4e8] bg-white hover:bg-[#fafbfc]",
            ].join(" ")}
        >
            <div
                className={[
                    "mt-[1px]",
                    "flex",
                    "h-[31px]",
                    "w-[31px]",
                    "shrink-0",
                    "items-center",
                    "justify-center",
                    "rounded-[9px]",
                    active
                        ? "bg-[#e8efff] text-[#4f7df3]"
                        : "bg-[#f3f4f6] text-[#737d88]",
                ].join(" ")}
            >
                <Icon
                    size={14}
                    strokeWidth={1.8}
                />
            </div>

            <div>
                <p className="text-[10.5px] font-semibold text-[#202833]">
                    {title}
                </p>

                <p className="mt-[3px] text-[9px] leading-[14px] text-[#7f8893]">
                    {description}
                </p>
            </div>
        </button>
    );
}


function TypeCard({
    active,
    title,
    description,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={[
                "relative",
                "min-h-[78px]",
                "rounded-[12px]",
                "border",
                "p-[11px]",
                "text-left",
                "transition",
                active
                    ? "border-[#4f7df3] bg-[#f4f7ff] ring-1 ring-[#dce6ff]"
                    : "border-[#e0e4e8] bg-white hover:bg-[#fafbfc]",
            ].join(" ")}
        >
            <span
                className={[
                    "absolute",
                    "right-[10px]",
                    "top-[10px]",
                    "h-[13px]",
                    "w-[13px]",
                    "rounded-full",
                    "border",
                    active
                        ? "border-[#4f7df3] bg-[#4f7df3] shadow-[inset_0_0_0_3px_white]"
                        : "border-[#cbd1d8] bg-white",
                ].join(" ")}
            />

            <p className="pr-[24px] text-[10.5px] font-semibold text-[#202833]">
                {title}
            </p>

            <p className="mt-[3px] pr-[18px] text-[9px] leading-[14px] text-[#7f8893]">
                {description}
            </p>
        </button>
    );
}