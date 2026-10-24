import {
    ArrowDown,
    CircleOff,
    MapPin,
    MoreVertical,
    Pencil,
} from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";


export default function LocationRow({
    location,
    isLast = false,
    onEdit,
    onStatusToggle,
    onShipLater,
}) {
    const [menuOpen, setMenuOpen] =
        useState(false);

    const [menuPosition, setMenuPosition] =
        useState({
            top: 0,
            left: 0,
        });

    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const isActive =
        location.status === "active";


    /*
    |--------------------------------------------------------------------------
    | Dropdown Position
    |--------------------------------------------------------------------------
    */

    const updateMenuPosition = () => {
        if (!buttonRef.current) {
            return;
        }

        const rect =
            buttonRef.current.getBoundingClientRect();

        const menuWidth = 178;
        const menuHeight = 126;

        const spaceBelow =
            window.innerHeight -
            rect.bottom;

        const openAbove =
            spaceBelow <
            menuHeight + 16;

        let left =
            rect.right -
            menuWidth;

        if (left < 12) {
            left = 12;
        }

        if (
            left + menuWidth >
            window.innerWidth - 12
        ) {
            left =
                window.innerWidth -
                menuWidth -
                12;
        }

        setMenuPosition({
            left,

            top: openAbove
                ? rect.top -
                  menuHeight -
                  6
                : rect.bottom + 6,
        });
    };


    /*
    |--------------------------------------------------------------------------
    | Toggle Menu
    |--------------------------------------------------------------------------
    */

    const toggleMenu = () => {
        if (!menuOpen) {
            updateMenuPosition();
        }

        setMenuOpen(
            (current) => !current
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Outside Click
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const handleOutsideClick = (
            event
        ) => {
            const clickedButton =
                buttonRef.current?.contains(
                    event.target
                );

            const clickedMenu =
                menuRef.current?.contains(
                    event.target
                );

            if (
                !clickedButton &&
                !clickedMenu
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [menuOpen]);


    /*
    |--------------------------------------------------------------------------
    | Reposition
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const handlePositionChange =
            () => {
                updateMenuPosition();
            };

        window.addEventListener(
            "resize",
            handlePositionChange
        );

        window.addEventListener(
            "scroll",
            handlePositionChange,
            true
        );

        return () => {
            window.removeEventListener(
                "resize",
                handlePositionChange
            );

            window.removeEventListener(
                "scroll",
                handlePositionChange,
                true
            );
        };
    }, [menuOpen]);


    return (
        <>
            <tr
                className={`transition hover:bg-[#fafafa] ${
                    isLast
                        ? ""
                        : "border-b border-[#e8eaed]"
                }`}
            >
                {/* Name */}
                <td className="px-[20px] py-[13px]">
                    <div className="flex min-w-0 items-center gap-[12px]">
                        <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#eef3ff] text-[#3e7af7]">
                            <MapPin
                                size={15}
                                strokeWidth={2}
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-[7px]">
                                <p className="truncate text-[12.5px] font-semibold text-[#171a1f]">
                                    {location.name}
                                </p>

                                {location.is_default && (
                                    <span className="rounded-[5px] bg-[#edf3ff] px-[6px] py-[2px] text-[9.5px] font-semibold text-[#3974f4]">
                                        Default
                                    </span>
                                )}
                            </div>

                            {location.address && (
                                <p className="mt-[1px] truncate text-[11.5px] leading-[16px] text-[#737b85]">
                                    {location.address}
                                </p>
                            )}
                        </div>
                    </div>
                </td>


                {/* Delivery Order */}
                <td className="px-[20px] py-[13px]">
                    <span className="text-[12px] font-medium text-[#555d67]">
                        {location.delivery_order
                            ? `#${location.delivery_order}`
                            : "—"}
                    </span>
                </td>


                {/* Services */}
                <td className="px-[20px] py-[13px]">
                    {location.services?.length ? (
                        <div className="flex flex-wrap items-center gap-[5px]">
                            {location.services.map(
                                (service) => (
                                    <span
                                        key={service}
                                        className="inline-flex rounded-full bg-[#f1f3f5] px-[9px] py-[4px] text-[10.5px] font-medium text-[#28303a]"
                                    >
                                        {service}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <span className="text-[12px] text-[#8a9199]">
                            —
                        </span>
                    )}
                </td>


                {/* Status */}
                <td className="px-[20px] py-[13px]">
                    <span
                        className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] text-[10.5px] font-medium ${
                            isActive
                                ? "bg-[#d9f8e9] text-[#07824f]"
                                : "bg-[#f1f4f7] text-[#334155]"
                        }`}
                    >
                        <span
                            className={`h-[6px] w-[6px] rounded-full ${
                                isActive
                                    ? "bg-[#07955c]"
                                    : "bg-[#24364d]"
                            }`}
                        />

                        {isActive
                            ? "Active"
                            : "Inactive"}
                    </span>
                </td>


                {/* Actions */}
                <td className="px-[20px] py-[13px] text-right">
                    <button
                        ref={buttonRef}
                        type="button"
                        onClick={toggleMenu}
                        className={`inline-flex h-[32px] w-[32px] items-center justify-center rounded-[8px] border transition ${
                            menuOpen
                                ? "border-[#d7dadd] bg-[#f5f5f5] text-[#272c32]"
                                : "border-[#e1e3e5] bg-[#f7f7f7] text-[#505761] hover:bg-[#f1f2f3]"
                        }`}
                        aria-label="Location actions"
                    >
                        <MoreVertical
                            size={16}
                            strokeWidth={2.2}
                        />
                    </button>
                </td>
            </tr>


            {/* Floating Dropdown */}
            {menuOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            top:
                                menuPosition.top,
                            left:
                                menuPosition.left,
                        }}
                        className="fixed z-[9999] w-[178px] rounded-[10px] border border-[#dedfe1] bg-white p-[5px] shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                    >
                        <DropdownItem
                            icon={Pencil}
                            label="Edit"
                            onClick={() => {
                                setMenuOpen(
                                    false
                                );

                                onEdit?.();
                            }}
                        />

                        {isActive && (
                            <DropdownItem
                                icon={ArrowDown}
                                label="Ship from here later"
                                onClick={() => {
                                    setMenuOpen(
                                        false
                                    );

                                    onShipLater?.();
                                }}
                            />
                        )}

                        <DropdownItem
                            icon={CircleOff}
                            label={
                                isActive
                                    ? "Deactivate"
                                    : "Activate"
                            }
                            onClick={() => {
                                setMenuOpen(
                                    false
                                );

                                onStatusToggle?.();
                            }}
                        />
                    </div>,
                    document.body
                )}
        </>
    );
}


/*
|--------------------------------------------------------------------------
| Dropdown Item
|--------------------------------------------------------------------------
*/

function DropdownItem({
    icon: Icon,
    label,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-[34px] w-full items-center gap-[10px] rounded-[7px] px-[9px] text-left text-[12px] font-medium text-[#292d33] transition hover:bg-[#f5f5f6]"
        >
            <Icon
                size={14}
                strokeWidth={1.8}
                className="shrink-0 text-[#30353b]"
            />

            <span className="whitespace-nowrap">
                {label}
            </span>
        </button>
    );
}