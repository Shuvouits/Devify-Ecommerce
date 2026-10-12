import {
    ShieldCheck,
} from "lucide-react";


const ProfileSummaryCard = ({
    profile,
}) => {
    const getInitials = (name) => {
        if (!name) {
            return "U";
        }

        return name
            .trim()
            .split(/\s+/)
            .map((part) =>
                part.charAt(0)
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };


    return (
        <div className="flex min-h-[525px] flex-col items-center justify-center rounded-[18px] border border-[#dddddd] bg-white px-[28px]">

            <div className="flex h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full border-[4px] border-white bg-[#edf2ff] shadow-[0_4px_18px_rgba(0,0,0,0.12)]">

                {profile?.avatar ? (
                    <img
                        src={profile.avatar}
                        alt={profile.name || "Profile"}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <span className="!text-[28px] !font-semibold !leading-[34px] text-[#4f67a1]">
                        {getInitials(
                            profile?.name
                        )}
                    </span>
                )}

            </div>


            <h2 className="mt-[25px] max-w-full text-center !text-[20px] !font-semibold !leading-[28px] text-[#111111]">
                {profile?.name || "User"}
            </h2>


            <p className="mt-[8px] max-w-full truncate text-center !text-[13px] !font-normal !leading-[20px] text-[#777777]">
                {profile?.email || ""}
            </p>


            {profile?.role && (
                <div className="mt-[19px] flex items-center gap-[5px] rounded-full bg-[#f0edff] px-[14px] py-[7px] !text-[12px] !font-medium !leading-[18px] capitalize text-[#6547d7]">

                    <ShieldCheck
                        size={13}
                        strokeWidth={1.8}
                    />

                    <span>
                        {profile.role}
                    </span>

                </div>
            )}

        </div>
    );
};


export default ProfileSummaryCard;