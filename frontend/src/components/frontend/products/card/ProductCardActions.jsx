const ProductCardActions = ({
    onChooseOptions,
    onQuickView,
    onWishlist,
    onCompare,
}) => {
    return (
        <>
            <div className="absolute right-2.5 top-2.5 z-20 flex translate-x-1.5 flex-col gap-1.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                <ActionIconButton
                    label="Add to wishlist"
                    onClick={onWishlist}
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
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                        />
                    </svg>
                </ActionIconButton>

                <ActionIconButton
                    label="Compare product"
                    onClick={onCompare}
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
                            d="M7 4v16M17 4v16"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 7h6M14 17h6"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8 5 2 2-2 2M16 15l-2 2 2 2"
                        />
                    </svg>
                </ActionIconButton>
            </div>

            <div className="absolute bottom-2 left-2 right-2 z-20 flex translate-y-1.5 items-center gap-1.5 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();

                        if (onChooseOptions) {
                            onChooseOptions();
                        }
                    }}
                    className="flex h-8 min-w-0 flex-[1.08] items-center justify-center gap-1 rounded-[6px] bg-[#252b35] px-2.5 text-[10px] font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition hover:bg-[#171b21]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-3 w-3 shrink-0"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 7h16M4 12h16M4 17h16"
                        />
                    </svg>

                    <span className="whitespace-nowrap">
                        Choose options
                    </span>
                </button>

                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();

                        if (onQuickView) {
                            onQuickView();
                        }
                    }}
                    className="flex h-8 min-w-0 flex-1 items-center justify-center gap-1 rounded-[6px] border border-[#dfe3e8] bg-white/95 px-2.5 text-[10px] font-semibold text-[#4b5563] shadow-[0_2px_6px_rgba(0,0,0,0.08)] backdrop-blur-sm transition hover:border-[#cfd5dc] hover:bg-white hover:text-[#252b35]"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-3 w-3 shrink-0"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5h5v5"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m13 11 6-6"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 19H5v-5"
                        />

                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m11 13-6 6"
                        />
                    </svg>

                    <span className="whitespace-nowrap">
                        Quick view
                    </span>
                </button>
            </div>
        </>
    );
};

const ActionIconButton = ({
    children,
    label,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();

                if (onClick) {
                    onClick();
                }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white/95 text-[#5f6874] shadow-[0_2px_7px_rgba(0,0,0,0.08)] backdrop-blur-sm transition hover:border-[#cfd5dc] hover:bg-white hover:text-[#252b35]"
            aria-label={label}
            title={label}
        >
            {children}
        </button>
    );
};

export default ProductCardActions;