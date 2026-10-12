import {
    useCallback,
    useEffect,
    useState,
} from "react";

import api from "../../api/axios";

import {
    getStoredUser,
    saveAuth,
} from "../../utils/auth";


const initialProfileForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
};


const initialPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
};


const useProfile = () => {
    const [profile, setProfile] =
        useState(null);

    const [formData, setFormData] =
        useState(initialProfileForm);

    const [passwordData, setPasswordData] =
        useState(initialPasswordForm);


    /*
    |--------------------------------------------------------------------------
    | Loading States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [photoLoading, setPhotoLoading] =
        useState(false);

    const [photoDeleting, setPhotoDeleting] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Messages
    |--------------------------------------------------------------------------
    */

    const [successMessage, setSuccessMessage] =
        useState("");

    const [pageError, setPageError] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Validation Errors
    |--------------------------------------------------------------------------
    */

    const [errors, setErrors] =
        useState({});

    const [passwordErrors, setPasswordErrors] =
        useState({});


    /*
    |--------------------------------------------------------------------------
    | Clear Messages
    |--------------------------------------------------------------------------
    */

    const clearMessages = useCallback(() => {
        setSuccessMessage("");
        setPageError("");
    }, []);


    /*
    |--------------------------------------------------------------------------
    | Sync Profile Form
    |--------------------------------------------------------------------------
    */

    const syncProfileForm = useCallback(
        (data) => {
            setFormData({
                first_name:
                    data?.first_name || "",

                last_name:
                    data?.last_name || "",

                email:
                    data?.email || "",

                phone:
                    data?.phone || "",

                birthday:
                    data?.birthday || "",

                gender:
                    data?.gender || "",
            });
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Sync Auth User In Local Storage
    |--------------------------------------------------------------------------
    */

    const syncStoredUser = useCallback(
        (updatedProfile) => {
            const token =
                localStorage.getItem(
                    "token"
                );


            if (
                !token ||
                !updatedProfile
            ) {
                return;
            }


            const storedUser =
                getStoredUser() || {};


            const updatedUser = {
                ...storedUser,

                id:
                    updatedProfile.id,

                name:
                    updatedProfile.name,

                email:
                    updatedProfile.email,

                phone:
                    updatedProfile.phone,

                role:
                    updatedProfile.role,

                status:
                    updatedProfile.status,

                avatar:
                    updatedProfile.avatar,

                first_name:
                    updatedProfile.first_name,

                last_name:
                    updatedProfile.last_name,

                birthday:
                    updatedProfile.birthday,

                gender:
                    updatedProfile.gender,
            };


            saveAuth(
                token,
                updatedUser
            );


            /*
            |--------------------------------------------------------------------------
            | Notify Other Frontend Components
            |--------------------------------------------------------------------------
            |
            | Sidebar/Header later ei event listen korte parbe.
            |
            */

            window.dispatchEvent(
                new CustomEvent(
                    "auth:user-updated",
                    {
                        detail:
                            updatedUser,
                    }
                )
            );
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | Apply Profile Response
    |--------------------------------------------------------------------------
    */

    const applyProfile = useCallback(
        (
            data,
            {
                updateForm = true,
            } = {}
        ) => {
            if (!data) {
                return;
            }


            setProfile(
                data
            );


            if (updateForm) {
                syncProfileForm(
                    data
                );
            }


            syncStoredUser(
                data
            );
        },
        [
            syncProfileForm,
            syncStoredUser,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Get Profile
    |--------------------------------------------------------------------------
    */

    const fetchProfile = useCallback(
        async () => {
            setLoading(true);
            setPageError("");


            try {
                const response =
                    await api.get(
                        "/profile"
                    );


                const data =
                    response.data?.data
                        ?.profile;


                if (!data) {
                    throw new Error(
                        "Profile data was not returned."
                    );
                }


                applyProfile(
                    data
                );

            } catch (error) {
                setPageError(
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Unable to load profile."
                );

            } finally {
                setLoading(false);
            }
        },
        [
            applyProfile,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Initial Profile Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);


    /*
    |--------------------------------------------------------------------------
    | Personal Information Input
    |--------------------------------------------------------------------------
    */

    const handleChange = useCallback(
        (e) => {
            const {
                name,
                value,
            } = e.target;


            setFormData(
                (prev) => ({
                    ...prev,
                    [name]:
                        value,
                })
            );


            setErrors(
                (prev) => {
                    if (!prev[name]) {
                        return prev;
                    }


                    return {
                        ...prev,
                        [name]:
                            undefined,
                    };
                }
            );


            clearMessages();
        },
        [
            clearMessages,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Save Personal Information
    |--------------------------------------------------------------------------
    */

    const saveProfile = useCallback(
        async (e) => {
            if (e) {
                e.preventDefault();
            }


            if (saving) {
                return false;
            }


            setSaving(true);
            setErrors({});
            clearMessages();


            try {
                const payload = {
                    first_name:
                        formData.first_name.trim(),

                    last_name:
                        formData.last_name.trim(),

                    email:
                        formData.email.trim(),

                    phone:
                        formData.phone.trim(),

                    birthday:
                        formData.birthday ||
                        null,

                    gender:
                        formData.gender ||
                        null,
                };


                const response =
                    await api.put(
                        "/profile",
                        payload
                    );


                const updatedProfile =
                    response.data?.data
                        ?.profile;


                if (!updatedProfile) {
                    throw new Error(
                        "Updated profile was not returned."
                    );
                }


                applyProfile(
                    updatedProfile
                );


                setSuccessMessage(
                    response.data?.message ||
                    "Profile updated successfully."
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
                    error.message ||
                    "Unable to update profile."
                );


                return false;

            } finally {
                setSaving(false);
            }
        },
        [
            saving,
            formData,
            clearMessages,
            applyProfile,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Upload Profile Photo
    |--------------------------------------------------------------------------
    */

   const uploadPhoto = useCallback(
    async (file) => {
        if (!file || photoLoading) {
            return false;
        }

        setPhotoLoading(true);
        clearMessages();

        try {
            const payload = new FormData();

            payload.append("photo", file);

            const response = await api.post(
                "/profile/photo",
                payload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const updatedProfile =
                response.data?.data?.profile;

            if (!updatedProfile) {
                throw new Error(
                    "Updated profile photo data was not returned."
                );
            }

            setProfile({
                ...updatedProfile,
                avatar: updatedProfile.avatar
                    ? `${updatedProfile.avatar}${
                          updatedProfile.avatar.includes("?")
                              ? "&"
                              : "?"
                      }t=${Date.now()}`
                    : null,
            });

            syncStoredUser(updatedProfile);

            setSuccessMessage(
                response.data?.message ||
                    "Profile photo updated successfully."
            );

            return true;
        } catch (error) {
            console.error(
                "Profile photo upload failed:",
                error.response?.data || error
            );

            setPageError(
                error.response?.data?.errors?.photo?.[0] ||
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to upload profile photo."
            );

            return false;
        } finally {
            setPhotoLoading(false);
        }
    },
    [
        photoLoading,
        clearMessages,
        syncStoredUser,
    ]
);


    /*
    |--------------------------------------------------------------------------
    | Delete Profile Photo
    |--------------------------------------------------------------------------
    */

    const deletePhoto = useCallback(
        async () => {
            if (photoDeleting) {
                return false;
            }


            setPhotoDeleting(true);
            clearMessages();


            try {
                const response =
                    await api.delete(
                        "/profile/photo"
                    );


                const updatedProfile =
                    response.data?.data
                        ?.profile;


                if (!updatedProfile) {
                    throw new Error(
                        "Updated profile data was not returned."
                    );
                }


                applyProfile(
                    updatedProfile,
                    {
                        updateForm:
                            false,
                    }
                );


                setSuccessMessage(
                    response.data?.message ||
                    "Profile photo removed successfully."
                );


                return true;

            } catch (error) {
                setPageError(
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Unable to remove profile photo."
                );


                return false;

            } finally {
                setPhotoDeleting(false);
            }
        },
        [
            photoDeleting,
            clearMessages,
            applyProfile,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | Password Input
    |--------------------------------------------------------------------------
    */

    const handlePasswordChange =
        useCallback(
            (e) => {
                const {
                    name,
                    value,
                } = e.target;


                setPasswordData(
                    (prev) => ({
                        ...prev,
                        [name]:
                            value,
                    })
                );


                setPasswordErrors(
                    (prev) => {
                        if (
                            !prev[name]
                        ) {
                            return prev;
                        }


                        return {
                            ...prev,
                            [name]:
                                undefined,
                        };
                    }
                );


                clearMessages();
            },
            [
                clearMessages,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */

    const updatePassword =
        useCallback(
            async (e) => {
                if (e) {
                    e.preventDefault();
                }


                if (
                    passwordSaving
                ) {
                    return false;
                }


                setPasswordSaving(
                    true
                );

                setPasswordErrors(
                    {}
                );

                clearMessages();


                try {
                    const response =
                        await api.put(
                            "/profile/password",
                            passwordData
                        );


                    setPasswordData(
                        initialPasswordForm
                    );


                    setSuccessMessage(
                        response.data?.message ||
                        "Password updated successfully."
                    );


                    return true;

                } catch (error) {
                    if (
                        error.response
                            ?.status ===
                        422
                    ) {
                        setPasswordErrors(
                            error.response
                                ?.data
                                ?.errors ||
                            {}
                        );


                        setPageError(
                            "Please check the password fields."
                        );


                        return false;
                    }


                    setPageError(
                        error.response?.data
                            ?.message ||
                        error.message ||
                        "Unable to update password."
                    );


                    return false;

                } finally {
                    setPasswordSaving(
                        false
                    );
                }
            },
            [
                passwordSaving,
                passwordData,
                clearMessages,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Reset Profile Form
    |--------------------------------------------------------------------------
    */

    const resetProfileForm =
        useCallback(() => {
            if (!profile) {
                return;
            }


            syncProfileForm(
                profile
            );

            setErrors({});
            clearMessages();

        }, [
            profile,
            syncProfileForm,
            clearMessages,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Public Hook API
    |--------------------------------------------------------------------------
    */

    return {
        /*
        |--------------------------------------------------------------------------
        | Data
        |--------------------------------------------------------------------------
        */

        profile,

        formData,

        passwordData,


        /*
        |--------------------------------------------------------------------------
        | Loading
        |--------------------------------------------------------------------------
        */

        loading,

        saving,

        photoLoading,

        photoDeleting,

        passwordSaving,


        /*
        |--------------------------------------------------------------------------
        | Messages
        |--------------------------------------------------------------------------
        */

        successMessage,

        pageError,

        errors,

        passwordErrors,


        /*
        |--------------------------------------------------------------------------
        | Profile Actions
        |--------------------------------------------------------------------------
        */

        fetchProfile,

        handleChange,

        saveProfile,

        resetProfileForm,


        /*
        |--------------------------------------------------------------------------
        | Photo Actions
        |--------------------------------------------------------------------------
        */

        uploadPhoto,

        deletePhoto,


        /*
        |--------------------------------------------------------------------------
        | Password Actions
        |--------------------------------------------------------------------------
        */

        handlePasswordChange,

        updatePassword,


        /*
        |--------------------------------------------------------------------------
        | Message Actions
        |--------------------------------------------------------------------------
        */

        clearMessages,
    };
};


export default useProfile;