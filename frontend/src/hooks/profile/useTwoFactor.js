import {
    useCallback,
    useEffect,
    useState,
} from "react";

import api from "../../api/axios";


const useTwoFactor = () => {
    const [status, setStatus] =
        useState({
            enabled: false,
            confirmed: false,
            configured: false,
        });

    const [setupData, setSetupData] =
        useState(null);

    const [recoveryCodes, setRecoveryCodes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [setupLoading, setSetupLoading] =
        useState(false);

    const [confirmLoading, setConfirmLoading] =
        useState(false);

    const [disableLoading, setDisableLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    const fetchStatus = useCallback(
        async () => {
            setLoading(true);
            setError("");

            try {
                const response =
                    await api.get(
                        "/profile/two-factor/status"
                    );

                const data =
                    response.data?.data
                        ?.two_factor;

                if (data) {
                    setStatus(data);
                }

            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load two-factor authentication status."
                );

            } finally {
                setLoading(false);
            }
        },
        []
    );


    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);


    /*
    |--------------------------------------------------------------------------
    | Start Setup
    |--------------------------------------------------------------------------
    */

    const startSetup = useCallback(
        async () => {
            setSetupLoading(true);
            setError("");

            try {
                const response =
                    await api.post(
                        "/profile/two-factor/setup"
                    );

                const data =
                    response.data?.data
                        ?.two_factor;

                if (!data) {
                    throw new Error(
                        "Two-factor setup data was not returned."
                    );
                }

                setSetupData(data);

                return data;

            } catch (error) {
                setError(
                    error.response?.data
                        ?.errors
                        ?.two_factor?.[0] ||
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Unable to start two-factor authentication setup."
                );

                return null;

            } finally {
                setSetupLoading(false);
            }
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Confirm Setup
    |--------------------------------------------------------------------------
    */

    const confirmSetup = useCallback(
        async (code) => {
            setConfirmLoading(true);
            setError("");

            try {
                const response =
                    await api.post(
                        "/profile/two-factor/confirm",
                        {
                            code,
                        }
                    );

                const data =
                    response.data?.data
                        ?.two_factor;

                if (!data) {
                    throw new Error(
                        "Two-factor confirmation data was not returned."
                    );
                }

                setStatus({
                    enabled:
                        data.enabled ?? true,

                    confirmed:
                        data.confirmed ?? true,

                    configured: true,
                });

                setRecoveryCodes(
                    data.recovery_codes || []
                );

                setSetupData(null);

                return data;

            } catch (error) {
                setError(
                    error.response?.data
                        ?.errors?.code?.[0] ||
                    error.response?.data
                        ?.errors
                        ?.two_factor?.[0] ||
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Unable to verify the authentication code."
                );

                return null;

            } finally {
                setConfirmLoading(false);
            }
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Disable Two-Factor Authentication
    |--------------------------------------------------------------------------
    */

    const disableTwoFactor = useCallback(
        async (code) => {
            setDisableLoading(true);
            setError("");

            try {
                await api.delete(
                    "/profile/two-factor",
                    {
                        data: {
                            code,
                        },
                    }
                );


                setStatus({
                    enabled: false,
                    confirmed: false,
                    configured: false,
                });


                setSetupData(null);
                setRecoveryCodes([]);


                return true;

            } catch (error) {
                setError(
                    error.response?.data
                        ?.errors?.code?.[0] ||
                    error.response?.data
                        ?.errors
                        ?.two_factor?.[0] ||
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Unable to disable two-factor authentication."
                );

                return false;

            } finally {
                setDisableLoading(false);
            }
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Clear Setup
    |--------------------------------------------------------------------------
    */

    const clearSetup = useCallback(
        () => {
            setSetupData(null);
            setError("");
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Clear Recovery Codes
    |--------------------------------------------------------------------------
    */

    const clearRecoveryCodes =
        useCallback(() => {
            setRecoveryCodes([]);
        }, []);


    /*
    |--------------------------------------------------------------------------
    | Clear Error
    |--------------------------------------------------------------------------
    */

    const clearError = useCallback(
        () => {
            setError("");
        },
        []
    );


    return {
        status,
        setupData,
        recoveryCodes,

        loading,
        setupLoading,
        confirmLoading,
        disableLoading,

        error,

        fetchStatus,
        startSetup,
        confirmSetup,
        disableTwoFactor,

        clearSetup,
        clearRecoveryCodes,
        clearError,
    };
};


export default useTwoFactor;