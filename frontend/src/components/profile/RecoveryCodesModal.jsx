import {
    Check,
    Copy,
    ShieldCheck,
    X,
} from "lucide-react";

import {
    useState,
} from "react";


const RecoveryCodesModal = ({
    open,
    recoveryCodes,
    onClose,
}) => {
    const [copied, setCopied] =
        useState(false);


    if (
        !open ||
        !recoveryCodes?.length
    ) {
        return null;
    }


    const copyAllCodes = async () => {
        await navigator.clipboard.writeText(
            recoveryCodes.join("\n")
        );

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-[20px]">

            <div className="relative w-full max-w-[520px] rounded-[18px] bg-white p-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-[18px] top-[18px] flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#777777] transition hover:bg-[#f4f4f4]"
                >
                    <X size={18} />
                </button>


                <div className="flex items-center gap-[12px]">

                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#edf8f0] text-[#2f8a4e]">
                        <ShieldCheck
                            size={21}
                            strokeWidth={1.8}
                        />
                    </div>


                    <div>
                        <h2 className="!text-[19px] !font-semibold !leading-[26px] text-[#111111]">
                            Save Your Recovery Codes
                        </h2>

                        <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                            Store these codes somewhere safe
                        </p>
                    </div>

                </div>


                <div className="mt-[20px] rounded-[12px] border border-[#f0d7a5] bg-[#fffaf0] px-[14px] py-[12px]">

                    <p className="!text-[12px] !font-normal !leading-[19px] text-[#765719]">
                        Each recovery code can only be used once. You can use one if you lose access to your authenticator app.
                    </p>

                </div>


                <div className="mt-[20px] grid grid-cols-2 gap-[10px]">

                    {recoveryCodes.map(
                        (code) => (
                            <div
                                key={code}
                                className="rounded-[9px] border border-[#e1e1e1] bg-[#fafafa] px-[14px] py-[11px] text-center"
                            >
                                <code className="!text-[13px] !font-semibold tracking-[0.5px] text-[#333333]">
                                    {code}
                                </code>
                            </div>
                        )
                    )}

                </div>


                <div className="mt-[22px] flex justify-end gap-[10px]">

                    <button
                        type="button"
                        onClick={copyAllCodes}
                        className="flex h-[40px] items-center gap-[7px] rounded-full border border-[#d8d8d8] bg-white px-[18px] !text-[13px] !font-medium text-[#444444] transition hover:bg-[#f8f8f8]"
                    >
                        {copied ? (
                            <>
                                <Check
                                    size={15}
                                    className="text-[#2d8d4d]"
                                />

                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={15} />

                                Copy all
                            </>
                        )}
                    </button>


                    <button
                        type="button"
                        onClick={onClose}
                        className="h-[40px] rounded-full bg-[#286bd7] px-[22px] !text-[13px] !font-semibold text-white transition hover:bg-[#1f60c8]"
                    >
                        Done
                    </button>

                </div>

            </div>

        </div>
    );
};


export default RecoveryCodesModal;