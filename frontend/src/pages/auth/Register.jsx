import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Store,
    UserRound,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <section className="w-full bg-white">
            <div className="mx-auto flex min-h-[690px] max-w-[1300px] justify-center px-4 pb-[34px] pt-[18px] xl:px-0">
                <div className="h-fit w-full max-w-[422px] rounded-[18px] border border-[#dddddd] bg-white px-[24px] pb-[20px] pt-[22px] shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-[27px] font-bold leading-[34px] tracking-[-0.6px] text-[#111111]">
                            Create an account
                        </h1>

                        <p className="mt-[9px] text-[14px] text-[#6d6d6d]">
                            Enter your details to get started
                        </p>
                    </div>

                    {/* Google */}
                    <button
                        type="button"
                        className="mt-[24px] flex h-[37px] w-full items-center justify-center gap-[10px] rounded-full border border-[#d9d9d9] bg-white text-[14px] font-medium text-[#171717] transition hover:bg-[#fafafa]"
                    >
                        <FcGoogle size={18} />
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="mt-[24px] flex items-center gap-[10px]">
                        <div className="h-px flex-1 bg-[#dedede]" />

                        <span className="shrink-0 text-[10px] font-medium uppercase text-[#858585]">
                            Or continue with
                        </span>

                        <div className="h-px flex-1 bg-[#dedede]" />
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-[19px]"
                    >
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-[7px] block text-[13px] font-medium text-[#161616]"
                            >
                                Full Name
                            </label>

                            <div className="flex h-[36px] items-center rounded-full border border-[#d9d9d9] bg-white px-[13px]">
                                <UserRound
                                    size={16}
                                    strokeWidth={1.7}
                                    className="mr-[10px] shrink-0 text-[#8c9399]"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#313131] outline-none placeholder:text-[#7e8790]"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mt-[13px]">
                            <label
                                htmlFor="email"
                                className="mb-[7px] block text-[13px] font-medium text-[#161616]"
                            >
                                Email
                            </label>

                            <div className="flex h-[36px] items-center rounded-full border border-[#d9d9d9] bg-white px-[13px]">
                                <Mail
                                    size={16}
                                    strokeWidth={1.7}
                                    className="mr-[10px] shrink-0 text-[#8c9399]"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#313131] outline-none placeholder:text-[#7e8790]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mt-[13px]">
                            <label
                                htmlFor="password"
                                className="mb-[7px] block text-[13px] font-medium text-[#161616]"
                            >
                                Password
                            </label>

                            <div className="flex h-[36px] items-center rounded-full border border-[#d9d9d9] bg-white px-[13px]">
                                <LockKeyhole
                                    size={16}
                                    strokeWidth={1.7}
                                    className="mr-[10px] shrink-0 text-[#8c9399]"
                                />

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-[13px] text-[#313131] outline-none placeholder:text-[#7e8790]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="ml-[8px] flex shrink-0 items-center justify-center text-[#8b9298] transition hover:text-[#286bd7]"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={16}
                                            strokeWidth={1.7}
                                        />
                                    ) : (
                                        <Eye
                                            size={16}
                                            strokeWidth={1.7}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Sign Up */}
                        <button
                            type="submit"
                            className="mt-[14px] flex h-[36px] w-full items-center justify-center rounded-full bg-[#286bd7] text-[13px] font-semibold text-white transition hover:bg-[#1f60c8]"
                        >
                            Sign up
                        </button>

                        {/* Terms */}
                        <p className="mx-auto mt-[23px] max-w-[320px] text-center text-[11px] leading-[17px] text-[#777777]">
                            By creating an account, you agree to our{" "}
                            <Link
                                to="/terms"
                                className="text-[#286bd7] hover:underline"
                            >
                                Terms of Service
                            </Link>
                            <br />
                            and{" "}
                            <Link
                                to="/privacy-policy"
                                className="text-[#286bd7] hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </p>

                        {/* Vendor CTA */}
                        <Link
                            to="/become-vendor"
                            className="mt-[18px] flex h-[37px] w-full items-center justify-center gap-[8px] rounded-full border border-[#bdd5ff] bg-[#f7faff] px-4 text-[12px] text-[#676767] transition hover:bg-[#f0f6ff]"
                        >
                            <Store
                                size={15}
                                strokeWidth={1.8}
                                className="text-[#286bd7]"
                            />

                            <span>
                                Want to sell on our marketplace?{" "}
                                <span className="font-medium text-[#286bd7]">
                                    Become a Vendor
                                </span>
                            </span>
                        </Link>

                        {/* Login Divider */}
                        <div className="mt-[24px] flex items-center gap-[10px]">
                            <div className="h-px flex-1 bg-[#dedede]" />

                            <span className="shrink-0 text-[10px] font-medium uppercase text-[#858585]">
                                Already have an account?
                            </span>

                            <div className="h-px flex-1 bg-[#dedede]" />
                        </div>

                        {/* Sign In */}
                        <Link
                            to="/login"
                            className="mt-[20px] flex h-[37px] w-full items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[13px] font-semibold text-[#171717] transition hover:bg-[#fafafa]"
                        >
                            Sign in
                        </Link>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Register;