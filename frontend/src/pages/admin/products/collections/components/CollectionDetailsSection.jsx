import {
    Image as ImageIcon,
    Sparkles,
    Upload,
} from "lucide-react";


export default function CollectionDetailsSection({
    form,
    onChange,
    fieldErrors = {},
}) {
    const imageUrl =
        form.image_path
            ? form.image_path.startsWith(
                  "http://"
              ) ||
              form.image_path.startsWith(
                  "https://"
              )
                ? form.image_path
                : `http://127.0.0.1:8000/${form.image_path}`
            : null;


    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="p-[22px]">
                <h2 className="text-[14px] font-semibold text-[#111827]">
                    Collection Details
                </h2>


                {/* Title */}

                <div className="mt-[14px]">
                    <label className="mb-[6px] block text-[11px] font-medium text-[#202833]">
                        Title
                        <span className="ml-[2px] text-red-500">
                            *
                        </span>
                    </label>

                    <input
                        type="text"
                        value={
                            form.title
                        }
                        onChange={(event) =>
                            onChange(
                                "title",
                                event.target
                                    .value
                            )
                        }
                        placeholder="Summer Collection"
                        className={[
                            "h-[38px]",
                            "w-full",
                            "rounded-[10px]",
                            "border",
                            "bg-white",
                            "px-[11px]",
                            "text-[11.5px]",
                            "text-[#303945]",
                            "outline-none",
                            "transition",
                            "placeholder:text-[#929aa4]",
                            fieldErrors
                                ?.title
                                ? "border-red-300 focus:border-red-400"
                                : "border-[#ccd3dc] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]",
                        ].join(
                            " "
                        )}
                    />

                    {fieldErrors
                        ?.title?.[0] && (
                        <p className="mt-[5px] text-[9.5px] text-red-600">
                            {
                                fieldErrors
                                    .title[0]
                            }
                        </p>
                    )}
                </div>


                {/* Description */}

                <div className="mt-[14px]">
                    <div className="mb-[6px] flex items-center justify-between">
                        <label className="text-[11px] font-medium text-[#202833]">
                            Description
                        </label>

                        <button
                            type="button"
                            title="Generate description with AI"
                            className="flex h-[27px] w-[27px] items-center justify-center rounded-[6px] bg-gradient-to-br from-[#ff9e46] via-[#ef4dd8] to-[#45c8ff] text-white shadow-sm transition hover:scale-[1.04]"
                        >
                            <Sparkles
                                size={14}
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>

                    <textarea
                        rows={7}
                        value={
                            form.description
                        }
                        onChange={(event) =>
                            onChange(
                                "description",
                                event.target
                                    .value
                            )
                        }
                        placeholder="Describe this collection..."
                        className="min-h-[120px] w-full resize-y rounded-[10px] border border-[#ccd3dc] bg-white px-[11px] py-[9px] text-[11.5px] leading-[18px] text-[#303945] outline-none transition placeholder:text-[#929aa4] focus:border-[#7da0f8] focus:ring-2 focus:ring-[#eef3ff]"
                    />
                </div>


                {/* Collection Image */}

                <div className="mt-[16px]">
                    <div className="mb-[7px] flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-[#202833]">
                                Collection Image
                            </p>

                            <p className="mt-[2px] text-[9.5px] text-[#858e99]">
                                Used as the collection cover image.
                            </p>
                        </div>

                        <button
                            type="button"
                            title="Open AI Studio"
                            className="inline-flex h-[29px] items-center gap-[5px] rounded-[7px] bg-gradient-to-r from-[#ff9e46] via-[#ef4dd8] to-[#45c8ff] px-[9px] text-[9.5px] font-semibold text-white shadow-sm transition hover:scale-[1.02]"
                        >
                            <Sparkles
                                size={12}
                            />

                            AI Studio
                        </button>
                    </div>

                    <div className="rounded-[13px] border border-dashed border-[#d5dae1] bg-[#fcfcfd] p-[12px]">
                        {imageUrl ? (
                            <div className="overflow-hidden rounded-[10px] border border-[#e0e3e7] bg-white">
                                <img
                                    src={
                                        imageUrl
                                    }
                                    alt={
                                        form.title ||
                                        "Collection"
                                    }
                                    className="h-[180px] w-full object-cover"
                                />

                                <div className="flex items-center justify-between border-t border-[#e8eaed] px-[10px] py-[8px]">
                                    <span className="max-w-[70%] truncate text-[9.5px] text-[#68717c]">
                                        {
                                            form.image_path
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onChange(
                                                "image_path",
                                                ""
                                            )
                                        }
                                        className="text-[9.5px] font-medium text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-[150px] flex-col items-center justify-center text-center">
                                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[#f1f3f5] text-[#8a939e]">
                                    <ImageIcon
                                        size={18}
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <p className="mt-[9px] text-[10.5px] font-medium text-[#4f5965]">
                                    Add collection image
                                </p>

                                <p className="mt-[3px] max-w-[300px] text-[9px] leading-[14px] text-[#8a939e]">
                                    Upload an image or generate one using AI Studio.
                                </p>

                                <div className="mt-[10px] flex items-center gap-[7px]">
                                    <button
                                        type="button"
                                        className="inline-flex h-[31px] items-center gap-[5px] rounded-[8px] border border-[#d9dee4] bg-white px-[10px] text-[9.5px] font-medium text-[#4f5965] transition hover:bg-[#f7f8fa]"
                                    >
                                        <Upload
                                            size={12}
                                        />

                                        Upload
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex h-[31px] items-center gap-[5px] rounded-[8px] bg-gradient-to-r from-[#ff9e46] via-[#ef4dd8] to-[#45c8ff] px-[10px] text-[9.5px] font-semibold text-white shadow-sm transition hover:scale-[1.02]"
                                    >
                                        <Sparkles
                                            size={12}
                                        />

                                        AI Studio
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}