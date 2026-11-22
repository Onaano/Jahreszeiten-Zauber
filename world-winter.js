/* WINTER – Die Schneemannfreunde kommen heraus */
(function (root) {
  'use strict';
  var JZ = root.JZ, A = JZ.art, OL = A.OL, OUT = A.OUT, f1 = A.f1, face = A.face, R = A.R;
  var PAL = ['#e45f6e', '#4f9ad6', '#f0b43c', '#6bbf8a', '#a77bd0', '#f08a5d', '#3fb5b0', '#e87ab0'];
  /* balls (2/3), Hut, Schal, Gesicht, Nase-Typ, Arme */
  var SPEC = [
    [3, 'top', 0, 'happy'], [2, 'beanie', 1, 'cheer'], [3, 'earm', 2, 'closed'], [3, 'none', 3, 'curious'], [2, 'top', 4, 'sly'],
    [3, 'beanie', 5, 'happy'], [2, 'earm', 6, 'sleepy'], [3, 'top', 7, 'cheer'], [3, 'beanie', 0, 'cat'], [2, 'none', 1, 'happy'],
    [3, 'earm', 2, 'curious'], [3, 'top', 3, 'closed'], [2, 'beanie', 4, 'happy'], [3, 'none', 5, 'sly'], [3, 'earm', 6, 'cheer'],
    [2, 'top', 7, 'sleepy'], [3, 'beanie', 0, 'curious'], [3, 'earm', 1, 'happy'], [2, 'none', 2, 'cat'], [3, 'top', 3, 'cheer']
  ];
  function ball(cx, cy, r, p) {
    return '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="#fbfdff"' + OL + '/>' +
      '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" fill="url(#' + p + 'shade)"/>' +
      '<ellipse cx="' + f1(cx - r * .35) + '" cy="' + f1(cy - r * .4) + '" rx="' + f1(r * .28) + '" ry="' + f1(r * .16) + '" fill="#fff" opacity=".8" transform="rotate(-30 ' + f1(cx - r * .35) + ' ' + f1(cy - r * .4) + ')"/>' +
      '<path d="M' + f1(cx - r * .85) + ' ' + f1(cy + r * .3) + ' Q' + f1(cx) + ' ' + f1(cy + r * 1.05) + ' ' + f1(cx + r * .85) + ' ' + f1(cy + r * .3) + '" fill="none" stroke="#bcd3ea" stroke-width="3" opacity=".55"/>';
  }
  function fig(i, p, rnd) {
    var sp = SPEC[i], n = sp[0], hat = sp[1], col = PAL[sp[2]], alt = PAL[(sp[2] + 3) % 8], fc = sp[3];
    var rb = 46, rm = 36, rh = 31, g = '', y;
    var by = -rb, my = -rb * 2 + 6 - (n === 3 ? 0 : 0), hy;
    var parts = [];
    g += ball(0, -rb, rb, p);
    var topY;
    if (n === 3) { my = -2 * rb + 8 - rm + 4; g += ball(0, my, rm, p); hy = my - rm + 8 - rh; } else { hy = -2 * rb + 10 - rh + 4; my = null; }
    if (n === 2) hy = -rb * 2 + 12 - rh + 6;
    var rr = n === 3 ? rh : rh + 3;
    var arms = '', ay = n === 3 ? my : hy + rr + 4;
    arms = '<g class="arm" stroke="#7a5532" stroke-width="5" stroke-linecap="round" fill="none"><path d="M-' + (n === 3 ? rm - 4 : rb - 8) + ' ' + f1(n === 3 ? my : -rb - 4) + ' q-22 -4 -34 -22 m10 11 q-6 -8 -4 -14"/><path d="M' + (n === 3 ? rm - 4 : rb - 8) + ' ' + f1(n === 3 ? my : -rb - 4) + ' q22 -4 34 -22 m-10 11 q6 -8 4 -14"/></g>';
    var head = ball(0, hy, rr, p);
    if (n === 3) { g = g.replace(/$/, ''); }
    var buttons = '<g fill="#5a4234">' + [-rb * .55, -rb * 1.0].map(function (yy) { return '<circle cx="0" cy="' + f1(yy) + '" r="3.6"/>'; }).join('') + '</g>';
    var scarf = '<path d="M' + f1(-rr * .78) + ' ' + f1(hy + rr * .72) + ' Q0 ' + f1(hy + rr * 1.15) + ' ' + f1(rr * .78) + ' ' + f1(hy + rr * .72) + ' L' + f1(rr * .72) + ' ' + f1(hy + rr * 1.0) + ' Q0 ' + f1(hy + rr * 1.5) + ' ' + f1(-rr * .72) + ' ' + f1(hy + rr * 1.0) + 'Z" fill="' + col + '"' + OL + '/>' +
      '<path d="M' + f1(rr * .25) + ' ' + f1(hy + rr * 1.2) + ' l' + f1(rr * .3) + ' ' + f1(rr * .75) + ' l' + f1(-rr * .42) + ' ' + f1(rr * .05) + ' l' + f1(rr * .02) + ' ' + f1(-rr * .6) + 'Z" fill="' + col + '"' + OL + '/>' +
      '<path d="M' + f1(-rr * .6) + ' ' + f1(hy + rr * .96) + ' q' + f1(rr * .4) + ' ' + f1(rr * .3) + ' ' + f1(rr * 1.2) + ' 0" stroke="' + alt + '" stroke-width="4" fill="none" opacity=".85"/>';
    var nose = '<path d="M0 ' + f1(hy + 2) + ' L' + f1(rr * .72) + ' ' + f1(hy + 7) + ' L0 ' + f1(hy + 11) + 'Z" fill="#f08a3c"' + OL.replace('2.4', '2') + '/>';
    var fcs = face(fc === 'cat' ? 'happy' : fc, 0, f1(hy - 2), f1(rr / 31 * .95), { cheek: '#ffb0b8', noMouth: false, noNose: true });
    var hatS = '';
    if (hat === 'top') hatS = '<g transform="translate(0 ' + f1(hy - rr + 6) + ')"><ellipse cx="0" cy="0" rx="' + f1(rr * .95) + '" ry="7" fill="#4a4a5c"' + OL + '/><path d="M' + f1(-rr * .6) + ' 0 L' + f1(-rr * .55) + ' -34 Q0 -40 ' + f1(rr * .55) + ' -34 L' + f1(rr * .6) + ' 0Z" fill="#555a6e"' + OL + '/><rect x="' + f1(-rr * .6) + '" y="-12" width="' + f1(rr * 1.2) + '" height="9" fill="' + alt + '"' + OL.replace('2.4', '2') + '/></g>';
    else if (hat === 'beanie') hatS = '<g transform="translate(0 ' + f1(hy - rr * .55) + ')"><path d="M' + f1(-rr * .98) + ' 4 C' + f1(-rr * .98) + ' -36 ' + f1(rr * .98) + ' -36 ' + f1(rr * .98) + ' 4Z" fill="' + alt + '"' + OL + '/><rect x="' + f1(-rr * 1.04) + '" y="-3" width="' + f1(rr * 2.08) + '" height="13" rx="6" fill="' + col + '"' + OL + '/><circle cx="0" cy="-34" r="9" fill="#fff"' + OL.replace('2.4', '2') + '/><path d="M' + f1(-rr * .4) + ' -20 l4 18 M0 -26 l0 24 M' + f1(rr * .4) + ' -20 l-4 18" stroke="#fff" stroke-opacity=".45" stroke-width="3"/></g>';
    else if (hat === 'earm') hatS = '<g transform="translate(0 ' + f1(hy - rr * .1) + ')"><path d="M' + f1(-rr * 1.1) + ' 0 C' + f1(-rr * 1.1) + ' -' + f1(rr * 1.5) + ' ' + f1(rr * 1.1) + ' -' + f1(rr * 1.5) + ' ' + f1(rr * 1.1) + ' 0" fill="none" stroke="#5a4234" stroke-width="5"/><circle cx="' + f1(-rr * 1.08) + '" cy="4" r="' + f1(rr * .36) + '" fill="' + alt + '"' + OL + '/><circle cx="' + f1(rr * 1.08) + '" cy="4" r="' + f1(rr * .36) + '" fill="' + alt + '"' + OL + '/></g>';
    var cheekTw = '';
    var snowfeet = '';
    var inner = '<g class="sm">' + arms + g + buttons + head + nose + fcs + scarf + hatS + '</g>';
    /* Teile für den Roll-Auftritt: Unterteil wird zuerst sichtbar */
    var shadow = '<ellipse cx="0" cy="4" rx="' + f1(rb * 1.25) + '" ry="11" fill="url(#' + p + 'gsh)"/>';
    var mound = '<path d="M' + f1(-rb * 1.2) + ' 8 C' + f1(-rb * .9) + ' -8 ' + f1(-rb * .4) + ' -12 0 -11 C' + f1(rb * .4) + ' -12 ' + f1(rb * .9) + ' -8 ' + f1(rb * 1.2) + ' 8 C' + f1(rb * .5) + ' 14 ' + f1(-rb * .5) + ' 14 ' + f1(-rb * 1.2) + ' 8Z" fill="#f4f9ff"' + OL + '/><path d="M' + f1(-rb * .7) + ' 0 q' + f1(rb * .3) + ' -6 ' + f1(rb * .6) + ' -2" stroke="#c8dcf0" stroke-width="3" fill="none"/>';
    return { pre: shadow, fx: inner, cls: 'sn', front: '<g class="mnd">' + mound + '</g>' };
  }
  function fir(x, y, s, snow) {
    var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-8" y="-20" width="16" height="30" fill="#7a5a3e"/>';
    [[0, 150, 78, '#4f8f78'], [-60, 110, 62, '#5da084'], [-118, 74, 48, '#6bb092']].forEach(function (t, k) {
      var w = t[2], yy = t[0];
      g += '<path d="M' + (-w) + ' ' + (yy - 10) + ' L0 ' + (yy - 78) + ' L' + w + ' ' + (yy - 10) + ' Q0 ' + (yy + 6) + ' ' + (-w) + ' ' + (yy - 10) + 'Z" fill="' + t[3] + '"/>';
      g += '<path d="M' + (-w * .66) + ' ' + (yy - 40) + ' L0 ' + (yy - 78) + ' L' + (w * .66) + ' ' + (yy - 40) + ' Q' + (w * .3) + ' ' + (yy - 30) + ' 0 ' + (yy - 42) + ' Q' + (-w * .3) + ' ' + (yy - 30) + ' ' + (-w * .66) + ' ' + (yy - 40) + 'Z" fill="#f6faff"/>';
    });
    return g + '</g>';
  }
  JZ.defWorld({
    key: 'winter', name: 'Winter', short: 'Schneewelt', seed: 83, sky: '#cfe3f5',
    alt: 'Verschneite Landschaft mit Schneemännern', title: 'Die Schneemannfreunde kommen heraus', idle: 'Die Schneemannfreunde ruhen', quiet: 'Die Schneemannfreunde warten noch',
    rows: [{ y: 600, s: .72, n: 7, x0: 160, x1: 1440 }, { y: 712, s: .98, n: 7, x0: 150, x1: 1450 }, { y: 848, s: 1.26, n: 6, x0: 220, x1: 1380 }],
    defs: function (p) {
      return '<linearGradient id="' + p + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c9ea"/><stop offset=".6" stop-color="#d4e6f6"/><stop offset="1" stop-color="#eef6fd"/></linearGradient>' +
        '<linearGradient id="' + p + 'gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7fbff"/><stop offset=".6" stop-color="#e3eefa"/><stop offset="1" stop-color="#cfe0f2"/></linearGradient>' +
        '<radialGradient id="' + p + 'moon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe8" stop-opacity=".9"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></radialGradient>';
    },
    bg: function (p) {
      var rnd = R(3), g = '<rect width="1600" height="900" fill="url(#' + p + 'sky)"/>';
      g += '<circle cx="1230" cy="170" r="280" fill="url(#' + p + 'moon)"/><circle cx="1230" cy="170" r="52" fill="#fffbe6"/><circle cx="1214" cy="160" r="52" fill="#d9e8f6" opacity=".0"/>';
      for (var i = 0; i < 26; i++) g += '<circle cx="' + f1(rnd() * 1600) + '" cy="' + f1(rnd() * 330) + '" r="' + f1(1.2 + rnd() * 1.6) + '" fill="#fff" opacity="' + f1(.5 + rnd() * .4) + '"/>';
      g += '<path d="M-60 470 C160 380 330 400 520 450 C700 498 860 380 1080 392 C1280 404 1440 380 1660 450 L1660 620 L-60 620Z" fill="#c4d9ee"/><path d="M-60 470 C160 380 330 400 520 450 C700 498 860 380 1080 392 C1280 404 1440 380 1660 450" fill="none" stroke="#fff" stroke-width="6" opacity=".8"/>';
      g += fir(300, 520, .52) + fir(380, 530, .4) + fir(1010, 510, .55) + fir(1090, 520, .42) + fir(1330, 512, .5);
      /* Hütte */
      g += '<g transform="translate(1180 560)"><rect x="-70" y="-70" width="140" height="74" fill="#c58a5a"' + OL + '/><path d="M-90 -66 L0 -130 L90 -66Z" fill="#7e5a45"' + OL + '/><path d="M-84 -68 L0 -122 L84 -68 Q40 -80 0 -94 Q-40 -80 -84 -68Z" fill="#f6faff"/><rect x="-14" y="-36" width="28" height="40" rx="4" fill="#6c4a33"' + OL.replace('2.4', '2') + '/><rect x="30" y="-52" width="30" height="26" rx="3" fill="#ffe29a"' + OL.replace('2.4', '2') + '/><rect x="38" y="-120" width="18" height="34" fill="#a56d52"' + OL.replace('2.4', '2') + '/><rect x="35" y="-126" width="24" height="9" rx="4" fill="#f6faff"/></g>';
      g += '<path d="M-60 596 C260 556 520 590 800 592 C1080 594 1340 556 1660 590 L1660 900 L-60 900Z" fill="url(#' + p + 'gr)"/>';
      for (i = 0; i < 40; i++) { var x = (i * 173 + 31) % 1600, y = 610 + (i * 71) % 280; g += '<path d="M' + x + ' ' + y + ' q10 -7 22 0" stroke="#b9d0e8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>'; }
      /* Rahmen-Tannen */
      g += fir(70, 740, 1.5) + fir(1540, 730, 1.45);
      /* Schneewehen unten */
      g += '<path d="M-20 900 L-20 850 Q200 820 380 868 L400 900Z" fill="#fff"' + OL.replace('2.4', '2') + '/><path d="M1200 900 Q1300 846 1460 860 Q1560 868 1640 850 L1640 900Z" fill="#fff"' + OL.replace('2.4', '2') + '/>';
      return g;
    },
    ambient: function (p) {
      var g = '', rnd = R(21);
      for (var i = 0; i < 42; i++) {
        var lv = i < 14 ? 1 : (i < 28 ? 2 : 3);
        g += '<circle class="snowf lv' + lv + '" cx="0" cy="0" r="' + f1(2 + rnd() * 3) + '" fill="#fff" style="--x:' + f1(rnd() * 1600) + 'px;--d:' + f1(rnd() * 20) + 's;--t:' + f1(14 + rnd() * 14) + 's;--w:' + f1(10 + rnd() * 30) + 'px"/>';
      }
      return g;
    },
    fg: function () { return ''; },
    fig: fig
  });
})(window);
