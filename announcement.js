/* ============================================================
   announcement.js - Popup announcement shown once after splash
   (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        TITLE: 'Important Notice',
        TEXT: 'Welcome to Kingdom Discipleship App! Join us in winning 6 million souls worldwide.',
        STORAGE_KEY: 'hasSeenAnnouncement',
        DELAY_MS: 2000
    };

    var popup = document.createElement('div');
    popup.id = 'announcement-popup';
    popup.className = 'dv-modal hidden';
    popup.innerHTML =
        '<div class="dv-scrim"></div>' +
        '<div class="ann-dialog">' +
            '<div class="ann-head">' + DV.icon('megaphone', 48) + '<h2 class="ann-title">' + CFG.TITLE + '</h2></div>' +
            '<div class="ann-body">' +
                '<p class="ann-text">' + CFG.TEXT + '</p>' +
                '<button id="ann-close" class="ann-btn ripple">Got It</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(popup);

    function markSeen() {
        try { localStorage.setItem(CFG.STORAGE_KEY, 'true'); } catch (e) {}
    }

    function seen() {
        try { return !!localStorage.getItem(CFG.STORAGE_KEY); } catch (e) { return false; }
    }

    function closeIt() {
        DV.act(function () { DV.layers.close(); });
    }

    popup.querySelector('.dv-scrim').addEventListener('click', closeIt);
    popup.querySelector('#ann-close').addEventListener('click', closeIt);

    document.addEventListener('dv:splashend', function () {
        if (seen()) return;
        setTimeout(function () {
            popup.classList.remove('hidden');
            DV.layers.open(function () {
                popup.classList.add('hidden');
                markSeen();
            });
        }, CFG.DELAY_MS);
    });
})();
