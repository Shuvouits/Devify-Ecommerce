import {
    Eye,
    EyeOff,
} from "lucide-react";

import ErrorText from "./ErrorText";


const PasswordField = ({
    label,
    name,
    value,
    onChange,
    show,
    setShow,
    error,
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
                }`}
            >
                <input
                    id={name}
                    type={
                        show
                            ? "text"
                            : "password"
                    }
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete={
                        name === "current_password"
                            ? "current-password"
                            : "new-password"
                    }
                    className="h-full min-w-0 flex-1 border-0 bg-transparent !text-[13px] !font-normal !leading-[20px] text-[#555555] outline-none"
                    style={{
                        fontFamily: "Inter, sans-serif",
                    }}
                />

                <button
                    type="button"
                    onClick={() =>
                        setShow(
                            (prev) => !prev
                        )
                    }
                    className="ml-[8px] flex h-[28px] w-[28px] shrink-0 items-center justify-center text-[#999999] transition hover:text-[#555555]"
                    aria-label={
                        show
                            ? `Hide ${label.toLowerCase()}`
                            : `Show ${label.toLowerCase()}`
                    }
                >
                    {show ? (
                        <EyeOff
                            size={15}
                            strokeWidth={1.7}
                        />
                    ) : (
                        <Eye
                            size={15}
                            strokeWidth={1.7}
                        />
                    )}
                </button>
            </div>

            <ErrorText>
                {error}
            </ErrorText>
        </div>
    );
};


export default PasswordField;