import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { Plus } from "lucide-react";

import {
    createLocation,
    deleteLocation,
    getLocations,
    updateLocation,
} from "../../../api/admin/locationApi";

import BrandToast from "../../../components/admin/brands/BrandToast";

import LocationTabs from "./components/LocationTabs";
import LocationTable from "./components/LocationTable";
import LocationFormModal from "./components/LocationFormModal";
import DeleteLocationModal from "./components/DeleteLocationModal";


const EMPTY_FORM = {
    name: "",
    address: "",
    can_collect: false,
    ships_online_orders: false,
    sells_over_counter: false,
    receives_returns: false,
    is_default: false,
    status: "active",
};


export default function LocationIndex() {
    const [locations, setLocations] = useState([]);

    const [activeTab, setActiveTab] =
        useState("all");

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [formOpen, setFormOpen] =
        useState(false);

    const [
        editingLocation,
        setEditingLocation,
    ] = useState(null);

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(null);

    const [form, setForm] =
        useState({
            ...EMPTY_FORM,
        });

    const [errors, setErrors] =
        useState({});

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

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
    | Load Locations
    |--------------------------------------------------------------------------
    */

    const loadLocations =
        useCallback(async () => {
            try {
                setLoading(true);

                const response =
                    await getLocations({
                        filter: activeTab,
                        search:
                            search.trim() ||
                            undefined,
                        per_page: 100,
                    });

                setLocations(
                    response?.data || []
                );
            } catch (error) {
                showToast(
                    error?.response?.data
                        ?.message ||
                    "Unable to load locations."
                );
            } finally {
                setLoading(false);
            }
        }, [
            activeTab,
            search,
            showToast,
        ]);


    useEffect(() => {
        const timer =
            window.setTimeout(
                () => {
                    loadLocations();
                },
                250
            );

        return () => {
            window.clearTimeout(timer);
        };
    }, [loadLocations]);


    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    const openCreateModal = () => {
        setEditingLocation(null);

        setForm({
            ...EMPTY_FORM,
        });

        setErrors({});
        setFormOpen(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const openEditModal = (
        location
    ) => {
        setEditingLocation(location);

        setForm({
            name:
                location.name || "",

            address:
                location.address || "",

            can_collect:
                Boolean(
                    location.can_collect
                ),

            ships_online_orders:
                Boolean(
                    location
                        .ships_online_orders
                ),

            sells_over_counter:
                Boolean(
                    location
                        .sells_over_counter
                ),

            receives_returns:
                Boolean(
                    location
                        .receives_returns
                ),

            is_default:
                Boolean(
                    location.is_default
                ),

            status:
                location.status ||
                "active",


        });

        setErrors({});
        setFormOpen(true);
    };


    /*
    |--------------------------------------------------------------------------
    | Close Form
    |--------------------------------------------------------------------------
    */

    const closeFormModal = () => {
        if (saving) {
            return;
        }

        setFormOpen(false);
        setEditingLocation(null);

        setForm({
            ...EMPTY_FORM,
        });

        setErrors({});
    };


    /*
    |--------------------------------------------------------------------------
    | Form Change
    |--------------------------------------------------------------------------
    */

    const handleFormChange = (
        event
    ) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm((current) => ({
            ...current,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: undefined,
        }));
    };


    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    const handleSubmit =
        async (event) => {
            event.preventDefault();

            try {
                setSaving(true);
                setErrors({});

                if (editingLocation) {
                    await updateLocation(
                        editingLocation.id,
                        form
                    );

                    showToast(
                        `${form.name} updated successfully.`
                    );
                } else {
                    await createLocation(
                        form
                    );

                    showToast(
                        `${form.name} added successfully.`
                    );
                }

                setFormOpen(false);
                setEditingLocation(null);

                setForm({
                    ...EMPTY_FORM,
                });

                await loadLocations();
            } catch (error) {
                const validationErrors =
                    error?.response?.data
                        ?.errors;

                if (validationErrors) {
                    const normalized = {};

                    Object.entries(
                        validationErrors
                    ).forEach(
                        ([
                            field,
                            messages,
                        ]) => {
                            normalized[field] =
                                Array.isArray(
                                    messages
                                )
                                    ? messages[0]
                                    : messages;
                        }
                    );

                    setErrors(normalized);

                    return;
                }

                showToast(
                    error?.response?.data
                        ?.message ||
                    "Unable to save location."
                );
            } finally {
                setSaving(false);
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Activate / Deactivate
    |--------------------------------------------------------------------------
    */

    const handleStatusToggle =
        async (location) => {
            const nextStatus =
                location.status === "active"
                    ? "inactive"
                    : "active";

            try {
                await updateLocation(
                    location.id,
                    {
                        status:
                            nextStatus,
                    }
                );

                showToast(
                    `${location.name} ${nextStatus === "active"
                        ? "activated"
                        : "deactivated"
                    } successfully.`
                );

                await loadLocations();
            } catch (error) {
                const statusError =
                    error?.response?.data
                        ?.errors
                        ?.status?.[0];

                showToast(
                    statusError ||
                    error?.response
                        ?.data
                        ?.message ||
                    "Unable to update location status."
                );
            }
        };


    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete =
        async () => {
            if (!deleteTarget) {
                return;
            }

            try {
                setDeleting(true);

                const locationName =
                    deleteTarget.name;

                await deleteLocation(
                    deleteTarget.id
                );

                setDeleteTarget(null);

                showToast(
                    `${locationName} deleted successfully.`
                );

                await loadLocations();
            } catch (error) {
                const locationError =
                    error?.response?.data
                        ?.errors
                        ?.location?.[0];

                showToast(
                    locationError ||
                    error?.response
                        ?.data
                        ?.message ||
                    "Unable to delete location."
                );
            } finally {
                setDeleting(false);
            }
        };


    return (
        <div className="min-h-full bg-[#f7f7f8] px-6 py-6 lg:px-7">
            <div className="mx-auto max-w-[1500px]">

                {/* Main Card */}
                <div className="rounded-[14px] border border-[#e1e3e6] bg-white p-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">

                    {/* Header */}
                    <div className="mb-[16px] flex items-center justify-between">
                        <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-[#17191c]">
                            Locations
                        </h1>

                        <button
                            type="button"
                            onClick={
                                openCreateModal
                            }
                            className="inline-flex h-[36px] items-center gap-[8px] rounded-[10px] bg-[#3677f5] px-[14px] text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#2f6ce3]"
                        >
                            <Plus
                                size={16}
                                strokeWidth={
                                    2
                                }
                            />

                            Add Location
                        </button>
                    </div>


                    {/* Inner Locations Panel */}
                    <div className="overflow-hidden rounded-[12px] border border-[#e1e3e6] bg-white">
                        <LocationTabs
                            activeTab={
                                activeTab
                            }
                            onTabChange={
                                setActiveTab
                            }
                            search={
                                search
                            }
                            onSearchChange={
                                setSearch
                            }
                        />

                        <LocationTable
                            locations={
                                locations
                            }
                            loading={
                                loading
                            }
                            search={
                                search
                            }
                            activeTab={
                                activeTab
                            }
                            onAdd={
                                openCreateModal
                            }
                            onEdit={
                                openEditModal
                            }
                            onDelete={
                                setDeleteTarget
                            }
                            onStatusToggle={
                                handleStatusToggle
                            }
                        />
                    </div>
                </div>
            </div>


            <LocationFormModal
                open={formOpen}
                form={form}
                errors={errors}
                saving={saving}
                editingLocation={
                    editingLocation
                }
                onChange={
                    handleFormChange
                }
                onClose={
                    closeFormModal
                }
                onSubmit={
                    handleSubmit
                }
            />


            <DeleteLocationModal
                open={Boolean(
                    deleteTarget
                )}
                location={
                    deleteTarget
                }
                deleting={
                    deleting
                }
                onClose={() => {
                    if (!deleting) {
                        setDeleteTarget(
                            null
                        );
                    }
                }}
                onDelete={
                    handleDelete
                }
            />


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