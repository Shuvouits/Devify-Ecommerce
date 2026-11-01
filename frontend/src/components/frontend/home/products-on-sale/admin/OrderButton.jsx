const OrderButton = ({
    direction,
    disabled,
    onClick,
}) => {
    const isUp =
        direction === "up";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-default disabled:opacity-25"
            aria-label={
                isUp
                    ? "Move product up"
                    : "Move product down"
            }
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                        isUp
                            ? "m6 15 6-6 6 6"
                            : "m6 9 6 6 6-6"
                    }
                />
            </svg>
        </button>
    );
};

export default OrderButton;