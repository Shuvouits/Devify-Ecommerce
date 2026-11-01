const VisibilityToggle = ({
    isActive,
    onChange,
}) => {
    return (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3.5">
            <div>
                <p className="text-[14px] font-semibold text-[#252b35]">
                    Show on homepage
                </p>

                <p className="mt-1 text-[12px] text-gray-500">
                    Hide or display the entire section.
                </p>
            </div>

            <button
                type="button"
                onClick={() =>
                    onChange(!isActive)
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    isActive
                        ? "bg-[#4f7df3]"
                        : "bg-gray-300"
                }`}
                aria-label={
                    isActive
                        ? "Hide section"
                        : "Show section"
                }
            >
                <span
                    className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ${
                        isActive
                            ? "left-[23px]"
                            : "left-[3px]"
                    }`}
                />
            </button>
        </div>
    );
};

export default VisibilityToggle;