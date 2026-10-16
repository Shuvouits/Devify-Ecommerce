import {
    ArrowLeft,
} from "lucide-react";


export default function BrandFormHeader({
    brandName,
    status,
    onBack,
    onSave,
    loading,
}) {
    const displayName =
        brandName?.trim() ||
        "New Brand";


    return (
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2.5">

                <h1 className="text-[17px] font-semibold tracking-[-0.25px] text-[#111827]">
                    {displayName}
                </h1>

                <span
                    className={[
                        "inline-flex",
                        "h-[22px]",
                        "items-center",
                        "rounded-full",
                        "px-[9px]",
                        "text-[10.5px]",
                        "font-semibold",
                        status === "active"
                            ? "bg-[#316ff4] text-white"
                            : "bg-[#eef0f3] text-[#68717d]",
                    ].join(" ")}
                >
                    {status === "active"
                        ? "Active"
                        : "Inactive"}
                </span>

            </div>


            <div className="flex items-center gap-2">

                <button
                    type="button"
                    onClick={onSave}
                    disabled={loading}
                    className="inline-flex h-[36px] items-center justify-center rounded-[12px] bg-[#316ff4] px-[17px] text-[12px] font-semibold text-white transition hover:bg-[#2462dc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Saving..."
                        : "Save"}
                </button>


                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="inline-flex h-[36px] items-center gap-2 rounded-[12px] border border-[#dfe2e6] bg-white px-[14px] text-[12px] font-medium text-[#202833] shadow-sm transition hover:bg-[#f8f9fa]"
                >
                    <ArrowLeft
                        size={14}
                        strokeWidth={1.8}
                    />

                    Back
                </button>

            </div>

        </div>
    );
}