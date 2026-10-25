import { Pencil } from "lucide-react";

export default function GlobalVariantCard({
    variant,
    onEdit,
}) {
    const options =
        Array.isArray(variant?.options)
            ? variant.options
            : [];

    const isColor =
        variant?.visual_type === "color";

    return (
        <div className="flex min-h-[68px] w-full items-center rounded-[20px] border border-gray-200 bg-white px-5 py-3">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <h3 className="min-w-[72px] shrink-0 text-[15px] font-semibold text-gray-950">
                    {variant?.name}
                </h3>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {options.map((option) => {
                        if (isColor) {
                            return (
                                <span
                                    key={option.id}
                                    className="inline-flex h-7 items-center gap-2 rounded-full bg-gray-100 px-3 text-[12px] font-medium text-gray-600"
                                >
                                    <span
                                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                                        style={{
                                            backgroundColor:
                                                option.color_hex ||
                                                "#D1D5DB",
                                        }}
                                    />

                                    <span>
                                        {option.value}
                                    </span>
                                </span>
                            );
                        }

                        return (
                            <span
                                key={option.id}
                                className="inline-flex h-7 items-center rounded-full bg-gray-100 px-3 text-[12px] font-medium text-gray-600"
                            >
                                {option.value}
                            </span>
                        );
                    })}
                </div>
            </div>

            <button
                type="button"
                onClick={onEdit}
                className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label={`Edit ${variant?.name ?? "variant"}`}
                title="Edit variant"
            >
                <Pencil
                    size={16}
                    strokeWidth={1.8}
                />
            </button>
        </div>
    );
}