/* ============================================================
   library.js - Library screen (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var html =
        '<div class="screen-body">' +
            '<div class="hero-card grad-blue">' +
                '<div class="hero-row">' + DV.icon('book', 32) + '<h2 class="hero-title">Library</h2></div>' +
                '<p class="hero-text">Access study materials and discipleship resources.</p>' +
            '</div>' +

            '<div class="lib-list">' +
                '<div class="card" style="margin-bottom:0"><div class="lib-row">' +
                    '<div class="lib-cover tone-blue">' + DV.icon('book', 32) + '</div>' +
                    '<div class="lib-body">' +
                        '<h4 class="lib-title">Kingdom Principles</h4>' +
                        '<p class="lib-sub">Study Guide for New Believers</p>' +
                        '<div class="lib-btns">' +
                            '<button class="btn-sm btn-blue ripple" data-read="kingdom-principles">Read</button>' +
                            '<button class="btn-icon ripple" data-like="library" aria-label="Like">' + DV.icon('heart', 22) + '</button>' +
                        '</div>' +
                    '</div>' +
                '</div></div>' +

                '<div class="card" style="margin-bottom:0"><div class="lib-row">' +
                    '<div class="lib-cover" style="background:#dcfce7;color:#16a34a">' + DV.icon('cross', 32) + '</div>' +
                    '<div class="lib-body">' +
                        '<h4 class="lib-title">Discipleship Manual</h4>' +
                        '<p class="lib-sub">Comprehensive Training Material</p>' +
                        '<div class="lib-btns">' +
                            '<button class="btn-sm btn-green ripple" data-read="discipleship">Read</button>' +
                            '<button class="btn-icon ripple" data-like="library" aria-label="Like">' + DV.icon('heart', 22) + '</button>' +
                        '</div>' +
                    '</div>' +
                '</div></div>' +
            '</div>' +
        '</div>';

    var screen = DV.addScreen({ id: 'library', title: 'Library', html: html });

    DV.addMenu('left', { label: 'Library', icon: 'book', onClick: function () { DV.go('library'); } });
    DV.addQuickCard({ title: 'Library', sub: 'Study Resources', icon: 'book', tone: 'blue', onClick: function () { DV.go('library'); } });

    screen.addEventListener('click', function (e) {
        var readBtn = e.target.closest('[data-read]');
        var likeBtn = e.target.closest('[data-like]');
        if (readBtn) {
            DV.act(function () {
                DV.emit('read', readBtn.getAttribute('data-read'));
                DV.toast('Tracking your reading progress...');
            });
        } else if (likeBtn) {
            DV.act(function () {
                DV.emit('like', likeBtn.getAttribute('data-like'));
                DV.toast('Liked!');
            });
        }
    });
})();
