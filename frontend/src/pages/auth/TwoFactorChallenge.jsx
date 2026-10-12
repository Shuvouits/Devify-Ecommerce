import { useEffect, useState } from "react";

import {
    ArrowLeft,
    ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import {
    getDashboardPath,
    saveAuth,
} from "../../utils/auth";


const TwoFactorChallenge = () => {
    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | Challenge Token
    |--------------------------------------------------------------------------
    |
    | sessionStorage theke component mount-er somoy ekbar token read korbo.
    | Successful verification-er por sessionStorage clear korleo
    | component state immediately null hobe na.
    |
    */

    const [challengeToken] = useState(() =>
        sessionStorage.getItem(
            "two_factor_challenge"
        )
    );


    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [code, setCode] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Missing Challenge
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!challengeToken) {
            navigate(
                "/login",
                {
                    replace: true,
                }
            );
        }
    }, [
        challengeToken,
        navigate,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Code Input
    |--------------------------------------------------------------------------
    */

    const handleCodeChange = (e) => {
        const value =
            e.target.value
                .replace(/\D/g, "")
                .slice(0, 6);


        setCode(value);


        if (error) {
            setError("");
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Verify Two-Factor Code
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (
            loading ||
            code.length !== 6 ||
            !challengeToken
        ) {
            return;
        }


        setLoading(true);
        setError("");


        try {
            const response =
                await api.post(
                    "/auth/two-factor/verify",
                    {
                        challenge_token:
                            challengeToken,

                        code,
                    }
                );


            const data =
                response.data?.data;


            const token =
                data?.access_token;


            const user =
                data?.user;


            /*
            |--------------------------------------------------------------------------
            | Validate Auth Response
            |--------------------------------------------------------------------------
            */

            if (!token || !user) {
                throw new Error(
                    "Authentication data was not returned."
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Save JWT + User
            |--------------------------------------------------------------------------
            |
            | Ei step redirect-er age hote hobe.
            |
            */

            saveAuth(
                token,
                user
            );


            /*
            |--------------------------------------------------------------------------
            | Remove Temporary Challenge
            |--------------------------------------------------------------------------
            |
            | Challenge already backend-e consume hoye geche.
            | Frontend sessionStorage-o clean kore dibo.
            |
            */

            sessionStorage.removeItem(
                "two_factor_challenge"
            );


            /*
            |--------------------------------------------------------------------------
            | Role Based Dashboard
            |--------------------------------------------------------------------------
            */

            const dashboardPath =
                getDashboardPath(
                    user.role
                );


            /*
            |--------------------------------------------------------------------------
            | Redirect
            |--------------------------------------------------------------------------
            */

            navigate(
                dashboardPath,
                {
                    replace: true,
                }
            );

        } catch (error) {
            const codeError =
                error.response?.data
                    ?.errors
                    ?.code?.[0];


            const challengeError =
                error.response?.data
                    ?.errors
                    ?.challenge_token?.[0];


            const message =
                codeError ||
                challengeError ||
                error.response?.data
                    ?.message ||
                error.message ||
                "Unable to verify the authentication code.";


            setError(message);


            /*
            |--------------------------------------------------------------------------
            | Invalid / Expired Challenge
            |--------------------------------------------------------------------------
            */

            if (challengeError) {
                sessionStorage.removeItem(
                    "two_factor_challenge"
                );


                setTimeout(() => {
                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );
                }, 1200);
            }

        } finally {
            setLoading(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Back To Login
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
        sessionStorage.removeItem(
            "two_factor_challenge"
        );


        navigate(
            "/login",
            {
                replace: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Do Not Render Without Challenge
    |--------------------------------------------------------------------------
    */

    if (!challengeToken) {
        return null;
    }


    return (
        <section className="w-full bg-white">

            <div className="mx-auto flex min-h-[640px] max-w-[1300px] justify-center px-4 pb-[34px] pt-[62px] xl:px-0">

                <div className="h-fit w-full max-w-[398px] rounded-[18px] border border-[#dddddd] bg-white px-[27px] pb-[26px] pt-[27px] shadow-[0_10px_24px_rgba(0,0,0,0.09)]">

                    {/* Icon */}

                    <div className="flex justify-center">

                        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#edf4ff] text-[#286bd7]">

                            <ShieldCheck
                                size={25}
                                strokeWidth={1.8}
                            />

                        </div>

                    </div>


                    {/* Header */}

                    <div className="mt-[17px] text-center">

                        <h1 className="!text-[25px] !font-bold !leading-[33px] tracking-[-0.5px] text-[#111111]">
                            Verify your identity
                        </h1>


                        <p className="mx-auto mt-[9px] max-w-[310px] !text-[13px] !font-normal !leading-[20px] text-[#656565]">
                            Enter the 6-digit code from your authenticator app to continue.
                        </p>

                    </div>


                    {/* Error */}

                    {error && (
                        <div className="mt-[18px] rounded-[9px] border border-[#f3c4c4] bg-[#fff5f5] px-[13px] py-[10px] text-center !text-[12px] !font-medium !leading-[18px] text-[#d13b3b]">
                            {error}
                        </div>
                    )}


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-[24px]"
                    >

                        <label
                            htmlFor="two_factor_code"
                            className="mb-[8px] block !text-[13px] !font-medium text-[#161616]"
                        >
                            Authentication code
                        </label>


                        <input
                            id="two_factor_code"
                            name="two_factor_code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={code}
                            onChange={handleCodeChange}
                            disabled={loading}
                            autoFocus
                            className="h-[48px] w-full rounded-full border border-[#d9d9d9] bg-white px-[17px] text-center !text-[21px] !font-semibold tracking-[9px] text-[#222222] outline-none transition focus:border-[#7fa5e8] disabled:cursor-not-allowed disabled:opacity-60"
                        />


                        <p className="mt-[7px] text-center !text-[11px] !font-normal !leading-[17px] text-[#8a8a8a]">
                            Codes refresh automatically in your authenticator app.
                        </p>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                code.length !== 6
                            }
                            className={`mt-[21px] flex h-[39px] w-full items-center justify-center rounded-full !text-[13px] !font-semibold text-white transition ${
                                loading ||
                                code.length !== 6
                                    ? "cursor-not-allowed bg-[#7fa5e8]"
                                    : "bg-[#286bd7] hover:bg-[#1f60c8]"
                            }`}
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify & Continue"
                            }

                        </button>

                    </form>


                    {/* Back To Login */}

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="mt-[16px] flex w-full items-center justify-center gap-[6px] !text-[12px] !font-medium text-[#666666] transition hover:text-[#286bd7] disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <ArrowLeft
                            size={14}
                            strokeWidth={1.8}
                        />

                        Back to sign in

                    </button>

                </div>

            </div>

        </section>
    );
};


export default TwoFactorChallenge;