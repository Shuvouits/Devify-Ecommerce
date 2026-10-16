const effectItems = [
    {
        key: "brightness",
        label: "Brightness",
        min: -100,
        max: 100,
    },
    {
        key: "exposure",
        label: "Exposure",
        min: -100,
        max: 100,
    },
    {
        key: "contrast",
        label: "Contrast",
        min: -100,
        max: 100,
    },
    {
        key: "highlights",
        label: "Highlights",
        min: -100,
        max: 100,
    },
    {
        key: "shadows",
        label: "Shadows",
        min: -100,
        max: 100,
    },
    {
        key: "vignette",
        label: "Vignette",
        min: 0,
        max: 100,
    },
    {
        key: "saturation",
        label: "Saturation",
        min: -100,
        max: 100,
    },
    {
        key: "warmth",
        label: "Warmth",
        min: -100,
        max: 100,
    },
];


export default function ImageStudioEffects({
    effects,
    setEffects,
    onApply,
    onReset,
}) {
    const updateEffect = (
        key,
        value
    ) => {
        setEffects(
            (current) => ({
                ...current,
                [key]: Number(value),
            })
        );
    };


    return (
        <div className="flex h-full flex-col">

            <div className="flex-1 overflow-y-auto px-[16px] py-[14px]">

                <p className="mb-[13px] text-[12px] font-semibold text-[#202833]">
                    Light
                </p>


                <div className="space-y-[18px]">

                    {effectItems.map(
                        (item) => (
                            <div key={item.key}>

                                <div className="mb-[8px] flex items-center justify-between">

                                    <span className="text-[11.5px] text-[#353d48]">
                                        {item.label}
                                    </span>

                                    <span className="text-[10px] text-[#9299a3]">
                                        {effects[item.key]}
                                    </span>

                                </div>


                                <input
                                    type="range"
                                    min={item.min}
                                    max={item.max}
                                    value={
                                        effects[
                                            item.key
                                        ]
                                    }
                                    onChange={(event) =>
                                        updateEffect(
                                            item.key,
                                            event.target.value
                                        )
                                    }
                                    className="w-full accent-[#4f7df3]"
                                />

                            </div>
                        )
                    )}

                </div>

            </div>


            <div className="flex gap-2 border-t border-[#e4e7eb] p-[12px]">

                <button
                    type="button"
                    onClick={onReset}
                    className="h-[34px] flex-1 rounded-[9px] text-[11px] font-medium text-[#68717c] hover:bg-[#f5f6f7]"
                >
                    Reset
                </button>

                <button
                    type="button"
                    onClick={onApply}
                    className="h-[34px] flex-[2] rounded-[9px] bg-[#92adf7] text-[11px] font-semibold text-white transition hover:bg-[#7395ef]"
                >
                    Apply
                </button>

            </div>

        </div>
    );
}