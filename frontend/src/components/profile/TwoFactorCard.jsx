import {
    CheckCircle2,
    ShieldCheck,
    ShieldOff,
} from "lucide-react";

import {
    useState,
} from "react";

import useTwoFactor from "../../hooks/profile/useTwoFactor";

import RecoveryCodesModal from "./RecoveryCodesModal";
import TwoFactorDisableModal from "./TwoFactorDisableModal";
import TwoFactorSetupModal from "./TwoFactorSetupModal";


const TwoFactorCard = () => {
    const {
        status,
        setupData,
        recoveryCodes,

        loading,
        setupLoading,
        confirmLoading,
        disableLoading,

        error,

        startSetup,
        confirmSetup,
        disableTwoFactor,

        clearSetup,
        clearRecoveryCodes,
        clearError,
    } = useTwoFactor();


    const [
        setupModalOpen,
        setSetupModalOpen,
    ] = useState(false);


    const [
        recoveryModalOpen,
        setRecoveryModalOpen,
    ] = useState(false);


    const [
        disableModalOpen,
        setDisableModalOpen,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Start Setup
    |--------------------------------------------------------------------------
    */

    const handleStartSetup =
        async () => {
            const data =
                await startSetup();

            if (!data) {
                return;
            }

            setSetupModalOpen(
                true
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Confirm Setup
    |--------------------------------------------------------------------------
    */

    const handleConfirm =
        async (code) => {
            const result =
                await confirmSetup(
                    code
                );

            if (!result) {
                return;
            }

            setSetupModalOpen(
                false
            );

            setRecoveryModalOpen(
                true
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Disable Two-Factor
    |--------------------------------------------------------------------------
    */

    const handleDisable =
        async (code) => {
            const success =
                await disableTwoFactor(
                    code
                );

            if (!success) {
                return false;
            }

            setDisableModalOpen(
                false
            );

            return true;
        };


    /*
    |--------------------------------------------------------------------------
    | Open Disable Modal
    |--------------------------------------------------------------------------
    */

    const handleOpenDisable =
        () => {
            clearError();

            setDisableModalOpen(
                true
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Close Disable Modal
    |--------------------------------------------------------------------------
    */

    const handleCloseDisable =
        () => {
            if (disableLoading) {
                return;
            }

            clearError();

            setDisableModalOpen(
                false
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Close Setup Modal
    |--------------------------------------------------------------------------
    */

    const handleCloseSetup =
        () => {
            clearSetup();

            setSetupModalOpen(
                false
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Close Recovery Modal
    |--------------------------------------------------------------------------
    */

    const handleCloseRecovery =
        () => {
            clearRecoveryCodes();

            setRecoveryModalOpen(
                false
            );
        };


    if (loading) {
        return (
            <div className="mt-[20px] rounded-[18px] border border-[#dddddd] bg-white p-[27px]">

                <div className="flex min-h-[120px] items-center justify-center">

                    <div className="h-[26px] w-[26px] animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />

                </div>

            </div>
        );
    }


    return (
        <>
            <div className="mt-[20px] rounded-[18px] border border-[#dddddd] bg-white p-[27px]">

                <div className="flex flex-col gap-[18px] sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-center gap-[13px]">

                        <div
                            className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${
                                status.enabled
                                    ? "bg-[#edf8f0] text-[#2f8a4e]"
                                    : "bg-[#edf4ff] text-[#286bd7]"
                            }`}
                        >

                            {status.enabled ? (
                                <CheckCircle2
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <ShieldCheck
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            )}

                        </div>


                        <div>

                            <h2 className="!text-[18px] !font-semibold !leading-[25px] text-[#111111]">
                                Two-Factor Authentication
                            </h2>


                            <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                                Add an extra layer of security to your account
                            </p>

                        </div>

                    </div>


                    {status.enabled ? (
                        <span className="w-fit rounded-full bg-[#eaf8ef] px-[13px] py-[6px] !text-[11px] !font-medium !leading-[16px] text-[#2d8a4c]">
                            Enabled
                        </span>
                    ) : (
                        <span className="w-fit rounded-full bg-[#f2efff] px-[13px] py-[6px] !text-[11px] !font-medium !leading-[16px] text-[#6747ca]">
                            Disabled
                        </span>
                    )}

                </div>


                {status.enabled ? (
                    <>
                        <p className="mt-[24px] max-w-[710px] !text-[13px] !font-normal !leading-[20px] text-[#555555]">
                            Two-factor authentication is active on your account. You will need a verification code from your authenticator app when signing in.
                        </p>


                        <div className="mt-[20px] flex flex-wrap items-center justify-between gap-[16px]">

                            <div className="flex items-center gap-[8px] !text-[12px] !font-medium text-[#2d8a4c]">

                                <CheckCircle2
                                    size={16}
                                    strokeWidth={1.8}
                                />

                                Your account is protected with two-factor authentication.

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleOpenDisable
                                }
                                className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#efc7c9] bg-white px-[17px] !text-[13px] !font-semibold text-[#d44b50] transition hover:bg-[#fff5f5]"
                            >

                                <ShieldOff
                                    size={15}
                                    strokeWidth={1.8}
                                />

                                Disable Two-Factor Authentication

                            </button>

                        </div>
                    </>
                ) : (
                    <>
                        <p className="mt-[24px] max-w-[710px] !text-[13px] !font-normal !leading-[20px] text-[#555555]">
                            Protect your account by requiring a verification code from your authenticator app in addition to your password.
                        </p>


                        {error && (
                            <p className="mt-[12px] !text-[12px] !font-normal text-[#d8484d]">
                                {error}
                            </p>
                        )}


                        <button
                            type="button"
                            onClick={
                                handleStartSetup
                            }
                            disabled={
                                setupLoading
                            }
                            className="mt-[20px] flex h-[40px] items-center gap-[8px] rounded-[8px] bg-[#286bd7] px-[18px] !text-[13px] !font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <ShieldCheck
                                size={15}
                                strokeWidth={1.8}
                            />


                            {setupLoading
                                ? "Preparing..."
                                : "Set Up Two-Factor Authentication"
                            }

                        </button>
                    </>
                )}

            </div>


            <TwoFactorSetupModal
                open={
                    setupModalOpen
                }
                setupData={
                    setupData
                }
                loading={
                    confirmLoading
                }
                error={
                    error
                }
                onClose={
                    handleCloseSetup
                }
                onConfirm={
                    handleConfirm
                }
            />


            <RecoveryCodesModal
                open={
                    recoveryModalOpen
                }
                recoveryCodes={
                    recoveryCodes
                }
                onClose={
                    handleCloseRecovery
                }
            />


            <TwoFactorDisableModal
                open={
                    disableModalOpen
                }
                loading={
                    disableLoading
                }
                error={
                    error
                }
                onClose={
                    handleCloseDisable
                }
                onConfirm={
                    handleDisable
                }
            />

        </>
    );
};


export default TwoFactorCard;