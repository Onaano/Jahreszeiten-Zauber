/* HERBST – Die Kürbisfreunde erwachen */
(function (root) {
  'use strict';
  var JZ = root.JZ, A = JZ.art, OL = A.OL, OUT = A.OUT, f1 = A.f1, face = A.face, R = A.R;
  var COL = [['#f9ad47', '#e47f1f', '#c9651a'], ['#f39033', '#d36d1b', '#b4551a'], ['#f8c552', '#e0a028', '#c4841e'], ['#ec7647', '#c9502b', '#a43f22'],
    ['#f9ebc9', '#e3c995', '#c5a46c'], ['#a9cf72', '#78a24a', '#5c8638'], ['#adc0cc', '#7f9bae', '#617f94']];
  var LEAFC = ['#e8a43a', '#d9692b', '#c4452e', '#f2c45a', '#a8742f', '#cf8230'];
  /* Form, Farbe, Breite(Halb), Höhe, Gesicht, Zubehör, Auftritt */
  var SPEC = [
    ['round', 0, 58, 98, 'happy', null, 'peek'], ['tall', 1, 46, 112, 'closed', 'leaf', 'roll'], ['flat', 2, 66, 72, 'cheer', null, 'peek'], ['gourd', 0, 56, 124, 'curious', null, 'roll'], ['hokk', 3, 50, 86, 'cat', 'leaf', 'peek'],
    ['round', 4, 54, 92, 'sleepy', null, 'roll'], ['tall', 0, 44, 104, 'sly', null, 'peek'], ['flat', 6, 64, 70, 'happy', 'leaf', 'roll'], ['round', 5, 52, 90, 'closed', null, 'peek'], ['hokk', 2, 54, 92, 'cheer', null, 'roll'],
    ['gourd', 3, 50, 118, 'happy', 'leaf', 'peek'], ['tall', 4, 48, 110, 'cat', null, 'roll'], ['round', 1, 62, 104, 'sly', null, 'peek'], ['flat', 0, 68, 74, 'sleepy', 'leaf', 'roll'], ['hokk', 6, 52, 90, 'curious', null, 'peek'],
    ['round', 2, 56, 96, 'happy', null, 'roll'], ['tall', 3, 46, 108, 'cheer', 'leaf', 'peek'], ['gourd', 5, 52, 120, 'closed', null, 'roll'], ['flat', 1, 64, 70, 'cat', null, 'peek'], ['round', 6, 54, 94, 'curious', 'leaf', 'roll']
  ];
  function leafShape(w, fill, rot, x, y) {
    return '<g transform="translate(' + f1(x) + ' ' + f1(y) + ') rotate(' + f1(rot) + ') scale(' + f1(w) + ')"><path d="M0 0 C6 -9 17 -10 22 0 C17 10 6 9 0 0Z" fill="' + fill + '" stroke="' + OUT + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 0 L19 0" stroke="#fff" stroke-opacity=".4" stroke-width="1.2" fill="none"/></g>';
  }
  function maple(fill, big) {
    var s = big || 1;
    return '<g transform="scale(' + s + ')"><path d="M0 8 L0 -4 M0 -2 L-14 -10 L-10 -2 L-20 0 L-10 4 L-14 12 L-4 8 L0 20 L4 8 L14 12 L10 4 L20 0 L10 -2 L14 -10 Z" transform="translate(0 -4)" fill="' + fill + '"' + OL.replace('2.4', '2') + '/><path d="M0 14 L0 -6" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none"/></g>';
  }
  function body(form, c, Wd, Hh, p, rnd) {
    var g = '', lobes = form === 'hokk' ? 3 : (form === 'flat' ? 6 : 5), k, ord = [];
    function lobe(kk, front, dark) {
      var half = Math.floor(lobes / 2), cx = (kk - (lobes - 1) / 2) * (Wd * 2 / (lobes + .6)), rx = Wd * 2 / lobes * (form === 'hokk' ? .95 : .78) * (1 + (kk === (lobes - 1) / 2 ? .18 : 0)), cy = -Hh * .5, ry = Hh * .5;
      if (form === 'tall') rx *= .9;
      var fill = form === 'tall' && kk % 2 ? c[1] : (dark ? c[1] : c[0]);
      var e = '<ellipse cx="' + f1(cx) + '" cy="' + f1(cy) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="' + fill + '"' + OL + '/>';
      e += '<ellipse cx="' + f1(cx) + '" cy="' + f1(cy) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="url(#' + p + 'shade)"/>';
      if (form === 'hokk') e += '<path d="M' + f1(cx - rx * .3) + ' ' + f1(cy - ry * .8) + ' Q' + f1(cx - rx * .6) + ' ' + f1(cy) + ' ' + f1(cx - rx * .3) + ' ' + f1(cy + ry * .8) + '" fill="none" stroke="' + c[2] + '" stroke-width="2" opacity=".35"/>';
      return e;
    }
    var mid = (lobes - 1) / 2;
    for (k = 0; k < lobes; k++) ord.push(k);
    ord.sort(function (a, b) { return Math.abs(b - mid) - Math.abs(a - mid); });
    ord.forEach(function (kk) { g += lobe(kk, false, Math.abs(kk - mid) > .6); });
    if (form === 'gourd') {
      g = '<g>' + g + '</g>';
    }
    return g;
  }
  function stemAndTendril(Hh, rnd, tone) {
    var y = -Hh, d = rnd() < .5 ? 1 : -1;
    return '<path d="M' + f1(-7 * d) + ' ' + f1(y + 6) + ' C' + f1(-10 * d) + ' ' + f1(y - 12) + ' ' + f1(-3 * d) + ' ' + f1(y - 24) + ' ' + f1(8 * d) + ' ' + f1(y - 28) + ' L' + f1(14 * d) + ' ' + f1(y - 20) + ' C' + f1(5 * d) + ' ' + f1(y - 14) + ' ' + f1(6 * d) + ' ' + f1(y - 8) + ' ' + f1(8 * d) + ' ' + f1(y + 6) + 'Z" fill="#8a6440"' + OL + '/>' +
      '<path d="M' + f1(12 * d) + ' ' + f1(y - 2) + ' q' + f1(24 * d) + ' -10 ' + f1(24 * d) + ' 8 q' + f1(1 * d) + ' 14 ' + f1(-12 * d) + ' 8 q' + f1(-6 * d) + ' -6 ' + f1(-1 * d) + ' -11" fill="none" stroke="#5f9a42" stroke-width="3.4" stroke-linecap="round"/>' +
      '<g transform="translate(' + f1(-6 * d) + ' ' + f1(y + 2) + ') scale(' + f1(-d) + ' 1) rotate(-18)"><path d="M0 0 C14 -20 40 -20 52 -6 C40 8 14 12 0 0Z" fill="#69b04c"' + OL + '/><path d="M4 -2 Q28 -8 46 -6" stroke="#3f7f3a" stroke-width="1.6" fill="none" opacity=".6"/></g>';
  }
  function pile(wd, rnd, tall) {
    var g = "", n = 16, leaves = [];
    for (var i = 0; i < n; i++) { var a = Math.PI * (.05 + rnd() * .9), r = Math.sqrt(rnd()); leaves.push({ x: -Math.cos(a) * r * wd, y: 6 - Math.sin(a) * r * tall + rnd() * 6, rot: rnd() * 360, w: .8 + rnd() * .6, c: LEAFC[(rnd() * LEAFC.length) | 0] }); }
    leaves.sort(function (a, b) { return a.y - b.y; });
    leaves.forEach(function (l) { g += leafShape(l.w, l.c, l.rot, l.x, l.y); });
    return '<ellipse cx="0" cy="6" rx="' + f1(wd * 1.05) + '" ry="12" fill="#a36a2c" opacity=".55"/>' + g;
  }
  function fig(i, p, rnd) {
    var sp = SPEC[i], form = sp[0], c = COL[sp[1]], Wd = sp[2], Hh = sp[3], fc = sp[4], acc = sp[5], app = sp[6];
    var g, faceY, fs = Math.min(1.5, Wd / 40);
    var bodyH = Hh;
    if (form === 'gourd') {
      var h1 = Hh * .62, w1 = Wd, h2 = Hh * .42, w2 = Wd * .62;
      g = '<g transform="translate(0 ' + f1(-h1 * .62) + ')">' + body('round', c, w2, h2, p, rnd) + '</g>' + body('round', c, w1, h1, p, rnd);
      bodyH = Hh; faceY = -h1 * .5;
      g += stemAndTendril(h1 * .62 + h2 * 1.0, rnd);
    } else {
      g = body(form, c, Wd, Hh, p, rnd) + stemAndTendril(Hh, rnd);
      faceY = -Hh * .5;
    }
    var fcs = face(fc, 0, f1(faceY), f1(fs * (form === 'flat' ? .9 : 1)), { cheek: '#ff8a6a' });
    var hat = '';
    if (acc === 'leaf') hat = '<g transform="translate(' + f1((rnd() - .5) * Wd * .5) + ' ' + f1(-Hh * (form === 'gourd' ? .98 : .94)) + ') rotate(' + f1(-30 + rnd() * 60) + ')">' + maple(LEAFC[(i * 2) % 6], 1.15) + '</g>';
    var shadow = '<ellipse cx="0" cy="4" rx="' + f1(Wd * 1.05) + '" ry="10" fill="url(#' + p + 'gsh)"/>';
    var inner = '<g class="wob" style="animation-delay:' + f1(rnd() * 4) + 's;--d0:' + (i % 2 ? 1 : -1) + '">' + g + fcs + hat + '</g>';
    var tall = Math.min(Hh * .16, 18);
    return { pre: shadow, fx: inner, cls: 'pk pk-' + app, front: '<g class="pile">' + pile(Wd * .95, rnd, tall) + '</g>', };
  }
  JZ.defWorld({
    key: 'herbst', name: 'Herbst', short: 'Kürbiswald', seed: 47, sky: '#f9d9a8',
    alt: 'Herbstwald mit Kürbissen', title: 'Die Kürbisfreunde erwachen', idle: 'Die Kürbisfreunde ruhen', quiet: 'Die Kürbisfreunde schlafen noch',
    rows: [{ y: 590, s: .74, n: 7, x0: 160, x1: 1440 }, { y: 706, s: 1.0, n: 7, x0: 160, x1: 1440 }, { y: 842, s: 1.28, n: 6, x0: 210, x1: 1390 }],
    defs: function (p) {
      return '<linearGradient id="' + p + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6cf9c"/><stop offset=".55" stop-color="#fbe5be"/><stop offset="1" stop-color="#fff2d6"/></linearGradient>' +
        '<linearGradient id="' + p + 'gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6a05a"/><stop offset=".5" stop-color="#a98245"/><stop offset="1" stop-color="#876733"/></linearGradient>' +
        '<radialGradient id="' + p + 'sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c8" stop-opacity=".95"/><stop offset=".4" stop-color="#ffe2a8" stop-opacity=".45"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>' +
        '<pattern id="' + p + 'tx" width="48" height="32" patternUnits="userSpaceOnUse"><path d="M6 8 q3 -6 6 0 M28 20 q3 -6 6 0 M36 5 q2 -4 4 0 M14 24 q2 -4 4 0" fill="none" stroke="#5a3a18" stroke-width="1.6" stroke-linecap="round" opacity=".25"/></pattern>';
    },
    bg: function (p) {
      var rnd = R(5), g = '<rect width="1600" height="900" fill="url(#' + p + 'sky)"/>';
      g += '<circle cx="1180" cy="190" r="380" fill="url(#' + p + 'sun)"/><circle cx="1180" cy="190" r="58" fill="#fff0c4" opacity=".9"/>';
      /* ferne Hügel mit Herbstbäumen */
      var cols = ['#e5a864', '#d98b4c', '#e8bd6a', '#cf7a45', '#dba558'];
      g += '<path d="M-60 470 C160 420 340 430 540 462 C740 494 920 420 1120 432 C1320 444 1480 420 1660 462 L1660 600 L-60 600Z" fill="#e3b377" opacity=".85"/>';
      for (var i = 0; i < 26; i++) { var x = 20 + i * 64 + rnd() * 20; g += '<circle cx="' + f1(x) + '" cy="' + f1(446 + Math.sin(i * .8) * 22 + rnd() * 14) + '" r="' + f1(20 + rnd() * 16) + '" fill="' + cols[i % 5] + '" opacity=".8"/>'; }
      g += '<path d="M-60 520 C200 470 440 488 680 520 C920 552 1160 470 1400 490 C1520 500 1600 490 1660 500 L1660 640 L-60 640Z" fill="#d1a266"/>';
      for (i = 0; i < 20; i++) { var x2 = 40 + i * 80 + rnd() * 30, h = 70 + rnd() * 50; g += '<g transform="translate(' + f1(x2) + ' ' + f1(528 + Math.sin(i) * 12) + ')"><rect x="-5" y="-' + f1(h * .6) + '" width="10" height="' + f1(h * .6) + '" rx="4" fill="#8a6542"/><ellipse cx="0" cy="-' + f1(h * .8) + '" rx="' + f1(26 + rnd() * 8) + '" ry="' + f1(h * .42) + '" fill="' + cols[(i * 3) % 5] + '"/><ellipse cx="' + f1(-8) + '" cy="-' + f1(h * .92) + '" rx="12" ry="' + f1(h * .22) + '" fill="#fff" opacity=".18"/></g>'; }
      g += '<path d="M-60 586 C240 546 520 574 800 580 C1080 586 1360 546 1660 574 L1660 900 L-60 900Z" fill="url(#' + p + 'gr)"/><path d="M-60 586 C240 546 520 574 800 580 C1080 586 1360 546 1660 574 L1660 900 L-60 900Z" fill="url(#' + p + 'tx)"/>';
      /* große Rahmen-Bäume */
      [[96, 640, 1.2, false], [1514, 636, 1.15, true]].forEach(function (t) {
        g += '<g transform="translate(' + t[0] + ' ' + t[1] + ') scale(' + t[2] + ')"><path d="M-30 0 C-22 -100 -14 -220 -26 -330 L26 -330 C16 -220 22 -100 32 0Z" fill="#7f5a3a"' + OL + '/><path d="M-12 -40 C-10 -120 -6 -220 -12 -310" stroke="#a37a52" stroke-width="7" fill="none" opacity=".6" stroke-linecap="round"/>' +
          '<g>' + [[-96, -390, 92, '#e29a3c'], [20, -450, 110, '#d9692b'], [108, -380, 86, '#e8b24a'], [-34, -360, 96, '#c9502b'], [70, -330, 70, '#f0c25a'], [-120, -320, 62, '#d98b3c'], [-8, -500, 66, '#e8b24a']].map(function (b) { return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + b[3] + '"/>'; }).join('') + '</g></g>';
      });
      /* Waldboden: Blätter, Pilze, Baumstamm, Eicheln */
      for (i = 0; i < 90; i++) { var lx = (i * 211 + 17) % 1600, ly = 600 + (i * 67) % 290; g += leafShape(.7 + (i % 3) * .2, LEAFC[i % 6], (i * 47) % 360, lx, ly).replace('stroke-width="1.5"', 'stroke-width="1.2" opacity=".85"'); }
      function mush(x, y, s, cap, dots) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-8 0 C-9 -14 -7 -22 -6 -26 L6 -26 C7 -22 9 -14 8 0Z" fill="#f6ecd6"' + OL.replace('2.4', '2') + '/><path d="M-30 -24 C-30 -52 30 -52 30 -24 C20 -18 -20 -18 -30 -24Z" fill="' + cap + '"' + OL.replace('2.4', '2') + '/>' + (dots ? '<g fill="#fff" opacity=".9"><circle cx="-14" cy="-36" r="4"/><circle cx="4" cy="-42" r="4.5"/><circle cx="16" cy="-33" r="3.4"/></g>' : '') + '</g>'; }
      g += mush(70, 832, 1.1, '#d9533d', true) + mush(120, 858, .75, '#e8a24a', false) + mush(1540, 842, 1.0, '#d9533d', true) + mush(1480, 868, .7, '#b98550', false) + mush(790, 884, .6, '#e8a24a', false);
      g += '<g transform="translate(1350 604)"><rect x="-70" y="-26" width="140" height="40" rx="16" fill="#8d6642"' + OL + '/><ellipse cx="70" cy="-6" rx="12" ry="20" fill="#d7b07c"' + OL + '/><ellipse cx="70" cy="-6" rx="6" ry="12" fill="none" stroke="#a37a52" stroke-width="2"/></g>';
      return g;
    },
    ambient: function (p) {
      var g = '', rnd = R(9);
      for (var i = 0; i < 10; i++) {
        var x = 80 + rnd() * 1440, lv = i < 4 ? 1 : (i < 7 ? 2 : 3);
        g += '<g class="leaf-fall lv' + lv + '" style="--x:' + f1(x) + 'px;--d:' + f1(rnd() * 14) + 's;--t:' + f1(26 + rnd() * 14) + 's;--s:' + f1(.7 + rnd() * .5) + '"><g class="lf-in"><g transform="translate(0 0) rotate(' + f1(rnd() * 360) + ') scale(.9)">' + leafShape(1, LEAFC[i % 6], 0, -10, 0) + '</g></g></g>';
      }
      return g;
    },
    fg: function (p) {
      var g = '';
      [[26, 904], [1580, 906], [560, 908]].forEach(function (t, k) { g += '<g transform="translate(' + t[0] + ' ' + t[1] + ') scale(1.3)">' + [-24, -10, 4, 18, 30].map(function (x, j) { return '<path d="M' + x + ' 0 Q' + (x + (j % 2 ? 8 : -8)) + ' -34 ' + (x + (j % 2 ? 14 : -12)) + ' -' + (40 + (j % 3) * 12) + ' Q' + (x + 6) + ' -26 ' + (x + 12) + ' 0Z" fill="' + (j % 2 ? '#a78a42' : '#8c7a3a') + '"/>'; }).join('') + '</g>'; });
      return g;
    },
    fig: fig
  });
})(window);
