import {
    Bot,
    Eye,
    EyeOff,
    Save,
    ShieldCheck,
} from "lucide-react";

import {
    useState,
} from "react";

import useAiSettings from "../../../hooks/admin/settings/useAiSettings";


/*
|--------------------------------------------------------------------------
| Provider Configuration
|--------------------------------------------------------------------------
*/

const PROVIDERS = {
    openrouter: {
        name: "OpenRouter",
        title: "OpenRouter AI",
        description:
            "Connect Devify to OpenRouter for AI-powered features",
        apiKeyLabel:
            "OpenRouter API Key",
        apiKeyPlaceholder:
            "Enter your OpenRouter API key",
        modelExample:
            "openrouter/free",
        defaultModel:
            "openrouter/free",
        url:
            "https://openrouter.ai/api/v1/chat/completions",
        baseUrl:
            "https://openrouter.ai/api/v1",
    },

    nvidia: {
        name: "NVIDIA NIM",
        title: "NVIDIA NIM",
        description:
            "Connect Devify to NVIDIA NIM for AI-powered features",
        apiKeyLabel:
            "NVIDIA API Key",
        apiKeyPlaceholder:
            "Enter your NVIDIA API key",
        modelExample:
            "nvidia/nemotron-3-ultra-550b-a55b",
        defaultModel:
            "nvidia/nemotron-3-ultra-550b-a55b",
        url:
            "https://integrate.api.nvidia.com/v1/chat/completions",
        baseUrl:
            "https://integrate.api.nvidia.com/v1",
    },
};


const AiConfiguration = () => {
    const {
        formData,
        aiEnabled,
        apiKeyConfigured,
        maskedApiKey,

        loading,
        saving,

        errors,
        pageError,
        successMessage,

        handleChange,
        toggleEnabled,
        saveSettings,
    } = useAiSettings();


    const [
        showApiKey,
        setShowApiKey,
    ] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | Current Provider
    |--------------------------------------------------------------------------
    */

    const providerKey =
        formData.provider &&
        PROVIDERS[formData.provider]
            ? formData.provider
            : "openrouter";


    const provider =
        PROVIDERS[providerKey];


    /*
    |--------------------------------------------------------------------------
    | Update Hook Field
    |--------------------------------------------------------------------------
    */

    const updateField = (
        name,
        value
    ) => {
        handleChange({
            target: {
                name,
                value,
                type: "text",
            },
        });
    };


    /*
    |--------------------------------------------------------------------------
    | Provider Change
    |--------------------------------------------------------------------------
    */

    const handleProviderChange = (
        event
    ) => {
        const value =
            event.target.value;


        const selectedProvider =
            PROVIDERS[value];


        if (!selectedProvider) {
            return;
        }


        /*
        |--------------------------------------------------------------------------
        | Provider
        |--------------------------------------------------------------------------
        */

        updateField(
            "provider",
            value
        );


        /*
        |--------------------------------------------------------------------------
        | Provider Defaults
        |--------------------------------------------------------------------------
        |
        | Switching provider automatically sets the correct model
        | and API endpoints.
        |
        */

        updateField(
            "model",
            selectedProvider.defaultModel
        );


        updateField(
            "url",
            selectedProvider.url
        );


        updateField(
            "base_url",
            selectedProvider.baseUrl
        );


        /*
        |--------------------------------------------------------------------------
        | Hide API Key
        |--------------------------------------------------------------------------
        */

        setShowApiKey(
            false
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        await saveSettings();
    };


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div
                className="mx-auto max-w-[800px] pb-[40px]"
                style={{
                    fontFamily:
                        "Inter, sans-serif",
                }}
            >
                <div className="flex min-h-[360px] items-center justify-center rounded-[13px] border border-[#dadee3] bg-white">

                    <div className="flex flex-col items-center gap-[10px]">

                        <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />

                        <span className="!text-[13px] !font-normal !leading-[20px] text-[#555555]">
                            Loading AI configuration...
                        </span>

                    </div>

                </div>
            </div>
        );
    }


    return (
        <div
            className="mx-auto max-w-[800px] pb-[40px]"
            style={{
                fontFamily:
                    "Inter, sans-serif",
            }}
        >

            {/* Page Heading */}

            <div className="rounded-[13px] border border-[#dadee3] bg-white px-[22px] py-[18px]">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h1 className="!text-[18px] !font-semibold !leading-[27px] text-[#182331]">
                            AI Configuration
                        </h1>

                        <p className="mt-[3px] !text-[13px] !font-normal !leading-[20px] text-[#7a8491]">
                            Configure the AI provider used by Devify services
                        </p>

                    </div>


                    <span
                        className={`rounded-full px-[10px] py-[4px] !text-[11px] !font-semibold !leading-[16px] ${
                            aiEnabled
                                ? "bg-[#e9f8ef] text-[#32a35c]"
                                : "bg-[#f1f2f4] text-[#747e89]"
                        }`}
                    >
                        {aiEnabled
                            ? "Active"
                            : "Disabled"}
                    </span>

                </div>

            </div>


            {/* Success */}

            {successMessage && (
                <div className="mt-[14px] rounded-[10px] border border-[#bfe6cd] bg-[#f0fbf4] px-[14px] py-[11px] !text-[13px] !font-normal !leading-[20px] text-[#27854a]">
                    {successMessage}
                </div>
            )}


            {/* Error */}

            {pageError && (
                <div className="mt-[14px] rounded-[10px] border border-[#f1c7c9] bg-[#fff5f5] px-[14px] py-[11px] !text-[13px] !font-normal !leading-[20px] text-[#c83d43]">
                    {pageError}
                </div>
            )}


            {/* Configuration */}

            <form
                onSubmit={
                    handleSubmit
                }
                className="mt-[18px] overflow-hidden rounded-[13px] border border-[#dadee3] bg-white"
            >

                {/* Header */}

                <div className="flex items-center justify-between border-b border-[#e6e9ed] px-[20px] py-[15px]">

                    <div className="flex items-center gap-[13px]">

                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] bg-[#eef4ff] text-[#3173ee]">

                            <Bot
                                size={19}
                                strokeWidth={1.8}
                            />

                        </div>


                        <div>

                            <div className="flex items-center gap-[8px]">

                                <h2 className="!text-[14px] !font-semibold !leading-[21px] text-[#555555]">
                                    {provider.title}
                                </h2>


                                <span
                                    className={`rounded-full px-[8px] py-[3px] !text-[11px] !font-semibold !leading-[16px] ${
                                        apiKeyConfigured
                                            ? "bg-[#ecf9f0] text-[#35a35e]"
                                            : "bg-[#f2f3f5] text-[#7b8490]"
                                    }`}
                                >
                                    {apiKeyConfigured
                                        ? "Configured"
                                        : "Not configured"}
                                </span>

                            </div>


                            <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#89919c]">
                                {provider.description}
                            </p>

                        </div>

                    </div>


                    {/* Toggle */}

                    <button
                        type="button"
                        onClick={
                            toggleEnabled
                        }
                        className={`relative h-[21px] w-[38px] shrink-0 rounded-full transition ${
                            aiEnabled
                                ? "bg-[#286bd7]"
                                : "bg-[#cdd2d8]"
                        }`}
                        aria-label="Toggle AI configuration"
                    >
                        <span
                            className={`absolute top-[3px] h-[15px] w-[15px] rounded-full bg-white shadow transition-all ${
                                aiEnabled
                                    ? "left-[20px]"
                                    : "left-[3px]"
                            }`}
                        />
                    </button>

                </div>


                {/* Fields */}

                <div className="px-[20px] pb-[19px] pt-[18px]">

                    {/* Provider */}

                    <div>

                        <label className="mb-[6px] block !text-[13px] !font-normal !leading-[20px] text-[#555555]">
                            AI Provider
                        </label>


                        <div className="relative">

                            <Bot
                                size={15}
                                strokeWidth={1.7}
                                className="pointer-events-none absolute left-[11px] top-1/2 z-10 -translate-y-1/2 text-[#667381]"
                            />


                            <select
                                name="provider"
                                value={
                                    providerKey
                                }
                                onChange={
                                    handleProviderChange
                                }
                                className="h-[37px] w-full appearance-none rounded-[8px] border border-[#d9dde2] bg-white pl-[34px] pr-[36px] !text-[13px] !font-normal !leading-[20px] text-[#555555] outline-none transition focus:border-[#7da5f4]"
                            >
                                <option value="openrouter">
                                    OpenRouter
                                </option>

                                <option value="nvidia">
                                    NVIDIA NIM
                                </option>
                            </select>


                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                className="pointer-events-none absolute right-[12px] top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#7c858f]"
                            >
                                <path
                                    d="M6 8L10 12L14 8"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                        </div>


                        {errors.provider?.[0] && (
                            <ErrorText>
                                {errors.provider[0]}
                            </ErrorText>
                        )}

                    </div>


                    {/* API Key */}

                    <div className="mt-[14px]">

                        <label className="mb-[6px] block !text-[13px] !font-normal !leading-[20px] text-[#555555]">
                            {provider.apiKeyLabel}
                        </label>


                        <div
                            className={`flex h-[37px] items-center rounded-[8px] border bg-white px-[11px] ${
                                errors.api_key
                                    ? "border-[#e45a5f]"
                                    : "border-[#d9dde2] focus-within:border-[#7da5f4]"
                            }`}
                        >

                            <input
                                type={
                                    showApiKey
                                        ? "text"
                                        : "password"
                                }
                                name="api_key"
                                value={
                                    formData.api_key ||
                                    ""
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                                placeholder={
                                    apiKeyConfigured
                                        ? ""
                                        : provider.apiKeyPlaceholder
                                }
                                className="min-w-0 flex-1 border-0 bg-transparent !text-[13px] !font-normal !leading-[20px] text-[#555555] outline-none placeholder:text-[#a5abb3]"
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowApiKey(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="ml-[8px] flex shrink-0 items-center justify-center text-[#8c949d]"
                                aria-label={
                                    showApiKey
                                        ? "Hide API key"
                                        : "Show API key"
                                }
                            >
                                {showApiKey ? (
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


                        {errors.api_key?.[0] && (
                            <ErrorText>
                                {errors.api_key[0]}
                            </ErrorText>
                        )}


                        <p className="mt-[4px] !text-[12px] !font-normal !leading-[18px] text-[#8c8c8c]">

                            {apiKeyConfigured ? (
                                <>
                                    An API key is already configured
                                    {maskedApiKey
                                        ? ` (${maskedApiKey})`
                                        : ""}
                                    .{" "}
                                    Leave this field blank to keep the existing key.
                                </>
                            ) : (
                                `Enter your ${provider.name} API key to complete the setup.`
                            )}

                        </p>

                    </div>


                    {/* Model */}

                    <div className="mt-[14px]">

                        <Field
                            label="Model"
                            name="model"
                            value={
                                formData.model ||
                                ""
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                errors.model?.[0]
                            }
                        />


                        <p className="mt-[4px] !text-[12px] !font-normal !leading-[18px] text-[#8c8c8c]">
                            Example: {provider.modelExample}
                        </p>

                    </div>


                    {/* Chat URL */}

                    <div className="mt-[14px]">

                        <Field
                            label="Chat Completion URL"
                            name="url"
                            value={
                                formData.url ||
                                ""
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                errors.url?.[0]
                            }
                        />

                    </div>


                    {/* Base URL */}

                    <div className="mt-[14px]">

                        <Field
                            label={`${provider.name} Base URL`}
                            name="base_url"
                            value={
                                formData.base_url ||
                                ""
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                errors.base_url?.[0]
                            }
                        />

                    </div>


                    {/* Security */}

                    <div className="mt-[16px] flex gap-[11px] rounded-[10px] border border-[#dde2e8] bg-[#fafbfc] px-[13px] py-[11px]">

                        <ShieldCheck
                            size={17}
                            strokeWidth={1.8}
                            className="mt-[1px] shrink-0 text-[#4e83ef]"
                        />


                        <div>

                            <h4 className="!text-[13px] !font-semibold !leading-[20px] text-[#555555]">
                                API credentials are stored securely
                            </h4>


                            <p className="mt-[3px] !text-[12px] !font-normal !leading-[18px] text-[#9299a2]">
                                The {provider.name} API key is encrypted before being stored.
                                After saving, the key field stays blank and the existing key
                                is preserved unless you enter a new one.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Footer */}

                <div className="flex justify-end border-t border-[#e8eaed] bg-[#fcfcfd] px-[20px] py-[14px]">

                    <button
                        type="submit"
                        disabled={
                            saving
                        }
                        className="flex h-[36px] min-w-[150px] items-center justify-center gap-[7px] rounded-[8px] bg-[#286bd7] px-[15px] !text-[13px] !font-semibold !leading-[20px] text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <span className="h-[14px] w-[14px] animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                Saving...
                            </>
                        ) : (
                            <>
                                <Save
                                    size={14}
                                />

                                Save Configuration
                            </>
                        )}
                    </button>

                </div>

            </form>

        </div>
    );
};


/*
|--------------------------------------------------------------------------
| Standard Field
|--------------------------------------------------------------------------
*/

const Field = ({
    label,
    name,
    value,
    onChange,
    error,
}) => {
    return (
        <div>

            <label className="mb-[6px] block !text-[13px] !font-normal !leading-[20px] text-[#555555]">
                {label}
            </label>


            <input
                type="text"
                name={
                    name
                }
                value={
                    value
                }
                onChange={
                    onChange
                }
                className={`h-[37px] w-full rounded-[8px] border bg-white px-[11px] !text-[13px] !font-normal !leading-[20px] text-[#555555] outline-none transition ${
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
| Error Text
|--------------------------------------------------------------------------
*/

const ErrorText = ({
    children,
}) => {
    return (
        <p className="mt-[4px] !text-[12px] !font-normal !leading-[18px] text-[#d8484d]">
            {children}
        </p>
    );
};


export default AiConfiguration;