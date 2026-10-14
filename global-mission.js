/* ============================================================
   global-mission.js - Global Mission progress card on Home
   (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        WON_TEXT: '1,234,567 / 6,000,000',
        PERCENT: 20.6
    };

    DV.addHomeCard(
        '<div class="card">' +
            '<div class="card-head c-green">' + DV.icon('globe', 24) + '<h3 class="card-title">Global Mission</h3></div>' +
            '<div class="progress-meta">' +
                '<span class="progress-label">Souls Won</span>' +
                '<span class="progress-value">' + CFG.WON_TEXT + '</span>' +
            '</div>' +
            '<div class="progress-track"><div class="progress-fill" style="width:' + CFG.PERCENT + '%"></div></div>' +
            '<p class="progress-note">Every soul matters. Keep pressing forward.</p>' +
        '</div>'
    );
})();
