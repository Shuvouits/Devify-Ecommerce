import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <section className="w-full bg-white">
            <div className="mx-auto flex min-h-[640px] max-w-[1300px] justify-center px-4 pb-[34px] pt-[62px] xl:px-0">
                <div className="h-fit w-full max-w-[398px] rounded-[18px] border border-[#dddddd] bg-white px-[27px] pb-[21px] pt-[23px] shadow-[0_10px_24px_rgba(0,0,0,0.09)]">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-[27px] font-bold leading-[34px] tracking-[-0.6px] text-[#111111]">
                            Welcome back
                        </h1>

                        <p className="mt-[11px] text-[15px] font-normal text-[#656565]">
                            Sign in
                        </p>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        className="mt-[25px] flex h-[37px] w-full items-center justify-center gap-[10px] rounded-full border border-[#d9d9d9] bg-white text-[14px] font-medium text-[#171717] transition hover:bg-[#fafafa]"
                    >
                        <FcGoogle size={18} />

                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="mt-[25px] flex items-center gap-[10px]">
                        <div className="h-px flex-1 bg-[#dedede]" />

                        <span className="shrink-0 text-[10px] font-medium uppercase text-[#858585]">
                            Or continue with
                        </span>

                        <div className="h-px flex-1 bg-[#dedede]" />
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-[20px]"
                    >
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-[8px] block text-[13px] font-medium text-[#161616]"
                            >
                                Email
                            </label>

                            <div className="flex h-[37px] items-center rounded-full border border-[#d9d9d9] bg-white px-[13px]">
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
                        <div className="mt-[16px]">
                            <label
                                htmlFor="password"
                                className="mb-[8px] block text-[13px] font-medium text-[#161616]"
                            >
                                Password
                            </label>

                            <div className="flex h-[37px] items-center rounded-full border border-[#d9d9d9] bg-white px-[13px]">
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

                        {/* Forgot Password */}
                        <div className="mt-[9px] flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-[13px] font-normal text-[#286bd7] transition hover:text-[#1f59bb]"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Sign In */}
                        <button
                            type="submit"
                            className="mt-[19px] flex h-[37px] w-full items-center justify-center rounded-full bg-[#286bd7] text-[13px] font-semibold text-white transition hover:bg-[#1f60c8]"
                        >
                            Sign in
                        </button>

                        {/* Account Divider */}
                        <div className="mt-[30px] flex items-center gap-[9px]">
                            <div className="h-px flex-1 bg-[#dcdcdc]" />

                            <span className="shrink-0 text-[10px] font-medium uppercase text-[#777777]">
                                Don't have an account?
                            </span>

                            <div className="h-px flex-1 bg-[#dcdcdc]" />
                        </div>

                        {/* Create Account */}
                        <Link
                            to="/register"
                            className="mt-[23px] flex h-[37px] w-full items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[13px] font-semibold text-[#171717] transition hover:bg-[#fafafa]"
                        >
                            Create an account
                        </Link>
                    </form>
                </div>
            </div>
            <br></br>
        </section>
    );
};

export default Login;