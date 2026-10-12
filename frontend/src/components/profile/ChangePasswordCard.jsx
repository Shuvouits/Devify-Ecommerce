import {
    KeyRound,
} from "lucide-react";

import {
    useState,
} from "react";

import PasswordField from "./fields/PasswordField";


const ChangePasswordCard = ({
    profileState,
}) => {
    const {
        passwordData,
        passwordErrors,
        passwordSaving,
        handlePasswordChange,
        updatePassword,
    } = profileState;


    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);


    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);


    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);


    return (
        <form
            onSubmit={
                updatePassword
            }
            className="rounded-[18px] border border-[#dddddd] bg-white p-[27px]"
        >

            <div className="flex items-center gap-[13px]">

                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#fff1e9] text-[#ff6b2c]">

                    <KeyRound
                        size={19}
                    />

                </div>


                <div>

                    <h2 className="!text-[18px] !font-semibold !leading-[25px] text-[#111111]">
                        Change password
                    </h2>


                    <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                        Update your password to keep your account secure
                    </p>

                </div>

            </div>


            <div className="mt-[27px] grid grid-cols-3 gap-[16px]">

                <PasswordField
                    label="OLD PASSWORD"
                    name="current_password"
                    value={
                        passwordData.current_password
                    }
                    onChange={
                        handlePasswordChange
                    }
                    show={
                        showCurrentPassword
                    }
                    setShow={
                        setShowCurrentPassword
                    }
                    error={
                        passwordErrors.current_password?.[0]
                    }
                />


                <PasswordField
                    label="NEW PASSWORD"
                    name="password"
                    value={
                        passwordData.password
                    }
                    onChange={
                        handlePasswordChange
                    }
                    show={
                        showNewPassword
                    }
                    setShow={
                        setShowNewPassword
                    }
                    error={
                        passwordErrors.password?.[0]
                    }
                />


                <PasswordField
                    label="CONFIRM PASSWORD"
                    name="password_confirmation"
                    value={
                        passwordData.password_confirmation
                    }
                    onChange={
                        handlePasswordChange
                    }
                    show={
                        showConfirmPassword
                    }
                    setShow={
                        setShowConfirmPassword
                    }
                    error={
                        passwordErrors.password_confirmation?.[0]
                    }
                />

            </div>


            <div className="mt-[23px] flex justify-end">

                <button
                    type="submit"
                    disabled={
                        passwordSaving
                    }
                    className="h-[40px] min-w-[150px] rounded-full border border-[#d5d5d5] bg-white px-[23px] !text-[13px] !font-semibold !leading-[20px] text-[#222222] transition hover:bg-[#f8f8f8] disabled:cursor-not-allowed disabled:opacity-60"
                >

                    {passwordSaving
                        ? "Updating..."
                        : "Update Password"
                    }

                </button>

            </div>

        </form>
    );
};


export default ChangePasswordCard;