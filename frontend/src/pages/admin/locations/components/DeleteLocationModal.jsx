import {
    Trash2,
    X,
} from "lucide-react";


export default function DeleteLocationModal({
    open = false,
    location = null,
    deleting = false,
    onClose,
    onDelete,
}) {
    if (!open || !location) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[1px]">
            <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Red Top Accent */}
                <div className="h-1 bg-red-500" />


                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={deleting}
                    className="absolute right-4 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close delete modal"
                >
                    <X size={18} />
                </button>


                {/* Content */}
                <div className="px-6 pb-6 pt-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <Trash2 size={21} />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900">
                        Delete Location
                    </h3>

                    <p className="mt-2 pr-5 text-sm leading-6 text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-700">
                            {location.name}
                        </span>
                        ? This action cannot be undone.
                    </p>

                    {location.is_default && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                            <p className="text-xs leading-5 text-amber-700">
                                This is currently the default
                                location. Set another location
                                as default before deleting it.
                            </p>
                        </div>
                    )}
                </div>


                {/* Footer */}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={
                            deleting ||
                            location.is_default
                        }
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? (
                            <>
                                <Spinner />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={16} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


function Spinner() {
    return (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
    );
}