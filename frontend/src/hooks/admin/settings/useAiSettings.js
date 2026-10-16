import {
    useCallback,
    useEffect,
    useState,
} from "react";

import api from "../../../api/axios";


const initialFormData = {
    provider: "openrouter",
    api_key: "",
    model: "openrouter/free",
    url: "https://openrouter.ai/api/v1/chat/completions",
    base_url: "https://openrouter.ai/api/v1",
};


const useAiSettings = () => {
    const [formData, setFormData] =
        useState(initialFormData);

    const [aiEnabled, setAiEnabled] =
        useState(false);

    const [apiKeyConfigured, setApiKeyConfigured] =
        useState(false);

    const [maskedApiKey, setMaskedApiKey] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    const [pageError, setPageError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Apply Settings
    |--------------------------------------------------------------------------
    */

    const applySettings = useCallback(
        (settings) => {
            if (!settings) {
                return;
            }


            setAiEnabled(
                Boolean(
                    settings.is_enabled
                )
            );


            setApiKeyConfigured(
                Boolean(
                    settings.has_api_key
                )
            );


            setMaskedApiKey(
                settings.api_key_masked ||
                null
            );


            setFormData({
                provider:
                    settings.provider ||
                    "openrouter",

                api_key: "",

                model:
                    settings.model ||
                    "openrouter/free",

                url:
                    settings.url ||
                    "https://openrouter.ai/api/v1/chat/completions",

                base_url:
                    settings.base_url ||
                    "https://openrouter.ai/api/v1",
            });
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Load Settings
    |--------------------------------------------------------------------------
    */

    const fetchSettings =
        useCallback(async () => {
            setLoading(true);
            setPageError("");


            try {
                const response =
                    await api.get(
                        "/admin/settings/ai"
                    );


                const settings =
                    response.data?.data
                        ?.ai_settings;


                applySettings(
                    settings
                );

            } catch (error) {
                setPageError(
                    error.response?.data
                        ?.message ||
                    "Unable to load AI configuration."
                );

            } finally {
                setLoading(false);
            }
        }, [applySettings]);


    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);


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


        setPageError("");
        setSuccessMessage("");
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle AI
    |--------------------------------------------------------------------------
    */

    const toggleEnabled = () => {
        setAiEnabled(
            (prev) => !prev
        );

        setPageError("");
        setSuccessMessage("");
    };


    /*
    |--------------------------------------------------------------------------
    | Save Settings
    |--------------------------------------------------------------------------
    */

    const saveSettings =
        async () => {
            if (saving) {
                return false;
            }


            setSaving(true);
            setErrors({});
            setPageError("");
            setSuccessMessage("");


            try {
                const payload = {
                    provider:
                        formData.provider,

                    model:
                        formData.model.trim(),

                    url:
                        formData.url.trim(),

                    base_url:
                        formData.base_url.trim(),

                    is_enabled:
                        aiEnabled,
                };


                /*
                |--------------------------------------------------------------------------
                | Only Send API Key When Entered
                |--------------------------------------------------------------------------
                */

                if (
                    formData.api_key.trim()
                ) {
                    payload.api_key =
                        formData.api_key.trim();
                }


                const response =
                    await api.put(
                        "/admin/settings/ai",
                        payload
                    );


                const settings =
                    response.data?.data
                        ?.ai_settings;


                applySettings(
                    settings
                );


                setSuccessMessage(
                    response.data?.message ||
                    "AI configuration saved successfully."
                );


                return true;

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

                    return false;
                }


                setPageError(
                    error.response?.data
                        ?.message ||
                    "Unable to save AI configuration."
                );


                return false;

            } finally {
                setSaving(false);
            }
        };


    return {
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
    };
};


export default useAiSettings;