import { Link } from "react-router-dom";
import {
    Mail,
    MapPin,
    Phone,
    ShoppingBag,
} from "lucide-react";

import {
    FaFacebookF,
    FaInstagram,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="w-full border-t border-[#edf0f3] bg-[#f8f9fb]">
            <div className="mx-auto grid max-w-[1300px] grid-cols-[2.2fr_1fr_1fr_1fr_1fr] gap-[55px] px-4 pb-[45px] pt-[45px] xl:px-0">
                <div>
                    <Link
                        to="/"
                        className="mb-[14px] inline-flex items-center gap-2.5"
                    >
                        <div className="relative flex h-[39px] w-[36px] items-center justify-center rounded-[9px] bg-gradient-to-br from-[#3575ff] via-[#5b6eff] to-[#8a55ff] shadow-[0_4px_10px_rgba(80,92,255,0.25)]">
                            <ShoppingBag
                                size={26}
                                strokeWidth={2}
                                className="text-white"
                            />

                            <span className="absolute mt-1 text-[13px] font-extrabold text-white">
                                D.
                            </span>
                        </div>

                        <span className="text-[28px] font-extrabold tracking-[-1.4px] text-[#3474f5]">
                            Devify
                        </span>
                    </Link>

                    <p className="mb-[15px] max-w-[300px] text-[13px] leading-[18px] text-[#7c8492]">
                        Storify is a modern self-hosted eCommerce platform built
                        for online stores, retail businesses, and multi-vendor
                        marketplaces.
                    </p>

                    <h4 className="mb-[10px] text-[13px] font-bold text-[#262c36]">
                        Contact
                    </h4>

                    <div className="flex flex-col gap-[9px]">
                        <a
                            href="tel:+17759865200"
                            className="flex items-center gap-2 text-[13px] text-[#7c8492] transition hover:text-[#3f73f7]"
                        >
                            <Phone size={15} strokeWidth={1.8} />

                            +17759865200
                        </a>

                        <a
                            href="mailto:store@example.com"
                            className="flex items-center gap-2 text-[13px] text-[#7c8492] transition hover:text-[#3f73f7]"
                        >
                            <Mail size={15} strokeWidth={1.8} />

                            store@example.com
                        </a>

                        <div className="flex items-center gap-2 text-[13px] text-[#7c8492]">
                            <MapPin size={15} strokeWidth={1.8} />

                            Main street, New York, 1000
                        </div>
                    </div>
                </div>

                <FooterColumn
                    title="Products"
                    links={[
                        ["Products", "/products"],
                        ["Categories", "/categories"],
                        ["Collections", "/collections"],
                        ["New Arrivals", "/new-arrivals"],
                    ]}
                />

                <FooterColumn
                    title="Help"
                    links={[
                        ["Track Order", "/track-order"],
                        ["FAQ", "/faq"],
                        ["Returns", "/returns"],
                        ["Contact", "/contact"],
                    ]}
                />

                <FooterColumn
                    title="Company"
                    links={[
                        ["Blog", "/blog"],
                        ["Become a Vendor", "/become-vendor"],
                    ]}
                />

                <FooterColumn
                    title="Legal"
                    links={[
                        ["Terms of Service", "/terms"],
                        ["Privacy Policy", "/privacy-policy"],
                    ]}
                />
            </div>

            <div className="border-t border-[#e5e7ea]">
                <div className="mx-auto flex h-[61px] max-w-[1190px] items-center justify-between px-4 xl:px-0">
                    <p className="text-[13px] text-[#7c8492]">
                        © {new Date().getFullYear()} Storify. All rights reserved.
                    </p>

                    <div className="flex items-center gap-[18px]">
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="text-[16px] text-[#757d89] transition hover:text-[#3f73f7]"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="#"
                            aria-label="X"
                            className="text-[17px] text-[#757d89] transition hover:text-[#3f73f7]"
                        >
                            <FaXTwitter />
                        </a>

                        <a
                            href="#"
                            aria-label="Instagram"
                            className="text-[18px] text-[#757d89] transition hover:text-[#3f73f7]"
                        >
                            <FaInstagram />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterColumn = ({ title, links }) => {
    return (
        <div>
            <h3 className="mb-[19px] text-[15px] font-bold text-[#252b35]">
                {title}
            </h3>

            <div className="flex flex-col items-start gap-[13px]">
                {links.map(([label, path]) => (
                    <Link
                        key={label}
                        to={path}
                        className="text-[13px] text-[#7c8492] transition hover:text-[#3f73f7]"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Footer;