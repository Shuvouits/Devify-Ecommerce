import {
    Building2,
    CheckCircle2,
    Store,
} from "lucide-react";


export default function LocationStats({
    stats = {},
}) {
    const cards = [
        {
            label: "Total Locations",
            value: stats.total ?? 0,
            helper: "All operational locations",
            icon: Building2,
        },
        {
            label: "Active",
            value: stats.active ?? 0,
            helper: "Available for operations",
            icon: CheckCircle2,
        },
        {
            label: "Inactive",
            value: stats.inactive ?? 0,
            helper: "Currently not in use",
            icon: Store,
        },
    ];


    return (
        <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {card.label}
                                </p>

                                <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                                    {card.value}
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                    {card.helper}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
                                <Icon size={20} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}