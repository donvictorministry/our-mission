/* ============================================================
   partner.js - Partner footer button + modal (independent module)
   ============================================================ */
(function () {
    'use strict';
    if (!window.DV) return;

    var CFG = {
        BANK_NAME: 'ZENITH BANK',
        ACCOUNT_NUMBER: '1010101010',
        ACCOUNT_NAME: 'Kingdom Discipleship Series'
    };

    var contact = DV.contactBar ? DV.contactBar() : '';

    DV.addModal({
        id: 'kingdom-modal-partner',
        tone: 'green',
        html:
            '<div class="dlg-head">' +
                '<p class="dlg-kicker c-green">Kingdom Financier</p>' +
                '<h2 class="dlg-title">Fuel The<br>Mission</h2>' +
            '</div>' +
            '<p class="dlg-text">The Gospel is free, but the logistics of global evangelism require resources. God is raising financial pillars to stand with this commission.<br><br>' +
                '<span class="dlg-ref">"And how shall they preach, except they be sent?" (Romans 10:15)</span></p>' +
            '<div class="bank-wrap">' +
                '<button id="btn-reveal-bank" class="reveal-btn ripple">' + DV.icon('lock', 22) + '<span>Reveal Account Details</span></button>' +
                '<div id="bank-details-box" class="bank-box hidden">' +
                    '<p class="bank-label">Bank Name</p>' +
                    '<p class="bank-name">' + CFG.BANK_NAME + '</p>' +
                    '<p class="bank-label">Account Number</p>' +
                    '<div class="bank-acc-row">' +
                        '<span id="account-number" class="bank-acc">' + CFG.ACCOUNT_NUMBER + '</span>' +
                        '<button id="btn-copy-acc" class="copy-btn ripple" aria-label="Copy account number">' + DV.icon('copy', 24) + '</button>' +
                    '</div>' +
                    '<p class="bank-label">Account Name</p>' +
                    '<p class="bank-holder">' + CFG.ACCOUNT_NAME + '</p>' +
                    '<div id="copy-feedback" class="copy-feedback hidden">Copied!</div>' +
                '</div>' +
            '</div>' +
            contact
    });

    DV.addFooterButton({
        label: 'Partner',
        icon: 'payments',
        tone: 'green',
        onClick: function () { DV.openModal('kingdom-modal-partner'); }
    });

    document.getElementById('btn-reveal-bank').addEventListener('click', function () {
        DV.act(function () {
            var box = document.getElementById('bank-details-box');
            var btn = document.getElementById('btn-reveal-bank');
            if (box.classList.contains('hidden')) {
                box.classList.remove('hidden');
                btn.innerHTML = DV.icon('eye_off', 22) + '<span>Hide Details</span>';
            } else {
                box.classList.add('hidden');
                btn.innerHTML = DV.icon('lock', 22) + '<span>Reveal Account Details</span>';
            }
        });
    });

    document.getElementById('btn-copy-acc').addEventListener('click', function () {
        DV.act(function () {
            var accNum = document.getElementById('account-number').innerText;
            return navigator.clipboard.writeText(accNum).then(function () {
                var feedback = document.getElementById('copy-feedback');
                feedback.classList.remove('hidden');
                setTimeout(function () { feedback.classList.add('hidden'); }, 2000);
            }).catch(function () {
                DV.toast('Copy failed. Please copy the number manually.');
            });
        });
    });
})();
