import { useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    Mail,
} from "lucide-react";

import api from "../../api/axios";


const ResetPassword = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token =
        searchParams.get("token") || "";

    const email =
        searchParams.get("email") || "";


    const [formData, setFormData] = useState({
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    const [pageError, setPageError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | INPUT CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));


        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }

        setPageError("");
    };


    /*
    |--------------------------------------------------------------------------
    | RESET PASSWORD
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setErrors({});
        setPageError("");
        setSuccessMessage("");


        /*
        |--------------------------------------------------------------------------
        | Invalid reset URL
        |--------------------------------------------------------------------------
        */

        if (!token || !email) {
            setPageError(
                "This password reset link is invalid or incomplete."
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Frontend Validation
        |--------------------------------------------------------------------------
        */

        const frontendErrors = {};


        if (!formData.password) {
            frontendErrors.password =
                "Please enter a new password.";
        } else if (
            formData.password.length < 8
        ) {
            frontendErrors.password =
                "Password must be at least 8 characters.";
        } else if (
            !/[A-Za-z]/.test(
                formData.password
            )
        ) {
            frontendErrors.password =
                "Password must contain at least one letter.";
        } else if (
            !/[0-9]/.test(
                formData.password
            )
        ) {
            frontendErrors.password =
                "Password must contain at least one number.";
        }


        if (
            !formData.password_confirmation
        ) {
            frontendErrors.password_confirmation =
                "Please confirm your new password.";
        } else if (
            formData.password !==
            formData.password_confirmation
        ) {
            frontendErrors.password_confirmation =
                "Passwords do not match.";
        }


        if (
            Object.keys(frontendErrors).length
        ) {
            setErrors(frontendErrors);

            return;
        }


        try {
            setLoading(true);


            const response =
                await api.post(
                    "/auth/reset-password",
                    {
                        token,
                        email,

                        password:
                            formData.password,

                        password_confirmation:
                            formData.password_confirmation,
                    }
                );


            setSuccessMessage(
                response.data?.message ||
                "Your password has been reset successfully."
            );


            setFormData({
                password: "",
                password_confirmation: "",
            });

        } catch (error) {
            /*
            |--------------------------------------------------------------------------
            | Validation errors
            |--------------------------------------------------------------------------
            */

            if (
                error.response?.status ===
                422
            ) {
                const apiErrors =
                    error.response?.data
                        ?.errors || {};

                setErrors(apiErrors);

                setPageError(
                    error.response?.data
                        ?.message ||
                    "Unable to reset your password."
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Other errors
            |--------------------------------------------------------------------------
            */

            setPageError(
                error.response?.data?.message ||
                "Unable to reset your password. The link may have expired."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | INVALID LINK
    |--------------------------------------------------------------------------
    */

    const invalidLink =
        !token || !email;


    return (
        <section className="w-full bg-white">

            <div className="mx-auto flex min-h-[640px] max-w-[1300px] justify-center px-4 pb-[34px] pt-[62px] xl:px-0">

                <div className="h-fit w-full max-w-[398px] rounded-[18px] border border-[#dddddd] bg-white px-[27px] pb-[28px] pt-[27px] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">

                    {/* Icon */}

                    <div className="flex justify-center">

                        <div
                            className={`flex h-[48px] w-[48px] items-center justify-center rounded-full ${
                                successMessage
                                    ? "bg-[#edf9f1] text-[#2d9a55]"
                                    : "bg-[#eef4ff] text-[#286bd7]"
                            }`}
                        >
                            {successMessage ? (
                                <CheckCircle2
                                    size={21}
                                    strokeWidth={1.8}
                                />
                            ) : (
                                <KeyRound
                                    size={20}
                                    strokeWidth={1.8}
                                />
                            )}
                        </div>

                    </div>


                    {/* Success State */}

                    {successMessage ? (
                        <>
                            <div className="mt-[17px] text-center">

                                <h1 className="text-[27px] font-bold leading-[34px] tracking-[-0.6px] text-[#111111]">
                                    Password reset
                                </h1>


                                <p className="mx-auto mt-[9px] max-w-[315px] text-[13px] leading-[20px] text-[#6d6d6d]">
                                    {successMessage}
                                    You can now sign in with your new password.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login",
                                        {
                                            replace: true,
                                        }
                                    )
                                }
                                className="mt-[27px] flex h-[38px] w-full items-center justify-center rounded-full bg-[#286bd7] text-[13px] font-semibold text-white transition hover:bg-[#1f60c8]"
                            >
                                Back to sign in
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Header */}

                            <div className="mt-[17px] text-center">

                                <h1 className="text-[27px] font-bold leading-[34px] tracking-[-0.6px] text-[#111111]">
                                    Create new password
                                </h1>


                                <p className="mx-auto mt-[9px] max-w-[320px] text-[13px] leading-[19px] text-[#6d6d6d]">
                                    Choose a secure password for your Devify account.
                                </p>

                            </div>


                            {/* Email */}

                            {email && (
                                <div className="mt-[22px] flex items-center gap-[9px] rounded-[10px] border border-[#e3e6ea] bg-[#f8f9fb] px-[12px] py-[10px]">

                                    <Mail
                                        size={15}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-[#7c8794]"
                                    />

                                    <span className="min-w-0 truncate text-[11px] text-[#66717d]">
                                        {email}
                                    </span>

                                </div>
                            )}


                            {/* Error */}

                            {pageError && (
                                <div className="mt-[14px] rounded-[10px] border border-[#f0c7c9] bg-[#fff5f5] px-[12px] py-[10px] text-[11px] leading-[17px] text-[#c94348]">
                                    {pageError}
                                </div>
                            )}


                            {invalidLink ? (

                                <div className="mt-[24px]">

                                    <p className="text-center text-[12px] leading-[19px] text-[#747d87]">
                                        Request a new password reset link to continue.
                                    </p>


                                    <Link
                                        to="/forgot-password"
                                        className="mt-[18px] flex h-[38px] w-full items-center justify-center rounded-full bg-[#286bd7] text-[13px] font-semibold text-white transition hover:bg-[#1f60c8]"
                                    >
                                        Request new link
                                    </Link>

                                </div>

                            ) : (

                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="mt-[23px]"
                                >

                                    {/* New Password */}

                                    <div>

                                        <label
                                            htmlFor="password"
                                            className="mb-[8px] block text-[13px] font-medium text-[#161616]"
                                        >
                                            New password
                                        </label>


                                        <div
                                            className={`flex h-[38px] items-center rounded-full border bg-white px-[13px] transition ${
                                                errors
                                                    .password
                                                    ? "border-[#dc555a]"
                                                    : "border-[#d9d9d9] focus-within:border-[#739be8]"
                                            }`}
                                        >

                                            <LockKeyhole
                                                size={16}
                                                strokeWidth={1.7}
                                                className="mr-[10px] shrink-0 text-[#8c9399]"
                                            />


                                            <input
                                                id="password"
                                                name="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    formData.password
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter new password"
                                                autoComplete="new-password"
                                                disabled={
                                                    loading
                                                }
                                                className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#313131] outline-none placeholder:text-[#7e8790]"
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (
                                                            prev
                                                        ) =>
                                                            !prev
                                                    )
                                                }
                                                className="ml-[8px] text-[#8c9399]"
                                            >
                                                {showPassword ? (
                                                    <EyeOff
                                                        size={
                                                            16
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={
                                                            16
                                                        }
                                                    />
                                                )}
                                            </button>

                                        </div>


                                        {errors
                                            .password && (
                                            <p className="mt-[6px] px-[4px] text-[10px] leading-[15px] text-[#d8494e]">

                                                {Array.isArray(
                                                    errors.password
                                                )
                                                    ? errors
                                                          .password[0]
                                                    : errors.password}

                                            </p>
                                        )}

                                    </div>


                                    {/* Confirm Password */}

                                    <div className="mt-[16px]">

                                        <label
                                            htmlFor="password_confirmation"
                                            className="mb-[8px] block text-[13px] font-medium text-[#161616]"
                                        >
                                            Confirm password
                                        </label>


                                        <div
                                            className={`flex h-[38px] items-center rounded-full border bg-white px-[13px] transition ${
                                                errors
                                                    .password_confirmation
                                                    ? "border-[#dc555a]"
                                                    : "border-[#d9d9d9] focus-within:border-[#739be8]"
                                            }`}
                                        >

                                            <LockKeyhole
                                                size={16}
                                                strokeWidth={1.7}
                                                className="mr-[10px] shrink-0 text-[#8c9399]"
                                            />


                                            <input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type={
                                                    showConfirmation
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    formData.password_confirmation
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Confirm new password"
                                                autoComplete="new-password"
                                                disabled={
                                                    loading
                                                }
                                                className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#313131] outline-none placeholder:text-[#7e8790]"
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmation(
                                                        (
                                                            prev
                                                        ) =>
                                                            !prev
                                                    )
                                                }
                                                className="ml-[8px] text-[#8c9399]"
                                            >
                                                {showConfirmation ? (
                                                    <EyeOff
                                                        size={
                                                            16
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={
                                                            16
                                                        }
                                                    />
                                                )}
                                            </button>

                                        </div>


                                        {errors
                                            .password_confirmation && (
                                            <p className="mt-[6px] px-[4px] text-[10px] leading-[15px] text-[#d8494e]">

                                                {Array.isArray(
                                                    errors.password_confirmation
                                                )
                                                    ? errors
                                                          .password_confirmation[0]
                                                    : errors.password_confirmation}

                                            </p>
                                        )}

                                    </div>


                                    {/* Password Requirements */}

                                    <div className="mt-[13px] rounded-[10px] bg-[#f8f9fb] px-[12px] py-[10px]">

                                        <p className="text-[10px] font-medium text-[#68727d]">
                                            Password must contain:
                                        </p>

                                        <div className="mt-[5px] text-[10px] leading-[17px] text-[#8a929b]">
                                            At least 8 characters, including a letter and a number.
                                        </div>

                                    </div>


                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        disabled={
                                            loading
                                        }
                                        className="mt-[18px] flex h-[38px] w-full items-center justify-center rounded-full bg-[#286bd7] text-[13px] font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {loading ? (
                                            <span className="flex items-center gap-[8px]">

                                                <span className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                                Resetting...

                                            </span>
                                        ) : (
                                            "Reset password"
                                        )}

                                    </button>


                                    {/* Back */}

                                    <div className="mt-[24px] flex justify-center">

                                        <Link
                                            to="/login"
                                            className="flex items-center gap-[8px] text-[13px] font-medium text-[#4d4d4d] transition hover:text-[#286bd7]"
                                        >

                                            <ArrowLeft
                                                size={
                                                    15
                                                }
                                                strokeWidth={
                                                    1.7
                                                }
                                            />

                                            Back to sign in

                                        </Link>

                                    </div>

                                </form>
                            )}
                        </>
                    )}

                </div>

            </div>

        </section>
    );
};


export default ResetPassword;