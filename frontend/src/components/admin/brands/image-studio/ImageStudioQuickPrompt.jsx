const backgrounds = [
    {
        key: "white",
        label: "Clean white",
        preview:
            "bg-white",
    },
    {
        key: "lifestyle",
        label: "Lifestyle room",
        preview:
            "bg-gradient-to-br from-[#f3eadc] to-[#d8e4dd]",
    },
    {
        key: "desk",
        label: "Desk setup",
        preview:
            "bg-gradient-to-br from-[#dedede] to-[#aeb7c1]",
    },
    {
        key: "gradient",
        label: "Gradient studio",
        preview:
            "bg-gradient-to-br from-[#dbeafe] via-[#ede9fe] to-[#fce7f3]",
    },
    {
        key: "neon",
        label: "Neon accent",
        preview:
            "bg-gradient-to-br from-[#111827] via-[#312e81] to-[#ec4899]",
    },
];


export default function ImageStudioQuickPrompt({
    background,
    onBackgroundChange,
}) {
    return (
        <div className="p-[15px]">

            <select className="mb-[12px] h-[36px] w-full rounded-[10px] border border-[#dce0e5] bg-white px-[11px] text-[11.5px] text-[#303944] outline-none">
                <option>
                    Electronics
                </option>

                <option>
                    Fashion
                </option>

                <option>
                    Beauty
                </option>

                <option>
                    Lifestyle
                </option>
            </select>


            <div className="space-y-[9px]">

                {backgrounds.map(
                    (item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() =>
                                onBackgroundChange(
                                    item.key
                                )
                            }
                            className={[
                                "flex",
                                "h-[43px]",
                                "w-full",
                                "items-center",
                                "gap-[11px]",
                                "rounded-[10px]",
                                "border",
                                "px-[8px]",
                                "text-left",
                                "transition",
                                background ===
                                item.key
                                    ? "border-[#316ff4] bg-[#f8faff]"
                                    : "border-[#e1e4e8] bg-white hover:bg-[#fafbfc]",
                            ].join(" ")}
                        >

                            <span
                                className={[
                                    "h-[31px]",
                                    "w-[31px]",
                                    "shrink-0",
                                    "rounded-[6px]",
                                    "border",
                                    "border-[#e5e7eb]",
                                    item.preview,
                                ].join(" ")}
                            />

                            <span className="text-[11.5px] font-medium text-[#343d48]">
                                {item.label}
                            </span>

                        </button>
                    )
                )}

            </div>

        </div>
    );
}