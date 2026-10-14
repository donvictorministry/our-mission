/* ============================================================
   GAS.js - Google Apps Script backend sync (independent module)
   Every call shows the center spinner.
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        BACKEND_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
        BATCH_MS: 300000,
        STORES: ['analytics', 'prayers', 'testimonies', 'comments']
    };

    function send(type, data) {
        DV.loader.show();
        return fetch(CFG.BACKEND_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: type, data: data })
        }).catch(function () {
            /* offline - data stays saved locally */
        }).then(function () {
            DV.loader.hide();
        });
    }

    DV.gas = { send: send };

    // BATCH SYNC (every 5 minutes)
    setInterval(function () {
        DV.ready.then(function () {
            CFG.STORES.forEach(function (name) {
                var request = DV.db.transaction([name], 'readonly').objectStore(name).getAll();
                request.onsuccess = function () {
                    if (request.result.length > 0) send('batch_' + name, request.result);
                };
            });
        });
    }, CFG.BATCH_MS);
})();
