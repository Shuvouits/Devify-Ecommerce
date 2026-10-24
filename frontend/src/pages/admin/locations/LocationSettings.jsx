import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    MapPin,
    Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getLocationDeliveryOrder,
    getLocations,
    setDefaultLocation,
    updateLocationDeliveryOrder,
} from "../../../api/admin/locationApi";

import BrandToast from "../../../components/admin/brands/BrandToast";


export default function LocationSettings() {
    const navigate = useNavigate();

    const [allLocations, setAllLocations] =
        useState([]);

    const [
        deliveryLocations,
        setDeliveryLocations,
    ] = useState([]);

    const [
        selectedDefaultId,
        setSelectedDefaultId,
    ] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [
        savingDefault,
        setSavingDefault,
    ] = useState(false);

    const [
        savingOrder,
        setSavingOrder,
    ] = useState(false);

    const [
        toastMessage,
        setToastMessage,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Toast
    |--------------------------------------------------------------------------
    */

    const showToast =
        useCallback((message) => {
            setToastMessage(message);

            window.setTimeout(() => {
                setToastMessage("");
            }, 3200);
        }, []);


    /*
    |--------------------------------------------------------------------------
    | Load Settings Data
    |--------------------------------------------------------------------------
    */

    const loadSettings =
        useCallback(async () => {
            try {
                setLoading(true);

                const [
                    locationsResponse,
                    deliveryResponse,
                ] = await Promise.all([
                    getLocations({
                        filter: "all",
                        per_page: 100,
                    }),

                    getLocationDeliveryOrder(),
                ]);

                const locations =
                    locationsResponse?.data ||
                    [];

                const delivery =
                    deliveryResponse?.data ||
                    [];

                setAllLocations(
                    locations
                );

                setDeliveryLocations(
                    delivery
                );

                const defaultLocation =
                    locations.find(
                        (location) =>
                            location.is_default
                    );

                setSelectedDefaultId(
                    defaultLocation
                        ? String(
                              defaultLocation.id
                          )
                        : ""
                );
            } catch (error) {
                showToast(
                    error?.response?.data
                        ?.message ||
                        "Unable to load location settings."
                );
            } finally {
                setLoading(false);
            }
        }, [showToast]);


    useEffect(() => {
        loadSettings();
    }, [loadSettings]);


    /*
    |--------------------------------------------------------------------------
    | Active Location Options
    |--------------------------------------------------------------------------
    */

    const activeLocations =
        useMemo(
            () =>
                allLocations.filter(
                    (location) =>
                        location.status ===
                        "active"
                ),
            [allLocations]
        );


    /*
    |--------------------------------------------------------------------------
    | Save Default Location
    |--------------------------------------------------------------------------
    */

    const handleSaveDefault =
        async () => {
            if (!selectedDefaultId) {
                return;
            }

            try {
                setSavingDefault(true);

                await setDefaultLocation(
                    Number(
                        selectedDefaultId
                    )
                );

                showToast(
                    "Default location updated successfully."
                );

                await loadSettings();
            } catch (error) {
                const validationError =
                    error?.response?.data
                        ?.errors
                        ?.location_id?.[0];

                showToast(
                    validationError ||
                        error?.response
                            ?.data
                            ?.message ||
                        "Unable to update default location."
                );
            } finally {
                setSavingDefault(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Move Delivery Location
    |--------------------------------------------------------------------------
    */

    const moveLocation = (
        index,
        direction
    ) => {
        if (savingOrder) {
            return;
        }

        const nextIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            nextIndex < 0 ||
            nextIndex >=
                deliveryLocations.length
        ) {
            return;
        }

        setDeliveryLocations(
            (current) => {
                const updated = [
                    ...current,
                ];

                [
                    updated[index],
                    updated[nextIndex],
                ] = [
                    updated[nextIndex],
                    updated[index],
                ];

                return updated.map(
                    (
                        location,
                        itemIndex
                    ) => ({
                        ...location,

                        delivery_order:
                            itemIndex + 1,
                    })
                );
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Save Delivery Order
    |--------------------------------------------------------------------------
    */

    const handleSaveOrder =
        async () => {
            try {
                setSavingOrder(true);

                const ids =
                    deliveryLocations.map(
                        (location) =>
                            location.id
                    );

                const response =
                    await updateLocationDeliveryOrder(
                        ids
                    );

                setDeliveryLocations(
                    response?.data || []
                );

                showToast(
                    "Delivery order updated successfully."
                );
            } catch (error) {
                showToast(
                    error?.response?.data
                        ?.message ||
                        "Unable to update delivery order."
                );
            } finally {
                setSavingOrder(false);
            }
        };


    return (
        <div className="min-h-full bg-[#f8fafc] px-6 py-7 lg:px-8">
            <div className="mx-auto max-w-[1180px]">

                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/locations"
                        )
                    }
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft
                        size={16}
                    />

                    Back to Locations
                </button>


                {/* Header */}
                <div className="mb-7">
                    <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-slate-900">
                        Location Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Configure your default
                        location and delivery
                        routing priority.
                    </p>
                </div>


                {loading ? (
                    <SettingsSkeleton />
                ) : (
                    <div className="space-y-6">

                        {/* Default Location */}
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-5">
                                <h2 className="text-base font-semibold text-slate-900">
                                    Default Location
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    This location is
                                    used as the
                                    fallback when no
                                    other location is
                                    specified.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-end">
                                <div className="flex-1">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>

                                    <select
                                        value={
                                            selectedDefaultId
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSelectedDefaultId(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                                    >
                                        <option value="">
                                            Select a
                                            location
                                        </option>

                                        {activeLocations.map(
                                            (
                                                location
                                            ) => (
                                                <option
                                                    key={
                                                        location.id
                                                    }
                                                    value={
                                                        location.id
                                                    }
                                                >
                                                    {
                                                        location.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveDefault
                                    }
                                    disabled={
                                        savingDefault ||
                                        !selectedDefaultId
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingDefault ? (
                                        <>
                                            <Spinner />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={
                                                    16
                                                }
                                            />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </section>


                        {/* Delivery Order */}
                        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        Delivery Order
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Locations at
                                        the top of the
                                        list are
                                        prioritised
                                        when routing
                                        deliveries.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveOrder
                                    }
                                    disabled={
                                        savingOrder ||
                                        deliveryLocations.length ===
                                            0
                                    }
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {savingOrder ? (
                                        <>
                                            <Spinner />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save
                                                size={
                                                    15
                                                }
                                            />
                                            Save Order
                                        </>
                                    )}
                                </button>
                            </div>


                            <div className="px-6 py-6">
                                {deliveryLocations.length ===
                                0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center">
                                        <MapPin
                                            size={
                                                22
                                            }
                                            className="mx-auto text-slate-400"
                                        />

                                        <p className="mt-3 text-sm font-medium text-slate-700">
                                            No active
                                            delivery
                                            locations
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Active
                                            locations
                                            will appear
                                            here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {deliveryLocations.map(
                                            (
                                                location,
                                                index
                                            ) => (
                                                <DeliveryOrderRow
                                                    key={
                                                        location.id
                                                    }
                                                    location={
                                                        location
                                                    }
                                                    index={
                                                        index
                                                    }
                                                    total={
                                                        deliveryLocations.length
                                                    }
                                                    disabled={
                                                        savingOrder
                                                    }
                                                    onMoveUp={() =>
                                                        moveLocation(
                                                            index,
                                                            "up"
                                                        )
                                                    }
                                                    onMoveDown={() =>
                                                        moveLocation(
                                                            index,
                                                            "down"
                                                        )
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>


            <BrandToast
                open={Boolean(
                    toastMessage
                )}
                message={
                    toastMessage
                }
                onClose={() =>
                    setToastMessage("")
                }
            />
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Delivery Order Row
|--------------------------------------------------------------------------
*/

function DeliveryOrderRow({
    location,
    index,
    total,
    disabled,
    onMoveUp,
    onMoveDown,
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                {index + 1}
            </div>


            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <MapPin size={18} />
            </div>


            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {location.name}
                    </p>

                    {location.is_default && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            Default
                        </span>
                    )}
                </div>

                <p className="mt-1 truncate text-xs text-slate-500">
                    {location.address ||
                        "No address provided"}
                </p>
            </div>


            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={onMoveUp}
                    disabled={
                        disabled ||
                        index === 0
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
                    title="Move up"
                >
                    <ArrowUp
                        size={16}
                    />
                </button>

                <button
                    type="button"
                    onClick={onMoveDown}
                    disabled={
                        disabled ||
                        index ===
                            total - 1
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-35"
                    title="Move down"
                >
                    <ArrowDown
                        size={16}
                    />
                </button>
            </div>
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Loading Skeleton
|--------------------------------------------------------------------------
*/

function SettingsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-[190px] animate-pulse rounded-2xl border border-slate-200 bg-white" />

            <div className="h-[330px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Spinner
|--------------------------------------------------------------------------
*/

function Spinner() {
    return (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
    );
}