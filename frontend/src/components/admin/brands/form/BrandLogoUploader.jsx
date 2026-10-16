import {
    ImagePlus,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";


export default function BrandLogoUploader({
    logoFile,
    previewUrl,
    onSelect,
    onRemove,
    onOpenStudio,
}) {
    return (
        <section className="overflow-hidden rounded-[18px] border border-[#e2e4e8] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">

            <div className="flex items-center justify-between px-[22px] pt-[20px]">

                <h2 className="text-[14px] font-semibold text-[#111827]">
                    Logo
                </h2>


                <button
                    type="button"
                    onClick={onOpenStudio}
                    disabled={!previewUrl}
                    className="inline-flex h-[30px] items-center gap-[5px] rounded-[7px] bg-gradient-to-r from-[#ff46c7] via-[#f7837b] to-[#4bc7ff] px-[10px] text-[10.5px] font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <Sparkles
                        size={12}
                    />

                    AI Studio
                </button>

            </div>


            <div className="p-[22px]">

                {!previewUrl ? (
                    <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[#ccd3dc] bg-[#fafbfc] px-6 text-center transition hover:border-[#7a9bf6] hover:bg-[#f8faff]">

                        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#eef3ff] text-[#316ff4]">
                            <ImagePlus
                                size={20}
                            />
                        </div>

                        <p className="mt-3 text-[12px] font-semibold text-[#303944]">
                            Upload image
                        </p>

                        <p className="mt-1 text-[10.5px] text-[#9098a3]">
                            PNG, JPG or WebP. Max 5 MB.
                        </p>

                        <span className="mt-4 inline-flex h-[34px] items-center gap-2 rounded-[9px] border border-[#d9dde3] bg-white px-3 text-[11px] font-medium text-[#515a67] shadow-sm">
                            <Upload
                                size={13}
                            />

                            Choose image
                        </span>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(event) =>
                                onSelect(
                                    event.target.files?.[0] ||
                                    null
                                )
                            }
                            className="hidden"
                        />

                    </label>
                ) : (
                    <div className="flex flex-col gap-4">

                        <div className="flex min-h-[190px] items-center justify-center overflow-hidden rounded-[14px] border border-[#e0e3e7] bg-[#f7f7f7] p-5">

                            <div className="flex h-[150px] w-[150px] items-center justify-center overflow-hidden rounded-[12px] border border-[#dadde2] bg-white p-3">

                                <img
                                    src={previewUrl}
                                    alt="Brand logo preview"
                                    className="max-h-full max-w-full object-contain"
                                />

                            </div>

                        </div>


                        <div className="flex flex-wrap items-center gap-2">

                            <label className="inline-flex h-[34px] cursor-pointer items-center gap-2 rounded-[9px] border border-[#d9dde3] bg-white px-3 text-[11px] font-medium text-[#515a67] transition hover:bg-[#f7f8fa]">

                                <Upload
                                    size={13}
                                />

                                Replace

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={(event) =>
                                        onSelect(
                                            event.target.files?.[0] ||
                                            null
                                        )
                                    }
                                    className="hidden"
                                />

                            </label>


                            <button
                                type="button"
                                onClick={onRemove}
                                className="inline-flex h-[34px] items-center gap-2 rounded-[9px] border border-[#efd6da] bg-white px-3 text-[11px] font-medium text-[#d04a58] transition hover:bg-[#fff7f8]"
                            >
                                <Trash2
                                    size={13}
                                />

                                Remove
                            </button>

                        </div>

                    </div>
                )}

            </div>

        </section>
    );
}