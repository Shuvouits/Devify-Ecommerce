import {
    Building2,
    FolderTree,
    Layers3,
    Tags,
    X,
} from "lucide-react";

export default function ProductOrganizationSection({
    form,
    brands = [],
    categories = [],
    collections = [],
    onChange,
    selectedCollections = [],
    onCollectionsChange,
}) {
    const isCollectionSelected = (
        collectionId
    ) => {
        return selectedCollections.some(
            (item) =>
                Number(
                    item.collection_id
                ) ===
                Number(collectionId)
        );
    };

    const toggleCollection = (
        collection
    ) => {
        const selected =
            isCollectionSelected(
                collection.id
            );

        if (selected) {
            onCollectionsChange(
                selectedCollections.filter(
                    (item) =>
                        Number(
                            item.collection_id
                        ) !==
                        Number(
                            collection.id
                        )
                )
            );

            return;
        }

        onCollectionsChange([
            ...selectedCollections,
            {
                collection_id:
                    collection.id,

                display_order:
                    selectedCollections.length +
                    1,
            },
        ]);
    };

    const tags =
        Array.isArray(form.tags)
            ? form.tags
            : [];

    const addTag = (value) => {
        const tag =
            String(value || "")
                .trim();

        if (!tag) {
            return;
        }

        const exists =
            tags.some(
                (item) =>
                    item.toLowerCase() ===
                    tag.toLowerCase()
            );

        if (exists) {
            return;
        }

        onChange(
            "tags",
            [
                ...tags,
                tag,
            ]
        );
    };

    const removeTag = (
        index
    ) => {
        onChange(
            "tags",
            tags.filter(
                (_, tagIndex) =>
                    tagIndex !== index
            )
        );
    };

    const handleTagKeyDown = (
        event
    ) => {
        if (
            event.key !== "Enter" &&
            event.key !== ","
        ) {
            return;
        }

        event.preventDefault();

        addTag(
            event.currentTarget.value
        );

        event.currentTarget.value =
            "";
    };

    return (
        <div className="space-y-[12px]">
            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <h2 className="text-[13px] font-semibold text-[#111827]">
                        Product organization
                    </h2>

                    <div className="mt-[14px] space-y-[13px]">
                        <SelectField
                            icon={Building2}
                            label="Brand"
                            value={
                                form.brand_id ||
                                ""
                            }
                            onChange={(value) =>
                                onChange(
                                    "brand_id",
                                    value
                                        ? Number(
                                              value
                                          )
                                        : null
                                )
                            }
                        >
                            <option value="">
                                No brand
                            </option>

                            {brands.map(
                                (brand) => (
                                    <option
                                        key={
                                            brand.id
                                        }
                                        value={
                                            brand.id
                                        }
                                    >
                                        {
                                            brand.name
                                        }
                                    </option>
                                )
                            )}
                        </SelectField>

                        <SelectField
                            icon={FolderTree}
                            label="Category"
                            value={
                                form.category_id ||
                                ""
                            }
                            onChange={(value) =>
                                onChange(
                                    "category_id",
                                    value
                                        ? Number(
                                              value
                                          )
                                        : null
                                )
                            }
                        >
                            <option value="">
                                No category
                            </option>

                            {categories.map(
                                (
                                    category
                                ) => (
                                    <option
                                        key={
                                            category.id
                                        }
                                        value={
                                            category.id
                                        }
                                    >
                                        {
                                            category.name
                                        }
                                    </option>
                                )
                            )}
                        </SelectField>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <div className="flex items-center gap-[7px]">
                        <Layers3
                            size={13}
                            strokeWidth={1.8}
                            className="text-[#7e8792]"
                        />

                        <h2 className="text-[13px] font-semibold text-[#111827]">
                            Collections
                        </h2>
                    </div>

                    {collections.length ===
                    0 ? (
                        <div className="mt-[12px] rounded-[10px] border border-dashed border-[#d7dce2] bg-[#fafbfc] px-3 py-5 text-center text-[10px] text-[#89929d]">
                            No collections available.
                        </div>
                    ) : (
                        <div className="mt-[12px] flex flex-wrap gap-[6px]">
                            {collections.map(
                                (
                                    collection
                                ) => {
                                    const selected =
                                        isCollectionSelected(
                                            collection.id
                                        );

                                    return (
                                        <button
                                            key={
                                                collection.id
                                            }
                                            type="button"
                                            onClick={() =>
                                                toggleCollection(
                                                    collection
                                                )
                                            }
                                            className={[
                                                "inline-flex",
                                                "min-h-[29px]",
                                                "items-center",
                                                "rounded-[8px]",
                                                "border",
                                                "px-[9px]",
                                                "py-[5px]",
                                                "text-[10px]",
                                                "font-medium",
                                                "transition",
                                                selected
                                                    ? "border-[#111827] bg-[#111827] text-white"
                                                    : "border-[#d9dee4] bg-white text-[#59636f] hover:bg-[#f8f9fa]",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {
                                                collection.title
                                            }
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="p-[18px]">
                    <div className="flex items-center gap-[7px]">
                        <Tags
                            size={13}
                            strokeWidth={1.8}
                            className="text-[#7e8792]"
                        />

                        <h2 className="text-[13px] font-semibold text-[#111827]">
                            Tags
                        </h2>
                    </div>

                    <div className="mt-[12px] rounded-[10px] border border-[#ccd3dc] bg-white px-[9px] py-[8px] transition focus-within:border-[#7da0f8] focus-within:ring-2 focus-within:ring-[#eef3ff]">
                        {tags.length >
                            0 && (
                            <div className="mb-[7px] flex flex-wrap gap-[5px]">
                                {tags.map(
                                    (
                                        tag,
                                        index
                                    ) => (
                                        <span
                                            key={`${tag}-${index}`}
                                            className="inline-flex h-[24px] items-center gap-[5px] rounded-[7px] bg-[#f1f3f5] px-[7px] text-[9.5px] font-medium text-[#59636f]"
                                        >
                                            {
                                                tag
                                            }

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTag(
                                                        index
                                                    )
                                                }
                                                className="flex h-[14px] w-[14px] items-center justify-center rounded-[4px] text-[#8a939e] transition hover:bg-[#e1e4e8] hover:text-[#404955]"
                                            >
                                                <X
                                                    size={
                                                        10
                                                    }
                                                    strokeWidth={
                                                        2
                                                    }
                                                />
                                            </button>
                                        </span>
                                    )
                                )}
                            </div>
                        )}

                        <input
                            type="text"
                            onKeyDown={
                                handleTagKeyDown
                            }
                            onBlur={(
                                event
                            ) => {
                                if (
                                    event.target.value.trim()
                                ) {
                                    addTag(
                                        event.target.value
                                    );

                                    event.target.value =
                                        "";
                                }
                            }}
                            placeholder="Add tags"
                            className="h-[24px] w-full border-0 bg-transparent px-[2px] text-[10.5px] text-[#303945] outline-none placeholder:text-[#9da5af]"
                        />
                    </div>

                    <p className="mt-[5px] text-[9px] text-[#9098a2]">
                        Press Enter or comma to add a tag.
                    </p>
                </div>
            </section>
        </div>
    );
}


function SelectField({
    icon: Icon,
    label,
    value,
    onChange,
    children,
}) {
    return (
        <div>
            <label className="mb-[6px] flex items-center gap-[6px] text-[10.5px] font-medium text-[#454f5b]">
                <Icon
                    size={12}
                    strokeWidth={1.8}
                    className="text-[#8a939e]"
                />

                {label}
            </label>

            <select
                value={value}
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