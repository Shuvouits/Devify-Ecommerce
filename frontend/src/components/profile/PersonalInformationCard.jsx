import {
    CalendarDays,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";

import ProfileField from "./fields/ProfileField";
import ErrorText from "./fields/ErrorText";
import ProfilePhotoField from "./ProfilePhotoField";


const PersonalInformationCard = ({
    profileState,
}) => {
    const {
        profile,
        formData,
        errors,
        saving,
        photoLoading,
        photoDeleting,
        handleChange,
        saveProfile,
        resetProfileForm,
        uploadPhoto,
        deletePhoto,
    } = profileState;


    return (
        <form
            onSubmit={
                saveProfile
            }
            className="rounded-[18px] border border-[#dddddd] bg-white p-[24px]"
        >

            <div className="flex items-center gap-[13px]">

                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#edf4ff] text-[#286bd7]">

                    <UserRound
                        size={20}
                    />

                </div>


                <div>

                    <h2 className="!text-[18px] !font-semibold !leading-[25px] text-[#111111]">
                        Personal Information
                    </h2>


                    <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                        Update your name and contact details
                    </p>

                </div>

            </div>


            <div className="mt-[27px] grid grid-cols-2 gap-x-[16px] gap-y-[18px]">

                <ProfileField
                    label="FIRST NAME"
                    name="first_name"
                    value={
                        formData.first_name
                    }
                    onChange={
                        handleChange
                    }
                    icon={
                        UserRound
                    }
                    error={
                        errors.first_name?.[0]
                    }
                />


                <ProfileField
                    label="LAST NAME"
                    name="last_name"
                    value={
                        formData.last_name
                    }
                    onChange={
                        handleChange
                    }
                    icon={
                        UserRound
                    }
                    error={
                        errors.last_name?.[0]
                    }
                />


                <ProfileField
                    label="EMAIL ADDRESS"
                    name="email"
                    type="email"
                    value={
                        formData.email
                    }
                    onChange={
                        handleChange
                    }
                    icon={
                        Mail
                    }
                    error={
                        errors.email?.[0]
                    }
                />


                <ProfileField
                    label="PHONE NUMBER"
                    name="phone"
                    value={
                        formData.phone
                    }
                    onChange={
                        handleChange
                    }
                    icon={
                        Phone
                    }
                    error={
                        errors.phone?.[0]
                    }
                />


                <ProfileField
                    label="BIRTHDAY"
                    name="birthday"
                    type="date"
                    value={
                        formData.birthday
                    }
                    onChange={
                        handleChange
                    }
                    icon={
                        CalendarDays
                    }
                    error={
                        errors.birthday?.[0]
                    }
                />


                <div>

                    <label
                        htmlFor="gender"
                        className="mb-[7px] block !text-[11px] !font-medium !leading-[16px] tracking-[0.4px] text-[#555555]"
                    >
                        GENDER
                    </label>


                    <select
                        id="gender"
                        name="gender"
                        value={
                            formData.gender
                        }
                        onChange={
                            handleChange
                        }
                        className={`h-[44px] w-full rounded-full border bg-white px-[17px] !text-[13px] !font-normal !leading-[20px] text-[#555555] outline-none transition ${
                            errors.gender?.[0]
                                ? "border-[#e45a5f]"
                                : "border-[#dcdcdc] focus:border-[#8cacff]"
                        }`}
                        style={{
                            fontFamily:
                                "Inter, sans-serif",
                        }}
                    >

                        <option value="">
                            Select gender
                        </option>

                        <option value="male">
                            Male
                        </option>

                        <option value="female">
                            Female
                        </option>

                        <option value="other">
                            Other
                        </option>

                        <option value="prefer_not_to_say">
                            Prefer not to say
                        </option>

                    </select>


                    <ErrorText>
                        {errors.gender?.[0]}
                    </ErrorText>

                </div>

            </div>


            <ProfilePhotoField
                profile={
                    profile
                }
                uploadPhoto={
                    uploadPhoto
                }
                deletePhoto={
                    deletePhoto
                }
                photoLoading={
                    photoLoading
                }
                photoDeleting={
                    photoDeleting
                }
            />


            <div className="mt-[24px] flex justify-end gap-[10px]">

                <button
                    type="button"
                    onClick={
                        resetProfileForm
                    }
                    disabled={
                        saving ||
                        photoLoading ||
                        photoDeleting
                    }
                    className="h-[40px] rounded-full border border-[#d8d8d8] bg-white px-[20px] !text-[13px] !font-medium text-[#444444] transition hover:bg-[#f8f8f8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={
                        saving ||
                        photoLoading ||
                        photoDeleting
                    }
                    className="flex h-[40px] min-w-[130px] items-center justify-center rounded-full bg-[#286bd7] px-[21px] !text-[13px] !font-semibold text-white transition hover:bg-[#1f60c8] disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {saving
                        ? "Saving..."
                        : "Save changes"
                    }

                </button>

            </div>

        </form>
    );
};


export default PersonalInformationCard;