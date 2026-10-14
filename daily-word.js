/* ============================================================
   daily-word.js - Daily Word card on Home (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        VERSE: '"Go ye into all the world, and preach the gospel to every creature."',
        REFERENCE: 'Mark 16:15'
    };

    DV.addHomeCard(
        '<div class="card">' +
            '<div class="card-head c-blue">' + DV.icon('book', 24) + '<h3 class="card-title">Daily Word</h3></div>' +
            '<p class="verse-text">' + CFG.VERSE + '</p>' +
            '<p class="verse-ref">' + CFG.REFERENCE + '</p>' +
        '</div>'
    );
})();
