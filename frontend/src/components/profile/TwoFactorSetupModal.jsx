import {
    Check,
    Copy,
    ShieldCheck,
    X,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";


const TwoFactorSetupModal = ({
    open,
    setupData,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    const [code, setCode] =
        useState("");

    const [copied, setCopied] =
        useState(false);


    const qrCodeUrl =
        useMemo(() => {
            if (!setupData?.qr_code) {
                return "";
            }

            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                setupData.qr_code
            )}`;
        }, [setupData]);


    if (!open || !setupData) {
        return null;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (code.length !== 6) {
            return;
        }

        await onConfirm(code);
    };


    const copySecret = async () => {
        if (!setupData.secret) {
            return;
        }

        await navigator.clipboard.writeText(
            setupData.secret
        );

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-[20px]">

            <div className="relative w-full max-w-[480px] rounded-[18px] bg-white p-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-[18px] top-[18px] flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#777777] transition hover:bg-[#f4f4f4]"
                >
                    <X size={18} />
                </button>


                <div className="flex items-center gap-[12px]">

                    <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#edf4ff] text-[#286bd7]">
                        <ShieldCheck size={21} />
                    </div>

                    <div>
                        <h2 className="!text-[19px] !font-semibold !leading-[26px] text-[#111111]">
                            Set Up Two-Factor Authentication
                        </h2>

                        <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                            Scan the QR code with your authenticator app
                        </p>
                    </div>

                </div>


                <div className="mt-[24px] flex justify-center">

                    <div className="rounded-[14px] border border-[#e2e2e2] bg-white p-[12px]">
                        <img
                            src={qrCodeUrl}
                            alt="Two-factor authentication QR code"
                            className="h-[200px] w-[200px]"
                        />
                    </div>

                </div>


                <div className="mt-[22px]">

                    <div className="!text-[12px] !font-medium text-[#555555]">
                        Can't scan the QR code?
                    </div>

                    <p className="mt-[3px] !text-[11px] !font-normal !leading-[17px] text-[#888888]">
                        Enter this setup key manually in your authenticator app.
                    </p>


                    <div className="mt-[10px] flex items-center gap-[8px] rounded-[10px] border border-[#dddddd] bg-[#fafafa] px-[13px] py-[10px]">

                        <code className="min-w-0 flex-1 break-all !text-[12px] !font-medium text-[#333333]">
                            {setupData.secret}
                        </code>

                        <button
                            type="button"
                            onClick={copySecret}
                            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] text-[#666666] transition hover:bg-white"
                        >
                            {copied ? (
                                <Check
                                    size={15}
                                    className="text-[#2a8a4d]"
                                />
                            ) : (
                                <Copy size={15} />
                            )}
                        </button>

                    </div>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="mt-[22px]"
                >

                    <label
                        htmlFor="two_factor_code"
                        className="mb-[7px] block !text-[11px] !font-medium !leading-[16px] tracking-[0.4px] text-[#555555]"
                    >
                        VERIFICATION CODE
                    </label>

                    <input
                        id="two_factor_code"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={(e) =>
                            setCode(
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6)
                            )
                        }
                        className="h-[46px] w-full rounded-[10px] border border-[#dcdcdc] px-[14px] text-center !text-[20px] !font-semibold tracking-[8px] text-[#222222] outline-none focus:border-[#8cacff]"
                        autoComplete="one-time-code"
                        autoFocus
                    />


                    {error && (
                        <p className="mt-[8px] !text-[12px] !font-normal text-[#d8484d]">
                            {error}
                        </p>
                    )}


                    <div className="mt-[22px] flex justify-end gap-[10px]">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-[40px] rounded-full border border-[#d8d8d8] bg-white px-[20px] !text-[13px] !font-medium text-[#444444]"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                code.length !== 6
                            }
                            className="h-[40px] min-w-[120px] rounded-full bg-[#286bd7] px-[20px] !text-[13px] !font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify & Enable"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default TwoFactorSetupModal;