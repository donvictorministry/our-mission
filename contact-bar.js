/* ============================================================
   contact-bar.js - "Stay Connected" row shown inside the
   Mission / Partner / Assignment modals (independent module).
   Edit the three links below.
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        EMAIL: 'mailto:contact@kingdomdiscipleship.org',
        PHONE: 'tel:+1234567890',
        WHATSAPP: 'https://wa.me/1234567890'
    };

    DV.contactBar = function () {
        return '<div class="contact-bar">' +
            '<p class="contact-label">Stay Connected</p>' +
            '<div class="contact-row">' +
                '<a href="' + CFG.EMAIL + '" class="contact-btn cb-blue" aria-label="Email">' + DV.icon('mail', 24) + '</a>' +
                '<a href="' + CFG.PHONE + '" class="contact-btn cb-green" aria-label="Call">' + DV.icon('phone', 24) + '</a>' +
                '<a href="' + CFG.WHATSAPP + '" target="_blank" rel="noopener" class="contact-btn cb-purple" aria-label="WhatsApp">' + DV.icon('chat', 24) + '</a>' +
            '</div></div>';
    };
})();
