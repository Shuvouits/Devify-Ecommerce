import { X } from "lucide-react";


export default function LocationFormModal({
    open = false,
    form,
    errors = {},
    saving = false,
    editingLocation = null,
    onChange,
    onClose,
    onSubmit,
}) {
    if (!open) {
        return null;
    }

    const isEditing =
        Boolean(editingLocation);


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-6">
            <div className="flex max-h-[86vh] w-full max-w-[500px] flex-col overflow-hidden rounded-[14px] border border-[#dfe1e4] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.22)]">

                {/* Header */}
                <div className="flex shrink-0 items-start justify-between px-[26px] pb-[12px] pt-[21px]">
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#171a1f]">
                            {isEditing
                                ? "Edit Location"
                                : "Add Location"}
                        </h2>

                        <p className="mt-[4px] text-[12.5px] leading-[18px] text-[#68717c]">
                            {isEditing
                                ? "Update the location details"
                                : "Add a warehouse, shop, or collection point for your store"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="ml-4 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[7px] text-[#5f6670] transition hover:bg-[#f3f4f5] hover:text-[#20252b] disabled:opacity-50"
                    >
                        <X
                            size={16}
                            strokeWidth={1.8}
                        />
                    </button>
                </div>


                <form
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable Content */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-[26px] pb-[20px]">

                        {/* Name */}
                        <FormField
                            label="Name"
                            error={errors.name}
                        >
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                placeholder="e.g. Main Store"
                                className={inputClass(
                                    errors.name
                                )}
                            />
                        </FormField>


                        {/* Address */}
                        <div className="mt-[14px]">
                            <FormField
                                label="Address"
                                required
                                error={errors.address}
                            >
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={onChange}
                                    rows={3}
                                    placeholder="Enter the location address"
                                    className={`${inputClass(
                                        errors.address
                                    )} min-h-[68px] resize-none py-[10px]`}
                                />
                            </FormField>
                        </div>


                        {/* Services */}
                        <div className="mt-[16px] overflow-hidden rounded-[14px] border border-[#e1e3e6] bg-white">
                            <ToggleRow
                                name="can_collect"
                                checked={
                                    form.can_collect
                                }
                                onChange={onChange}
                                title="Customers can collect here"
                                description="Off for a warehouse. On for a shop the public can walk into."
                            />

                            <Divider />

                            <ToggleRow
                                name="ships_online_orders"
                                checked={
                                    form.ships_online_orders
                                }
                                onChange={onChange}
                                title="Ship online orders from here"
                                description="Off for a counter that only hands over what is brought to it. Delivery orders draw stock from the first branch in your list that has it."
                            />

                            <Divider />

                            <ToggleRow
                                name="sells_over_counter"
                                checked={
                                    form.sells_over_counter
                                }
                                onChange={onChange}
                                title="Sell over a counter here"
                                description="Off for a warehouse or collection point with no till. Only places with this on are offered to a cashier opening the register."
                            />

                            <Divider />

                            <ToggleRow
                                name="receives_returns"
                                checked={
                                    form.receives_returns
                                }
                                onChange={onChange}
                                title="Receive returns here"
                                description="Offered as the return address when a return is approved. With none on, returns go back to where the parcel was sent from."
                            />
                        </div>


                        {/* Default Location */}
                        <div className="mt-[16px] rounded-[14px] border border-[#e1e3e6] bg-white">
                            <ToggleRow
                                name="is_default"
                                checked={
                                    Boolean(
                                        form.is_default
                                    )
                                }
                                onChange={onChange}
                                title="Default Location"
                                description="New POS orders will use this location by default"
                                compact
                            />
                        </div>


                        {/* Active */}
                        {isEditing && (
                            <div className="mt-[16px] rounded-[14px] border border-[#e1e3e6] bg-white">
                                <ActiveToggle
                                    active={
                                        form.status ===
                                        "active"
                                    }
                                    onChange={
                                        onChange
                                    }
                                />
                            </div>
                        )}
                    </div>


                    {/* Footer */}
                    <div className="flex shrink-0 items-center justify-end gap-[9px] border-t border-[#e6e7e9] bg-white px-[26px] py-[14px]">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="h-[36px] rounded-[9px] border border-[#dfe1e4] bg-white px-[16px] text-[12px] font-semibold text-[#272c32] transition hover:bg-[#f7f7f8] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex h-[36px] min-w-[64px] items-center justify-center gap-2 rounded-[9px] bg-[#3677f5] px-[16px] text-[12px] font-semibold text-white transition hover:bg-[#2f6ce3] disabled:opacity-50"
                        >
                            {saving && (
                                <Spinner />
                            )}

                            {saving
                                ? "Saving..."
                                : isEditing
                                  ? "Save"
                                  : "Add Location"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Active Toggle
|--------------------------------------------------------------------------
*/

function ActiveToggle({
    active,
    onChange,
}) {
    return (
        <label className="flex cursor-pointer items-start gap-[14px] px-[13px] py-[12px]">
            <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold leading-[17px] text-[#181c21]">
                    Active
                </p>

                <p className="mt-[2px] text-[10.5px] leading-[14px] text-[#6f7780]">
                    Inactive locations are hidden
                    from products, inventory and POS
                </p>
            </div>

            <div className="relative mt-[2px] shrink-0">
                <input
                    type="checkbox"
                    checked={active}
                    onChange={(event) =>
                        onChange({
                            target: {
                                name: "status",
                                type: "select-one",
                                value:
                                    event.target
                                        .checked
                                        ? "active"
                                        : "inactive",
                            },
                        })
                    }
                    className="peer sr-only"
                />

                <div className="h-[20px] w-[34px] rounded-full bg-[#cbd5df] transition peer-checked:bg-[#3677f5]" />

                <div className="absolute left-[2px] top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[14px]" />
            </div>
        </label>
    );
}


/*
|--------------------------------------------------------------------------
| Form Field
|--------------------------------------------------------------------------
*/

function FormField({
    label,
    required = false,
    error,
    children,
}) {
    return (
        <div>
            <label className="mb-[6px] block text-[12px] font-semibold text-[#1d2228]">
                {label}

                {required && (
                    <span className="ml-[5px] text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <p className="mt-[5px] text-[10.5px] text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Toggle Row
|--------------------------------------------------------------------------
*/

function ToggleRow({
    name,
    checked,
    onChange,
    title,
    description,
    compact = false,
}) {
    return (
        <label
            className={`flex cursor-pointer items-start gap-[14px] px-[13px] ${
                compact
                    ? "py-[12px]"
                    : "py-[11px]"
            }`}
        >
            <div className="min-w-0 flex-1">
                <p className="text-[12px] font-semibold leading-[17px] text-[#181c21]">
                    {title}
                </p>

                <p className="mt-[2px] pr-[5px] text-[10.5px] leading-[14px] text-[#6f7780]">
                    {description}
                </p>
            </div>

            <div className="relative mt-[2px] shrink-0">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />

                <div className="h-[20px] w-[34px] rounded-full bg-[#cbd5df] transition peer-checked:bg-[#3677f5]" />

                <div className="absolute left-[2px] top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[14px]" />
            </div>
        </label>
    );
}


/*
|--------------------------------------------------------------------------
| Divider
|--------------------------------------------------------------------------
*/

function Divider() {
    return (
        <div className="mx-[13px] border-t border-[#e8eaec]" />
    );
}


/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
*/

function inputClass(error) {
    return `h-[38px] w-full rounded-[11px] border bg-white px-[12px] text-[12px] text-[#222831] outline-none transition placeholder:text-[#77808a] ${
        error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-[#cdd2d8] focus:border-[#3677f5] focus:ring-2 focus:ring-[#dce8ff]"
    }`;
}


function Spinner() {
    return (
        <span className="h-[14px] w-[14px] animate-spin rounded-full border-2 border-current border-r-transparent" />
    );
}