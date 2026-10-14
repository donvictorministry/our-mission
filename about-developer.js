/* ============================================================
   about-developer.js - About Developer modal (right sidebar)
   (independent module)

   TO USE YOUR REAL PHOTO: put its URL in CFG.PHOTO_URL below.
   The gear ring rotates. The photo itself never rotates.
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        PHOTO_URL: '',
        NAME: 'Developer Name',
        ROLE: 'Lead Developer',
        SUBTITLE: 'Building tools for the Kingdom.',
        BIO:
            'Write a short introduction about yourself here.\n' +
            'Each line break you type is kept exactly as written.\n\n' +
            'Share what you do, why you built this app, and the vision behind it.\n\n' +
            'Mention your ministry, your training, and the people you serve.\n\n' +
            'Add a closing line or a verse that describes your heart for this work.\n\n' +
            'Only the first seven lines are visible until the reader taps Show more.',
        GEAR_TEETH: 24,
        GEAR_COLOR: '#FBBF24'
    };

    var PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23d1d5db'/%3E%3Ccircle cx='80' cy='62' r='28' fill='%239ca3af'/%3E%3Cpath d='M24 160c0-34 25-52 56-52s56 18 56 52z' fill='%239ca3af'/%3E%3C/svg%3E";

    // Gear ring: 200 x 200 box, hole radius 82 so the 160px photo (radius 80) sits inside.
    function gearPath() {
        var cx = 100, cy = 100, rOut = 100, rRoot = 92, rHole = 82;
        var n = CFG.GEAR_TEETH, step = (Math.PI * 2) / n, d = '';
        function pt(r, a) { return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); }
        for (var i = 0; i < n; i++) {
            var a = i * step;
            d += (i === 0 ? 'M' : 'L') + pt(rRoot, a) +
                 'L' + pt(rOut, a + step * 0.12) +
                 'L' + pt(rOut, a + step * 0.38) +
                 'L' + pt(rRoot, a + step * 0.5);
        }
        d += 'Z';
        d += 'M' + (cx + rHole) + ' ' + cy +
             'A' + rHole + ' ' + rHole + ' 0 1 0 ' + (cx - rHole) + ' ' + cy +
             'A' + rHole + ' ' + rHole + ' 0 1 0 ' + (cx + rHole) + ' ' + cy + 'Z';
        return d;
    }

    DV.addModal({
        id: 'modal-about-dev',
        tone: 'blue',
        html:
            '<div class="dev-photo-wrap">' +
                '<svg class="dev-gear" viewBox="0 0 200 200" aria-hidden="true">' +
                    '<path d="' + gearPath() + '" fill="' + CFG.GEAR_COLOR + '" fill-rule="evenodd"/>' +
                '</svg>' +
                '<img id="dev-photo" class="dev-photo" width="160" height="160" alt="Developer photo" src="' + PLACEHOLDER + '">' +
            '</div>' +
            '<h2 class="dev-name">' + CFG.NAME + '</h2>' +
            '<p class="dev-role">' + CFG.ROLE + '</p>' +
            '<p class="dev-sub">' + CFG.SUBTITLE + '</p>' +
            '<div id="dev-bio" class="dev-bio"></div>' +
            '<button id="dev-more" class="dev-more hidden">Show more</button>'
    });

    var photo = document.getElementById('dev-photo');
    var bio = document.getElementById('dev-bio');
    var more = document.getElementById('dev-more');

    bio.textContent = CFG.BIO;

    if (CFG.PHOTO_URL) {
        photo.onerror = function () { photo.onerror = null; photo.src = PLACEHOLDER; };
        photo.src = CFG.PHOTO_URL;
    }

    more.addEventListener('click', function () {
        DV.act(function () {
            var open = bio.classList.toggle('open');
            more.textContent = open ? 'Show less' : 'Show more';
        });
    });

    function checkBio() {
        bio.classList.remove('open');
        more.textContent = 'Show more';
        more.classList.toggle('hidden', bio.scrollHeight <= bio.clientHeight + 1);
    }

    DV.addMenu('right', {
        label: 'About Developer',
        icon: 'info',
        onClick: function () {
            DV.openModal('modal-about-dev');
            checkBio();
        }
    });
})();
