/* ============================================================
   how-to.js - "How To Use This App" button + modal
   (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    DV.addModal({
        id: 'modal-how-to',
        tone: 'yellow',
        html:
            '<div class="dlg-head">' +
                '<p class="dlg-kicker c-yellow">Quick Guide</p>' +
                '<h2 class="dlg-title">How To Use<br>This App</h2>' +
            '</div>' +
            '<div class="dlg-item" style="margin-bottom:16px">' +
                '<h4 class="dlg-item-title c-blue">1. Share Prayer Requests</h4>' +
                '<p>Visit the Prayer Wall to submit your requests. Limited to two per device daily.</p>' +
            '</div>' +
            '<div class="dlg-item" style="margin-bottom:16px">' +
                '<h4 class="dlg-item-title c-blue">2. Share Testimonies</h4>' +
                '<p>Share what God has done in your life. Two testimonies per device per day.</p>' +
            '</div>' +
            '<div class="dlg-item" style="margin-bottom:16px">' +
                '<h4 class="dlg-item-title c-blue">3. Join Live Broadcast</h4>' +
                '<p>Watch live services and interact via comments.</p>' +
            '</div>' +
            '<div class="dlg-item" style="margin-bottom:0">' +
                '<h4 class="dlg-item-title c-blue">4. Like and Engage</h4>' +
                '<p>Show support by liking content. Track engagement in the analytics bar.</p>' +
            '</div>'
    });

    var fab = document.createElement('button');
    fab.className = 'dv-fab ripple';
    fab.setAttribute('aria-label', 'How to use this app');
    fab.innerHTML = DV.icon('help', 30);
    fab.addEventListener('click', function () {
        DV.act(function () { DV.openModal('modal-how-to'); });
    });
    document.body.appendChild(fab);
})();
