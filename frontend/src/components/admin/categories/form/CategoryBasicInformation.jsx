import {
    Sparkles,
} from "lucide-react";


export default function CategoryBasicInformation({
    form,
    setForm,
    onOpenDescriptionAi,
}) {
    return (
        <section className="rounded-[14px] border border-[#e0e3e7] bg-white p-[20px] shadow-sm">

            <h2 className="mb-[16px] text-[14px] font-semibold text-[#171d25]">
                Details
            </h2>


            <div>

                <label className="mb-[6px] block text-[11.5px] font-medium text-[#202833]">
                    Name *
                </label>


                <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                        setForm(
                            (current) => ({
                                ...current,
                                name: event.target.value,
                            })
                        )
                    }
                    placeholder="Category name"
                    className="h-[39px] w-full rounded-[9px] border border-[#d7dce2] bg-white px-[12px] text-[12px] text-[#313a45] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#7ca1f7]"
                />

            </div>


            <div className="mt-[15px]">

                <div className="mb-[6px] flex items-center justify-between">

                    <label className="text-[11.5px] font-medium text-[#202833]">
                        Description
                    </label>


                    <button
                        type="button"
                        onClick={onOpenDescriptionAi}
                        className="flex h-[25px] w-[25px] items-center justify-center rounded-[7px] bg-gradient-to-br from-[#ffbf50] via-[#f54cc9] to-[#40dff2] text-white shadow-sm transition hover:opacity-90"
                        title="Generate with AI"
                    >
                        <Sparkles
                            size={13}
                        />
                    </button>

                </div>


                <textarea
                    value={form.description}
                    maxLength={500}
                    onChange={(event) =>
                        setForm(
                            (current) => ({
                                ...current,
                                description: event.target.value,
                            })
                        )
                    }
                    placeholder="Describe this category..."
                    className="min-h-[92px] w-full resize-y rounded-[9px] border border-[#d7dce2] bg-white px-[12px] py-[10px] text-[12px] text-[#313a45] outline-none transition placeholder:text-[#9aa1aa] focus:border-[#7ca1f7]"
                />


                <p className="mt-[4px] text-[10.5px] text-[#8c949d]">
                    {form.description.length}/500 characters
                </p>

            </div>

        </section>
    );
}