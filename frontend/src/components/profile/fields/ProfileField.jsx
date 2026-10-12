import ErrorText from "./ErrorText";


const ProfileField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    icon: Icon,
    error,
    disabled = false,
}) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-[7px] block !text-[11px] !font-medium !leading-[16px] tracking-[0.4px] text-[#555555]"
            >
                {label}
            </label>

            <div
                className={`flex h-[44px] items-center rounded-full border bg-white px-[15px] transition ${
                    error
                        ? "border-[#e45a5f]"
                        : "border-[#dcdcdc] focus-within:border-[#8cacff]"
                } ${
                    disabled
                        ? "bg-[#f7f8fa]"
                        : ""
                }`}
            >
                {Icon && (
                    <Icon
                        size={15}
                        strokeWidth={1.7}
                        className="mr-[10px] shrink-0 text-[#999999]"
                    />
                )}

                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent !text-[13px] !font-normal !leading-[20px] text-[#555555] outline-none disabled:cursor-not-allowed"
                    style={{
                        fontFamily: "Inter, sans-serif",
                    }}
                />
            </div>

            <ErrorText>
                {error}
            </ErrorText>
        </div>
    );
};


export default ProfileField;