import {
    Trash2,
    Upload,
    UserRound,
} from "lucide-react";

import {
    useRef,
} from "react";


const ProfilePhotoField = ({
    profile,
    uploadPhoto,
    deletePhoto,
    photoLoading,
    photoDeleting,
}) => {
    const inputRef =
        useRef(null);


    const handleFileChange = async (e) => {
        const file =
            e.target.files?.[0];


        e.target.value = "";


        if (!file) {
            return;
        }


        await uploadPhoto(
            file
        );
    };


    return (
        <div className="mt-[20px] flex items-center justify-between rounded-[13px] border border-[#e1e1e1] bg-[#fcfcfc] px-[16px] py-[14px]">

            <div className="flex min-w-0 items-center gap-[12px]">

                <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#edf2ff]">

                    {profile?.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={
                                profile.name ||
                                "Profile"
                            }
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <UserRound
                            size={19}
                            className="text-[#657184]"
                        />
                    )}

                </div>


                <div className="min-w-0">

                    <div className="!text-[13px] !font-medium !leading-[20px] text-[#222222]">
                        Profile photo
                    </div>


                    <div className="mt-[2px] !text-[11px] !font-normal !leading-[16px] text-[#888888]">
                        JPG, PNG or WEBP. Max 5MB.
                    </div>

                </div>

            </div>


            <div className="flex items-center gap-[8px]">

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                        handleFileChange
                    }
                    className="hidden"
                />


                {profile?.profile_photo_path && (
                    <button
                        type="button"
                        onClick={
                            deletePhoto
                        }
                        disabled={
                            photoLoading ||
                            photoDeleting
                        }
                        className="flex h-[38px] items-center gap-[6px] rounded-full border border-[#efc7c9] bg-white px-[14px] !text-[12px] !font-medium text-[#d44b50] transition hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <Trash2
                            size={14}
                        />

                        {photoDeleting
                            ? "Removing..."
                            : "Remove"
                        }

                    </button>
                )}


                <button
                    type="button"
                    onClick={() =>
                        inputRef.current
                            ?.click()
                    }
                    disabled={
                        photoLoading ||
                        photoDeleting
                    }
                    className="flex h-[38px] items-center gap-[7px] rounded-full border border-[#d9d9d9] bg-white px-[17px] !text-[12px] !font-medium text-[#333333] transition hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <Upload
                        size={14}
                    />

                    {photoLoading
                        ? "Uploading..."
                        : profile?.profile_photo_path
                            ? "Change photo"
                            : "Upload photo"
                    }

                </button>

            </div>

        </div>
    );
};


export default ProfilePhotoField;