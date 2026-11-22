/* Jahreszeiten-Zauber – Mikrofonmessung (Web Audio API). Alles bleibt lokal im Browser:
 * es werden keine Audiodaten gespeichert, aufgezeichnet oder übertragen. */
(function (root) {
  'use strict';
  var JZ = root.JZ = root.JZ || {};
  var AC = root.AudioContext || root.webkitAudioContext;

  function Meter() {
    this.ctx = null; this.stream = null; this.analyser = null; this.buf = null; this.src = null;
    this.on = {}; this.active = false; this.deviceId = null;
  }
  Meter.supported = function () {
    return !!(root.navigator && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && AC);
  };
  /* Warum ist die Messung nicht möglich? */
  Meter.unsupportedReason = function () {
    if (!root.isSecureContext && root.location && root.location.protocol !== 'file:') return 'insecure';
    return 'unsupported';
  };
  Meter.prototype.emit = function (n, a) { var f = this.on[n]; if (f) f(a); };
  Meter.errorKind = function (err) {
    var n = err && err.name;
    if (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') return 'denied';
    if (n === 'NotFoundError' || n === 'DevicesNotFoundError') return 'nomic';
    if (n === 'NotReadableError' || n === 'TrackStartError' || n === 'AbortError') return 'busy';
    if (n === 'OverconstrainedError' || n === 'ConstraintNotSatisfiedError') return 'device';
    return 'other';
  };
  Meter.prototype.start = function (deviceId) {
    var self = this;
    if (!Meter.supported()) return Promise.reject({ kind: Meter.unsupportedReason() });
    self.stop();
    var audio = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
    if (deviceId) audio.deviceId = { exact: deviceId };
    return navigator.mediaDevices.getUserMedia({ audio: audio, video: false }).then(function (stream) {
      self.stream = stream;
      self.ctx = new AC();
      self.src = self.ctx.createMediaStreamSource(stream);
      self.analyser = self.ctx.createAnalyser();
      self.analyser.fftSize = 2048; self.analyser.smoothingTimeConstant = 0;
      self.buf = new Float32Array(self.analyser.fftSize);
      self.src.connect(self.analyser);                 // bewusst NICHT mit destination verbunden: keine Wiedergabe
      var t = stream.getAudioTracks()[0];
      self.deviceId = (t && t.getSettings && t.getSettings().deviceId) || deviceId || null;
      self.label = t && t.label || '';
      if (t) {
        t.onended = function () { if (self.active) { self.active = false; self.emit('lost', { kind: 'ended' }); } };
        t.onmute = function () { if (self.active) self.emit('muted'); };
        t.onunmute = function () { if (self.active) self.emit('unmuted'); };
      }
      self.ctx.onstatechange = function () { if (self.active) self.emit('state', self.ctx.state); };
      self.active = true;
      return self.ctx.state === 'suspended' ? self.ctx.resume().catch(function () {}) : null;
    }).catch(function (err) { self.stop(); throw { kind: err && err.kind ? err.kind : Meter.errorKind(err), error: err }; });
  };
  /* Aktueller RMS-Pegel in dBFS (−100 … 0) */
  Meter.prototype.read = function () {
    if (!this.analyser) return -100;
    this.analyser.getFloatTimeDomainData(this.buf);
    var s = 0, b = this.buf, n = b.length;
    for (var i = 0; i < n; i++) s += b[i] * b[i];
    var rms = Math.sqrt(s / n);
    return 20 * Math.log10(Math.max(rms, 1e-5));
  };
  Meter.prototype.isLive = function () {
    var t = this.stream && this.stream.getAudioTracks()[0];
    return !!(this.active && t && t.readyState === 'live' && !t.muted && this.ctx && this.ctx.state === 'running');
  };
  Meter.prototype.resume = function () { return this.ctx && this.ctx.state !== 'running' ? this.ctx.resume() : Promise.resolve(); };
  Meter.prototype.stop = function () {
    this.active = false;
    try { if (this.stream) this.stream.getTracks().forEach(function (t) { t.onended = null; t.stop(); }); } catch (e) {}
    try { if (this.ctx) { this.ctx.onstatechange = null; this.ctx.close(); } } catch (e) {}
    this.stream = null; this.ctx = null; this.analyser = null; this.src = null;
  };
  Meter.devices = function () {
    if (!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) return Promise.resolve([]);
    return navigator.mediaDevices.enumerateDevices().then(function (l) { return l.filter(function (d) { return d.kind === 'audioinput'; }); }).catch(function () { return []; });
  };
  JZ.Meter = Meter;
})(typeof window !== 'undefined' ? window : globalThis);
