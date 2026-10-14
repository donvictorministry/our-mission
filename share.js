/* ============================================================
   share.js - Share App item in the right sidebar
   (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        TITLE: 'Kingdom Discipleship App',
        TEXT: 'Join the global mission to win 6 million souls!'
    };

    DV.addMenu('right', {
        label: 'Share App',
        icon: 'share',
        onClick: function () {
            if (navigator.share) {
                return navigator.share({
                    title: CFG.TITLE,
                    text: CFG.TEXT,
                    url: window.location.href
                }).catch(function () {});
            }
            DV.toast('Share this app with your network!');
        }
    });
})();
