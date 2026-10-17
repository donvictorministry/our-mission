/* ============================================================
   telemetry.js - Anonymous once-a-day visit telemetry
   (independent module). Uses the free ipapi.co service for the
   visitor's country / region / city / timezone only.
   The IP address is NEVER read, stored or sent.
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        API: 'https://ipapi.co/json/',
        DAY_KEY: 'dvTelemetryDay'
    };

    function today() { return new Date().toISOString().slice(0, 10); }
    function doneToday() { try { return localStorage.getItem(CFG.DAY_KEY) === today(); } catch (e) { return false; } }
    function markDone() { try { localStorage.setItem(CFG.DAY_KEY, today()); } catch (e) {} }

    function run() {
        if (!DV.gas || doneToday()) return;
        fetch(CFG.API).then(function (r) { return r.json(); }).then(function (g) {
            if (!g || g.error || !g.country_name) return null;
            // Only these fields are copied. The "ip" field in the reply is ignored.
            var rec = {
                cid: DV.uid(),
                country: g.country_name,
                region: g.region || '',
                city: g.city || '',
                timezone: g.timezone || '',
                language: navigator.language || '',
                screen: screen.width + 'x' + screen.height,
                device: Math.min(screen.width, screen.height) >= 600 ? 'Tablet' : 'Phone',
                installed: (window.matchMedia && matchMedia('(display-mode: standalone)').matches) ? 'Yes' : 'No',
                timestamp: new Date().toISOString()
            };
            return DV.gas.send('telemetry', rec);
        }).then(function (res) {
            if (res && res.success) markDone();
        }).catch(function () {});
    }

    DV.ready.then(run);
})();
