const PencilButton = ({
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            aria-label="Edit products on sale"
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-[17px] w-[17px]"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L8.25 18.463 3.75 19.5l1.037-4.5L16.862 3.487Z"
                />

                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.75 5.6 3.65 3.65"
                />
            </svg>
        </button>
    );
};

export default PencilButton;