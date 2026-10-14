/* ============================================================
   assignment.js - Assignment footer button + modal
   (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var contact = DV.contactBar ? DV.contactBar() : '';

    DV.addModal({
        id: 'kingdom-modal-assignment',
        tone: 'purple',
        html:
            '<div class="dlg-head">' +
                '<p class="dlg-kicker c-purple">Our Assignment</p>' +
                '<h2 class="dlg-title">We Are<br>Sent To Do</h2>' +
            '</div>' +
            '<div class="dlg-item">' +
                '<h4 class="dlg-item-title c-purple">1. Proclaim The Word</h4>' +
                '<p>We do not just believe; we <strong>enforce</strong> the Word of God as the final authority over nations, systems, and lives.</p>' +
            '</div>' +
            '<div class="dlg-item">' +
                '<h4 class="dlg-item-title c-purple">2. Demonstrate Power</h4>' +
                '<p>We are sent to heal the sick, cast out devils, and demonstrate the reality of the Kingdom through the power of the Holy Spirit. <span class="dlg-ref">(1 Cor 4:20)</span></p>' +
            '</div>' +
            '<div class="dlg-item" style="margin-bottom:0">' +
                '<h4 class="dlg-item-title c-purple">3. Disciple Nations</h4>' +
                '<p>We are raising a generation of believers who will take over the seven mountains of influence for Christ.</p>' +
            '</div>' +
            contact
    });

    DV.addFooterButton({
        label: 'Assignment',
        icon: 'check_circle',
        tone: 'purple',
        onClick: function () { DV.openModal('kingdom-modal-assignment'); }
    });
})();
