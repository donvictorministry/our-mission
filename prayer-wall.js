/* ============================================================
   prayer-wall.js - Prayer Wall screen (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var html =
        '<div class="screen-body">' +
            '<div class="hero-card grad-purple">' +
                '<div class="hero-row">' + DV.icon('candle', 32) + '<h2 class="hero-title">Prayer Wall</h2></div>' +
                '<p class="hero-text">Cast your burdens here. The Kingdom prays together.</p>' +
            '</div>' +

            '<div class="card">' +
                '<h3 class="form-title">Submit Prayer Request</h3>' +
                '<input type="email" id="prayer-email" placeholder="Your Email" class="dv-input focus-purple">' +
                '<textarea id="prayer-message" placeholder="Your prayer request (' + DV.MAX_CHARS + ' characters max)" maxlength="' + DV.MAX_CHARS + '" class="dv-input dv-textarea focus-purple"></textarea>' +
                '<div class="counter-row">' +
                    '<span id="prayer-char-count" class="char-count">0/' + DV.MAX_CHARS + '</span>' +
                    '<span id="prayer-limit-msg" class="limit-msg hidden">Daily limit reached</span>' +
                '</div>' +
                '<button id="prayer-submit" class="btn-block btn-purple ripple">Submit Prayer Request</button>' +
            '</div>' +

            '<h3 class="feed-head">Recent Prayers</h3>' +
            '<div id="prayer-feed"></div>' +
            '<div class="load-more"><button id="prayer-more" class="btn-load ripple">Load More</button></div>' +
        '</div>';

    DV.addScreen({ id: 'prayer-wall', title: 'Prayer Wall', html: html, onShow: loadPrayers });

    DV.addMenu('left', { label: 'Prayer Wall', icon: 'candle', onClick: function () { DV.go('prayer-wall'); } });
    DV.addQuickCard({ title: 'Prayer Wall', sub: 'Share Request', icon: 'candle', tone: 'purple', onClick: function () { DV.go('prayer-wall'); } });

    DV.bindCounter('prayer-message', 'prayer-char-count');

    document.getElementById('prayer-submit').addEventListener('click', function () {
        DV.act(submitPrayerRequest);
    });
    document.getElementById('prayer-more').addEventListener('click', function () {
        DV.act(loadPrayers);
    });
    document.getElementById('prayer-feed').addEventListener('click', function (e) {
        if (e.target.closest('[data-pray]')) {
            DV.act(function () { DV.toast('Added to your prayer list!'); });
        }
    });

    async function submitPrayerRequest() {
        var emailInput = document.getElementById('prayer-email');
        var messageInput = document.getElementById('prayer-message');
        var limitMsg = document.getElementById('prayer-limit-msg');

        var email = emailInput.value.trim();
        var message = messageInput.value.trim();

        if (!email || !message) { DV.showError(emailInput, 'Please fill all fields'); return; }
        if (!DV.isValidEmail(email)) { DV.showError(emailInput, 'Invalid email address'); return; }
        if (!DV.validate(message)) { DV.showError(messageInput, 'Invalid content detected'); return; }

        await DV.ready;
        var canSubmit = await DV.checkDailyLimit('prayer');
        if (!canSubmit) {
            limitMsg.classList.remove('hidden');
            setTimeout(function () { limitMsg.classList.add('hidden'); }, 3000);
            return;
        }

        var prayerData = {
            cid: DV.uid(),
            synced: false,
            email: email,
            message: DV.sanitize(message),
            timestamp: new Date().toISOString()
        };

        DV.db.transaction(['prayers'], 'readwrite').objectStore('prayers').add(prayerData);

        await DV.incrementDailyLimit('prayer');
        if (DV.gas) DV.gas.send('prayer', prayerData);

        emailInput.value = '';
        messageInput.value = '';
        DV.resetCounter('prayer-char-count');
        DV.toast('Prayer request submitted successfully!');
        loadPrayers();
    }

    function loadPrayers() {
        DV.ready.then(function () {
            var request = DV.db.transaction(['prayers'], 'readonly').objectStore('prayers').getAll();
            request.onsuccess = function () {
                var prayers = request.result.reverse().slice(0, 10);
                var feed = document.getElementById('prayer-feed');

                if (prayers.length === 0) {
                    feed.innerHTML = '<p class="empty-note">No prayers yet. Be the first to share!</p>';
                    return;
                }

                feed.innerHTML = prayers.map(function (p) {
                    return '<div class="feed-item">' +
                        '<p class="feed-text">' + p.message + '</p>' +
                        '<div class="feed-meta">' +
                            '<span class="feed-time">' + DV.icon('clock', 18) + DV.formatTime(p.timestamp) + '</span>' +
                            '<button class="feed-act act-purple ripple" data-pray="' + p.id + '">' + DV.icon('candle', 20) + 'Praying</button>' +
                        '</div>' +
                    '</div>';
                }).join('');
            };
        });
    }

    DV.ready.then(loadPrayers);
})();
