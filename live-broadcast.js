/* ============================================================
   live-broadcast.js - Live Broadcast screen + comments
   (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        // Where "Join Live" sends people: a WhatsApp link, a meeting link, or any site.
        // Example WhatsApp group: 'https://chat.whatsapp.com/XXXXXXXX'
        JOIN_URL: ''
    };

    var html =
        '<div class="screen-body">' +
            '<div class="hero-card grad-red">' +
                '<div class="hero-row">' + DV.icon('podcast', 32) + '<h2 class="hero-title">Live Broadcast</h2></div>' +
                '<p class="hero-text">Join the live stream. Experience the Word now.</p>' +
            '</div>' +

            '<div class="card">' +
                '<div class="video-box">' + DV.icon('play_circle', 64) + '</div>' +
                '<h3 class="item-title">Kingdom Service Live</h3>' +
                '<p class="item-sub">Broadcasting from the Throne Room</p>' +
                '<div class="btn-row">' +
                    '<button id="bc-join" class="btn-grow btn-red ripple">Join Live</button>' +
                    '<button id="bc-like" class="btn-like ripple" aria-label="Like">' + DV.icon('heart', 24) + '</button>' +
                '</div>' +
            '</div>' +

            '<div class="card">' +
                '<h3 class="form-title">Live Comments</h3>' +
                '<input type="email" id="comment-email" placeholder="Your Email" class="dv-input focus-red">' +
                '<textarea id="comment-message" placeholder="Your comment (' + DV.MAX_CHARS + ' characters max)" maxlength="' + DV.MAX_CHARS + '" class="dv-input dv-textarea short focus-red"></textarea>' +
                '<div class="counter-row">' +
                    '<span id="comment-char-count" class="char-count">0/' + DV.MAX_CHARS + '</span>' +
                    '<span id="comment-limit-msg" class="limit-msg hidden">Daily limit reached</span>' +
                '</div>' +
                '<button id="comment-submit" class="btn-block btn-red ripple">Post Comment</button>' +
                '<div id="comments-feed" style="margin-top:20px"></div>' +
            '</div>' +
        '</div>';

    DV.addScreen({ id: 'broadcast', title: 'Live Broadcast', html: html, onShow: loadComments });

    DV.addMenu('left', { label: 'Live Broadcast', icon: 'podcast', onClick: function () { DV.go('broadcast'); } });
    DV.addQuickCard({ title: 'Live Broadcast', sub: 'Join Now', icon: 'podcast', tone: 'red', onClick: function () { DV.go('broadcast'); } });

    DV.bindCounter('comment-message', 'comment-char-count');

    document.getElementById('bc-join').addEventListener('click', function () {
        DV.act(function () {
            if (!CFG.JOIN_URL) {
                DV.toast('Live link is not available yet.');
                return;
            }
            window.open(CFG.JOIN_URL, '_blank', 'noopener');
        });
    });

    document.getElementById('bc-like').addEventListener('click', function () {
        DV.act(function () {
            DV.emit('like', 'broadcast');
            DV.toast('Liked!');
        });
    });

    document.getElementById('comment-submit').addEventListener('click', function () {
        DV.act(submitComment);
    });

    async function submitComment() {
        var emailInput = document.getElementById('comment-email');
        var messageInput = document.getElementById('comment-message');
        var limitMsg = document.getElementById('comment-limit-msg');

        var email = emailInput.value.trim();
        var message = messageInput.value.trim();

        if (!email || !message) { DV.showError(emailInput, 'Please fill all fields'); return; }
        if (!DV.isValidEmail(email)) { DV.showError(emailInput, 'Invalid email address'); return; }
        if (!DV.validate(message)) { DV.showError(messageInput, 'Invalid content detected'); return; }

        await DV.ready;
        var canSubmit = await DV.checkDailyLimit('comment');
        if (!canSubmit) {
            limitMsg.classList.remove('hidden');
            setTimeout(function () { limitMsg.classList.add('hidden'); }, 3000);
            return;
        }

        var commentData = {
            cid: DV.uid(),
            synced: false,
            email: email,
            message: DV.sanitize(message),
            timestamp: new Date().toISOString()
        };

        DV.db.transaction(['comments'], 'readwrite').objectStore('comments').add(commentData);

        await DV.incrementDailyLimit('comment');
        if (DV.gas) DV.gas.send('comment', commentData);

        emailInput.value = '';
        messageInput.value = '';
        DV.resetCounter('comment-char-count');
        DV.toast('Comment posted!');
        loadComments();
    }

    function loadComments() {
        DV.ready.then(function () {
            var request = DV.db.transaction(['comments'], 'readonly').objectStore('comments').getAll();
            request.onsuccess = function () {
                var comments = request.result.reverse().slice(0, 10);
                var feed = document.getElementById('comments-feed');

                if (comments.length === 0) {
                    feed.innerHTML = '<p class="empty-note">No comments yet. Start the conversation!</p>';
                    return;
                }

                feed.innerHTML = comments.map(function (c) {
                    return '<div class="comment-item">' +
                        '<p class="feed-text">' + c.message + '</p>' +
                        '<span class="feed-time">' + DV.icon('clock', 18) + DV.formatTime(c.timestamp) + '</span>' +
                    '</div>';
                }).join('');
            };
        });
    }

    DV.ready.then(loadComments);
})();
