<!-- =========================================================
     POOL PILOTS - MOBILE ONLY MENU
     Standalone Elementor HTML Widget
     No JavaScript required
========================================================= -->

<style>
    #ppmMobileNav {
        --ppm-purple: #6750a4;
        --ppm-purple-dark: #503b88;
        --ppm-purple-light: #f5f2fb;
        --ppm-orange: #ffa000;
        --ppm-orange-dark: #e89000;
        --ppm-pink: #f2a7ff;
        --ppm-text: #201a2d;
        --ppm-muted: #6d6679;
        --ppm-border: #ebe6f2;
        --ppm-white: #ffffff;

        position: relative;
        z-index: 99999999;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        font-family: inherit;
    }

    #ppmMobileNav,
    #ppmMobileNav * {
        box-sizing: border-box;
    }

    #ppmMobileNav a {
        text-decoration: none !important;
    }

    #ppmMobileNav .ppm-toggle-input {
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
    }

    /* HAMBURGER BUTTON */
    #ppmMobileNav .ppm-hamburger {
        position: relative;
        z-index: 100000003;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        width: 48px;
        height: 42px;
        margin: 0;
        padding: 0;
        border: 2px solid var(--ppm-pink);
        border-radius: 10px;
        background: #ffffff;
        color: var(--ppm-purple);
        box-shadow: 0 4px 14px rgba(103, 80, 164, 0.09);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: 0.2s ease;
    }

    #ppmMobileNav .ppm-hamburger:hover,
    #ppmMobileNav .ppm-hamburger:focus-visible {
        border-color: var(--ppm-purple);
        background: var(--ppm-purple-light);
        outline: none;
    }

    #ppmMobileNav .ppm-hamburger span {
        display: block;
        width: 21px;
        height: 2.5px;
        border-radius: 20px;
        background: currentColor;
    }

    /* OVERLAY */
    #ppmMobileNav .ppm-overlay {
        position: fixed;
        inset: 0;
        z-index: 100000000;
        display: block;
        background: rgba(25, 19, 34, 0.44);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        cursor: pointer;
        transition: opacity 0.24s ease, visibility 0.24s ease;
    }

    /* DRAWER */
    #ppmMobileNav .ppm-drawer {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 100000001;
        width: min(92vw, 410px);
        height: 100dvh;
        overflow-y: auto;
        overflow-x: hidden;
        background: var(--ppm-white);
        box-shadow: -24px 0 70px rgba(32, 26, 45, 0.25);
        transform: translateX(105%);
        visibility: hidden;
        transition: transform 0.28s ease, visibility 0.28s ease;
        -webkit-overflow-scrolling: touch;
    }

    #ppmMobileNav .ppm-toggle-input:checked~.ppm-overlay {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }

    #ppmMobileNav .ppm-toggle-input:checked~.ppm-drawer {
        transform: translateX(0);
        visibility: visible;
    }

    /* DRAWER HEADER */
    #ppmMobileNav .ppm-drawer-head {
        position: sticky;
        top: 0;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-height: 72px;
        padding: 14px 18px;
        border-bottom: 1px solid var(--ppm-border);
        background: rgba(255, 255, 255, 0.97);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }

    #ppmMobileNav .ppm-drawer-title {
        margin: 0;
        color: var(--ppm-text);
        font-size: 19px;
        font-weight: 850;
        line-height: 1.2;
    }

    #ppmMobileNav .ppm-drawer-subtitle {
        display: block;
        margin-top: 3px;
        color: var(--ppm-muted);
        font-size: 11.5px;
        font-weight: 500;
    }

    #ppmMobileNav .ppm-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        border: 1px solid var(--ppm-border);
        border-radius: 10px;
        background: #ffffff;
        color: var(--ppm-purple);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }

    #ppmMobileNav .ppm-close svg {
        width: 20px;
        height: 20px;
    }

    /* MENU BODY */
    #ppmMobileNav .ppm-menu-body {
        padding: 10px 14px 22px;
    }

    #ppmMobileNav .ppm-top-link,
    #ppmMobileNav details.ppm-accordion>summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 56px;
        margin: 0;
        padding: 0 12px;
        border-bottom: 1px solid #f0ecf4;
        color: var(--ppm-text) !important;
        font-size: 15px;
        font-weight: 800;
        line-height: 1.25;
        cursor: pointer;
        list-style: none;
        -webkit-tap-highlight-color: transparent;
    }

    #ppmMobileNav details.ppm-accordion>summary::-webkit-details-marker {
        display: none;
    }

    #ppmMobileNav details.ppm-accordion>summary::marker {
        display: none;
        content: "";
    }

    #ppmMobileNav .ppm-summary-arrow {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        flex: 0 0 30px;
        border-radius: 8px;
        color: var(--ppm-purple);
        transition: transform 0.22s ease, background 0.22s ease;
    }

    #ppmMobileNav .ppm-summary-arrow svg {
        width: 17px;
        height: 17px;
    }

    #ppmMobileNav details.ppm-accordion[open]>summary {
        color: var(--ppm-purple) !important;
    }

    #ppmMobileNav details.ppm-accordion[open]>summary .ppm-summary-arrow {
        transform: rotate(180deg);
        background: var(--ppm-purple-light);
    }

    #ppmMobileNav .ppm-panel {
        margin: 0 0 8px;
        padding: 14px;
        border: 1px solid #eee8f4;
        border-top: 0;
        border-radius: 0 0 14px 14px;
        background: #fbfafd;
    }

    /* SERVICE GROUPS */
    #ppmMobileNav .ppm-section {
        margin-bottom: 18px;
    }

    #ppmMobileNav .ppm-section:last-child {
        margin-bottom: 0;
    }

    #ppmMobileNav .ppm-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e9e2ef;
    }

    #ppmMobileNav .ppm-section-title {
        margin: 0;
        color: var(--ppm-orange-dark);
        font-size: 11px;
        font-weight: 900;
        line-height: 1.2;
        letter-spacing: 1.3px;
        text-transform: uppercase;
    }

    #ppmMobileNav .ppm-section-head a {
        color: var(--ppm-purple) !important;
        font-size: 11.5px;
        font-weight: 800;
        white-space: nowrap;
    }

    #ppmMobileNav .ppm-link-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 4px;
    }

    #ppmMobileNav .ppm-sub-link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 40px;
        padding: 8px 10px;
        border-radius: 9px;
        color: #514a5c !important;
        font-size: 13.5px;
        font-weight: 650;
        line-height: 1.3;
        transition: 0.18s ease;
    }

    #ppmMobileNav .ppm-sub-link::after {
        content: "→";
        flex: 0 0 auto;
        color: var(--ppm-orange);
        font-size: 16px;
        font-weight: 800;
    }

    #ppmMobileNav .ppm-sub-link:hover {
        padding-left: 13px;
        background: var(--ppm-purple-light);
        color: var(--ppm-purple) !important;
    }

    #ppmMobileNav .ppm-view-all {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        margin-top: 12px;
        padding: 0 14px;
        border: 1px solid rgba(103, 80, 164, 0.18);
        border-radius: 10px;
        background: #ffffff;
        color: var(--ppm-purple) !important;
        font-size: 13px;
        font-weight: 850;
    }

    /* LOCATIONS */
    #ppmMobileNav .ppm-office-link {
        display: flex;
        align-items: center;
        gap: 11px;
        min-height: 66px;
        margin-bottom: 8px;
        padding: 11px;
        border: 1px solid var(--ppm-border);
        border-radius: 12px;
        background: #ffffff;
        color: var(--ppm-text) !important;
    }

    #ppmMobileNav .ppm-office-link:last-of-type {
        margin-bottom: 0;
    }

    #ppmMobileNav .ppm-office-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        border-radius: 10px;
        background: #fff6e6;
        color: var(--ppm-orange-dark);
    }

    #ppmMobileNav .ppm-office-icon svg {
        width: 19px;
        height: 19px;
    }

    #ppmMobileNav .ppm-office-copy {
        min-width: 0;
        flex: 1;
    }

    #ppmMobileNav .ppm-office-title {
        display: block;
        margin-bottom: 2px;
        color: var(--ppm-text);
        font-size: 14px;
        font-weight: 850;
    }

    #ppmMobileNav .ppm-office-text {
        display: block;
        color: var(--ppm-muted);
        font-size: 11.5px;
        font-weight: 500;
        line-height: 1.35;
    }

    #ppmMobileNav .ppm-office-arrow {
        color: var(--ppm-orange);
        font-size: 17px;
        font-weight: 850;
    }

    /* SERVICE AREA GROUPS */
    #ppmMobileNav .ppm-area-group {
        margin-bottom: 17px;
    }

    #ppmMobileNav .ppm-area-group:last-child {
        margin-bottom: 0;
    }

    #ppmMobileNav .ppm-area-title {
        margin: 0 0 7px;
        padding: 0 0 8px;
        border-bottom: 1px solid #e9e2ef;
        color: var(--ppm-orange-dark);
        font-size: 10.5px;
        font-weight: 900;
        line-height: 1.2;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }

    /* CTA */
    #ppmMobileNav .ppm-cta-wrap {
        display: grid;
        grid-template-columns: 1fr;
        gap: 9px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--ppm-border);
    }

    #ppmMobileNav .ppm-cta {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0 16px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 850;
    }

    #ppmMobileNav .ppm-cta-primary {
        background: var(--ppm-purple);
        color: #ffffff !important;
    }

    #ppmMobileNav .ppm-cta-call {
        background: var(--ppm-orange);
        color: #18121f !important;
    }

    /* MOBILE ONLY */
    @media (min-width: 1025px) {
        #ppmMobileNav {
            display: none !important;
        }
    }

    @media (max-width: 480px) {
        #ppmMobileNav .ppm-hamburger {
            width: 46px;
            height: 40px;
        }

        #ppmMobileNav .ppm-drawer {
            width: min(94vw, 390px);
        }
    }

    /* Prevent page scroll while drawer is open on modern browsers */
    @supports selector(body:has(#ppmMobileMenuToggle:checked)) {
        body:has(#ppmMobileMenuToggle:checked) {
            overflow: hidden !important;
        }
    }
</style>

<div id="ppmMobileNav">

    <input class="ppm-toggle-input" type="checkbox" id="ppmMobileMenuToggle" aria-hidden="true">

    <!-- HAMBURGER -->
    <label class="ppm-hamburger" for="ppmMobileMenuToggle" aria-label="Open mobile navigation">
        <span></span>
        <span></span>
        <span></span>
    </label>

    <!-- CLICK OUTSIDE TO CLOSE -->
    <label class="ppm-overlay" for="ppmMobileMenuToggle" aria-label="Close mobile navigation"></label>

    <!-- DRAWER -->
    <aside class="ppm-drawer" aria-label="Pool Pilots Mobile Navigation">

        <div class="ppm-drawer-head">
            <div>
                <h2 class="ppm-drawer-title">Menu</h2>
                <span class="ppm-drawer-subtitle">Pool Pilots</span>
            </div>

            <label class="ppm-close" for="ppmMobileMenuToggle" aria-label="Close mobile navigation">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M6 6l12 12"></path>
                    <path d="M18 6 6 18"></path>
                </svg>
            </label>
        </div>

        <nav class="ppm-menu-body" aria-label="Mobile menu">

            <!-- POOL SERVICES -->
            <details class="ppm-accordion">
                <summary>
                    <span>Pool Services</span>
                    <span class="ppm-summary-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </span>
                </summary>

                <div class="ppm-panel">

                    <div class="ppm-section">
                        <div class="ppm-section-head">
                            <h3 class="ppm-section-title">Pool Cleaning</h3>
                            <a href="/pool-cleaning/">View all →</a>
                        </div>

                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/weekly-pool-cleaning/">Weekly Pool Cleaning</a>
                            <a class="ppm-sub-link" href="/green-pool-cleaning/">Green Pool Cleaning</a>
                            <a class="ppm-sub-link" href="/filter-cleaning/">Filter Cleaning</a>
                            <a class="ppm-sub-link" href="/chemical-balancing/">Chemical Balancing</a>
                        </div>
                    </div>

                    <div class="ppm-section">
                        <div class="ppm-section-head">
                            <h3 class="ppm-section-title">Pool Repair</h3>
                            <a href="/pool-repair/">View all →</a>
                        </div>

                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/pool-pump-repair/">Pool Pump Repair</a>
                            <a class="ppm-sub-link" href="/pool-filter-repair/">Pool Filter Repair</a>
                            <a class="ppm-sub-link" href="/pool-heater-repair/">Pool Heater Repair</a>
                            <a class="ppm-sub-link" href="/pool-leak-repair/">Pool Leak Repair</a>
                            <a class="ppm-sub-link" href="/pool-automation-repair/">Pool Automation Repair</a>
                            <a class="ppm-sub-link" href="/equipment-repair-and-replacement/">Equipment Repair &amp;
                                Replacement</a>
                        </div>
                    </div>

                    <div class="ppm-section">
                        <div class="ppm-section-head">
                            <h3 class="ppm-section-title">Pool Maintenance</h3>
                            <a href="/pool-maintenance/">View all →</a>
                        </div>

                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/preventative-maintenance-for-pool/">Preventative
                                Maintenance</a>
                            <a class="ppm-sub-link" href="/seasonal-pool-maintenance/">Seasonal Pool Maintenance</a>
                            <a class="ppm-sub-link" href="/pool-inspections/">Pool Inspections</a>
                            <a class="ppm-sub-link" href="/pool-equipment-maintenance/">Pool Equipment Maintenance</a>
                            <a class="ppm-sub-link" href="/pool-draining-and-washing/">Pool Draining &amp; Washing</a>
                        </div>
                    </div>

                    <div class="ppm-section">
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/residential-pool-cleaning-and-repair/">Residential Pool
                                Cleaning &amp; Repair</a>
                            <a class="ppm-sub-link" href="/commercial-pool-cleaning-and-repair/">Commercial Pool
                                Cleaning &amp; Repair</a>
                        </div>
                    </div>

                    <a class="ppm-view-all" href="/services/">View all pool services →</a>
                </div>
            </details>

            <!-- LOCATIONS -->
            <details class="ppm-accordion">
                <summary>
                    <span>Locations</span>
                    <span class="ppm-summary-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </span>
                </summary>

                <div class="ppm-panel">
                    <a class="ppm-office-link" href="/scottsdale/">
                        <span class="ppm-office-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"></path>
                                <circle cx="12" cy="10" r="2.5"></circle>
                            </svg>
                        </span>
                        <span class="ppm-office-copy">
                            <span class="ppm-office-title">Scottsdale</span>
                            <span class="ppm-office-text">Pool service from our Scottsdale location</span>
                        </span>
                        <span class="ppm-office-arrow">→</span>
                    </a>

                    <a class="ppm-office-link" href="/mesa/">
                        <span class="ppm-office-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z"></path>
                                <circle cx="12" cy="10" r="2.5"></circle>
                            </svg>
                        </span>
                        <span class="ppm-office-copy">
                            <span class="ppm-office-title">Mesa</span>
                            <span class="ppm-office-text">Pool service from our Mesa location</span>
                        </span>
                        <span class="ppm-office-arrow">→</span>
                    </a>

                    <a class="ppm-view-all" href="/locations/">View all locations →</a>
                </div>
            </details>

            <!-- SERVICE AREAS -->
            <details class="ppm-accordion">
                <summary>
                    <span>Service Areas</span>
                    <span class="ppm-summary-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </span>
                </summary>

                <div class="ppm-panel">

                    <div class="ppm-area-group">
                        <h3 class="ppm-area-title">Phoenix</h3>
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/phoenix/">Phoenix</a>
                        </div>
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/north-phoenix/">North Phoenix</a>
                        </div>
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/arcadia/">Arcadia</a>
                        </div>
                    </div>

                    <div class="ppm-area-group">
                        <h3 class="ppm-area-title">West Valley</h3>
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/glendale/">Glendale</a>
                            <a class="ppm-sub-link" href="/peoria/">Peoria</a>
                            <a class="ppm-sub-link" href="/surprise/">Surprise</a>
                            <a class="ppm-sub-link" href="/buckeye/">Buckeye</a>
                            <a class="ppm-sub-link" href="/goodyear/">Goodyear</a>
                            <a class="ppm-sub-link" href="/avondale/">Avondale</a>
                            <a class="ppm-sub-link" href="/sun-city/">Sun City</a>
                            <a class="ppm-sub-link" href="/tolleson/">Tolleson</a>
                            <a class="ppm-sub-link" href="/litchfield-park/">Litchfield Park</a>
                        </div>
                    </div>

                    <div class="ppm-area-group">
                        <h3 class="ppm-area-title">East Valley</h3>
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/mesa/">Mesa</a>
                            <a class="ppm-sub-link" href="/chandler/">Chandler</a>
                            <a class="ppm-sub-link" href="/gilbert/">Gilbert</a>
                            <a class="ppm-sub-link" href="/tempe/">Tempe</a>
                            <a class="ppm-sub-link" href="/san-tan-valley/">San Tan Valley</a>
                            <a class="ppm-sub-link" href="/ahwatukee/">Ahwatukee</a>
                            <a class="ppm-sub-link" href="/queen-creek/">Queen Creek</a>
                            <a class="ppm-sub-link" href="/maricopa/">Maricopa</a>
                        </div>
                    </div>

                    <div class="ppm-area-group">
                        <h3 class="ppm-area-title">Scottsdale &amp; NE Valley</h3>
                        <div class="ppm-link-list">
                            <a class="ppm-sub-link" href="/scottsdale/">Scottsdale</a>
                            <a class="ppm-sub-link" href="/fountain-hills/">Fountain Hills</a>
                            <a class="ppm-sub-link" href="/paradise-valley/">Paradise Valley</a>
                            <a class="ppm-sub-link" href="/cave-creek/">Cave Creek</a>
                            <a class="ppm-sub-link" href="/carefree/">Carefree</a>
                            <a class="ppm-sub-link" href="/desert-highlands/">Desert Highlands</a>
                        </div>
                    </div>

                    <a class="ppm-view-all" href="/service-areas/">View all service areas →</a>
                </div>
            </details>

            <!-- BRANDS -->
            <details class="ppm-accordion">
                <summary>
                    <span>Brands</span>
                    <span class="ppm-summary-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </span>
                </summary>

                <div class="ppm-panel">
                    <div class="ppm-link-list">
                        <a class="ppm-sub-link" href="/hayward-pool-equipment-repair-and-service/">Hayward</a>
                        <a class="ppm-sub-link" href="/pentair-pool-equipment-repair-and-service/">Pentair</a>
                        <a class="ppm-sub-link" href="/jandy-pool-equipment-repair-and-service/">Jandy</a>
                    </div>

                    <a class="ppm-view-all" href="/pool-equipment-brands/">View all brands →</a>
                </div>
            </details>

            <!-- NORMAL LINKS -->
            <a class="ppm-top-link" href="/reviews/">
                <span>Reviews</span>
                <span style="color:#ffa000;font-size:17px;font-weight:800;">→</span>
            </a>


            <!-- ABOUT -->
            <details class="ppm-accordion ppm-about-accordion">

                <summary>
                    <span>About</span>

                    <span class="ppm-summary-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m6 9 6 6 6-6"></path>
                        </svg>
                    </span>
                </summary>

                <div class="ppm-panel ppm-about-panel">

                    <div class="ppm-link-list">

                        <a class="ppm-sub-link" href="/about-us/">
                            About Us
                        </a>

                        <a class="ppm-sub-link" href="/careers/">
                            Careers
                        </a>

                    </div>

                </div>

            </details>


            <!-- CTA -->
            <div class="ppm-cta-wrap">
                <a class="ppm-cta ppm-cta-primary" href="/get-a-quote/">Get a Fast Quote</a>
                <a class="ppm-cta ppm-cta-call" href="tel:6028427178">Call Us: (602) 842-7178</a>
            </div>

        </nav>

    </aside>

</div>
