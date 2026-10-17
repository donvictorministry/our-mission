/* ============================================================
   GAS.js - Google Apps Script backend sync (independent module)
   Every call shows the center spinner. Requests use text/plain
   (no CORS preflight). Records carry a client id (cid) so the
   server can drop duplicates, and a local "synced" flag so each
   record is only re-sent until the server confirms it.
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        BACKEND_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
        BATCH_MS: 300000,
        CHUNK: 100,
        STORES: ['analytics', 'prayers', 'testimonies', 'comments'],
        STORE_FOR: { analytics: 'analytics', prayer: 'prayers', testimony: 'testimonies', comment: 'comments' }
    };

    function configured() { return CFG.BACKEND_URL.indexOf('http') === 0; }

    function clean(rec) {
        var o = {};
        Object.keys(rec).forEach(function (k) { if (k !== 'id' && k !== 'synced') o[k] = rec[k]; });
        return o;
    }

    function post(action, data, keepalive) {
        if (!configured()) return Promise.resolve(null);
        DV.loader.show();
        return fetch(CFG.BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: action, data: data }),
            keepalive: !!keepalive
        }).then(function (r) { return r.json(); })
          .catch(function () { return null; })
          .then(function (res) { DV.loader.hide(); return res; });
    }

    function markSynced(store, cids) {
        return DV.ready.then(function () {
            return new Promise(function (resolve) {
                var tx = DV.db.transaction([store], 'readwrite');
                var os = tx.objectStore(store);
                var rq = os.getAll();
                rq.onsuccess = function () {
                    rq.result.forEach(function (r) {
                        if (r.cid && cids.indexOf(r.cid) >= 0 && !r.synced) { r.synced = true; os.put(r); }
                    });
                };
                tx.oncomplete = resolve;
                tx.onerror = resolve;
            });
        });
    }

    function send(type, data) {
        return post(type, clean(data)).then(function (res) {
            if (res && res.success && data.cid && CFG.STORE_FOR[type]) markSynced(CFG.STORE_FOR[type], [data.cid]);
            return res;
        });
    }

    function unsynced(store) {
        return DV.ready.then(function () {
            return new Promise(function (resolve) {
                var os = DV.db.transaction([store], 'readwrite').objectStore(store);
                var rq = os.getAll();
                rq.onsuccess = function () {
                    var out = [];
                    rq.result.forEach(function (r) {
                        if (r.synced) return;
                        if (!r.cid) { r.cid = DV.uid(); os.put(r); }
                        out.push(r);
                    });
                    resolve(out);
                };
                rq.onerror = function () { resolve([]); };
            });
        });
    }

    var flushing = false;
    function flush(keepalive) {
        if (flushing || !configured()) return Promise.resolve();
        flushing = true;
        var done = function () { flushing = false; };
        return CFG.STORES.reduce(function (p, store) {
            return p.then(function () {
                return unsynced(store).then(function (list) {
                    var chunks = [];
                    for (var i = 0; i < list.length; i += CFG.CHUNK) chunks.push(list.slice(i, i + CFG.CHUNK));
                    return chunks.reduce(function (q, ch) {
                        return q.then(function () {
                            return post('batch_' + store, ch.map(clean), keepalive).then(function (res) {
                                if (res && res.success) return markSynced(store, ch.map(function (r) { return r.cid; }));
                            });
                        });
                    }, Promise.resolve());
                });
            });
        }, Promise.resolve()).then(done, done);
    }

    DV.gas = { send: send, flush: flush };

    // BATCH SYNC: unsynced records only
    setInterval(function () { flush(false); }, CFG.BATCH_MS);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(true); });
    window.addEventListener('online', function () { flush(false); });
    document.addEventListener('dv:splashend', function () { flush(false); });
})();
