import {
    Mail,
    Phone,
    ShieldCheck,
} from "lucide-react";


const AccountSummaryCard = ({
    profile,
}) => {
    return (
        <div className="rounded-[18px] border border-[#dddddd] bg-white p-[25px]">

            <div className="flex items-center gap-[13px]">

                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-[#edf4ff] text-[#286bd7]">

                    <Mail
                        size={19}
                    />

                </div>


                <div>

                    <h2 className="!text-[18px] !font-semibold !leading-[25px] text-[#111111]">
                        Account
                    </h2>


                    <p className="mt-[2px] !text-[12px] !font-normal !leading-[18px] text-[#888888]">
                        Your account details and current status
                    </p>

                </div>

            </div>


            <div className="mt-[25px] space-y-[13px]">

                <AccountItem
                    icon={Mail}
                    label="Email address"
                    value={
                        profile?.email ||
                        "Not added"
                    }
                />


                <AccountItem
                    icon={Phone}
                    label="Phone number"
                    value={
                        profile?.phone ||
                        "Not added"
                    }
                />


                <AccountItem
                    icon={
                        ShieldCheck
                    }
                    label="Account status"
                    value={
                        profile?.status ||
                        "Unknown"
                    }
                    capitalize
                />

            </div>

        </div>
    );
};


const AccountItem = ({
    icon: Icon,
    label,
    value,
    capitalize = false,
}) => {
    return (
        <div className="flex min-h-[70px] items-center gap-[12px] rounded-[13px] bg-[#fafafa] px-[15px]">

            <Icon
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-[#888888]"
            />


            <div className="min-w-0">

                <div className="!text-[11px] !font-normal !leading-[16px] text-[#888888]">
                    {label}
                </div>


                <div
                    className={`mt-[2px] truncate !text-[13px] !font-medium !leading-[20px] text-[#111111] ${
                        capitalize
                            ? "capitalize"
                            : ""
                    }`}
                >
                    {value}
                </div>

            </div>

        </div>
    );
};


export default AccountSummaryCard;