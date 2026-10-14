/* ============================================================
   testimony.js - Testimonies screen (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var html =
        '<div class="screen-body">' +
            '<div class="hero-card grad-yellow">' +
                '<div class="hero-row">' + DV.icon('flame', 32) + '<h2 class="hero-title">Testimonies</h2></div>' +
                '<p class="hero-text">Share what God has done. Inspire the Kingdom.</p>' +
            '</div>' +

            '<div class="card">' +
                '<h3 class="form-title">Share Your Testimony</h3>' +
                '<input type="email" id="testimony-email" placeholder="Your Email" class="dv-input focus-yellow">' +
                '<textarea id="testimony-message" placeholder="Your testimony (' + DV.MAX_CHARS + ' characters max)" maxlength="' + DV.MAX_CHARS + '" class="dv-input dv-textarea focus-yellow"></textarea>' +
                '<div class="counter-row">' +
                    '<span id="testimony-char-count" class="char-count">0/' + DV.MAX_CHARS + '</span>' +
                    '<span id="testimony-limit-msg" class="limit-msg hidden">Daily limit reached</span>' +
                '</div>' +
                '<button id="testimony-submit" class="btn-block btn-yellow ripple">Share Testimony</button>' +
            '</div>' +

            '<h3 class="feed-head">Recent Testimonies</h3>' +
            '<div id="testimony-feed"></div>' +
            '<div class="load-more"><button id="testimony-more" class="btn-load ripple">Load More</button></div>' +
        '</div>';

    DV.addScreen({ id: 'testimony', title: 'Testimonies', html: html, onShow: loadTestimonies });

    DV.addMenu('left', { label: 'Testimonies', icon: 'flame', onClick: function () { DV.go('testimony'); } });
    DV.addQuickCard({ title: 'Testimony', sub: 'Share Miracle', icon: 'flame', tone: 'yellow', onClick: function () { DV.go('testimony'); } });

    DV.bindCounter('testimony-message', 'testimony-char-count');

    document.getElementById('testimony-submit').addEventListener('click', function () {
        DV.act(submitTestimony);
    });
    document.getElementById('testimony-more').addEventListener('click', function () {
        DV.act(loadTestimonies);
    });
    document.getElementById('testimony-feed').addEventListener('click', function (e) {
        if (e.target.closest('[data-amen]')) {
            DV.act(function () {
                DV.emit('like', 'testimony');
                DV.toast('Glory to God!');
            });
        }
    });

    async function submitTestimony() {
        var emailInput = document.getElementById('testimony-email');
        var messageInput = document.getElementById('testimony-message');
        var limitMsg = document.getElementById('testimony-limit-msg');

        var email = emailInput.value.trim();
        var message = messageInput.value.trim();

        if (!email || !message) { DV.showError(emailInput, 'Please fill all fields'); return; }
        if (!DV.isValidEmail(email)) { DV.showError(emailInput, 'Invalid email address'); return; }
        if (!DV.validate(message)) { DV.showError(messageInput, 'Invalid content detected'); return; }

        await DV.ready;
        var canSubmit = await DV.checkDailyLimit('testimony');
        if (!canSubmit) {
            limitMsg.classList.remove('hidden');
            setTimeout(function () { limitMsg.classList.add('hidden'); }, 3000);
            return;
        }

        var testimonyData = {
            email: email,
            message: DV.sanitize(message),
            timestamp: new Date().toISOString()
        };

        DV.db.transaction(['testimonies'], 'readwrite').objectStore('testimonies').add(testimonyData);

        await DV.incrementDailyLimit('testimony');
        if (DV.gas) DV.gas.send('testimony', testimonyData);

        emailInput.value = '';
        messageInput.value = '';
        DV.resetCounter('testimony-char-count');
        DV.toast('Testimony shared successfully!');
        loadTestimonies();
    }

    function loadTestimonies() {
        DV.ready.then(function () {
            var request = DV.db.transaction(['testimonies'], 'readonly').objectStore('testimonies').getAll();
            request.onsuccess = function () {
                var testimonies = request.result.reverse().slice(0, 10);
                var feed = document.getElementById('testimony-feed');

                if (testimonies.length === 0) {
                    feed.innerHTML = '<p class="empty-note">No testimonies yet. Share your miracle!</p>';
                    return;
                }

                feed.innerHTML = testimonies.map(function (t) {
                    return '<div class="feed-item gold">' +
                        '<p class="feed-text">' + t.message + '</p>' +
                        '<div class="feed-meta">' +
                            '<span class="feed-time">' + DV.icon('clock', 18) + DV.formatTime(t.timestamp) + '</span>' +
                            '<button class="feed-act act-yellow ripple" data-amen="' + t.id + '">' + DV.icon('flame', 20) + 'Amen</button>' +
                        '</div>' +
                    '</div>';
                }).join('');
            };
        });
    }

    DV.ready.then(loadTestimonies);
})();
