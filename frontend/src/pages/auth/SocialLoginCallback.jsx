import { useEffect, useState } from "react";

import {
    useSearchParams,
} from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

import api from "../../api/axios";

import {
    getDashboardPath,
    saveAuth,
} from "../../utils/auth";


/*
|--------------------------------------------------------------------------
| Prevent duplicate exchange requests
|--------------------------------------------------------------------------
|
| React StrictMode development-e useEffect twice run korte pare.
| Backend-er exchange code single-use, tai same code-er request reuse kori.
|
*/

const exchangeRequests = new Map();


const exchangeSocialCode = (code) => {
    if (
        !exchangeRequests.has(code)
    ) {
        exchangeRequests.set(
            code,
            api.post(
                "/auth/social/exchange",
                {
                    code,
                }
            )
        );
    }

    return exchangeRequests.get(
        code
    );
};


const SocialLoginCallback = () => {
    const [searchParams] =
        useSearchParams();

    const [message, setMessage] =
        useState(
            "Completing your Google sign in..."
        );


    useEffect(() => {
        const code =
            searchParams.get("code");


        /*
        |--------------------------------------------------------------------------
        | Missing Code
        |--------------------------------------------------------------------------
        */

        if (!code) {
            window.location.replace(
                "/login?social_error=authentication_failed"
            );

            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Complete Google Login
        |--------------------------------------------------------------------------
        */

        const completeLogin = async () => {
            try {
                const response =
                    await exchangeSocialCode(
                        code
                    );


                const token =
                    response.data?.data
                        ?.access_token;


                const user =
                    response.data?.data
                        ?.user;


                if (
                    !token ||
                    !user
                ) {
                    throw new Error(
                        "Authentication data was not returned."
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Save JWT + User
                |--------------------------------------------------------------------------
                */

                saveAuth(
                    token,
                    user
                );


                setMessage(
                    "Sign in successful. Redirecting..."
                );


                /*
                |--------------------------------------------------------------------------
                | Role Based Redirect
                |--------------------------------------------------------------------------
                */

                const dashboardPath =
                    getDashboardPath(
                        user.role
                    );


                window.location.replace(
                    dashboardPath
                );

            } catch (error) {
                console.error(
                    "Google login exchange failed:",
                    error
                );


                if (
                    error.response
                        ?.status === 422
                ) {
                    window.location.replace(
                        "/login?social_error=expired"
                    );

                    return;
                }


                window.location.replace(
                    "/login?social_error=exchange_failed"
                );
            }
        };


        completeLogin();

    }, [searchParams]);


    return (
        <section className="w-full bg-white">

            <div className="mx-auto flex min-h-[540px] max-w-[1300px] items-center justify-center px-4 py-[50px] xl:px-0">

                <div className="w-full max-w-[380px] rounded-[18px] border border-[#dddddd] bg-white px-[30px] py-[35px] text-center shadow-[0_10px_24px_rgba(0,0,0,0.08)]">

                    <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#e2e5e9] bg-white shadow-sm">

                        <FcGoogle
                            size={25}
                        />

                    </div>


                    <h1 className="mt-[18px] text-[20px] font-semibold text-[#161616]">
                        Signing you in
                    </h1>


                    <p className="mt-[7px] text-[12px] leading-[19px] text-[#717982]">
                        {message}
                    </p>


                    <div className="mt-[22px] flex justify-center">

                        <div className="h-[26px] w-[26px] animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />

                    </div>

                </div>

            </div>

        </section>
    );
};


export default SocialLoginCallback;