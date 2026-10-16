import {
    Check,
    X,
} from "lucide-react";


export default function BrandToast({
    open,
    message,
    onClose,
}) {
    if (!open) {
        return null;
    }


    return (
        <div className="fixed bottom-[28px] right-[28px] z-[400] w-[340px] max-w-[calc(100vw-32px)]">

            <div className="relative flex min-h-[58px] items-center gap-[11px] rounded-[14px] border border-[#e4e7eb] bg-white px-[14px] py-[12px] shadow-[0_14px_40px_rgba(0,0,0,0.14)]">

                {/* Success Icon */}

                <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[#e8fbf0] text-[#13b967]">

                    <Check
                        size={14}
                        strokeWidth={2.5}
                    />

                </div>


                {/* Message */}

                <p className="min-w-0 flex-1 text-[11.5px] font-medium leading-[17px] text-[#252d38]">
                    {message}
                </p>


                {/* Close */}

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full text-[#a0a7af] transition hover:bg-[#f2f3f5] hover:text-[#4c5662]"
                >
                    <X
                        size={13}
                    />
                </button>

            </div>

        </div>
    );
}