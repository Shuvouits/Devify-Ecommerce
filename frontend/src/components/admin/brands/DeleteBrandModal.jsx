import {
    Trash2,
    X,
} from "lucide-react";


export default function DeleteBrandModal({
    open,
    brand,
    loading,
    onClose,
    onConfirm,
}) {
    if (
        !open ||
        !brand
    ) {
        return null;
    }


    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]">

            <div className="relative w-full max-w-[430px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">

                {/* Red Top Accent */}

                <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#ef4444]" />


                {/* Close */}

                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="absolute right-[14px] top-[14px] flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#9aa1aa] transition hover:bg-[#f5f6f7] hover:text-[#303944] disabled:cursor-not-allowed"
                >
                    <X
                        size={16}
                        strokeWidth={1.8}
                    />
                </button>


                <div className="px-[26px] pb-[24px] pt-[27px] text-center">

                    {/* Trash Icon */}

                    <div className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#feecec] text-[#ef2f3d]">

                        <Trash2
                            size={20}
                            strokeWidth={2}
                        />

                    </div>


                    {/* Title */}

                    <h2 className="mt-[17px] text-[17px] font-semibold tracking-[-0.2px] text-[#171d25]">
                        Delete brand
                    </h2>


                    {/* Description */}

                    <p className="mx-auto mt-[8px] max-w-[340px] text-[12px] leading-[19px] text-[#747d88]">
                        Delete{" "}
                        <span className="font-semibold text-[#444d58]">
                            &quot;{brand.name}&quot;
                        </span>
                        ? This action cannot be undone from the admin panel.
                    </p>


                    {/* Buttons */}

                    <div className="mt-[23px] grid grid-cols-2 gap-[10px]">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-[38px] rounded-[10px] border border-[#dde1e6] bg-white text-[12px] font-semibold text-[#303944] transition hover:bg-[#f7f8fa] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="inline-flex h-[38px] items-center justify-center gap-[7px] rounded-[10px] bg-[#ef101c] px-4 text-[12px] font-semibold text-white transition hover:bg-[#d90914] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Trash2
                                size={14}
                                strokeWidth={2}
                            />

                            {loading
                                ? "Deleting..."
                                : "Delete"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}