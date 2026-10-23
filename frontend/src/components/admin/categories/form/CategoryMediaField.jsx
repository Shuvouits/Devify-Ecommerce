import {
    ImagePlus,
    Sparkles,
    Trash2,
    Upload,
} from "lucide-react";


export default function CategoryMediaField({
    title,
    helper,
    file,
    previewUrl,
    onSelect,
    onRemove,
    onOpenStudio,
}) {
    const handleInput = (event) => {
        const selectedFile =
            event.target.files?.[0];

        if (selectedFile) {
            onSelect(
                selectedFile
            );
        }

        event.target.value = "";
    };


    const handleDrop = (event) => {
        event.preventDefault();

        const selectedFile =
            event.dataTransfer.files?.[0];

        if (selectedFile) {
            onSelect(
                selectedFile
            );
        }
    };


    return (
        <section className="rounded-[14px] border border-[#e0e3e7] bg-white p-[20px] shadow-sm">

            <div className="mb-[14px] flex items-center justify-between">

                <h2 className="text-[14px] font-semibold text-[#171d25]">
                    {title}
                </h2>


                <button
                    type="button"
                    onClick={onOpenStudio}
                    className="flex h-[30px] items-center gap-[5px] rounded-[8px] bg-gradient-to-r from-[#ffb83f] via-[#ef42cf] to-[#3ddbed] px-[10px] text-[10.5px] font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                    <Sparkles
                        size={12}
                    />

                    AI Studio
                </button>

            </div>


            {!previewUrl ? (
                <label
                    onDragOver={(event) =>
                        event.preventDefault()
                    }
                    onDrop={handleDrop}
                    className="flex min-h-[128px] cursor-pointer flex-col items-center justify-center rounded-[12px] border border-dashed border-[#ccd2d9] bg-white transition hover:border-[#86a6f8] hover:bg-[#fafcff]"
                >
                    <Upload
                        size={23}
                        className="text-[#6f7780]"
                    />

                    <p className="mt-[10px] text-[12px] font-medium text-[#252d37]">
                        Drag and drop files here, or click to browse
                    </p>

                    <p className="mt-[3px] text-[10.5px] text-[#8c949d]">
                        Images only. PNG, JPG or WebP.
                    </p>

                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleInput}
                        className="hidden"
                    />
                </label>
            ) : (
                <div>

                    <div className="flex min-h-[160px] items-center justify-center rounded-[12px] border border-[#e2e5e9] bg-[#fafafa] p-[18px]">

                        <img
                            src={previewUrl}
                            alt={title}
                            className="max-h-[135px] max-w-full object-contain"
                        />

                    </div>


                    <div className="mt-[10px] flex gap-2">

                        <label className="flex h-[34px] cursor-pointer items-center gap-[6px] rounded-[8px] border border-[#dde1e6] bg-white px-[11px] text-[10.5px] font-medium text-[#4f5964] transition hover:bg-[#f8f9fa]">

                            <ImagePlus
                                size={13}
                            />

                            Replace

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleInput}
                                className="hidden"
                            />

                        </label>


                        <button
                            type="button"
                            onClick={onRemove}
                            className="flex h-[34px] items-center gap-[6px] rounded-[8px] border border-[#f0cfd4] bg-white px-[11px] text-[10.5px] font-medium text-[#e14b59] transition hover:bg-[#fff7f8]"
                        >
                            <Trash2
                                size={13}
                            />

                            Remove
                        </button>

                    </div>

                </div>
            )}


            {helper && (
                <p className="mt-[10px] text-[10.5px] leading-[17px] text-[#78818c]">
                    {helper}
                </p>
            )}

        </section>
    );
}