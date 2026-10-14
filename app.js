/* ============================================================
   KINGDOM DISCIPLESHIP APP - app.js (CORE)
   Core files: index.html, styles.css, app.js, sw.js, manifest.json
   Every other .js file is an independent module that plugs into
   the small DV hooks below and can be deleted on its own.
   ============================================================ */
(function () {
    'use strict';

    var CFG = {
        DB_NAME: 'KingdomAppDB',
        DB_VERSION: 1,
        MAX_CHARS: 500,
        SPLASH_SECONDS: 9,
        SPIN_MIN_MS: 350,
        TOAST_MS: 2500,
        SW_FILE: 'sw.js'
    };

    var DV = {};
    window.DV = DV;
    DV.MAX_CHARS = CFG.MAX_CHARS;

    /* ---------- ICONS (inline SVG, no external font) ---------- */
    var STROKE = ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"';
    var ICONS = {
        menu: '<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>',
        more_vert: '<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
        arrow_back: '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>',
        home: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
        eye: '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
        eye_off: '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><path d="M3 3l18 18"' + STROKE + '/>',
        heart: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
        book: '<path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>',
        podcast: '<path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 2c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19zM12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z"/>',
        play_circle: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>',
        cross: '<path d="M10 2h4v6h6v4h-6v10h-4V12H4V8h6z"/>',
        candle: '<path d="M12 2c1.6 2.1 2.6 3.3 2.6 4.6a2.6 2.6 0 0 1-5.2 0C9.4 5.3 10.4 4.1 12 2z"/><path d="M8 11.5h8V21a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/>',
        flame: '<path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59-1.81-1.37-2-3.34-1.84-4.75.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54 2.43.31 5.06-.14 6.95-1.87 2.08-1.93 2.84-5.01 1.72-7.69z"/>',
        close: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
        copy: '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
        lock: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
        globe: '<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.2" ry="10"/><path d="M2 12h20"/></g>',
        megaphone: '<path d="M3 10v4h3l5 4V6L6 10H3z"/><path d="M14.5 9.2a4 4 0 0 1 0 5.6M17 6.5a8 8 0 0 1 0 11"' + STROKE + '/>',
        user: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>',
        share: '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>',
        info: '<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>',
        check_circle: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
        payments: '<rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3"/>',
        bullseye: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.8"/>',
        help: '<path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>',
        mail: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
        phone: '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
        chat: '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>',
        clock: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>'
    };

    DV.icon = function (name, size) {
        size = size || 24;
        return '<svg class="dv-icon" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
    };

    DV.paintIcons = function (root) {
        var list = (root || document).querySelectorAll('[data-icon]');
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            el.innerHTML = DV.icon(el.getAttribute('data-icon'), parseInt(el.getAttribute('data-size'), 10) || 24);
            el.removeAttribute('data-icon');
        }
    };

    /* ---------- EVENTS ---------- */
    DV.emit = function (name, detail) {
        document.dispatchEvent(new CustomEvent('dv:' + name, { detail: detail }));
    };

    /* ---------- TOAST + SPINNER (screen center) ---------- */
    var toastTimer = null;
    var pendingToast = null;
    var loadCount = 0;

    function showToast(msg, ms) {
        var el = document.getElementById('dv-toast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, ms || CFG.TOAST_MS);
    }

    DV.toast = function (msg, ms) {
        if (loadCount > 0) { pendingToast = { m: msg, t: ms }; return; }
        showToast(msg, ms);
    };

    DV.loader = {
        show: function () {
            loadCount++;
            document.getElementById('dv-loader').classList.remove('hidden');
        },
        hide: function () {
            loadCount = Math.max(0, loadCount - 1);
            if (loadCount === 0) {
                document.getElementById('dv-loader').classList.add('hidden');
                if (pendingToast) {
                    var p = pendingToast;
                    pendingToast = null;
                    showToast(p.m, p.t);
                }
            }
        }
    };

    // Every user action runs through DV.act so the spinner always shows.
    DV.act = function (fn, ms) {
        DV.loader.show();
        var wait = new Promise(function (r) { setTimeout(r, ms || CFG.SPIN_MIN_MS); });
        var run;
        try { run = Promise.resolve(fn ? fn() : null); } catch (e) { run = Promise.resolve(); }
        return Promise.all([run.catch(function () {}), wait]).then(function () { DV.loader.hide(); });
    };

    /* ---------- INDEXEDDB ---------- */
    function initIndexedDB() {
        return new Promise(function (resolve, reject) {
            var request = indexedDB.open(CFG.DB_NAME, CFG.DB_VERSION);
            request.onerror = function () { reject(request.error); };
            request.onsuccess = function () { resolve(request.result); };
            request.onupgradeneeded = function (event) {
                var d = event.target.result;
                ['analytics', 'prayers', 'testimonies', 'comments'].forEach(function (name) {
                    if (!d.objectStoreNames.contains(name)) {
                        var s = d.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
                        s.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                });
                if (!d.objectStoreNames.contains('dailyLimits')) {
                    d.createObjectStore('dailyLimits', { keyPath: 'type' });
                }
            };
        });
    }

    DV.db = null;
    DV.ready = initIndexedDB().then(function (d) { DV.db = d; return d; });

    /* ---------- INPUT VALIDATION ---------- */
    DV.validate = function (text) {
        var maliciousPatterns = [
            /<script/i, /<iframe/i, /javascript:/i, /on\w+=/i,
            /http:\/\//i, /https:\/\//i, /www\./i,
            /\.com/i, /\.org/i, /\.net/i,
            /bitcoin/i, /crypto/i, /forex/i, /investment/i, /romance/i, /dating/i,
            /<audio/i, /<video/i, /<embed/i, /<object/i,
            /\$\d+/, /\u20AC\d+/, /\u00A3\d+/,
            /earn money/i, /make money/i, /click here/i
        ];
        for (var i = 0; i < maliciousPatterns.length; i++) {
            if (maliciousPatterns[i].test(text)) return false;
        }
        return true;
    };

    DV.sanitize = function (text) {
        return text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .trim();
    };

    DV.isValidEmail = function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    DV.showError = function (element, message) {
        element.classList.add('input-error');
        setTimeout(function () { element.classList.remove('input-error'); }, 500);
        DV.toast(message);
    };

    DV.bindCounter = function (inputId, countId) {
        var input = document.getElementById(inputId);
        var count = document.getElementById(countId);
        if (!input || !count) return;
        input.addEventListener('input', function () {
            count.textContent = input.value.length + '/' + CFG.MAX_CHARS;
        });
    };

    DV.resetCounter = function (countId) {
        var count = document.getElementById(countId);
        if (count) count.textContent = '0/' + CFG.MAX_CHARS;
    };

    /* ---------- DAILY LIMIT ---------- */
    DV.checkDailyLimit = function (type) {
        return new Promise(function (resolve, reject) {
            var transaction = DV.db.transaction(['dailyLimits'], 'readwrite');
            var store = transaction.objectStore('dailyLimits');
            var request = store.get(type);
            request.onsuccess = function () {
                var today = new Date().toDateString();
                var record = request.result;
                if (!record || record.date !== today) {
                    store.put({ type: type, date: today, count: 0 });
                    resolve(true);
                } else if (record.count >= 1) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            };
            request.onerror = function () { reject(request.error); };
        });
    };

    DV.incrementDailyLimit = function (type) {
        return new Promise(function (resolve, reject) {
            var transaction = DV.db.transaction(['dailyLimits'], 'readwrite');
            var store = transaction.objectStore('dailyLimits');
            var request = store.get(type);
            request.onsuccess = function () {
                var today = new Date().toDateString();
                var record = request.result;
                if (record && record.date === today) {
                    record.count++;
                    store.put(record);
                } else {
                    store.put({ type: type, date: today, count: 1 });
                }
                resolve();
            };
            request.onerror = function () { reject(request.error); };
        });
    };

    /* ---------- FORMATTERS ---------- */
    DV.formatNumber = function (num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    DV.formatTime = function (timestamp) {
        var diff = new Date() - new Date(timestamp);
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return Math.floor(diff / 86400000) + 'd ago';
    };

    /* ---------- NAVIGATION + ANDROID BACK ---------- */
    var stack = ['home'];
    var layers = [];
    var skipPop = false;
    DV.screens = { home: { title: 'Kingdom App' } };

    function unwind(n) {
        return new Promise(function (resolve) {
            if (n <= 0) { resolve(); return; }
            skipPop = true;
            window.addEventListener('popstate', function h() {
                window.removeEventListener('popstate', h);
                resolve();
            });
            history.go(-n);
        });
    }

    function renderHeader() {
        var id = stack[stack.length - 1];
        var s = DV.screens[id];
        document.getElementById('hdr-title').textContent = (s && s.title) || 'Kingdom App';
        var sub = stack.length > 1;
        document.getElementById('btn-left-icon').innerHTML = DV.icon(sub ? 'arrow_back' : 'menu', 28);
        document.getElementById('btn-left').setAttribute('aria-label', sub ? 'Back' : 'Menu');
    }

    function show(id) {
        var el = document.getElementById('screen-' + id);
        if (!el) return;
        var all = document.querySelectorAll('.page-screen');
        for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
        el.classList.add('active');
        document.body.setAttribute('data-screen', id === 'home' ? 'home' : 'sub');
        renderHeader();
        var s = DV.screens[id];
        if (s && s.onShow) s.onShow();
    }

    DV.go = function (id) {
        if (!document.getElementById('screen-' + id)) return;
        if (stack[stack.length - 1] === id) return;
        stack.push(id);
        history.pushState({ dv: 1 }, '');
        show(id);
    };

    DV.home = function () {
        var n = stack.length - 1;
        stack = ['home'];
        show('home');
        return unwind(n);
    };

    DV.layers = {
        open: function (closeFn) {
            layers.push(closeFn);
            history.pushState({ dv: 1 }, '');
        },
        close: function () {
            if (!layers.length) return;
            var c = layers.pop();
            c();
            skipPop = true;
            history.back();
        },
        closeAll: function () {
            var n = layers.length;
            if (!n) return Promise.resolve();
            while (layers.length) { layers.pop()(); }
            return unwind(n);
        }
    };

    window.addEventListener('popstate', function () {
        if (skipPop) { skipPop = false; return; }
        if (layers.length) { layers.pop()(); return; }
        if (stack.length > 1) {
            stack.pop();
            show(stack[stack.length - 1]);
        }
    });

    /* ---------- HOOKS FOR MODULES ---------- */
    DV.addScreen = function (o) {
        var el = document.createElement('div');
        el.id = 'screen-' + o.id;
        el.className = 'page-screen hide-scrollbar';
        el.innerHTML = o.html;
        document.getElementById('dv-main').appendChild(el);
        DV.screens[o.id] = { title: o.title, onShow: o.onShow };
        DV.paintIcons(el);
        return el;
    };

    DV.addMenu = function (side, o) {
        var host = document.getElementById(side === 'right' ? 'right-menu' : 'left-menu');
        var b = document.createElement('button');
        b.className = 'dv-menu-item ripple';
        b.innerHTML = '<span class="dv-menu-ico">' + DV.icon(o.icon, 24) + '</span><span>' + o.label + '</span>';
        b.addEventListener('click', function () {
            DV.act(function () {
                return DV.layers.closeAll().then(function () { return o.onClick(); });
            });
        });
        host.appendChild(b);
        return b;
    };

    DV.addQuickCard = function (o) {
        var b = document.createElement('button');
        b.className = 'quick-card ripple';
        b.innerHTML = '<div class="quick-icon tone-' + o.tone + '">' + DV.icon(o.icon, 24) + '</div>' +
            '<p class="quick-title">' + o.title + '</p><p class="quick-sub">' + o.sub + '</p>';
        b.addEventListener('click', function () { DV.act(o.onClick); });
        document.getElementById('home-quick').appendChild(b);
        return b;
    };

    DV.addHomeCard = function (html) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        DV.paintIcons(wrap);
        document.getElementById('home-cards').appendChild(wrap);
        return wrap;
    };

    DV.addFooterButton = function (o) {
        var b = document.createElement('button');
        b.className = 'footer-btn fb-' + o.tone + ' ripple';
        b.innerHTML = DV.icon(o.icon, 24) + '<span>' + o.label + '</span>';
        b.addEventListener('click', function () { DV.act(o.onClick); });
        document.getElementById('home-footer').appendChild(b);
        return b;
    };

    DV.addModal = function (o) {
        var m = document.createElement('div');
        m.id = o.id;
        m.className = 'dv-modal hidden';
        m.innerHTML = '<div class="dv-scrim"></div>' +
            '<div class="dv-dialog dlg-' + o.tone + '">' +
            '<button class="dlg-close ripple" aria-label="Close">' + DV.icon('close', 24) + '</button>' +
            '<div class="dv-dialog-body">' + o.html + '</div></div>';
        var closeIt = function () { DV.act(function () { DV.layers.close(); }); };
        m.querySelector('.dv-scrim').addEventListener('click', closeIt);
        m.querySelector('.dlg-close').addEventListener('click', closeIt);
        document.body.appendChild(m);
        DV.paintIcons(m);
        return m;
    };

    DV.openModal = function (id) {
        var m = document.getElementById(id);
        if (!m) return;
        m.classList.remove('hidden');
        DV.layers.open(function () { m.classList.add('hidden'); });
    };

    /* ---------- SIDEBARS ---------- */
    function openSidebar(side) {
        var sb = document.getElementById(side + '-sidebar');
        var ov = document.getElementById('sidebar-overlay');
        sb.classList.add('active');
        ov.classList.remove('hidden');
        DV.layers.open(function () {
            sb.classList.remove('active');
            ov.classList.add('hidden');
        });
    }

    /* ---------- SPLASH ---------- */
    var splashCounter = CFG.SPLASH_SECONDS;
    function updateSplashTimer() {
        var timerEl = document.getElementById('splash-timer');
        var circle = document.getElementById('splash-circle');
        var total = 351;
        if (splashCounter > 0) {
            timerEl.textContent = splashCounter;
            var offset = (splashCounter / CFG.SPLASH_SECONDS) * total;
            circle.style.strokeDashoffset = total - offset;
            splashCounter--;
            setTimeout(updateSplashTimer, 1000);
        } else {
            document.getElementById('splash-screen').style.display = 'none';
            DV.emit('splashend');
        }
    }

    /* ---------- INIT ---------- */
    history.replaceState({ dv: 1 }, '');
    DV.paintIcons(document);

    DV.addMenu('left', { label: 'Home', icon: 'home', onClick: function () { return DV.home(); } });

    document.getElementById('btn-left').addEventListener('click', function () {
        DV.act(function () {
            if (stack.length > 1) { history.back(); } else { openSidebar('left'); }
        });
    });
    document.getElementById('btn-right').addEventListener('click', function () {
        DV.act(function () { openSidebar('right'); });
    });
    document.getElementById('sidebar-overlay').addEventListener('click', function () {
        DV.act(function () { DV.layers.close(); });
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(CFG.SW_FILE).catch(function () {});
    }

    renderHeader();
    updateSplashTimer();
})();
