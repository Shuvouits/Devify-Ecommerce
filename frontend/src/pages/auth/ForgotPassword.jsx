import { useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    KeyRound,
    Mail,
} from "lucide-react";

import api from "../../api/axios";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | SEND RESET LINK
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setSuccessMessage("");


        /*
        |--------------------------------------------------------------------------
        | Basic Frontend Validation
        |--------------------------------------------------------------------------
        */

        if (!email.trim()) {
            setError(
                "Please enter your email address."
            );

            return;
        }


        try {
            setLoading(true);


            const response = await api.post(
                "/auth/forgot-password",
                {
                    email: email.trim(),
                }
            );


            setSuccessMessage(
                response.data?.message ||
                "If an account exists with this email address, a password reset link has been sent."
            );


        } catch (error) {
            /*
            |--------------------------------------------------------------------------
            | Validation Error
            |--------------------------------------------------------------------------
            */

            if (
                error.response?.status === 422
            ) {
                const validationErrors =
                    error.response?.data?.errors;

                setError(
                    validationErrors?.email?.[0] ||
                    error.response?.data?.message ||
                    "Please enter a valid email address."
                );

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Other API Error
            |--------------------------------------------------------------------------
            */

            setError(
                error.response?.data?.message ||
                "Unable to send the reset link. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | INPUT CHANGE
    |--------------------------------------------------------------------------
    */

    const handleEmailChange = (e) => {
        setEmail(e.target.value);

        if (error) {
            setError("");
        }

        if (successMessage) {
            setSuccessMessage("");
        }
    };


    return (
        <section className="w-full bg-white">

            <div className="mx-auto flex min-h-[640px] max-w-[1300px] justify-center px-4 pb-[34px] pt-[62px] xl:px-0">

                <div className="h-fit w-full max-w-[398px] rounded-[18px] border border-[#dddddd] bg-white px-[27px] pb-[28px] pt-[27px] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">

                    {/* Icon */}

                    <div className="flex justify-center">

                        <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#eef4ff] text-[#286bd7]">

                            <KeyRound
                                size={20}
                                strokeWidth={1.8}
                            />

                        </div>

                    </div>


                    {/* Header */}

                    <div className="mt-[17px] text-center">

                        <h1 className="text-[27px] font-bold leading-[34px] tracking-[-0.6px] text-[#111111]">
                            Forgot password?
                        </h1>


                        <p className="mx-auto mt-[9px] max-w-[310px] text-[13px] leading-[19px] text-[#6d6d6d]">
                            Enter your email address and we'll send you a link
                            to reset your password.
                        </p>

                    </div>


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-[27px]"
                    >

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-[8px] block text-[13px] font-medium text-[#161616]"
                            >
                                Email
                            </label>


                            <div
                                className={`flex h-[38px] items-center rounded-full border bg-white px-[13px] transition ${
                                    error
                                        ? "border-[#dc555a]"
                                        : "border-[#d9d9d9] focus-within:border-[#739be8]"
                                }`}
                            >

                                <Mail
                                    size={16}
                                    strokeWidth={1.7}
                                    className="mr-[10px] shrink-0 text-[#8c9399]"
                                />


                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={
                                        handleEmailChange
                                    }
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    disabled={loading}
                                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#313131] outline-none placeholder:text-[#7e8790] disabled:cursor-not-allowed"
                                />

                            </div>


                            {/* Error */}

                            {error && (
                                <p className="mt-[7px] px-[4px] text-[11px] leading-[16px] text-[#d8494e]">
                                    {error}
                                </p>
                            )}

                        </div>


                        {/* Success */}

                        {successMessage && (
                            <div className="mt-[15px] flex items-start gap-[9px] rounded-[10px] border border-[#c7e8d2] bg-[#f2fbf5] px-[12px] py-[10px]">

                                <CheckCircle2
                                    size={16}
                                    strokeWidth={1.8}
                                    className="mt-[1px] shrink-0 text-[#2b9a55]"
                                />

                                <p className="text-[11px] leading-[17px] text-[#32754b]">
                                    {successMessage}
                                </p>

                            </div>
                        )}


                        {/* Reset Button */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-[18px] flex h-[38px] w-full items-center justify-center rounded-full bg-[#286bd7] text-[13px] font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading ? (
                                <span className="flex items-center gap-[8px]">

                                    <span className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                    Sending...

                                </span>
                            ) : (
                                "Send reset link"
                            )}

                        </button>


                        {/* Back to Login */}

                        <div className="mt-[24px] flex justify-center">

                            <Link
                                to="/login"
                                className="flex items-center gap-[8px] text-[13px] font-medium text-[#4d4d4d] transition hover:text-[#286bd7]"
                            >

                                <ArrowLeft
                                    size={15}
                                    strokeWidth={1.7}
                                />

                                Back to sign in

                            </Link>

                        </div>

                    </form>

                </div>

            </div>

        </section>
    );
};


export default ForgotPassword;