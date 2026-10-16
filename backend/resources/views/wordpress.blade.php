
<!-- Pool Pilots Mobile Sticky Footer -->

<div id="pp-mobile-sticky-footer">
  <div class="pp-footer-inner">

    <a href="tel:6028427178" class="pp-footer-call">
      <svg xmlns="http://www.w3.org/2000/svg"
           width="17" height="17"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2"
           stroke-linecap="round"
           stroke-linejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2
          19.79 19.79 0 0 1-8.63-3.07
          19.5 19.5 0 0 1-6-6
          19.79 19.79 0 0 1-3.07-8.67
          A2 2 0 0 1 4.11 2h3
          a2 2 0 0 1 2 1.72
          c.12.96.36 1.91.7 2.81
          a2 2 0 0 1-.45 2.11L8.09 9.91
          a16 16 0 0 0 6 6l1.27-1.27
          a2 2 0 0 1 2.11-.45
          c.9.34 1.85.58 2.81.7
          A2 2 0 0 1 22 16.92z"/>
      </svg>
      <span>Call</span>
    </a>

    <a href="/get-a-quote/"
       class="pp-footer-quote"
       id="pp-footer-quote-link">
      Get a Free Quote
    </a>

  </div>
</div>

<style>
  #pp-mobile-sticky-footer {
    display: none;
  }

  @media (max-width: 767px) {

    #pp-mobile-sticky-footer {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 99999;
      box-sizing: border-box;
      background: #FF6B9A;
      border-top: 1px solid #e9e9ef;
      padding: 8px 12px;
      padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.07);
      font-family: system-ui, -apple-system,
        BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    #pp-mobile-sticky-footer *,
    #pp-mobile-sticky-footer *::before,
    #pp-mobile-sticky-footer *::after {
      box-sizing: border-box;
    }

    #pp-mobile-sticky-footer .pp-footer-inner {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      max-width: 500px;
      margin: 0 auto;
    }

    #pp-mobile-sticky-footer a {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      flex: 1;
      min-width: 0;
      min-height: 42px;
      padding: 10px 8px;
      border-radius: 50px;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.3;
      text-align: center;
      text-decoration: none !important;
      transition: background-color 0.2s ease;
      box-shadow: none;
    }

    #pp-mobile-sticky-footer .pp-footer-call {
      background: black;
      color: white;
      border: 1px solid black;
    }

    #pp-mobile-sticky-footer .pp-footer-call svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    #pp-mobile-sticky-footer .pp-footer-quote {
      background: #6750A4;
      color: #ffffff;
      border: 1px solid #6750A4;
    }

    #pp-mobile-sticky-footer .pp-footer-call:hover {
      background: #f4efff;
      color: #6750A4;
    }

    #pp-mobile-sticky-footer .pp-footer-quote:hover {
      background: #543b91;
      color: #ffffff;
    }

    body {
      padding-bottom: calc(66px + env(safe-area-inset-bottom, 0px));
    }
  }





/* OneTap Accessibility - Mobile Middle Position */
@media (max-width: 767px) {

  body .onetap-container-toggle {
    position: fixed !important;
    top: 90% !important;
    bottom: auto !important;
    right: 1px !important;
    left: auto !important;
    transform: translateY(-50%) !important;
    margin: 0 !important;
    z-index: 99998 !important;
  }

}



</style>
