/* FRÜHLING – Die Blumenwiese erwacht */
(function (root) {
  'use strict';
  var JZ = root.JZ, A = JZ.art, OL = A.OL, OUT = A.OUT, f1 = A.f1, face = A.face, cloud = A.cloud;

  /* Paletten: [Blütenblatt, Blütenblatt dunkel, Mitte] */
  var PAL = [
    ['#f9b5cd', '#ea7fa6', '#ffd95e'], ['#d3c0f4', '#a68bdc', '#ffe58a'], ['#ffc8a2', '#f29a6c', '#ffe27a'], ['#fff6d2', '#f2cf63', '#f6a53f'],
    ['#ff9f93', '#e8675f', '#ffd86b'], ['#b4daf7', '#78aee6', '#ffe38a'], ['#ffffff', '#e8dfcb', '#ffcf4a'], ['#f7a1d8', '#d56bb9', '#fff0a0'],
    ['#ffd36e', '#f1a93a', '#8a5a3a'], ['#c5e8b5', '#8cc873', '#ffe48a']
  ];
  /* 20 Figuren: Typ, Palette, Gesicht (null = ohne Gesicht), Höhe */
  var SPEC = [
    ['daisy', 6, 'happy', 150], ['tulip', 0, 'closed', 150], ['fantasy', 1, null, 190], ['bloom', 2, 'cheer', 150], ['daisy', 3, null, 120],
    ['tulip', 4, 'happy', 165], ['fantasy', 5, 'curious', 175], ['bloom', 7, null, 135], ['daisy', 0, 'cat', 140], ['tulip', 2, null, 130],
    ['fantasy', 7, 'closed', 195], ['bloom', 1, 'happy', 160], ['daisy', 5, null, 165], ['tulip', 6, 'sly', 150], ['fantasy', 8, 'cheer', 170],
    ['bloom', 4, 'sleepy', 130], ['daisy', 9, 'happy', 125], ['tulip', 1, null, 175], ['fantasy', 3, 'closed', 160], ['bloom', 0, 'curious', 175]
  ];

  function petal(rx, ry, cy, rot, fill, extra) {
    return '<ellipse cx="0" cy="' + f1(cy) + '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' + OL.replace('2.4', '2') + ' transform="rotate(' + f1(rot) + ')"' + (extra || '') + '/>';
  }
  function disc(r, fill, p, fc) {
    return '<circle r="' + r + '" fill="' + fill + '"' + OL + '/><circle r="' + r + '" fill="url(#' + p + 'shade)"/><ellipse cx="' + f1(-r * .3) + '" cy="' + f1(-r * .38) + '" rx="' + f1(r * .3) + '" ry="' + f1(r * .17) + '" fill="#fff" opacity=".55" transform="rotate(-25 ' + f1(-r * .3) + ' ' + f1(-r * .38) + ')"/>';
  }
  function head(type, pal, fc, p, rn) {
    var c = pal[0], d = pal[1], m = pal[2], g = '', i, n, r;
    if (type === 'daisy') {
      n = 13; r = 50;
      for (i = 0; i < n; i++) g += petal(10.5, 24, -r * .66, i * 360 / n + 14, d, '');
      for (i = 0; i < n; i++) g += petal(10.5, 24, -r * .66, i * 360 / n, c);
      g += '<g>' + disc(24, m, p) + (fc ? face(fc, 0, 1, .66) : '<g fill="#e0a233" opacity=".6"><circle cx="-6" cy="-4" r="2"/><circle cx="5" cy="-6" r="2"/><circle cx="1" cy="4" r="2"/><circle cx="-8" cy="6" r="1.7"/><circle cx="9" cy="3" r="1.7"/></g>') + '</g>';
    } else if (type === 'tulip') {
      g += '<path d="M-3 20 C-44 18 -48 -28 -33 -70 C-14 -54 -3 -28 -3 20Z" fill="' + d + '"' + OL + '/>' +
        '<path d="M3 20 C44 18 48 -28 33 -70 C14 -54 3 -28 3 20Z" fill="' + d + '"' + OL + '/>' +
        '<path d="M-34 4 C-38 -30 -22 -58 0 -80 C22 -58 38 -30 34 4 C27 26 -27 26 -34 4Z" fill="' + c + '"' + OL + '/>' +
        '<path d="M-34 4 C-38 -30 -22 -58 0 -80 C22 -58 38 -30 34 4 C27 26 -27 26 -34 4Z" fill="url(#' + p + 'shade)"/>' +
        '<path d="M-20 -44 Q-12 -56 -4 -62" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/>' +
        '<path d="M0 -78 Q-4 -50 0 -26" fill="none" stroke="' + d + '" stroke-width="2" opacity=".5"/>' +
        (fc ? face(fc, 0, -14, .95) : '<path d="M-8 -22 Q0 -34 8 -22" fill="none" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>');
      return '<g transform="translate(0 -22)">' + g + '</g>';
    } else if (type === 'fantasy') {
      n = 6;
      for (i = 0; i < n; i++) g += '<circle cx="0" cy="-36" r="26" fill="' + (i % 2 ? c : d) + '"' + OL + ' transform="rotate(' + (i * 60) + ')"/>';
      for (i = 0; i < n; i++) g += '<circle cx="0" cy="-23" r="15" fill="' + (i % 2 ? d : '#fff') + '" opacity=".5" transform="rotate(' + (i * 60 + 30) + ')"/>';
      g += disc(25, m, p) + (fc ? face(fc, 0, 1, .74) : '<path d="M0 -14 L4 -4 14 -3 6 4 8 14 0 8 -8 14 -6 4 -14 -3 -4 -4Z" fill="#fff" opacity=".85"' + OL.replace('2.4', '1.6') + '/>');
      for (i = 0; i < 6; i++) g += '<circle cx="' + f1(Math.cos(i * 1.05) * 38) + '" cy="' + f1(Math.sin(i * 1.05) * 38) + '" r="2.6" fill="#fff" opacity=".8"/>';
    } else { // bloom
      for (i = 0; i < 12; i++) g += petal(11, 27, -38, i * 30, d);
      for (i = 0; i < 10; i++) g += petal(11.5, 24, -30, i * 36 + 18, c);
      for (i = 0; i < 8; i++) g += petal(9, 17, -19, i * 45, '#fff', ' opacity=".72"');
      g += disc(19, m, p) + (fc ? face(fc, 0, 1, .56) : '<g fill="#fff" opacity=".6"><circle cx="-5" cy="-3" r="2"/><circle cx="5" cy="-3" r="2"/><circle cx="0" cy="5" r="2"/></g>');
    }
    return g;
  }
  function leaf(side, y, k, fill) {
    var s = side;
    return '<g transform="translate(0 ' + f1(y) + ') scale(' + s * k + ' ' + k + ')"><path d="M0 0 C16 -26 46 -24 58 -42 C48 -6 20 8 0 0Z" fill="' + fill + '"' + OL + '/><path d="M4 -2 Q28 -14 48 -34" fill="none" stroke="#3f7f3a" stroke-width="1.6" opacity=".5"/></g>';
  }

  function fig(i, p, rnd) {
    var sp = SPEC[i], type = sp[0], pal = PAL[sp[1]], fc = sp[2], Hh = sp[3], d = rnd() < .5 ? 1 : -1, sx = f1(d * (6 + rnd() * 12));
    var green = i % 3 === 0 ? '#58a248' : (i % 3 === 1 ? '#63ad4f' : '#4f9a52');
    var stem = '<g class="stem" style="transform-origin:0 0"><path d="M0 0 C' + f1(-14 * d) + ' ' + f1(-Hh * .35) + ' ' + f1(16 * d) + ' ' + f1(-Hh * .68) + ' ' + sx + ' ' + (-Hh) + '" fill="none" stroke="' + OUT + '" stroke-width="10.5" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M0 0 C' + f1(-14 * d) + ' ' + f1(-Hh * .35) + ' ' + f1(16 * d) + ' ' + f1(-Hh * .68) + ' ' + sx + ' ' + (-Hh) + '" fill="none" stroke="' + green + '" stroke-width="6.4" stroke-linecap="round"/>' +
      '<path d="M-1.6 -6 C' + f1(-15 * d) + ' ' + f1(-Hh * .35) + ' ' + f1(13 * d) + ' ' + f1(-Hh * .68) + ' ' + f1(sx - 1.6) + ' ' + (-Hh + 6) + '" fill="none" stroke="#9bd47c" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>' +
      leaf(-1, -Hh * .3, .7 + rnd() * .3, '#69b653') + leaf(1, -Hh * .5, .6 + rnd() * .3, '#5aa84a') + '</g>';
    var hd = '<g class="head sw" style="transform-origin:' + sx + 'px ' + (-Hh) + 'px;--r:' + (d * 3) + 'deg"><g transform="translate(' + sx + ' ' + (-Hh) + ')">' + head(type, pal, fc, p, rnd) + '</g></g>';
    var shadow = '<ellipse cx="0" cy="3" rx="34" ry="8" fill="url(#' + p + 'gsh)"/>';
    var front = '<g class="tuft">' + tuft(rnd) + '</g>';
    return { pre: shadow, fx: '<g class="sway" style="--r:' + (d * 2.2) + 'deg">' + stem + hd + '</g>', front: front, cls: 'fl' };
  }
  function tuft(rnd) {
    var s = '';
    for (var k = 0; k < 7; k++) {
      var x = -22 + k * 7.5 + rnd() * 3, h = 12 + rnd() * 14, b = (rnd() - .5) * 8;
      s += '<path d="M' + f1(x) + ' 4 Q' + f1(x + b) + ' ' + f1(-h * .55) + ' ' + f1(x + b * 1.6) + ' ' + f1(-h) + ' Q' + f1(x + 3 + b * .6) + ' ' + f1(-h * .3) + ' ' + f1(x + 3.5) + ' 4Z" fill="' + (k % 2 ? '#6fba58' : '#5aa84a') + '"/>';
    }
    return s;
  }

  function blossomTree(x, y, s, flip) {
    var g = '<g transform="translate(' + x + ' ' + y + ') scale(' + (flip ? -s : s) + ' ' + s + ')">';
    g += '<path d="M-14 0 C-12 -60 -8 -110 -20 -170 L18 -170 C8 -110 12 -60 16 0Z" fill="#8b6048"' + OL + '/>' +
      '<path d="M0 -100 C-30 -130 -60 -140 -84 -170" fill="none" stroke="#8b6048" stroke-width="12" stroke-linecap="round"/><path d="M4 -120 C34 -150 56 -160 90 -190" fill="none" stroke="#8b6048" stroke-width="10" stroke-linecap="round"/>';
    var blobs = [[-70, -210, 62], [10, -250, 74], [86, -214, 60], [-20, -190, 64], [50, -176, 52], [-106, -164, 44], [124, -168, 40], [-38, -280, 46], [54, -290, 40]];
    blobs.forEach(function (b, i) { g += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '" fill="' + (i % 3 === 0 ? '#f7b9cf' : (i % 3 === 1 ? '#fbcfdd' : '#f3a6c1')) + '"/>'; });
    for (var i = 0; i < 26; i++) { g += '<circle cx="' + f1(-110 + (i * 37) % 240) + '" cy="' + f1(-300 + (i * 53) % 150) + '" r="' + (3 + (i % 3)) + '" fill="#fff" opacity=".55"/>'; }
    return g + '</g>';
  }
  function rndTree(x, y, s) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-9 0 C-7 -40 -5 -70 -8 -110 L8 -110 C5 -70 7 -40 9 0Z" fill="#a08063"' + OL + '/><circle cx="0" cy="-150" r="56" fill="#8fcf72"/><circle cx="-36" cy="-124" r="38" fill="#7cc064"/><circle cx="38" cy="-128" r="40" fill="#9bd97d"/><circle cx="-8" cy="-176" r="30" fill="#a6df88"/></g>';
  }

  JZ.defWorld({
    key: 'fruehling', name: 'Frühling', short: 'Blumenwiese', seed: 21, sky: '#bfe4f6',
    alt: 'Frühlingswiese mit Blumen', title: 'Die Blumenwiese wächst', idle: 'Die Blumenwiese ruht', quiet: 'Die Blumenwiese schläft noch',
    rows: [{ y: 572, s: .62, n: 7, x0: 150, x1: 1450 }, { y: 690, s: .86, n: 7, x0: 160, x1: 1440 }, { y: 826, s: 1.12, n: 6, x0: 200, x1: 1400 }],
    defs: function (p) {
      return '<linearGradient id="' + p + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe4f6"/><stop offset=".55" stop-color="#e3f3f0"/><stop offset="1" stop-color="#fdf5da"/></linearGradient>' +
        '<linearGradient id="' + p + 'gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6dc84"/><stop offset=".5" stop-color="#84c76a"/><stop offset="1" stop-color="#5fae52"/></linearGradient>' +
        '<linearGradient id="' + p + 'h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d5ebd4"/><stop offset="1" stop-color="#bddcc0"/></linearGradient>' +
        '<linearGradient id="' + p + 'h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8e19c"/><stop offset="1" stop-color="#96d07c"/></linearGradient>' +
        '<radialGradient id="' + p + 'sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff9c8" stop-opacity=".95"/><stop offset=".35" stop-color="#fff3b0" stop-opacity=".5"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></radialGradient>' +
        '<pattern id="' + p + 'tx" width="46" height="30" patternUnits="userSpaceOnUse"><path d="M6 8 q3 -6 6 0 M28 20 q3 -6 6 0 M36 5 q2 -4 4 0 M14 24 q2 -4 4 0" fill="none" stroke="#3f7f3a" stroke-width="1.6" stroke-linecap="round" opacity=".28"/></pattern>';
    },
    bg: function (p) {
      var g = '<rect width="1600" height="900" fill="url(#' + p + 'sky)"/>';
      g += '<circle cx="250" cy="150" r="420" fill="url(#' + p + 'sun)"/><circle cx="250" cy="150" r="64" fill="#fff6bf"/><circle cx="250" cy="150" r="48" fill="#fffbe3"/>';
      g += '<g opacity=".14" fill="#fff6bf">' + [0, 1, 2, 3, 4].map(function (k) { return '<path d="M250 150 L' + f1(250 + 1500 * Math.cos(.25 + k * .22)) + ' ' + f1(150 + 1500 * Math.sin(.25 + k * .22)) + ' L' + f1(250 + 1500 * Math.cos(.33 + k * .22)) + ' ' + f1(150 + 1500 * Math.sin(.33 + k * .22)) + 'Z"/>'; }).join('') + '</g>';
      g += '<g class="cl c1">' + cloud(1180, 150, 1.1) + '</g><g class="cl c2">' + cloud(600, 90, .8, { shade: '#e4eef8' }) + '</g><g class="cl c3">' + cloud(1440, 330, .7) + '</g><g class="cl c4">' + cloud(420, 300, .62, { shade: '#e4eef8' }) + '</g>';
      g += '<path d="M-60 470 C140 380 330 396 520 446 C700 494 860 380 1060 398 C1260 416 1420 372 1660 442 L1660 580 L-60 580Z" fill="url(#' + p + 'h1)"/>';
      for (var i = 0; i < 22; i++) { var x = 30 + i * 74 + (i % 3) * 9; g += '<circle cx="' + x + '" cy="' + f1(438 + Math.sin(i * .9) * 22 + (i % 2) * 8) + '" r="' + (13 + (i % 4) * 3) + '" fill="#b4d6b2" opacity=".75"/>'; }
      g += '<path d="M-60 520 C200 450 420 470 640 520 C860 566 1040 470 1260 480 C1440 490 1560 470 1660 500 L1660 640 L-60 640Z" fill="url(#' + p + 'h2)"/><path d="M-60 520 C200 450 420 470 640 520 C860 566 1040 470 1260 480 C1440 490 1560 470 1660 500 L1660 640 L-60 640Z" fill="url(#' + p + 'tx)"/>';
      g += blossomTree(120, 566, .95, false) + rndTree(1500, 560, .85);
      g += '<path d="M-60 560 C220 520 500 548 800 560 C1100 572 1380 530 1660 556 L1660 900 L-60 900Z" fill="url(#' + p + 'gr)"/><path d="M-60 560 C220 520 500 548 800 560 C1100 572 1380 530 1660 556 L1660 900 L-60 900Z" fill="url(#' + p + 'tx)"/>';
      var cols = ['#fff', '#ffd2e1', '#ffe27a', '#d9c7ff', '#ffc2a1'];
      for (i = 0; i < 70; i++) { var px = (i * 197 + 41) % 1600, py = 585 + (i * 61) % 250; g += '<circle cx="' + px + '" cy="' + py + '" r="' + f1(2.2 + (i % 3) * .9) + '" fill="' + cols[i % 5] + '" opacity=".6"/>'; }
      return g;
    },
    ambient: function (p) {
      var g = '';
      var spots = [[300, 470, 0], [900, 430, 1], [1250, 520, 2], [560, 600, 3], [1450, 470, 4], [150, 520, 5], [1080, 640, 6]];
      var cols = [['#ffb3d1', '#f06fa0'], ['#ffd76a', '#f2a93a'], ['#b9d8ff', '#6fa4e8'], ['#ffc0a0', '#f2916a'], ['#e1c8ff', '#b08ce0'], ['#ffe6f0', '#f6a2c4'], ['#fff0a0', '#f2c040']];
      spots.forEach(function (s, k) {
        var c = cols[k % cols.length], lv = k < 3 ? 1 : (k < 5 ? 2 : 3);
        g += '<g class="bfly lv' + lv + '" style="--d:' + (k * 1.7) + 's;--t:' + (14 + k * 2) + 's"><g transform="translate(' + s[0] + ' ' + s[1] + ')"><g class="bflap"><path d="M0 0 C-18 -22 -34 -8 -22 8 C-14 14 -6 8 0 0Z" fill="' + c[0] + '"' + OL.replace('2.4', '1.8') + '/><path d="M0 0 C18 -22 34 -8 22 8 C14 14 6 8 0 0Z" fill="' + c[0] + '"' + OL.replace('2.4', '1.8') + '/><circle cx="-17" cy="-5" r="4" fill="' + c[1] + '" opacity=".7"/><circle cx="17" cy="-5" r="4" fill="' + c[1] + '" opacity=".7"/></g><path d="M0 -3 L0 10" stroke="' + OUT + '" stroke-width="2.6" stroke-linecap="round"/></g></g>';
      });
      return g;
    },
    fg: function (p) {
      var g = '';
      [[30, 900, 1.5], [1570, 900, 1.5], [800, 905, 1]].forEach(function (t, k) {
        g += '<g transform="translate(' + t[0] + ' ' + t[1] + ') scale(' + t[2] + ')">' + [-34, -20, -8, 6, 20, 34].map(function (x, j) { return '<path d="M' + x + ' 0 Q' + (x + (j % 2 ? 10 : -10)) + ' -40 ' + (x + (j % 2 ? 16 : -14)) + ' -' + (56 + (j % 3) * 14) + ' Q' + (x + 6) + ' -30 ' + (x + 12) + ' 0Z" fill="' + (j % 2 ? '#5fae52' : '#4a9a48') + '"/>'; }).join('') + '</g>';
      });
      return g;
    },
    fig: fig
  });
})(window);
