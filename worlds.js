/* Jahreszeiten-Zauber – gemeinsame Zeichenhilfen, Welt-Registry, Rendering und Steuerung der Figuren */
(function (root) {
  'use strict';
  var JZ = root.JZ = root.JZ || {};
  var OUT = '#5a4234';
  var OL = ' stroke="' + OUT + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
  var W = 1600, H = 900;

  function R(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function f1(n) { return Math.round(n * 10) / 10; }

  /* ---------- Gesichter (gemeinsame Designsprache) ---------- */
  function eyeDot(x, y, r, ink) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(r * .88) + '" ry="' + r + '" fill="' + ink + '"/><circle cx="' + f1(x + r * .32) + '" cy="' + f1(y - r * .36) + '" r="' + f1(r * .32) + '" fill="#fff"/>';
  }
  function face(kind, x, y, s, o) {
    o = o || {};
    var ink = o.ink || '#3d2b25', ch = o.cheek || '#ff8aa0', st = ' fill="none" stroke="' + ink + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    var g = '<g class="face" transform="translate(' + x + ' ' + y + ') scale(' + s + ')">';
    var cheeks = '<ellipse cx="-19" cy="8" rx="6" ry="3.8" fill="' + ch + '" opacity=".55"/><ellipse cx="19" cy="8" rx="6" ry="3.8" fill="' + ch + '" opacity=".55"/>';
    var smile = '<path d="M-6 8 Q0 15 6 8"' + st + '/>';
    switch (kind) {
      case 'closed': g += cheeks + '<path d="M-16 1 Q-11.5 -5.5 -7 1"' + st + '/><path d="M7 1 Q11.5 -5.5 16 1"' + st + '/><path d="M-5 8 Q0 14 5 8"' + st + '/>'; break;
      case 'curious': g += cheeks + '<ellipse cx="-11" cy="0" rx="6.4" ry="7" fill="#fff" stroke="' + ink + '" stroke-width="1.8"/><ellipse cx="11" cy="0" rx="6.4" ry="7" fill="#fff" stroke="' + ink + '" stroke-width="1.8"/>' +
        '<circle cx="-9.4" cy="-1.4" r="3.3" fill="' + ink + '"/><circle cx="12.6" cy="-1.4" r="3.3" fill="' + ink + '"/><circle cx="-8.4" cy="-2.6" r="1.1" fill="#fff"/><circle cx="13.6" cy="-2.6" r="1.1" fill="#fff"/>' +
        '<path d="M-17 -10 Q-11 -14 -5 -10"' + st + ' stroke-width="1.8"/><ellipse cx="0" cy="11" rx="2.6" ry="3.2" fill="#7a3b3b"/>'; break;
      case 'sly': g += cheeks + eyeDot(-11, 0, 4, ink) + eyeDot(11, 0, 4, ink) + '<path d="M-18 -7 L-5 -4"' + st + ' stroke-width="2"/><path d="M5 -9 Q11 -13 17 -8"' + st + ' stroke-width="2"/><path d="M-6 11 Q2 15 8 7"' + st + '/>'; break;
      case 'cheer': g += cheeks + eyeDot(-11, 0, 4.2, ink) + eyeDot(11, 0, 4.2, ink) + '<path d="M-7 7 Q0 21 7 7 Z" fill="#8a3b3b" stroke="' + ink + '" stroke-width="2" stroke-linejoin="round"/><ellipse cx="0" cy="14.5" rx="3.6" ry="2.2" fill="#ee7c86"/>'; break;
      case 'sleepy': g += cheeks + '<path d="M-16 0 Q-11.5 5 -7 0"' + st + '/><path d="M7 0 Q11.5 5 16 0"' + st + '/><path d="M-3.5 9 Q0 12.5 3.5 9"' + st + '/>'; break;
      case 'cat': g += cheeks + eyeDot(-11, 0, 4, ink) + eyeDot(11, 0, 4, ink) + '<path d="M-7 8 Q-3.5 13.5 0 8 Q3.5 13.5 7 8"' + st + ' stroke-width="2.2"/>'; break;
      default: g += cheeks + eyeDot(-11, 0, 4.2, ink) + eyeDot(11, 0, 4.2, ink) + smile;
    }
    return g + '</g>';
  }

  /* ---------- Wolken ---------- */
  function cloud(x, y, s, o) {
    o = o || {}; var fill = o.fill || '#fff', sh = o.shade || '#d9e8f5', sc = o.scale || 1;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<ellipse cx="0" cy="22" rx="92" ry="22" fill="' + sh + '"/>' +
      '<g fill="' + fill + '"><circle cx="-52" cy="8" r="30"/><circle cx="-14" cy="-6" r="42"/><circle cx="32" cy="2" r="36"/><circle cx="66" cy="14" r="24"/><rect x="-78" y="8" width="164" height="30" rx="15"/></g>' +
      '<path d="M-70 34 Q0 46 84 34" fill="none" stroke="' + sh + '" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>';
  }

  /* ---------- gemeinsame Definitionen ---------- */
  function commonDefs(p) {
    return '<radialGradient id="' + p + 'shine" cx=".34" cy=".28" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".62"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="' + p + 'shade" cx=".42" cy=".36" r=".78"><stop offset=".58" stop-color="#5a2d18" stop-opacity="0"/><stop offset="1" stop-color="#5a2d18" stop-opacity=".26"/></radialGradient>' +
      '<radialGradient id="' + p + 'gsh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2d3a1e" stop-opacity=".34"/><stop offset="1" stop-color="#2d3a1e" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + p + 'grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .18  0 0 0 .55 -.18"/></filter>';
  }

  var DEFS = {};
  JZ.art = { OUT: OUT, OL: OL, R: R, f1: f1, face: face, cloud: cloud, eyeDot: eyeDot };
  JZ.worlds = DEFS;
  JZ.defWorld = function (def) { DEFS[def.key] = def; };
  JZ.KEYS = ['fruehling', 'sommer', 'herbst', 'winter'];

  /* ---------- Slots (Positionen der 20 Figuren) ---------- */
  function makeSlots(def) {
    var rnd = R(def.seed || 11), out = [], idx = 0;
    def.rows.forEach(function (row) {
      for (var i = 0; i < row.n; i++) {
        var t = (i + .5) / row.n, jx = (rnd() - .5) * (row.jx == null ? 36 : row.jx), jy = (rnd() - .5) * (row.jy == null ? 18 : row.jy);
        out.push({ i: idx++, x: f1(row.x0 + (row.x1 - row.x0) * t + jx), y: f1(row.y + jy), s: f1(row.s * (0.94 + rnd() * .12)) });
      }
    });
    return out;
  }
  /* Reihenfolge: nacheinander möglichst weit auseinander, damit die Welt gleichmäßig wächst */
  function makeOrder(slots) {
    var cx = W / 2, cy = def_cy(slots), first = 0, best = 1e9, k;
    slots.forEach(function (s) { var d = Math.hypot(s.x - cx, (s.y - cy) * 1.6); if (d < best) { best = d; first = s.i; } });
    var chosen = [first];
    while (chosen.length < slots.length) {
      var bi = -1, bd = -1;
      slots.forEach(function (s) {
        if (chosen.indexOf(s.i) >= 0) return;
        var md = 1e9; chosen.forEach(function (c) { var o = slots[c]; md = Math.min(md, Math.hypot(s.x - o.x, (s.y - o.y) * 1.8)); });
        if (md > bd) { bd = md; bi = s.i; }
      });
      chosen.push(bi);
    }
    return chosen;
  }
  function def_cy(slots) { var t = 0; slots.forEach(function (s) { t += s.y; }); return t / slots.length; }

  /* ---------- Welt als SVG-Text ---------- */
  JZ.renderWorld = function (key, p, opts) {
    opts = opts || {};
    var def = DEFS[key], slots = makeSlots(def), order = makeOrder(slots), n = opts.count == null ? 0 : opts.count;
    var on = {}; for (var i = 0; i < n; i++) on[order[i]] = 1;
    var sorted = slots.slice().sort(function (a, b) { return a.y - b.y; });
    var figs = sorted.map(function (s) {
      var rnd = R((def.seed || 11) * 100 + s.i), f = def.fig(s.i, p, rnd, s);
      var cls = 'fig' + (on[s.i] ? ' on' : '') + (opts.still ? ' still' : '');
      return '<g class="slot" transform="translate(' + s.x + ' ' + s.y + ') scale(' + s.s + ')" data-i="' + s.i + '">' +
        (f.pre || '') + '<g class="' + cls + '" data-i="' + s.i + '"><g class="fx ' + (f.cls || '') + '" style="--d:' + f1(rnd() * 5) + 's;--t:' + f1(4 + rnd() * 4) + 's">' + f.fx + '</g></g>' + (f.front || '') + '</g>';
    }).join('');
    var svg = '<svg class="world w-' + key + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice" role="img" aria-label="' + def.alt + '" data-key="' + key + '" data-lvl="' + Math.floor(n / 6) + '">' +
      '<defs>' + commonDefs(p) + def.defs(p) + '</defs>' +
      '<g class="bg">' + def.bg(p) + '</g>' +
      (opts.noAmbient ? '' : '<g class="amb">' + (def.ambient ? def.ambient(p) : '') + '</g>') +
      '<g class="slots">' + figs + '</g>' +
      '<g class="fgdeco">' + (def.fg ? def.fg(p) : '') + '</g>' +
      '<rect class="grain" width="' + W + '" height="' + H + '" filter="url(#' + p + 'grain)" opacity=".5" pointer-events="none"/>' +
      '</svg>';
    return { svg: svg, order: order, slots: slots, def: def };
  };

  /* ---------- Steuerung: Figuren ein-/ausblenden ---------- */
  function WorldView(svgEl, order) {
    this.svg = svgEl; this.order = order; this.count = 0;
    this.figs = []; var self = this;
    order.forEach(function (idx) { self.figs.push(svgEl.querySelector('.fig[data-i="' + idx + '"]')); });
    this.sync(true);
  }
  WorldView.prototype.visible = function () { return this.figs.filter(function (f) { return f.classList.contains('on'); }).length; };
  /* Setzt die Anzahl sichtbarer Figuren (Neuer erscheint animiert, sonst sofort) */
  WorldView.prototype.set = function (n, instant) {
    n = Math.max(0, Math.min(this.figs.length, n | 0));
    var old = this.count; this.count = n;
    for (var i = 0; i < this.figs.length; i++) {
      var f = this.figs[i], want = i < n, has = f.classList.contains('on');
      if (want && !has) { f.classList.remove('off'); f.classList.add('on'); if (instant) f.classList.add('still'); else f.classList.remove('still'); }
      else if (!want && has) { f.classList.remove('on'); if (!instant) f.classList.add('off'); else f.classList.remove('off'); }
    }
    this.svg.setAttribute('data-lvl', Math.floor(n / 6));
    this.svg.setAttribute('data-n', n);
    return n - old;
  };
  WorldView.prototype.sync = function (instant) { this.set(this.visible(), instant); };
  JZ.WorldView = WorldView;
})(window);
