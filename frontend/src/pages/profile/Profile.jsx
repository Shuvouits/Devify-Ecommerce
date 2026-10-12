import AccountSummaryCard from "../../components/profile/AccountSummaryCard";
import ChangePasswordCard from "../../components/profile/ChangePasswordCard";
import PersonalInformationCard from "../../components/profile/PersonalInformationCard";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSummaryCard from "../../components/profile/ProfileSummaryCard";
import TwoFactorCard from "../../components/profile/TwoFactorCard";

import useProfile from "../../hooks/profile/useProfile";


const Profile = () => {
    const profileState =
        useProfile();


    if (profileState.loading) {
        return (
            <div className="flex min-h-[420px] items-center justify-center">
                <div className="h-[30px] w-[30px] animate-spin rounded-full border-[3px] border-[#dce6ff] border-t-[#286bd7]" />
            </div>
        );
    }


    return (
        <div
            className="mx-auto w-full max-w-[1140px] pb-[50px]"
            style={{
                fontFamily:
                    "Inter, sans-serif",
            }}
        >

            <ProfileHeader />


            {profileState.successMessage && (
                <div className="mb-[16px] rounded-[10px] border border-[#bfe6cd] bg-[#f0fbf4] px-[14px] py-[11px] !text-[13px] !font-normal !leading-[20px] text-[#27854a]">
                    {profileState.successMessage}
                </div>
            )}


            {profileState.pageError && (
                <div className="mb-[16px] rounded-[10px] border border-[#f1c7c9] bg-[#fff5f5] px-[14px] py-[11px] !text-[13px] !font-normal !leading-[20px] text-[#c83d43]">
                    {profileState.pageError}
                </div>
            )}


            <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-[330px_minmax(0,1fr)]">

                <ProfileSummaryCard
                    profile={
                        profileState.profile
                    }
                />


                <PersonalInformationCard
                    profileState={
                        profileState
                    }
                />

            </div>


            <div className="mt-[20px] grid grid-cols-1 gap-[20px] xl:grid-cols-[minmax(0,1fr)_340px]">

                <ChangePasswordCard
                    profileState={
                        profileState
                    }
                />


                <AccountSummaryCard
                    profile={
                        profileState.profile
                    }
                />

            </div>


            <TwoFactorCard />

        </div>
    );
};


export default Profile;