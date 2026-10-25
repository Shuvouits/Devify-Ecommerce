import { createPortal } from "react-dom";
import { Trash2, X } from "lucide-react";

export default function DeleteGlobalVariantModal({
    open,
    variant,
    deleting,
    onClose,
    onConfirm,
}) {
    if (!open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
            <div className="relative w-full max-w-[430px] overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="h-1 w-full bg-red-500" />

                <button
                    type="button"
                    onClick={onClose}
                    disabled={deleting}
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="px-6 pb-5 pt-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <Trash2 size={20} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900">
                        Delete Global Variant
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-gray-800">
                            {variant?.name ?? "this variant"}
                        </span>
                        ? This action cannot be undone.
                    </p>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={deleting}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Trash2 size={16} />

                        {deleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}