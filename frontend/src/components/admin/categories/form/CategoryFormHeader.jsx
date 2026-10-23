import {
    ArrowLeft,
} from "lucide-react";


export default function CategoryFormHeader({
    categoryName,
    status,
    onBack,
    onSave,
    loading,
}) {
    return (
        <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-[9px]">

                <h1 className="text-[18px] font-semibold text-[#171d25]">
                    {categoryName
                        ? categoryName
                        : "Add category"}
                </h1>


                <span
                    className={[
                        "rounded-full",
                        "px-[9px]",
                        "py-[3px]",
                        "text-[10px]",
                        "font-semibold",
                        status === "active"
                            ? "bg-[#316ff4] text-white"
                            : "bg-[#eef0f3] text-[#6e7781]",
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
                    className="flex h-[36px] min-w-[70px] items-center justify-center rounded-[10px] bg-[#316ff4] px-[16px] text-[12px] font-semibold text-white transition hover:bg-[#245fdd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Saving..."
                        : "Save"}
                </button>


                <button
                    type="button"
                    onClick={onBack}
                    className="flex h-[36px] items-center gap-[6px] rounded-[10px] border border-[#dfe3e8] bg-white px-[14px] text-[12px] font-medium text-[#343d48] shadow-sm transition hover:bg-[#f8f9fa]"
                >
                    <ArrowLeft
                        size={14}
                    />

                    Back
                </button>

            </div>

        </div>
    );
}