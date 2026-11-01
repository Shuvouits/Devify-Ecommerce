const SliderButton = ({
    direction,
    disabled,
    onClick,
}) => {
    const isPrevious =
        direction === "previous";

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-default disabled:opacity-30"
            aria-label={
                isPrevious
                    ? "Previous products"
                    : "Next products"
            }
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                        isPrevious
                            ? "M15 18l-6-6 6-6"
                            : "M9 6l6 6-6 6"
                    }
                />
            </svg>
        </button>
    );
};

export default SliderButton;