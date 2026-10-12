import {
    ShieldOff,
    X,
} from "lucide-react";

import { useState } from "react";


const TwoFactorDisableModal = ({
    open,
    loading,
    error,
    onClose,
    onConfirm,
}) => {
    const [code, setCode] =
        useState("");


    if (!open) {
        return null;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            loading ||
            code.length !== 6
        ) {
            return;
        }

        const success =
            await onConfirm(code);

        if (success) {
            setCode("");
        }
    };


    const handleClose = () => {
        if (loading) {
            return;
        }

        setCode("");
        onClose();
    };


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-[20px]">

            <div className="relative w-full max-w-[430px] rounded-[18px] bg-white p-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">

                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="absolute right-[18px] top-[18px] flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#777777] transition hover:bg-[#f4f4f4] disabled:opacity-50"
                >
                    <X size={18} />
                </button>


                <div className="flex items-center gap-[12px]">

                    <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#fff0f0] text-[#d84b4b]">
                        <ShieldOff
                            size={21}
                            strokeWidth={1.8}
                        />
                    </div>


                    <div>
                        <h2 className="!text-[19px] !font-semibold !leading-[26px] text-[#111111]">
                            Disable Two-Factor Authentication
                        </h2>

                        <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                            Confirm using your authenticator app
                        </p>
                    </div>

                </div>


                <div className="mt-[20px] rounded-[10px] border border-[#f3d0d0] bg-[#fff7f7] px-[14px] py-[12px]">

                    <p className="!text-[12px] !font-normal !leading-[19px] text-[#8a4545]">
                        Disabling two-factor authentication will remove the additional verification step from your account.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="mt-[22px]"
                >

                    <label
                        htmlFor="disable_two_factor_code"
                        className="mb-[7px] block !text-[11px] !font-medium !leading-[16px] tracking-[0.4px] text-[#555555]"
                    >
                        AUTHENTICATION CODE
                    </label>


                    <input
                        id="disable_two_factor_code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={code}
                        onChange={(e) =>
                            setCode(
                                e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6)
                            )
                        }
                        disabled={loading}
                        autoFocus
                        className="h-[46px] w-full rounded-[10px] border border-[#dcdcdc] px-[14px] text-center !text-[20px] !font-semibold tracking-[8px] text-[#222222] outline-none focus:border-[#e59696] disabled:opacity-60"
                    />


                    {error && (
                        <p className="mt-[8px] !text-[12px] !font-normal text-[#d8484d]">
                            {error}
                        </p>
                    )}


                    <div className="mt-[22px] flex justify-end gap-[10px]">

                        <button
                            type="button"
                            onClick={handleClose}
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
                            className="h-[40px] min-w-[120px] rounded-full bg-[#d84b4b] px-[20px] !text-[13px] !font-semibold text-white transition hover:bg-[#c63e3e] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Disabling..."
                                : "Disable 2FA"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};


export default TwoFactorDisableModal;