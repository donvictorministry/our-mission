/* ============================================================
   mission.js - Mission footer button + modal (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var contact = DV.contactBar ? DV.contactBar() : '';

    DV.addModal({
        id: 'kingdom-modal-mission',
        tone: 'blue',
        html:
            '<div class="dlg-head">' +
                '<p class="dlg-kicker c-blue">Our Mission</p>' +
                '<h2 class="dlg-title">The Great<br>Commission</h2>' +
            '</div>' +
            '<p class="dlg-text">This is not just another ministry. This is a <strong class="c-blue">Kingdom Assignment</strong> &mdash; a global mandate from Heaven to win souls and disciple nations.</p>' +
            '<p class="dlg-text" style="margin-bottom:0">Our mandate is to win <strong class="c-blue">6,000,000 Souls</strong> across the six inhabited continents of the earth:</p>' +
            '<div class="chip-grid">' +
                '<div class="chip">1. Africa</div>' +
                '<div class="chip">2. Asia</div>' +
                '<div class="chip">3. Europe</div>' +
                '<div class="chip">4. North America</div>' +
                '<div class="chip">5. South America</div>' +
                '<div class="chip">6. Oceania</div>' +
            '</div>' +
            contact
    });

    DV.addFooterButton({
        label: 'Mission',
        icon: 'bullseye',
        tone: 'blue',
        onClick: function () { DV.openModal('kingdom-modal-mission'); }
    });
})();
