import {
    Barcode,
    MapPin,
    PackageSearch,
} from "lucide-react";

export default function ProductInventorySection({
    form,
    locations = [],
    inventories = [],
    onChange,
    onInventoriesChange,
    hasVariants = false,
}) {
    const getInventoryForLocation = (
        locationId
    ) => {
        return (
            inventories.find(
                (item) =>
                    Number(
                        item.location_id
                    ) ===
                        Number(
                            locationId
                        ) &&
                    !item.product_variant_id
            ) || null
        );
    };

    const updateLocationInventory = (
        locationId,
        field,
        value
    ) => {
        const existing =
            getInventoryForLocation(
                locationId
            );

        let nextInventories;

        if (existing) {
            nextInventories =
                inventories.map(
                    (item) =>
                        Number(
                            item.location_id
                        ) ===
                                Number(
                                    locationId
                                ) &&
                            !item.product_variant_id
                            ? {
                                  ...item,
                                  [field]:
                                      value,
                              }
                            : item
                );
        } else {
            nextInventories = [
                ...inventories,
                {
                    location_id:
                        Number(
                            locationId
                        ),

                    product_variant_id:
                        null,

                    quantity:
                        field ===
                        "quantity"
                            ? value
                            : 0,

                    reserved_quantity:
                        field ===
                        "reserved_quantity"
                            ? value
                            : 0,

                    incoming_quantity:
                        field ===
                        "incoming_quantity"
                            ? value
                            : 0,
                },
            ];
        }

        onInventoriesChange(
            nextInventories
        );
    };

    const totalQuantity =
        inventories
            .filter(
                (item) =>
                    !item.product_variant_id
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity ||
                            0
                    ),
                0
            );

    const totalReserved =
        inventories
            .filter(
                (item) =>
                    !item.product_variant_id
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.reserved_quantity ||
                            0
                    ),
                0
            );

    const availableQuantity =
        Math.max(
            totalQuantity -
                totalReserved,
            0
        );

    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                <h2 className="text-[14px] font-semibold text-[#111827]">
                    Inventory
                </h2>

                <div className="mt-[15px] grid gap-[12px] md:grid-cols-2">
                    <Field
                        label="SKU"
                        icon={
                            PackageSearch
                        }
                        value={
                            form.sku
                        }
                        placeholder="e.g. TSHIRT-BLK-001"
                        onChange={(
                            value
                        ) =>
                            onChange(
                                "sku",
                                value
                            )
                        }
                    />

                    <Field
                        label="Barcode"
                        icon={Barcode}
                        value={
                            form.barcode
                        }
                        placeholder="ISBN, UPC, GTIN, etc."
                        onChange={(
                            value
                        ) =>
                            onChange(
                                "barcode",
                                value
                            )
                        }
                    />
                </div>

                <div className="my-[17px] h-px bg-[#e8eaed]" />

                <ToggleRow
                    title="Track quantity"
                    description="Track stock levels for this product."
                    checked={Boolean(
                        form.track_quantity
                    )}
                    onChange={(
                        checked
                    ) =>
                        onChange(
                            "track_quantity",
                            checked
                        )
                    }
                />

                {form.track_quantity && (
                    <>
                        <div className="my-[15px] h-px bg-[#eef0f2]" />

                        <ToggleRow
                            title="Continue selling when out of stock"
                            description="Allow customers to purchase this product when inventory reaches zero."
                            checked={Boolean(
                                form.continue_selling_when_out_of_stock
                            )}
                            onChange={(
                                checked
                            ) =>
                                onChange(
                                    "continue_selling_when_out_of_stock",
                                    checked
                                )
                            }
                        />
                    </>
                )}

                {form.track_quantity &&
                    !hasVariants && (
                        <>
                            <div className="my-[17px] h-px bg-[#e8eaed]" />

                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-[12px] font-semibold text-[#222b38]">
                                        Inventory
                                        by location
                                    </h3>

                                    <p className="mt-[3px] text-[10px] text-[#7a838f]">
                                        Manage
                                        stock for
                                        each store
                                        or
                                        warehouse.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-[6px]">
                                    <SummaryBadge
                                        label="On hand"
                                        value={
                                            totalQuantity
                                        }
                                    />

                                    <SummaryBadge
                                        label="Reserved"
                                        value={
                                            totalReserved
                                        }
                                    />

                                    <SummaryBadge
                                        label="Available"
                                        value={
                                            availableQuantity
                                        }
                                    />
                                </div>
                            </div>

                            {locations.length ===
                            0 ? (
                                <div className="mt-[14px] rounded-[12px] border border-dashed border-[#d5dae1] bg-[#fafbfc] px-5 py-7 text-center">
                                    <MapPin
                                        size={
                                            18
                                        }
                                        strokeWidth={
                                            1.7
                                        }
                                        className="mx-auto text-[#98a1ad]"
                                    />

                                    <p className="mt-2 text-[11.5px] font-medium text-[#4c5664]">
                                        No
                                        active
                                        locations
                                    </p>

                                    <p className="mt-1 text-[10px] text-[#8a939e]">
                                        Add a
                                        location
                                        before
                                        assigning
                                        inventory.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-[14px] overflow-x-auto rounded-[12px] border border-[#e1e5ea]">
                                    <div className="min-w-[610px]">
                                        <div className="grid grid-cols-[minmax(190px,1fr)_105px_105px_105px] bg-[#f8f9fa] px-[13px] py-[8px]">
                                            <TableHeader>
                                                Location
                                            </TableHeader>

                                            <TableHeader>
                                                On
                                                hand
                                            </TableHeader>

                                            <TableHeader>
                                                Reserved
                                            </TableHeader>

                                            <TableHeader>
                                                Incoming
                                            </TableHeader>
                                        </div>

                                        {locations.map(
                                            (
                                                location
                                            ) => {
                                                const inventory =
                                                    getInventoryForLocation(
                                                        location.id
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            location.id
                                                        }
                                                        className="grid grid-cols-[minmax(190px,1fr)_105px_105px_105px] items-center border-t border-[#edf0f2] px-[13px] py-[10px]"
                                                    >
                                                        <div className="min-w-0 pr-[10px]">
                                                            <div className="flex items-center gap-[7px]">
                                                                <MapPin
                                                                    size={
                                                                        13
                                                                    }
                                                                    strokeWidth={
                                                                        1.8
                                                                    }
                                                                    className="shrink-0 text-[#8b95a1]"
                                                                />

                                                                <span className="truncate text-[11px] font-medium text-[#323b47]">
                                                                    {
                                                                        location.name
                                                                    }
                                                                </span>
                                                            </div>

                                                            {location.is_default && (
                                                                <span className="ml-[20px] mt-[3px] inline-flex rounded-full bg-[#f0f2f4] px-[6px] py-[2px] text-[8.5px] font-medium text-[#6d7580]">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>

                                                        <NumberInput
                                                            value={
                                                                inventory?.quantity ??
                                                                0
                                                            }
                                                            onChange={(
                                                                value
                                                            ) =>
                                                                updateLocationInventory(
                                                                    location.id,
                                                                    "quantity",
                                                                    value
                                                                )
                                                            }
                                                        />

                                                        <NumberInput
                                                            value={
                                                                inventory?.reserved_quantity ??
                                                                0
                                                            }
                                                            onChange={(
                                                                value
                                                            ) =>
                                                                updateLocationInventory(
                                                                    location.id,
                                                                    "reserved_quantity",
                                                                    value
                                                                )
                                                            }
                                                        />

                                                        <NumberInput
                                                            value={
                                                                inventory?.incoming_quantity ??
                                                                0
                                                            }
                                                            onChange={(
                                                                value
                                                            ) =>
                                                                updateLocationInventory(
                                                                    location.id,
                                                                    "incoming_quantity",
                                                                    value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                {hasVariants && (
                    <>
                        <div className="my-[17px] h-px bg-[#e8eaed]" />

                        <div className="rounded-[12px] border border-[#e2e5e9] bg-[#f8f9fa] px-[13px] py-[11px]">
                            <p className="text-[11.5px] font-medium text-[#303946]">
                                Inventory is
                                managed per
                                variant
                            </p>

                            <p className="mt-[3px] text-[10px] leading-[16px] text-[#7b8490]">
                                Stock
                                quantities
                                for this
                                product are
                                configured
                                inside each
                                sellable
                                variant.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}


function Field({
    label,
    icon: Icon,
    value,
    placeholder,
    onChange,
}) {
    return (
        <div>
            <label className="mb-[7px] block text-[11.5px] font-medium text-[#111827]">
                {label}
            </label>

            <div className="relative">
                <Icon
                    size={14}
                    strokeWidth={1.8}
                    className="absolute left-[11px] top-1/2 -translate-y-1/2 text-[#8e97a3]"
                />

                <input
                    type="text"
                    value={value ?? ""}
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                    }
                    placeholder={
                        placeholder
                    }
                    className="h-[38px] w-full rounded-[11px] border border-[#ccd3dc] bg-white pl-[33px] pr-[11px] text-[12px] text-[#222b38] outline-none transition placeholder:text-[#a0a7b0] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                />
            </div>
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
        <div className="flex items-start justify-between gap-5">
            <div>
                <p className="text-[11.5px] font-medium text-[#202833]">
                    {title}
                </p>

                <p className="mt-[3px] text-[10px] leading-[16px] text-[#7a838f]">
                    {description}
                </p>
            </div>

            <Toggle
                checked={checked}
                onChange={
                    onChange
                }
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


function NumberInput({
    value,
    onChange,
}) {
    return (
        <input
            type="number"
            min="0"
            step="1"
            value={value}
            onChange={(
                event
            ) =>
                onChange(
                    event.target
                        .value === ""
                        ? 0
                        : Number(
                              event
                                  .target
                                  .value
                          )
                )
            }
            className="h-[32px] w-[84px] rounded-[8px] border border-[#d3d8df] bg-white px-[8px] text-[11px] text-[#303945] outline-none transition focus:border-[#7da0f8]"
        />
    );
}


function SummaryBadge({
    label,
    value,
}) {
    return (
        <div className="rounded-[7px] bg-[#f1f3f5] px-[8px] py-[5px]">
            <span className="text-[8.5px] font-medium uppercase tracking-[0.04em] text-[#8a939d]">
                {label}
            </span>

            <span className="ml-[5px] text-[10.5px] font-semibold text-[#343d49]">
                {value}
            </span>
        </div>
    );
}


function TableHeader({
    children,
}) {
    return (
        <span className="text-[9px] font-semibold uppercase tracking-[0.04em] text-[#828c98]">
            {children}
        </span>
    );
}