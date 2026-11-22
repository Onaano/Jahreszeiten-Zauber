/* Jahreszeiten-Zauber – Messlogik (rein rechnerisch, ohne Browser-Abhängigkeit)
 * Der Pegel ist ein relativer Wert (dBFS des Mikrofonsignals), kein kalibrierter Schalldruckpegel in dB(A). */
(function (root) {
  'use strict';
  var JZ = root.JZ = root.JZ || {};

  var MAX_FIGS = 20, START_FIGS = 2;
  /* Standard-Obergrenzen je Arbeitsmodus in dBFS (ohne Kalibrierung). Unterschiede sind echte Schwellen. */
  var MODES = {
    still:   { label: 'Stillarbeit',   hint: 'Sehr ruhige Arbeitsatmosphäre',            upper: -52 },
    partner: { label: 'Partnerarbeit', hint: 'Leise Gespräche sind in Ordnung',          upper: -44 },
    gruppe:  { label: 'Gruppenarbeit', hint: 'Etwas höhere Gesprächslautstärke erlaubt', upper: -37 }
  };
  /* Tempo: Sekunden „passende Ruhe“ bis eine Figur erscheint / Sekunden anhaltender Überschreitung bis eine geht */
  var TEMPOS = {
    langsam: { label: 'Langsam', grow: 60, shrink: 30 },
    normal:  { label: 'Normal',  grow: 30, shrink: 20 },
    schnell: { label: 'Schnell', grow: 15, shrink: 12 }
  };
  var TOL_DB = 5;          // Toleranz über dem kalibrierten Pegel (Obergrenze = gemessen + 5 dB)
  var CALM_MARGIN = 3;     // „ruhig genug zum Wachsen“: so weit unter der Obergrenze
  var LOUD_ON = 1.5, LOUD_OFF = -1.5;   // Hysterese um die Obergrenze (insgesamt 3 dB)
  var CALM_ON = -3, CALM_OFF = -1;      // Hysterese für „ruhig“
  var WINDOW_S = 3;        // Medianfenster: kurze Spitzen (Husten, fallender Stift) zählen nicht
  var FLOOR_MAX_LIFT = 8;  // dB: Obergrenze, um die das Grundrauschen die Schwelle höchstens anheben darf
  var DB_MIN = -80, DB_MAX = -20;

  function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }), n = b.length; return n ? (n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2) : DB_MIN; }
  function percentile(a, p) { var b = a.slice().sort(function (x, y) { return x - y; }); if (!b.length) return DB_MIN; return b[Math.min(b.length - 1, Math.floor(p * b.length))]; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function Engine(opts) {
    opts = opts || {};
    this.mode = opts.mode || 'partner';
    this.tempo = opts.tempo || 'normal';
    this.sens = opts.sens == null ? 5 : opts.sens;          // 1 (weniger empfindlich) … 9 (empfindlicher)
    this.calibShift = opts.calibShift == null ? null : opts.calibShift; // dB, null = nicht kalibriert
    this.timeScale = 1;                                      // nur für Demo-Zeitraffer (wirkt auf Zähler, nicht auf Fenster)
    this.reset();
  }
  Engine.prototype.reset = function () {
    this.count = START_FIGS;
    this.level = DB_MIN;       // geglätteter Anzeigepegel
    this.decision = DB_MIN;    // Medianpegel (Entscheidungsgrundlage)
    this.win = [];             // [{t,db}]
    this.clock = 0;
    this.isLoud = false; this.isCalm = false;
    this.zone = 'mid';
    this.calmT = 0; this.loudT = 0;
    this.floorHist = []; this.floorAcc = 0; this.floorN = 0;
    this.noiseFloor = null;
    this.primed = false;
    this.events = [];
  };
  Engine.prototype.setMode = function (m) { if (MODES[m]) this.mode = m; };
  Engine.prototype.setTempo = function (t) { if (TEMPOS[t]) this.tempo = t; };
  Engine.prototype.setSens = function (s) { this.sens = clamp(+s, 1, 9); };
  /* Kalibrierung: gemessener Pegel gilt als „passende Arbeitslautstärke“ für den aktuellen Modus. */
  Engine.prototype.calibrate = function (measuredDb) {
    this.calibShift = (measuredDb + TOL_DB) - MODES[this.mode].upper;
    return this.calibShift;
  };
  Engine.prototype.clearCalibration = function () { this.calibShift = null; };
  /* Obergrenze für einen Modus (dBFS) */
  Engine.prototype.upperFor = function (mode) {
    var u = MODES[mode].upper + (this.calibShift || 0) - (this.sens - 5) * 1.5;
    if (this.noiseFloor !== null) u = Math.max(u, Math.min(this.noiseFloor + 6, u + FLOOR_MAX_LIFT));   // Dauergeräusch (Lüfter) darf die Grenze höchstens um 8 dB anheben
    return u;
  };
  Engine.prototype.upper = function () { return this.upperFor(this.mode); };

  /* dt in Sekunden, db = Rohpegel. Gibt Ereignisse ['grow'|'shrink'] zurück. */
  Engine.prototype.update = function (dt, db) {
    var ev = [];
    if (!(dt > 0)) return ev;
    db = clamp(isFinite(db) ? db : DB_MIN, DB_MIN, 0);
    this.clock += dt;
    /* Anzeigepegel: schneller Anstieg, langsames Abklingen */
    if (!this.primed) { this.level = db; this.primed = true; }
    var tau = db > this.level ? 0.15 : 0.7, a = 1 - Math.exp(-dt / tau);
    this.level += (db - this.level) * a;
    /* Medianfenster (Spitzenschutz) */
    this.win.push({ t: this.clock, db: db });
    while (this.win.length && this.win[0].t < this.clock - WINDOW_S) this.win.shift();
    this.decision = median(this.win.map(function (s) { return s.db; }));
    /* Grundrauschen: 10. Perzentil der Sekundenmittel der letzten 2 Minuten */
    this.floorAcc += db * dt; this.floorN += dt;
    if (this.floorN >= 1) {
      this.floorHist.push(this.floorAcc / this.floorN); this.floorAcc = 0; this.floorN = 0;
      if (this.floorHist.length > 120) this.floorHist.shift();
      this.noiseFloor = this.floorHist.length >= 20 ? percentile(this.floorHist, 0.1) : null;
    }
    /* Zonen mit Hysterese */
    var U = this.upper(), d = this.decision - U;
    if (this.isLoud) { if (d < LOUD_OFF) this.isLoud = false; } else if (d > LOUD_ON) this.isLoud = true;
    if (this.isCalm) { if (d > CALM_OFF) this.isCalm = false; } else if (d < CALM_ON) this.isCalm = true;
    if (this.isLoud) this.isCalm = false;
    this.zone = this.isLoud ? 'loud' : (this.isCalm ? 'calm' : 'mid');
    /* Zähler */
    var T = TEMPOS[this.tempo], ts = dt * this.timeScale;
    if (this.zone === 'calm') { this.calmT += ts; this.loudT = Math.max(0, this.loudT - ts * 1.5); }
    else if (this.zone === 'loud') { this.loudT += ts; this.calmT = Math.max(0, this.calmT - ts * 2); }
    else { this.calmT = Math.max(0, this.calmT - ts * 0.25); this.loudT = Math.max(0, this.loudT - ts * 0.5); }
    if (this.calmT >= T.grow) {
      this.calmT = 0; this.loudT = 0;
      if (this.count < MAX_FIGS) { this.count++; ev.push('grow'); }
    }
    if (this.loudT >= T.shrink) {
      this.loudT = 0; this.calmT = 0;
      if (this.count > 0) { this.count--; ev.push('shrink'); }
    }
    return ev;
  };
  /* Wertebereich für Anzeigen (0..1) */
  Engine.norm = function (db) { return clamp((db - DB_MIN) / (DB_MAX - DB_MIN), 0, 1); };
  Engine.MODES = MODES; Engine.TEMPOS = TEMPOS; Engine.MAX = MAX_FIGS; Engine.START = START_FIGS;
  Engine.DB_MIN = DB_MIN; Engine.DB_MAX = DB_MAX; Engine.WINDOW_S = WINDOW_S; Engine.TOL_DB = TOL_DB;
  Engine.median = median; Engine.percentile = percentile;
  JZ.Engine = Engine;
})(typeof window !== 'undefined' ? window : globalThis);
