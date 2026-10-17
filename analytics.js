/* ============================================================
   analytics.js - Views / Likes / Reads bar (independent module)
   Listens for dv:like and dv:read events sent by other modules.
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var slot = document.getElementById('analytics-slot');
    if (!slot) return;

    slot.innerHTML =
        '<div class="stats-bar"><div class="stats-grid">' +
            '<div class="stat stat-blue"><div class="stat-label">' + DV.icon('eye', 16) + '<span>Views</span></div><p id="total-views" class="stat-num">0</p></div>' +
            '<div class="stat stat-red"><div class="stat-label">' + DV.icon('heart', 16) + '<span>Likes</span></div><p id="total-likes" class="stat-num">0</p></div>' +
            '<div class="stat stat-green"><div class="stat-label">' + DV.icon('book', 16) + '<span>Reads</span></div><p id="total-reads" class="stat-num">0</p></div>' +
        '</div></div>';

    function updateDisplay() {
        var request = DV.db.transaction(['analytics'], 'readonly').objectStore('analytics').getAll();
        request.onsuccess = function () {
            var records = request.result;
            var views = records.filter(function (r) { return r.type === 'view'; }).length;
            var likes = records.filter(function (r) { return r.type === 'like'; }).length;
            var reads = records.filter(function (r) { return r.type === 'read'; }).length;
            document.getElementById('total-views').textContent = DV.formatNumber(views);
            document.getElementById('total-likes').textContent = DV.formatNumber(likes);
            document.getElementById('total-reads').textContent = DV.formatNumber(reads);
        };
    }

    function bump(id) {
        var el = document.getElementById(id);
        el.classList.add('counter-animate');
        setTimeout(function () { el.classList.remove('counter-animate'); }, 300);
    }

    function track(local, remote, bumpId) {
        DV.ready.then(function () {
            local.timestamp = new Date().toISOString();
            local.cid = DV.uid();
            local.synced = false;
            DV.db.transaction(['analytics'], 'readwrite').objectStore('analytics').add(local);
            updateDisplay();
            if (bumpId) bump(bumpId);
        });
    }

    document.addEventListener('dv:like', function (e) {
        track({ type: 'like', contentType: e.detail }, { type: 'like', contentType: e.detail }, 'total-likes');
    });

    document.addEventListener('dv:read', function (e) {
        track({ type: 'read', contentId: e.detail }, { type: 'read', contentId: e.detail }, 'total-reads');
    });

    DV.ready.then(function () {
        updateDisplay();
        track({ type: 'view' }, { type: 'view' });
    });
})();
