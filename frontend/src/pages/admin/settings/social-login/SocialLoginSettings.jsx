import { useEffect, useState } from "react";

import {
    CheckCircle2,
    Copy,
    Eye,
    EyeOff,
    Save,
    ShieldCheck,
} from "lucide-react";

import api from "../../../../api/axios";


const SocialLoginSettings = () => {
    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [showSecret, setShowSecret] =
        useState(false);

    const [secretConfigured, setSecretConfigured] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [pageError, setPageError] =
        useState("");

    const [errors, setErrors] =
        useState({});


    const [formData, setFormData] = useState({
        is_enabled: false,
        client_id: "",
        client_secret: "",
        redirect_uri:
            "http://127.0.0.1:8000/api/auth/social/google/callback",
        scopes: [
            "openid",
            "profile",
            "email",
        ],
    });


    /*
    |--------------------------------------------------------------------------
    | Load Google Settings
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true;

        const fetchGoogleSettings = async () => {
            try {
                setLoading(true);
                setPageError("");

                const response =
                    await api.get(
                        "/admin/settings/social-login/google"
                    );

                const data =
                    response.data?.data;

                const setting =
                    data?.setting;

                if (!mounted) {
                    return;
                }

                setSecretConfigured(
                    Boolean(
                        data?.client_secret_configured
                    )
                );

                if (!setting) {
                    return;
                }

                setFormData({
                    is_enabled:
                        Boolean(
                            setting.is_enabled
                        ),

                    client_id:
                        setting.client_id || "",

                    client_secret: "",

                    redirect_uri:
                        setting.redirect_uri ||
                        "http://127.0.0.1:8000/api/auth/social/google/callback",

                    scopes:
                        Array.isArray(
                            setting.scopes
                        ) &&
                        setting.scopes.length
                            ? setting.scopes
                            : [
                                "openid",
                                "profile",
                                "email",
                            ],
                });

            } catch (error) {
                if (!mounted) {
                    return;
                }

                setPageError(
                    error.response?.data?.message ||
                    "Unable to load Google OAuth settings."
                );

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchGoogleSettings();

        return () => {
            mounted = false;
        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Input Change
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

        setSuccessMessage("");
        setPageError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle
    |--------------------------------------------------------------------------
    */

    const handleToggle = () => {
        setFormData((prev) => ({
            ...prev,
            is_enabled:
                !prev.is_enabled,
        }));

        setSuccessMessage("");
        setPageError("");
    };


    /*
    |--------------------------------------------------------------------------
    | Copy Redirect URL
    |--------------------------------------------------------------------------
    */

    const copyRedirectUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                formData.redirect_uri
            );

        } catch (error) {
            console.error(
                "Unable to copy redirect URL:",
                error
            );
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Save Google Settings
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        setSaving(true);
        setErrors({});
        setSuccessMessage("");
        setPageError("");

        try {
            const payload = {
                is_enabled:
                    formData.is_enabled,

                client_id:
                    formData.client_id.trim(),

                redirect_uri:
                    formData.redirect_uri.trim(),

                scopes:
                    formData.scopes,
            };

            if (
                formData.client_secret.trim()
            ) {
                payload.client_secret =
                    formData.client_secret;
            }

            const response =
                await api.put(
                    "/admin/settings/social-login/google",
                    payload
                );

            const data =
                response.data?.data;

            const setting =
                data?.setting;

            if (setting) {
                setFormData((prev) => ({
                    ...prev,

                    is_enabled:
                        Boolean(
                            setting.is_enabled
                        ),

                    client_id:
                        setting.client_id || "",

                    client_secret: "",

                    redirect_uri:
                        setting.redirect_uri || "",

                    scopes:
                        Array.isArray(
                            setting.scopes
                        )
                            ? setting.scopes
                            : prev.scopes,
                }));
            }

            setSecretConfigured(
                Boolean(
                    data?.client_secret_configured
                )
            );

            setSuccessMessage(
                response.data?.message ||
                "Google OAuth settings saved successfully."
            );

        } catch (error) {
            if (
                error.response?.status ===
                422
            ) {
                setErrors(
                    error.response?.data
                        ?.errors || {}
                );

                setPageError(
                    "Please check the highlighted fields."
                );

                return;
            }

            setPageError(
                error.response?.data?.message ||
                "Unable to save Google OAuth settings."
            );

        } finally {
            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="mx-auto max-w-[800px] pb-[40px]">

                <div className="flex min-h-[360px] items-center justify-center rounded-[13px] border border-[#dadee3] bg-white">

                    <div className="flex flex-col items-center gap-[10px]">

                        <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />

                        <span className="text-[10px] text-[#7a8491]">
                            Loading social login settings...
                        </span>

                    </div>

                </div>

            </div>
        );
    }


    return (
        <div className="mx-auto max-w-[800px] pb-[40px]">

            {/* Page Heading */}

            <div className="rounded-[13px] border border-[#dadee3] bg-white px-[22px] py-[18px]">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h1 className="text-[18px] font-semibold text-[#182331]">
                            OAuth / Social Login
                        </h1>

                        <p className="mt-[3px] text-[11px] text-[#7a8491]">
                            Configure social authentication providers for Devify
                        </p>

                    </div>


                    <span
                        className={`rounded-full px-[10px] py-[4px] text-[8px] font-semibold ${
                            formData.is_enabled
                                ? "bg-[#e9f8ef] text-[#32a35c]"
                                : "bg-[#f1f2f4] text-[#747e89]"
                        }`}
                    >
                        {formData.is_enabled
                            ? "Active"
                            : "Disabled"}
                    </span>

                </div>

            </div>


            {/* Success */}

            {successMessage && (
                <div className="mt-[14px] flex items-center gap-[8px] rounded-[10px] border border-[#bfe6cd] bg-[#f0fbf4] px-[14px] py-[11px] text-[10px] font-medium text-[#27854a]">

                    <CheckCircle2
                        size={14}
                        strokeWidth={1.8}
                    />

                    {successMessage}

                </div>
            )}


            {/* Error */}

            {pageError && (
                <div className="mt-[14px] rounded-[10px] border border-[#f1c7c9] bg-[#fff5f5] px-[14px] py-[11px] text-[10px] font-medium text-[#c83d43]">
                    {pageError}
                </div>
            )}


            {/* Google Card */}

            <form
                onSubmit={handleSubmit}
                className="mt-[18px] overflow-hidden rounded-[13px] border border-[#dadee3] bg-white"
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#e6e9ed] px-[20px] py-[16px]">

                    <div className="flex items-center gap-[13px]">

                        {/* Google Logo */}

                        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#e6e8eb] bg-white shadow-sm">

                            <span className="text-[20px] font-bold text-[#4285F4]">
                                G
                            </span>

                        </div>


                        <div>

                            <div className="flex items-center gap-[8px]">

                                <h2 className="text-[13px] font-semibold text-[#24303d]">
                                    Google
                                </h2>


                                <span
                                    className={`rounded-full px-[8px] py-[3px] text-[7px] font-semibold ${
                                        secretConfigured
                                            ? "bg-[#ecf9f0] text-[#35a35e]"
                                            : "bg-[#f2f3f5] text-[#7b8490]"
                                    }`}
                                >
                                    {secretConfigured
                                        ? "Configured"
                                        : "Not configured"}
                                </span>

                            </div>


                            <p className="mt-[2px] text-[9px] text-[#89919c]">
                                Allow customers to sign in or register using their Google account
                            </p>

                        </div>

                    </div>


                    {/* Toggle */}

                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`relative h-[21px] w-[38px] rounded-full transition ${
                            formData.is_enabled
                                ? "bg-[#286bd7]"
                                : "bg-[#cdd2d8]"
                        }`}
                    >

                        <span
                            className={`absolute top-[3px] h-[15px] w-[15px] rounded-full bg-white shadow transition-all ${
                                formData.is_enabled
                                    ? "left-[20px]"
                                    : "left-[3px]"
                            }`}
                        />

                    </button>

                </div>


                {/* Form Body */}

                <div className="px-[20px] pb-[20px] pt-[18px]">

                    {/* Client ID */}

                    <Field
                        label="Client ID"
                        name="client_id"
                        value={
                            formData.client_id
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Google OAuth Client ID"
                        error={
                            errors.client_id?.[0]
                        }
                    />


                    {/* Client Secret */}

                    <div className="mt-[15px]">

                        <label className="mb-[6px] block text-[9px] font-medium text-[#454e5b]">
                            Client Secret
                        </label>


                        <div
                            className={`flex h-[38px] items-center rounded-[8px] border bg-white px-[11px] ${
                                errors.client_secret
                                    ? "border-[#e45a5f]"
                                    : "border-[#d9dde2] focus-within:border-[#7da5f4]"
                            }`}
                        >

                            <input
                                type={
                                    showSecret
                                        ? "text"
                                        : "password"
                                }
                                name="client_secret"
                                value={
                                    formData.client_secret
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={
                                    secretConfigured
                                        ? "Stored securely •••••••••••"
                                        : "Enter Google Client Secret"
                                }
                                autoComplete="new-password"
                                className="min-w-0 flex-1 bg-transparent text-[10px] font-normal text-[#515b67] outline-none placeholder:text-[10px] placeholder:font-normal placeholder:text-[#9aa3ad]"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowSecret(
                                        (prev) =>
                                            !prev
                                    )
                                }
                                className="ml-[8px] text-[#8c949d]"
                            >

                                {showSecret ? (
                                    <EyeOff
                                        size={14}
                                    />
                                ) : (
                                    <Eye
                                        size={14}
                                    />
                                )}

                            </button>

                        </div>


                        {errors
                            .client_secret?.[0] && (
                            <ErrorText>
                                {
                                    errors
                                        .client_secret[0]
                                }
                            </ErrorText>
                        )}


                        <p className="mt-[4px] text-[8px] leading-[13px] text-[#a0a6af]">

                            {secretConfigured
                                ? "Leave blank to keep the existing Client Secret."
                                : "Enter the Client Secret generated in Google Cloud Console."}

                        </p>

                    </div>


                    {/* Redirect URI */}

                    <div className="mt-[15px]">

                        <label className="mb-[6px] block text-[9px] font-medium text-[#454e5b]">
                            Authorized Redirect URI
                        </label>


                        <div
                            className={`flex h-[38px] items-center rounded-[8px] border bg-[#fafbfc] px-[11px] ${
                                errors.redirect_uri
                                    ? "border-[#e45a5f]"
                                    : "border-[#d9dde2]"
                            }`}
                        >

                            <input
                                type="text"
                                name="redirect_uri"
                                value={
                                    formData.redirect_uri
                                }
                                onChange={
                                    handleChange
                                }
                                className="min-w-0 flex-1 bg-transparent text-[10px] font-normal text-[#515b67] outline-none"
                            />


                            <button
                                type="button"
                                onClick={
                                    copyRedirectUrl
                                }
                                title="Copy redirect URL"
                                className="ml-[8px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6px] text-[#7b8490] transition hover:bg-[#edf0f3] hover:text-[#286bd7]"
                            >

                                <Copy
                                    size={13}
                                    strokeWidth={1.7}
                                />

                            </button>

                        </div>


                        {errors
                            .redirect_uri?.[0] && (
                            <ErrorText>
                                {
                                    errors
                                        .redirect_uri[0]
                                }
                            </ErrorText>
                        )}


                        <p className="mt-[5px] text-[8px] leading-[13px] text-[#a0a6af]">
                            Add this exact URL to your Google Cloud Console under Authorized redirect URIs.
                        </p>

                    </div>


                    {/* Permissions */}

                    <div className="mt-[16px]">

                        <label className="mb-[7px] block text-[9px] font-medium text-[#454e5b]">
                            Permissions
                        </label>


                        <div className="flex flex-wrap gap-[7px]">

                            {formData.scopes.map(
                                (scope) => (
                                    <span
                                        key={scope}
                                        className="rounded-full border border-[#dce3ef] bg-[#f5f8fd] px-[9px] py-[4px] text-[8px] font-medium text-[#55708f]"
                                    >
                                        {scope}
                                    </span>
                                )
                            )}

                        </div>

                    </div>


                    {/* Security */}

                    <div className="mt-[18px] flex gap-[11px] rounded-[10px] border border-[#dde2e8] bg-[#fafbfc] px-[13px] py-[11px]">

                        <ShieldCheck
                            size={16}
                            strokeWidth={1.8}
                            className="mt-[1px] shrink-0 text-[#4e83ef]"
                        />


                        <div>

                            <h4 className="text-[9px] font-semibold text-[#47515e]">
                                OAuth credentials are stored securely
                            </h4>


                            <p className="mt-[3px] text-[8px] leading-[13px] text-[#9299a2]">
                                Your Client Secret is encrypted before being stored.
                                It is never returned by the API. Leave the field blank
                                when editing to keep the existing secret.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Footer */}

                <div className="flex items-center justify-between border-t border-[#e8eaed] bg-[#fcfcfd] px-[20px] py-[14px]">

                    <p className="text-[8px] text-[#969da6]">
                        Provider: Google OAuth 2.0
                    </p>


                    <button
                        type="submit"
                        disabled={saving}
                        className="flex h-[34px] min-w-[112px] items-center justify-center gap-[7px] rounded-[8px] bg-[#286bd7] px-[14px] text-[10px] font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (
                            <>
                                <span className="h-[13px] w-[13px] animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                Saving...
                            </>
                        ) : (
                            <>
                                <Save
                                    size={13}
                                />

                                Save Changes
                            </>
                        )}

                    </button>

                </div>

            </form>


            {/* Google Console Help */}

            <div className="mt-[18px] rounded-[13px] border border-[#dadee3] bg-white px-[20px] py-[17px]">

                <h3 className="text-[12px] font-semibold text-[#25303d]">
                    Google Cloud setup
                </h3>


                <p className="mt-[5px] text-[9px] leading-[15px] text-[#818a95]">
                    Create an OAuth 2.0 Web application in Google Cloud,
                    copy the Client ID and Client Secret here, then add the
                    Authorized Redirect URI shown above to the Google OAuth client.
                </p>

            </div>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Standard Input Field
|--------------------------------------------------------------------------
*/

const Field = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
}) => {
    return (
        <div>

            <label className="mb-[6px] block text-[9px] font-medium text-[#454e5b]">
                {label}
            </label>


            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`h-[38px] w-full rounded-[8px] border bg-white px-[11px] text-[10px] font-normal text-[#515b67] outline-none transition placeholder:text-[10px] placeholder:font-normal placeholder:text-[#9aa3ad] ${
                    error
                        ? "border-[#e45a5f]"
                        : "border-[#d9dde2] focus:border-[#7da5f4]"
                }`}
            />


            {error && (
                <ErrorText>
                    {error}
                </ErrorText>
            )}

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Validation Error
|--------------------------------------------------------------------------
*/

const ErrorText = ({
    children,
}) => {
    return (
        <p className="mt-[4px] text-[8px] font-medium leading-[13px] text-[#d8484d]">
            {children}
        </p>
    );
};


export default SocialLoginSettings;