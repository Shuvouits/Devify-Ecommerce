import { useEffect, useState } from "react";

import {
    Eye,
    EyeOff,
    HardDrive,
    Mail,
    Save,
    Send,
    ShieldCheck,
} from "lucide-react";

import api from "../../../api/axios";


const EmailSettings = () => {
    const [smtpEnabled, setSmtpEnabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [passwordConfigured, setPasswordConfigured] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [pageError, setPageError] =
        useState("");

    const [errors, setErrors] =
        useState({});

    const [testEmail, setTestEmail] =
        useState("");

    const [testMessage, setTestMessage] =
        useState("");


    const [formData, setFormData] = useState({
        provider: "custom",
        host: "",
        port: "587",
        encryption: "tls",
        username: "",
        password: "",
        from_email: "",
        from_name: "",
    });


    /*
    |--------------------------------------------------------------------------
    | GET SMTP SETTINGS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let mounted = true;

        const fetchSettings = async () => {
            try {
                setLoading(true);
                setPageError("");

                const response =
                    await api.get(
                        "/admin/settings/email"
                    );

                const data =
                    response.data?.data;

                const settings =
                    data?.settings;

                if (!mounted) {
                    return;
                }

                setPasswordConfigured(
                    Boolean(
                        data?.password_configured
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | No saved settings yet
                |--------------------------------------------------------------------------
                */

                if (!settings) {
                    setSmtpEnabled(false);

                    return;
                }


                /*
                |--------------------------------------------------------------------------
                | Load saved settings
                |--------------------------------------------------------------------------
                */

                setSmtpEnabled(
                    Boolean(settings.is_enabled)
                );

                setFormData({
                    provider:
                        settings.provider ||
                        "custom",

                    host:
                        settings.host || "",

                    port:
                        settings.port
                            ? String(settings.port)
                            : "587",

                    encryption:
                        settings.encryption ||
                        "tls",

                    username:
                        settings.username || "",

                    /*
                    |--------------------------------------------------------------------------
                    | Never load password from API
                    |--------------------------------------------------------------------------
                    */

                    password: "",

                    from_email:
                        settings.from_email || "",

                    from_name:
                        settings.from_name || "",
                });

            } catch (error) {
                if (!mounted) {
                    return;
                }

                setPageError(
                    error.response?.data?.message ||
                    "Unable to load SMTP settings."
                );

            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };


        fetchSettings();


        return () => {
            mounted = false;
        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | NORMAL INPUT CHANGE
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


        /*
        |--------------------------------------------------------------------------
        | Clear field validation error
        |--------------------------------------------------------------------------
        */

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
    | PROVIDER SELECT
    |--------------------------------------------------------------------------
    */

    const handleProviderSelect = (provider) => {
        setErrors({});
        setSuccessMessage("");
        setPageError("");


        if (provider === "gmail") {
            setFormData((prev) => ({
                ...prev,

                provider: "gmail",

                host:
                    "smtp.gmail.com",

                port:
                    "587",

                encryption:
                    "tls",
            }));

            return;
        }


        if (provider === "microsoft365") {
            setFormData((prev) => ({
                ...prev,

                provider:
                    "microsoft365",

                host:
                    "smtp.office365.com",

                port:
                    "587",

                encryption:
                    "tls",
            }));

            return;
        }


        setFormData((prev) => ({
            ...prev,
            provider: "custom",
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | SAVE SMTP SETTINGS
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }


        setSaving(true);
        setErrors({});
        setPageError("");
        setSuccessMessage("");


        try {
            const payload = {
                is_enabled: smtpEnabled,

                provider:
                    formData.provider,

                host:
                    formData.host.trim(),

                port:
                    formData.port
                        ? Number(formData.port)
                        : null,

                encryption:
                    formData.encryption,

                username:
                    formData.username.trim(),

                from_email:
                    formData.from_email.trim(),

                from_name:
                    formData.from_name.trim(),
            };


            /*
            |--------------------------------------------------------------------------
            | Only send password if admin entered one
            |--------------------------------------------------------------------------
            |
            | Blank password means:
            | preserve existing encrypted password.
            |
            */

            if (
                formData.password.trim()
            ) {
                payload.password =
                    formData.password;
            }


            const response =
                await api.put(
                    "/admin/settings/email",
                    payload
                );


            const responseData =
                response.data?.data;


            const settings =
                responseData?.settings;


            /*
            |--------------------------------------------------------------------------
            | Update UI from saved data
            |--------------------------------------------------------------------------
            */

            if (settings) {
                setSmtpEnabled(
                    Boolean(
                        settings.is_enabled
                    )
                );

                setFormData((prev) => ({
                    ...prev,

                    provider:
                        settings.provider ||
                        "custom",

                    host:
                        settings.host || "",

                    port:
                        settings.port
                            ? String(
                                settings.port
                            )
                            : "",

                    encryption:
                        settings.encryption ||
                        "tls",

                    username:
                        settings.username ||
                        "",

                    /*
                    |--------------------------------------------------------------------------
                    | Clear password after save
                    |--------------------------------------------------------------------------
                    */

                    password: "",

                    from_email:
                        settings.from_email ||
                        "",

                    from_name:
                        settings.from_name ||
                        "",
                }));
            }


            setPasswordConfigured(
                Boolean(
                    responseData
                        ?.password_configured
                )
            );


            setSuccessMessage(
                response.data?.message ||
                "SMTP settings saved successfully."
            );

        } catch (error) {
            /*
            |--------------------------------------------------------------------------
            | Validation errors - 422
            |--------------------------------------------------------------------------
            */

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


            /*
            |--------------------------------------------------------------------------
            | Other errors
            |--------------------------------------------------------------------------
            */

            setPageError(
                error.response?.data?.message ||
                "Unable to save SMTP settings."
            );

        } finally {
            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | TEST EMAIL
    |--------------------------------------------------------------------------
    |
    | Backend endpoint for test email has not been created yet.
    |
    */

    const handleTestEmail = (e) => {
        e.preventDefault();

        setTestMessage("");

        if (!testEmail.trim()) {
            setTestMessage(
                "Enter an email address first."
            );

            return;
        }

        setTestMessage(
            "Test email API will be connected in the next step."
        );
    };


    /*
    |--------------------------------------------------------------------------
    | INITIAL LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="mx-auto max-w-[800px] pb-[40px]">

                <div className="flex min-h-[360px] items-center justify-center rounded-[13px] border border-[#dadee3] bg-white">

                    <div className="flex flex-col items-center gap-[10px]">

                        <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />

                        <span className="text-[11px] text-[#7a8491]">
                            Loading email settings...
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
                            Email Configuration (SMTP)
                        </h1>

                        <p className="mt-[3px] text-[12px] text-[#7a8491]">
                            Configure outgoing email delivery for your store
                        </p>

                    </div>


                    <span
                        className={`rounded-full px-[10px] py-[4px] text-[9px] font-semibold ${
                            smtpEnabled
                                ? "bg-[#e9f8ef] text-[#32a35c]"
                                : "bg-[#f1f2f4] text-[#747e89]"
                        }`}
                    >
                        {smtpEnabled
                            ? "Active"
                            : "Disabled"}
                    </span>

                </div>

            </div>


            {/* Success Message */}

            {successMessage && (
                <div className="mt-[14px] rounded-[10px] border border-[#bfe6cd] bg-[#f0fbf4] px-[14px] py-[11px] text-[11px] font-medium text-[#27854a]">
                    {successMessage}
                </div>
            )}


            {/* Error Message */}

            {pageError && (
                <div className="mt-[14px] rounded-[10px] border border-[#f1c7c9] bg-[#fff5f5] px-[14px] py-[11px] text-[11px] font-medium text-[#c83d43]">
                    {pageError}
                </div>
            )}


            {/* SMTP CARD */}

            <form
                onSubmit={handleSubmit}
                className="mt-[18px] overflow-hidden rounded-[13px] border border-[#dadee3] bg-white"
            >

                {/* Card Header */}

                <div className="flex items-center justify-between border-b border-[#e6e9ed] px-[20px] py-[15px]">

                    <div className="flex items-center gap-[13px]">

                        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[9px] bg-[#eef4ff] text-[#3173ee]">

                            <Mail
                                size={19}
                                strokeWidth={1.8}
                            />

                        </div>


                        <div>

                            <div className="flex items-center gap-[8px]">

                                <h2 className="text-[14px] font-semibold text-[#24303d]">
                                    SMTP Email Delivery
                                </h2>


                                <span
                                    className={`rounded-full px-[8px] py-[3px] text-[8px] font-semibold ${
                                        passwordConfigured
                                            ? "bg-[#ecf9f0] text-[#35a35e]"
                                            : "bg-[#f2f3f5] text-[#7b8490]"
                                    }`}
                                >
                                    {passwordConfigured
                                        ? "Configured"
                                        : "Not configured"}
                                </span>

                            </div>


                            <p className="mt-[2px] text-[10px] text-[#89919c]">
                                Send transactional and notification emails through your SMTP server
                            </p>

                        </div>

                    </div>


                    {/* Toggle */}

                    <button
                        type="button"
                        onClick={() => {
                            setSmtpEnabled(
                                (prev) => !prev
                            );

                            setSuccessMessage("");
                            setPageError("");
                        }}
                        className={`relative h-[21px] w-[38px] rounded-full transition ${
                            smtpEnabled
                                ? "bg-[#286bd7]"
                                : "bg-[#cdd2d8]"
                        }`}
                    >

                        <span
                            className={`absolute top-[3px] h-[15px] w-[15px] rounded-full bg-white shadow transition-all ${
                                smtpEnabled
                                    ? "left-[20px]"
                                    : "left-[3px]"
                            }`}
                        />

                    </button>

                </div>


                <div className="px-[20px] pb-[19px] pt-[18px]">

                    {/* Provider */}

                    <label className="text-[10px] font-medium text-[#454e5b]">
                        Quick Provider Setup
                    </label>


                    <div className="mt-[8px] flex items-center gap-[7px]">

                        <ProviderButton
                            label="Gmail"
                            active={
                                formData.provider ===
                                "gmail"
                            }
                            onClick={() =>
                                handleProviderSelect(
                                    "gmail"
                                )
                            }
                        />


                        <ProviderButton
                            label="Microsoft 365"
                            active={
                                formData.provider ===
                                "microsoft365"
                            }
                            onClick={() =>
                                handleProviderSelect(
                                    "microsoft365"
                                )
                            }
                        />


                        <ProviderButton
                            label="Custom SMTP"
                            active={
                                formData.provider ===
                                "custom"
                            }
                            onClick={() =>
                                handleProviderSelect(
                                    "custom"
                                )
                            }
                        />

                    </div>


                    {errors.provider?.[0] && (
                        <ErrorText>
                            {errors.provider[0]}
                        </ErrorText>
                    )}


                    {/* Row 1 */}

                    <div className="mt-[18px] grid grid-cols-[1.5fr_.65fr_.8fr] gap-[14px]">

                        <Field
                            label="SMTP Host"
                            name="host"
                            value={formData.host}
                            onChange={handleChange}
                            placeholder="smtp.example.com"
                            error={
                                errors.host?.[0]
                            }
                        />


                        <Field
                            label="Port"
                            name="port"
                            value={formData.port}
                            onChange={handleChange}
                            placeholder="587"
                            error={
                                errors.port?.[0]
                            }
                        />


                        <div>

                            <label className="mb-[6px] block text-[10px] font-medium text-[#454e5b]">
                                Encryption
                            </label>

                            <select
                                name="encryption"
                                value={
                                    formData.encryption
                                }
                                onChange={handleChange}
                                className={`h-[37px] w-full rounded-[8px] border bg-white px-[11px] text-[11px] text-[#626c79] outline-none ${
                                    errors.encryption
                                        ? "border-[#e45a5f]"
                                        : "border-[#d9dde2] focus:border-[#7da5f4]"
                                }`}
                            >

                                <option value="tls">
                                    TLS / STARTTLS
                                </option>

                                <option value="ssl">
                                    SSL
                                </option>

                                <option value="none">
                                    None
                                </option>

                            </select>


                            {errors.encryption?.[0] && (
                                <ErrorText>
                                    {
                                        errors
                                            .encryption[0]
                                    }
                                </ErrorText>
                            )}

                        </div>

                    </div>


                    {/* Row 2 */}

                    <div className="mt-[14px] grid grid-cols-2 gap-[14px]">

                        <Field
                            label="SMTP Username"
                            name="username"
                            value={
                                formData.username
                            }
                            onChange={handleChange}
                            placeholder="SMTP username"
                            error={
                                errors.username?.[0]
                            }
                        />


                        {/* Password */}

                        <div>

                            <label className="mb-[6px] block text-[10px] font-medium text-[#454e5b]">
                                SMTP Password
                            </label>


                            <div
                                className={`flex h-[37px] items-center rounded-[8px] border bg-white px-[11px] ${
                                    errors.password
                                        ? "border-[#e45a5f]"
                                        : "border-[#d9dde2] focus-within:border-[#7da5f4]"
                                }`}
                            >

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={
                                        passwordConfigured
                                            ? "Stored securely •••••••••••"
                                            : "Enter SMTP password"
                                    }
                                    autoComplete="new-password"
                                    className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#afb5bd]"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    className="text-[#8c949d]"
                                >

                                    {showPassword ? (
                                        <EyeOff
                                            size={15}
                                        />
                                    ) : (
                                        <Eye
                                            size={15}
                                        />
                                    )}

                                </button>

                            </div>


                            {errors.password?.[0] && (
                                <ErrorText>
                                    {
                                        errors
                                            .password[0]
                                    }
                                </ErrorText>
                            )}


                            <p className="mt-[4px] text-[9px] text-[#a0a6af]">
                                {passwordConfigured
                                    ? "Leave blank to keep the existing password."
                                    : "Enter the SMTP password to complete the initial setup."}
                            </p>

                        </div>

                    </div>


                    {/* Row 3 */}

                    <div className="mt-[14px] grid grid-cols-2 gap-[14px]">

                        <Field
                            label="From Email"
                            name="from_email"
                            value={
                                formData.from_email
                            }
                            onChange={handleChange}
                            placeholder="store@example.com"
                            error={
                                errors.from_email?.[0]
                            }
                        />


                        <Field
                            label="From Name"
                            name="from_name"
                            value={
                                formData.from_name
                            }
                            onChange={handleChange}
                            placeholder="Storify"
                            error={
                                errors.from_name?.[0]
                            }
                        />

                    </div>


                    {/* Security Notice */}

                    <div className="mt-[16px] flex gap-[11px] rounded-[10px] border border-[#dde2e8] bg-[#fafbfc] px-[13px] py-[11px]">

                        <ShieldCheck
                            size={17}
                            strokeWidth={1.8}
                            className="mt-[1px] shrink-0 text-[#4e83ef]"
                        />


                        <div>

                            <h4 className="text-[10px] font-semibold text-[#47515e]">
                                SMTP credentials are stored securely
                            </h4>


                            <p className="mt-[3px] text-[9px] leading-[15px] text-[#9299a2]">
                                The SMTP password is encrypted before being stored.
                                After saving, the password field stays blank and the
                                existing password is preserved unless you enter a new one.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Footer */}

                <div className="flex justify-end border-t border-[#e8eaed] bg-[#fcfcfd] px-[20px] py-[14px]">

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex h-[36px] min-w-[118px] items-center justify-center gap-[7px] rounded-[8px] bg-[#286bd7] px-[15px] text-[11px] font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (
                            <>
                                <span className="h-[14px] w-[14px] animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={14} />

                                Save Changes
                            </>
                        )}

                    </button>

                </div>

            </form>


            {/* Test Email */}

            <form
                onSubmit={handleTestEmail}
                className="mt-[18px] rounded-[13px] border border-[#dadee3] bg-white px-[20px] py-[17px]"
            >

                <div className="flex items-center gap-[12px]">

                    <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-[#f3f4f6] text-[#65717f]">

                        <Send
                            size={17}
                            strokeWidth={1.8}
                        />

                    </div>


                    <div>

                        <h3 className="text-[14px] font-semibold text-[#25303d]">
                            Send Test Email
                        </h3>


                        <p className="mt-[2px] text-[10px] text-[#9299a2]">
                            Verify that your saved SMTP configuration can deliver email
                        </p>

                    </div>

                </div>


                <div className="mt-[15px] flex gap-[9px]">

                    <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => {
                            setTestEmail(
                                e.target.value
                            );

                            setTestMessage("");
                        }}
                        placeholder="Enter test email address"
                        className="h-[38px] min-w-0 flex-1 rounded-[8px] border border-[#d9dde2] px-[12px] text-[11px] outline-none focus:border-[#7da5f4]"
                    />


                    <button
                        type="submit"
                        className="flex h-[38px] items-center gap-[7px] rounded-[8px] border border-[#d9dde2] bg-white px-[15px] text-[11px] font-semibold text-[#35404d] transition hover:bg-[#f7f8fa]"
                    >
                        <Send size={14} />
                        Send Test
                    </button>

                </div>


                {testMessage && (
                    <p className="mt-[8px] text-[10px] text-[#7a8491]">
                        {testMessage}
                    </p>
                )}

            </form>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| PROVIDER BUTTON
|--------------------------------------------------------------------------
*/

const ProviderButton = ({
    label,
    active,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex h-[34px] items-center gap-[7px] rounded-[8px] border px-[12px] text-[10px] font-medium transition ${
                active
                    ? "border-[#9ab9f7] bg-[#eef4ff] text-[#286bd7]"
                    : "border-[#d9dde2] bg-white text-[#424b57] hover:bg-[#f7f8fa]"
            }`}
        >
            <HardDrive size={14} />

            {label}
        </button>
    );
};


/*
|--------------------------------------------------------------------------
| STANDARD FIELD
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

            <label className="mb-[6px] block text-[10px] font-medium text-[#454e5b]">
                {label}
            </label>


            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`h-[37px] w-full rounded-[8px] border bg-white px-[11px] text-[11px] text-[#626c79] outline-none transition placeholder:text-[#b0b6bd] ${
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
| VALIDATION ERROR
|--------------------------------------------------------------------------
*/

const ErrorText = ({ children }) => {
    return (
        <p className="mt-[4px] text-[9px] font-medium text-[#d8484d]">
            {children}
        </p>
    );
};


export default EmailSettings;