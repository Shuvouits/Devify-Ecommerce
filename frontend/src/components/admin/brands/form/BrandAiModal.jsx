import {
    Sparkles,
    X,
} from "lucide-react";

import {
    useState,
} from "react";


const tones = [
    "default",
    "friendly",
    "professional",
    "luxury",
    "playful",
    "supportive",
];


export default function BrandAiModal({
    open,
    title,
    description,
    placeholder,
    onClose,
    onGenerate,
    loading,
}) {
    const [
        prompt,
        setPrompt,
    ] =
        useState("");

    const [
        tone,
        setTone,
    ] =
        useState(
            "professional"
        );


    if (!open) {
        return null;
    }


    const submit = async () => {
        await onGenerate({
            prompt,
            tone,
        });
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">

            <div className="w-full max-w-[520px] overflow-hidden rounded-[16px] border border-[#e3e6ea] bg-white shadow-2xl">

                <div className="flex items-start justify-between border-b border-[#eceef1] px-5 py-4">

                    <div>
                        <div className="flex items-center gap-2">

                            <Sparkles
                                size={17}
                                className="text-[#316ff4]"
                            />

                            <h3 className="text-[15px] font-semibold text-[#252d39]">
                                {title}
                            </h3>

                        </div>

                        <p className="mt-1 text-[11px] leading-5 text-[#8d96a1]">
                            {description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#79828d] hover:bg-[#f3f4f6]"
                    >
                        <X
                            size={17}
                        />
                    </button>

                </div>


                <div className="space-y-5 p-5">

                    <div>
                        <label className="mb-2 block text-[11.5px] font-medium text-[#343d48]">
                            Additional instructions
                        </label>

                        <textarea
                            rows={5}
                            value={prompt}
                            onChange={(event) =>
                                setPrompt(
                                    event.target.value
                                )
                            }
                            placeholder={placeholder}
                            className="w-full resize-none rounded-[10px] border border-[#dfe3e8] px-3 py-3 text-[12px] leading-5 outline-none focus:border-[#4f7df3]"
                        />
                    </div>


                    <div>
                        <label className="mb-2 block text-[11.5px] font-medium text-[#343d48]">
                            Tone
                        </label>

                        <div className="flex flex-wrap gap-2">

                            {tones.map(
                                (item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            setTone(
                                                item
                                            )
                                        }
                                        className={[
                                            "rounded-full",
                                            "border",
                                            "px-3",
                                            "py-1.5",
                                            "text-[10.5px]",
                                            "font-medium",
                                            "capitalize",
                                            "transition",
                                            tone === item
                                                ? "border-[#316ff4] bg-[#eef3ff] text-[#316ff4]"
                                                : "border-[#dfe3e8] bg-white text-[#656f7b] hover:bg-[#f7f8fa]",
                                        ].join(" ")}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        </div>
                    </div>

                </div>


                <div className="flex justify-end gap-2 border-t border-[#eceef1] px-5 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 rounded-[9px] border border-[#dfe3e8] px-4 text-[11px] font-semibold text-[#555f6b]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={submit}
                        disabled={loading}
                        className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-[#316ff4] px-4 text-[11px] font-semibold text-white disabled:opacity-60"
                    >
                        <Sparkles
                            size={13}
                        />

                        {loading
                            ? "Generating..."
                            : "Generate"}
                    </button>

                </div>

            </div>

        </div>
    );
}