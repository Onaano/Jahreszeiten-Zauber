/* SOMMER – Die Sonnen kommen heraus */
(function (root) {
  'use strict';
  var JZ = root.JZ, A = JZ.art, OL = A.OL, OUT = A.OUT, f1 = A.f1, face = A.face, cloud = A.cloud;
  var BODY = [['#fff1a0', '#ffc94d'], ['#fff6b8', '#ffd96a'], ['#ffe0a0', '#ffa94d'], ['#ffeaa0', '#f5b53f']];
  /* Radius, Strahlenform, Farbe, Gesicht, Zubehör, Wolke */
  var SPEC = [
    [64, 'tri', 0, 'closed', null, 0], [58, 'petal', 1, 'happy', 'flower', 1], [72, 'wave', 2, 'curious', null, 2], [60, 'ls', 3, 'cheer', 'hat', 0], [56, 'rod', 0, 'sly', null, 1],
    [68, 'flame', 1, 'cat', null, 2], [62, 'tri', 3, 'happy', 'glasses', 0], [74, 'petal', 2, 'closed', null, 1], [56, 'ls', 1, 'sly', 'flower', 2], [66, 'wave', 0, 'cheer', 'hat', 0],
    [60, 'rod', 3, 'curious', null, 1], [70, 'flame', 2, 'sleepy', null, 2], [58, 'tri', 1, 'cat', null, 0], [64, 'petal', 0, 'happy', 'glasses', 1], [72, 'ls', 2, 'closed', null, 2],
    [56, 'wave', 3, 'cheer', 'hat', 0], [62, 'rod', 1, 'happy', null, 1], [68, 'flame', 0, 'sly', 'flower', 2], [60, 'tri', 2, 'curious', null, 0], [66, 'petal', 3, 'sleepy', null, 1]
  ];
  function rays(style, R, c1, c2, p) {
    var g = '', k, n, a, w;
    var fill = c2, st = OL.replace('2.4', '2.2');
    if (style === 'tri') { n = 12; for (k = 0; k < n; k++) g += '<path d="M' + f1(R * .9) + ' ' + f1(-R * .17) + ' L' + f1(R * 1.55) + ' 0 L' + f1(R * .9) + ' ' + f1(R * .17) + 'Z" fill="' + fill + '"' + st + ' transform="rotate(' + k * 30 + ')"/>'; }
    else if (style === 'petal') { n = 10; for (k = 0; k < n; k++) g += '<ellipse cx="' + f1(R * 1.3) + '" cy="0" rx="' + f1(R * .3) + '" ry="' + f1(R * .17) + '" fill="' + fill + '"' + st + ' transform="rotate(' + k * 36 + ')"/>'; }
    else if (style === 'wave') { n = 14; var pts = []; for (k = 0; k < n * 2; k++) { a = k * Math.PI / n; var r = k % 2 ? R * 1.14 : R * 1.5; pts.push([f1(Math.cos(a) * r), f1(Math.sin(a) * r)]); } g += '<path d="M' + pts.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L') + 'Z" fill="' + fill + '" stroke="' + OUT + '" stroke-width="2.2" stroke-linejoin="round"/>'; }
    else if (style === 'ls') { n = 16; for (k = 0; k < n; k++) { var L2 = k % 2 ? R * 1.38 : R * 1.7; w = k % 2 ? .1 : .13; g += '<path d="M' + f1(R * .9) + ' ' + f1(-R * w) + ' L' + f1(L2) + ' 0 L' + f1(R * .9) + ' ' + f1(R * w) + 'Z" fill="' + (k % 2 ? c1 : fill) + '"' + st + ' transform="rotate(' + k * 22.5 + ')"/>'; } }
    else if (style === 'rod') { n = 12; for (k = 0; k < n; k++) g += '<g transform="rotate(' + k * 30 + ')"><path d="M' + f1(R * 1.2) + ' 0 L' + f1(R * 1.55) + ' 0" stroke="' + OUT + '" stroke-width="15" stroke-linecap="round"/><path d="M' + f1(R * 1.2) + ' 0 L' + f1(R * 1.55) + ' 0" stroke="' + fill + '" stroke-width="10" stroke-linecap="round"/></g>'; }
    else { n = 10; for (k = 0; k < n; k++) g += '<path d="M' + f1(R * .9) + ' ' + f1(-R * .2) + ' Q' + f1(R * 1.4) + ' ' + f1(-R * .34) + ' ' + f1(R * 1.7) + ' ' + f1(R * .06) + ' Q' + f1(R * 1.35) + ' ' + f1(R * .06) + ' ' + f1(R * .9) + ' ' + f1(R * .2) + 'Z" fill="' + fill + '"' + st + ' transform="rotate(' + k * 36 + ')"/>'; }
    return g;
  }
  function fig(i, p, rnd) {
    var sp = SPEC[i], R = sp[0], bi = sp[2], b = BODY[bi], s = R / 52;
    var beam = '<path d="M' + f1(-R * .5) + ' ' + f1(R * .5) + ' L' + f1(-R * 1.7) + ' ' + f1(R * 3.4) + ' L' + f1(R * 1.7) + ' ' + f1(R * 3.4) + ' L' + f1(R * .5) + ' ' + f1(R * .5) + 'Z" fill="url(#' + p + 'beam)" class="beam"/>';
    var glow = '<circle r="' + f1(R * 2.2) + '" fill="url(#' + p + 'glow)"/>';
    var rayG = '<g class="rays" style="animation-duration:' + (70 + i * 7) + 's;animation-direction:' + (i % 2 ? 'reverse' : 'normal') + '">' + rays(sp[1], R, b[0], b[1], p) + '</g>';
    var body = '<circle r="' + R + '" fill="url(#' + p + 'sg' + bi + ')"' + OL + '/><circle r="' + R + '" fill="url(#' + p + 'shade)"/>' +
      '<ellipse cx="' + f1(-R * .36) + '" cy="' + f1(-R * .5) + '" rx="' + f1(R * .26) + '" ry="' + f1(R * .13) + '" fill="#fff" opacity=".7" transform="rotate(-32 ' + f1(-R * .36) + ' ' + f1(-R * .5) + ')"/>';
    var fc = face(sp[3], 0, f1(-R * .02), f1(R / 40), { cheek: '#ff8d6a' });
    var acc = '';
    if (sp[4] === 'hat') acc = '<g transform="translate(' + f1(R * .08) + ' ' + f1(-R * .74) + ') rotate(-8)"><ellipse rx="' + f1(R * 1.0) + '" ry="' + f1(R * .24) + '" fill="#f3d38a"' + OL + '/><path d="M' + f1(-R * .5) + ' 0 C' + f1(-R * .5) + ' ' + f1(-R * .62) + ' ' + f1(R * .5) + ' ' + f1(-R * .62) + ' ' + f1(R * .5) + ' 0Z" fill="#f7dfa0"' + OL + '/><path d="M' + f1(-R * .5) + ' ' + f1(-R * .06) + ' Q0 ' + f1(R * .08) + ' ' + f1(R * .5) + ' ' + f1(-R * .06) + '" fill="none" stroke="#e5705c" stroke-width="' + f1(R * .14) + '"/></g>';
    else if (sp[4] === 'glasses') acc = '<g transform="translate(0 ' + f1(R * .02) + ')"><circle cx="' + f1(-R * .3) + '" cy="0" r="' + f1(R * .24) + '" fill="#3d3550"' + OL + '/><circle cx="' + f1(R * .3) + '" cy="0" r="' + f1(R * .24) + '" fill="#3d3550"' + OL + '/><path d="M' + f1(-R * .08) + ' ' + f1(-R * .04) + ' Q0 ' + f1(-R * .1) + ' ' + f1(R * .08) + ' ' + f1(-R * .04) + '" fill="none" stroke="' + OUT + '" stroke-width="2.6"/><ellipse cx="' + f1(-R * .38) + '" cy="' + f1(-R * .08) + '" rx="' + f1(R * .08) + '" ry="' + f1(R * .05) + '" fill="#fff" opacity=".6"/><ellipse cx="' + f1(R * .22) + '" cy="' + f1(-R * .08) + '" rx="' + f1(R * .08) + '" ry="' + f1(R * .05) + '" fill="#fff" opacity=".6"/></g>';
    else if (sp[4] === 'flower') acc = '<g transform="translate(' + f1(R * .66) + ' ' + f1(-R * .66) + ')">' + [0, 1, 2, 3, 4].map(function (k) { return '<circle cx="0" cy="-9" r="7.5" fill="#fff" stroke="' + OUT + '" stroke-width="1.6" transform="rotate(' + k * 72 + ')"/>'; }).join('') + '<circle r="5.5" fill="#f08aa6" stroke="' + OUT + '" stroke-width="1.6"/></g>';
    var sunG = '<g class="sunb"><g class="idle-f" style="animation-delay:' + f1(rnd() * 3) + 's">' + beam + glow + rayG + body + fc + acc + '</g></g>';
    /* Wolke vor der Sonne: sie bleibt stehen, die Sonne kommt dahinter hervor */
    var cv = sp[5], cw = R * (cv === 1 ? 1.2 : 1.35), cy = R * 1.02;
    var cl = '<g class="cl-front" style="animation-delay:' + f1(rnd() * 4) + 's"><g transform="translate(0 ' + f1(cy) + ')">' +
      '<ellipse cx="0" cy="' + f1(R * .22) + '" rx="' + f1(cw * 1.02) + '" ry="' + f1(R * .26) + '" fill="#cfe3f3"/>' +
      '<g fill="#fff"' + OL.replace('stroke="' + OUT + '"', 'stroke="#bcd3e6"').replace('2.4', '2') + '>' +
      (cv === 0 ? '<circle cx="' + f1(-cw * .62) + '" cy="0" r="' + f1(R * .28) + '"/><circle cx="' + f1(-cw * .2) + '" cy="' + f1(-R * .08) + '" r="' + f1(R * .38) + '"/><circle cx="' + f1(cw * .32) + '" cy="' + f1(-R * .02) + '" r="' + f1(R * .34) + '"/><circle cx="' + f1(cw * .72) + '" cy="' + f1(R * .08) + '" r="' + f1(R * .3) + '"/>' :
        cv === 1 ? '<circle cx="' + f1(-cw * .5) + '" cy="' + f1(R * .02) + '" r="' + f1(R * .36) + '"/><circle cx="0" cy="' + f1(-R * .1) + '" r="' + f1(R * .5) + '"/><circle cx="' + f1(cw * .55) + '" cy="' + f1(R * .06) + '" r="' + f1(R * .34) + '"/>' :
          '<circle cx="' + f1(-cw * .7) + '" cy="' + f1(R * .1) + '" r="' + f1(R * .26) + '"/><circle cx="' + f1(-cw * .34) + '" cy="' + f1(-R * .06) + '" r="' + f1(R * .4) + '"/><circle cx="' + f1(cw * .12) + '" cy="' + f1(-R * .14) + '" r="' + f1(R * .46) + '"/><circle cx="' + f1(cw * .56) + '" cy="' + f1(R * .0) + '" r="' + f1(R * .36) + '"/><circle cx="' + f1(cw * .86) + '" cy="' + f1(R * .14) + '" r="' + f1(R * .24) + '"/>') +
      '<rect x="' + f1(-cw * .92) + '" y="' + f1(R * .06) + '" width="' + f1(cw * 1.84) + '" height="' + f1(R * .34) + '" rx="' + f1(R * .17) + '" stroke="none"/></g>' +
      '<path d="M' + f1(-cw * .8) + ' ' + f1(R * .32) + ' Q0 ' + f1(R * .5) + ' ' + f1(cw * .85) + ' ' + f1(R * .32) + '" fill="none" stroke="#cfe0ef" stroke-width="5" stroke-linecap="round" opacity=".8"/></g></g>';
    return { fx: sunG, front: cl, cls: 'su' };
  }
  JZ.defWorld({
    key: 'sommer', name: 'Sommer', short: 'Sonnenland', seed: 33, sky: '#78c8ee',
    alt: 'Sommerhimmel mit kleinen Sonnen', title: 'Die Sonnen kommen heraus', idle: 'Die Sonnen ruhen', quiet: 'Die Sonnen warten hinter den Wolken',
    rows: [{ y: 210, s: .9, n: 6, x0: 150, x1: 1450, jy: 22 }, { y: 404, s: 1.0, n: 7, x0: 130, x1: 1470, jy: 26 }, { y: 604, s: .86, n: 7, x0: 120, x1: 1480, jy: 20 }],
    defs: function (p) {
      var g = '<linearGradient id="' + p + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cc2ee"/><stop offset=".6" stop-color="#a9ddf5"/><stop offset="1" stop-color="#e6f6fa"/></linearGradient>' +
        '<linearGradient id="' + p + 'gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ad86a"/><stop offset=".55" stop-color="#6cbb4f"/><stop offset="1" stop-color="#4d9f45"/></linearGradient>' +
        '<linearGradient id="' + p + 'lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fd3e0"/><stop offset="1" stop-color="#4db4cf"/></linearGradient>' +
        '<linearGradient id="' + p + 'wh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8d672"/><stop offset="1" stop-color="#c9c755"/></linearGradient>' +
        '<linearGradient id="' + p + 'beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4b0" stop-opacity=".18"/><stop offset="1" stop-color="#fff4b0" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="' + p + 'glow" cx=".5" cy=".5" r=".5"><stop offset=".3" stop-color="#fff1a0" stop-opacity=".38"/><stop offset="1" stop-color="#fff1a0" stop-opacity="0"/></radialGradient>' +
        '<pattern id="' + p + 'tx" width="46" height="30" patternUnits="userSpaceOnUse"><path d="M6 8 q3 -6 6 0 M28 20 q3 -6 6 0 M36 5 q2 -4 4 0 M14 24 q2 -4 4 0" fill="none" stroke="#2f6f2a" stroke-width="1.6" stroke-linecap="round" opacity=".28"/></pattern>';
      BODY.forEach(function (b, k) { g += '<radialGradient id="' + p + 'sg' + k + '" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="' + b[0] + '"/><stop offset="1" stop-color="' + b[1] + '"/></radialGradient>'; });
      return g;
    },
    bg: function (p) {
      var g = '<rect width="1600" height="900" fill="url(#' + p + 'sky)"/>';
      g += '<g opacity=".7" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"><path d="M80 60 Q260 30 440 58" opacity=".5"/><path d="M1080 40 Q1260 10 1440 44" opacity=".5"/><path d="M700 220 Q860 196 1010 220" opacity=".35"/></g>';
      g += '<path d="M-60 560 C150 500 360 510 560 546 C760 582 900 500 1100 510 C1300 520 1480 500 1660 540 L1660 640 L-60 640Z" fill="#9ccfae"/>';
      g += '<path d="M-60 586 C200 540 460 556 700 590 C960 626 1180 550 1400 566 C1520 574 1600 566 1660 576 L1660 660 L-60 660Z" fill="url(#' + p + 'lake)"/>';
      for (var i = 0; i < 16; i++) { g += '<path d="M' + (60 + i * 98) + ' ' + (604 + (i % 4) * 11) + ' q18 -6 36 0 q18 6 36 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>'; }
      g += '<path d="M-60 640 C240 600 520 626 820 632 C1120 638 1380 596 1660 622 L1660 740 L-60 740Z" fill="url(#' + p + 'wh)"/>';
      for (i = 0; i < 40; i++) { g += '<path d="M' + (i * 42 + 6) + ' ' + (650 + (i % 5) * 14) + ' l2 -14 M' + (i * 42 + 12) + ' ' + (654 + (i % 5) * 14) + ' l-1 -12" stroke="#b9a846" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>'; }
      g += '<path d="M-60 722 C240 690 560 706 820 712 C1100 718 1400 686 1660 706 L1660 900 L-60 900Z" fill="url(#' + p + 'gr)"/><path d="M-60 722 C240 690 560 706 820 712 C1100 718 1400 686 1660 706 L1660 900 L-60 900Z" fill="url(#' + p + 'tx)"/>';
      var cols = ['#fff', '#ffe27a', '#ffd2e1', '#fff'];
      for (i = 0; i < 80; i++) { var px = (i * 173 + 29) % 1600, py = 740 + (i * 47) % 150; g += '<circle cx="' + px + '" cy="' + py + '" r="' + f1(2.4 + (i % 3)) + '" fill="' + cols[i % 4] + '" opacity=".75"/>'; }
      g += '<g transform="translate(1496 704) scale(.9)"><path d="M-9 0 C-7 -40 -5 -70 -8 -110 L8 -110 C5 -70 7 -40 9 0Z" fill="#a38364"' + OL + '/><circle cx="0" cy="-150" r="58" fill="#6fbe5a"/><circle cx="-38" cy="-122" r="40" fill="#5fae4e"/><circle cx="40" cy="-126" r="42" fill="#7ccb64"/><circle cx="-6" cy="-182" r="30" fill="#8bd872"/></g>';
      return g;
    },
    ambient: function (p) {
      return '<g class="cl c1" opacity=".9">' + cloud(1320, 560, .6) + '</g><g class="cl c2" opacity=".9">' + cloud(420, 520, .5) + '</g>';
    },
    fg: function (p) {
      var g = '';
      [[70, 910, 1.0], [1530, 912, 1.05]].forEach(function (s, k) {
        g += '<g transform="translate(' + s[0] + ' ' + s[1] + ') scale(' + s[2] + ')"><path d="M0 0 C-4 -90 6 -170 0 -230" fill="none" stroke="#4f9a45" stroke-width="12" stroke-linecap="round"/><path d="M0 -120 C-40 -130 -60 -150 -70 -176 C-30 -166 -8 -150 0 -120Z" fill="#5eab4d"' + OL + '/>' +
          '<g transform="translate(0 -244)">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (q) { return '<ellipse cx="0" cy="-40" rx="14" ry="26" fill="#ffd23f"' + OL.replace('2.4', '2') + ' transform="rotate(' + q * 30 + ')"/>'; }).join('') + '<circle r="32" fill="#8a5a3a"' + OL + '/><circle r="32" fill="url(#' + p + 'shade)"/><g fill="#5e3a22" opacity=".6"><circle cx="-10" cy="-8" r="3"/><circle cx="8" cy="-10" r="3"/><circle cx="0" cy="4" r="3"/><circle cx="-14" cy="8" r="3"/><circle cx="14" cy="6" r="3"/></g></g></g>';
      });
      [[360, 905], [1240, 908]].forEach(function (t) { g += '<g transform="translate(' + t[0] + ' ' + t[1] + ') scale(1.2)">' + [-30, -14, 2, 18, 32].map(function (x, j) { return '<path d="M' + x + ' 0 Q' + (x + (j % 2 ? 8 : -8)) + ' -34 ' + (x + (j % 2 ? 14 : -12)) + ' -' + (44 + (j % 3) * 12) + ' Q' + (x + 6) + ' -26 ' + (x + 12) + ' 0Z" fill="' + (j % 2 ? '#5fae52' : '#4a9a48') + '"/>'; }).join('') + '</g>'; });
      return g;
    },
    fig: fig
  });
})(window);
