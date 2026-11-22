/* Jahreszeiten-Zauber – App-Steuerung. Läuft komplett lokal; keine Netzwerkzugriffe. */
(function () {
  'use strict';
  var JZ = window.JZ, E = JZ.Engine;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Einstellungen (nur lokal im Browser, mit Schutz gegen gesperrten Speicher) ---------- */
  var STORE = 'jz.settings.v1';
  var S = { mode: 'partner', tempo: 'normal', sens: 5, calib: null, showBar: true, deviceId: '', demoV: 35, demoFast: true };
  function load() { try { var o = JSON.parse(localStorage.getItem(STORE) || '{}'); for (var k in S) if (o[k] !== undefined) S[k] = o[k]; } catch (e) {} if (!E.MODES[S.mode]) S.mode = 'partner'; if (!E.TEMPOS[S.tempo]) S.tempo = 'normal'; }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }
  load();

  var engine = new E({ mode: S.mode, tempo: S.tempo, sens: S.sens, calibShift: S.calib });
  var meter = new JZ.Meter();
  var demo = false;
  var phase = 'start';            // start | ready | running | paused
  var worldKey = null, view = null, def = null, current = null;
  var calibrating = null;
  var lastT = 0, timer = null, idleTimer = null, wakeLock = null;

  /* Körnung als kleine, einmal erzeugte Textur (statt teurem SVG-Filter während der Animation) */
  (function grain() {
    try {
      var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), d = x.createImageData(128, 128), s = 7;
      for (var i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; var v = 110 + (s % 146); d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      x.putImageData(d, 0, 0); document.documentElement.style.setProperty('--grain', 'url(' + c.toDataURL() + ')');
    } catch (e) {}
  })();

  /* ---------- Startbildschirm ---------- */
  function buildStart() {
    var ul = $('cards'); ul.innerHTML = '';
    JZ.KEYS.forEach(function (k) {
      var r = JZ.renderWorld(k, 'c' + k + '_', { count: 6, still: true, noAmbient: true });
      var li = document.createElement('li');
      li.innerHTML = '<button type="button" class="card" data-world="' + k + '"><span class="thumb">' + r.svg + '</span><span class="cap"><span class="cname">' + esc(r.def.name) + '</span><span class="csub">' + esc(r.def.short) + '</span></span></button>';
      var svg = li.querySelector('svg'); svg.setAttribute('aria-hidden', 'true'); svg.removeAttribute('role'); svg.removeAttribute('aria-label');
      var g = svg.querySelector('.grain'); if (g) g.remove();
      li.querySelectorAll('.fig.on').forEach(function (f) { f.classList.add('still'); });
      ul.appendChild(li);
    });
    ul.onclick = function (e) { var b = e.target.closest('.card'); if (b) openWorld(b.getAttribute('data-world'), false); };
  }

  /* ---------- Welt anzeigen ---------- */
  var FIT = { fruehling: ['#bfe2f4', '#4f994a', .62], sommer: ['#6cbfe8', '#519e47', .78], herbst: ['#f5ce9b', '#896937', .64], winter: ['#a8c8e9', '#ccdbea', .66] };
  function fit() {
    var h = $('host'), svg = h.querySelector('svg.world:not(.leaving)'); if (!svg) return;
    var w = h.clientWidth, hh = h.clientHeight, a = w / Math.max(1, hh), f = FIT[worldKey] || FIT.fruehling, mode;
    if (a < 1.55) mode = 'xMidYMid meet'; else if (a > 2.0) mode = 'xMidYMax meet'; else mode = 'xMidYMax slice';
    h.querySelectorAll('svg.world').forEach(function (s) { s.setAttribute('preserveAspectRatio', mode); });
    if (a < 1.55) h.style.background = 'linear-gradient(to bottom,' + f[0] + ' 50%,' + f[1] + ' 50%)';
    else if (a > 2.0) h.style.background = 'linear-gradient(to bottom,' + f[0] + ' ' + (f[2] * 100 - 4) + '%,' + f[1] + ' ' + (f[2] * 100 + 4) + '%)';
    else h.style.background = f[0];
  }
  function mount(key, count, fade) {
    var r = JZ.renderWorld(key, 'm' + Date.now().toString(36) + '_', { count: 0, still: true });
    var host = $('host'), old = host.querySelector('svg.world');
    host.insertAdjacentHTML('beforeend', r.svg);
    var svg = host.lastElementChild;
    var g = svg.querySelector('.grain'); if (g) g.remove();
    svg.addEventListener('animationend', function (e) { if (e.animationName === 'retreat') { var f = e.target.closest('.fig'); if (f && f.classList.contains('off')) f.classList.add('gone'); } });
    view = new JZ.WorldView(svg, r.order); view.set(count, true);
    if (old) { old.classList.add('leaving'); setTimeout(function () { old.remove(); }, fade ? 750 : 0); if (!fade) old.remove(); }
    def = r.def; worldKey = key; current = svg; fit();
  }
  function openWorld(key, keepRun) {
    if (!keepRun) { engine.reset(); engine.timeScale = demo && S.demoFast ? 6 : 1; }
    var swap = phase !== 'start';
    $('start').hidden = true; $('stage').hidden = false;
    mount(key, engine.count, swap);
    if (!swap) { phase = 'ready'; showReady(); }
    refreshUI(); wake();
  }
  function toStart() {
    stopMeasuring(); phase = 'start'; closeAll(); engine.reset(); $('stage').hidden = true; $('start').hidden = false; $('demobadge').hidden = true; demo = false; $('demo').checked = false; $('demoBox').hidden = true;
    document.exitFullscreen && document.fullscreenElement && document.exitFullscreen().catch(function () {});
  }

  /* ---------- Anzeige/Texte ---------- */
  function statusText() {
    if (phase === 'ready') return 'Bereit zum Start';
    if (phase === 'paused') return def.idle;
    if (calibrating) return 'Wir hören kurz zu …';
    if (engine.count <= 0) return def.quiet;
    if (engine.count >= E.MAX) return 'Alle Freunde sind da!';
    if (engine.zone === 'loud') return 'Gerade ist es etwas lebendig – mit etwas leiserem Arbeiten wächst es wieder.';
    return 'Die Arbeitslautstärke passt gerade.';
  }
  var lastStatus = '';
  function refreshStatus() { var t = statusText(); if (t !== lastStatus) { $('status').textContent = t; lastStatus = t; } }
  function refreshUI() {
    if (!def) return;
    $('title').textContent = def.title;
    $('modechip').textContent = E.MODES[engine.mode].label;
    $('playLbl').textContent = phase === 'running' ? 'Pause' : (phase === 'paused' ? 'Weiter' : 'Start');
    $('playIcon').setAttribute('d', phase === 'running' ? 'M9 6h4v20H9zM19 6h4v20h-4z' : 'M10 6l16 10-16 10z');
    $('demobadge').hidden = !demo;
    $('demobadge').querySelector('small').textContent = demo && S.demoFast ? '– Zeitraffer' : '– ohne Mikrofon';
    $('ribbon').hidden = !S.showBar || phase === 'start' || (phase === 'ready');
    $('okzone').style.width = (E.norm(engine.upper()) * 100) + '%';
    var cs = $('calibState'); cs.textContent = engine.calibShift === null ? 'Es gelten die Standardwerte der Arbeitsform.' : 'Kalibriert: Die Schwellen aller Arbeitsformen sind an eure Klasse angepasst.';
    refreshStatus();
  }

  /* ---------- Hinweiskarten ---------- */
  function card(title, html, buttons) {
    $('mt').textContent = title; $('mb').innerHTML = html;
    var row = $('mbtn'); row.innerHTML = '';
    (buttons || []).forEach(function (b) { var el = document.createElement('button'); el.type = 'button'; el.className = 'btn' + (b.primary ? ' primary' : (b.ghost ? ' ghost' : '')); el.textContent = b.label; el.onclick = b.fn; row.appendChild(el); });
    $('veil').hidden = false; var f = row.querySelector('button'); if (f) f.focus();
  }
  function hideCard() { $('veil').hidden = true; calibrating = null; }
  function showReady() {
    card('Bereit für die Arbeitsphase?', '<p>Wenn ihr startet, fragt der Browser nach dem Mikrofon. Der Ton wird nur auf diesem Gerät ausgewertet – nichts wird aufgenommen oder gesendet.</p>',
      [{ label: 'Start', primary: true, fn: function () { hideCard(); begin(); } }, { label: 'Ohne Mikrofon (Demo)', ghost: true, fn: function () { hideCard(); setDemo(true); begin(); } }]);
  }
  var ERR = {
    denied: ['Das Mikrofon ist nicht freigegeben.', 'Bitte erlaubt den Zugriff im Browser (Schloss-Symbol neben der Adresszeile) und versucht es noch einmal.'],
    nomic: ['Es wurde kein Mikrofon gefunden.', 'Bitte schließt ein Mikrofon an oder prüft, ob es eingeschaltet ist.'],
    busy: ['Das Mikrofon wird gerade von einem anderen Programm benutzt.', 'Schließt andere Programme (zum Beispiel Videokonferenzen) und versucht es dann erneut.'],
    unsupported: ['Dieser Browser kann das Mikrofon leider nicht nutzen.', 'Bitte nutzt einen aktuellen Browser wie Chrome, Edge, Firefox oder Safari.'],
    insecure: ['Das Mikrofon funktioniert nur über eine sichere Adresse.', 'Öffnet die Seite über „https://“ oder über „http://localhost“ (siehe README).'],
    device: ['Das gewählte Mikrofon ist nicht verfügbar.', 'Wählt in den Einstellungen ein anderes Mikrofon aus.'],
    lost: ['Das Mikrofon wurde getrennt.', 'Bitte verbindet es wieder und versucht es erneut.'],
    interrupted: ['Die Messung war kurz unterbrochen.', 'Das passiert zum Beispiel beim Wechsel des Tabs oder wenn der Bildschirm gesperrt war. Mit einem Klick geht es weiter.'],
    other: ['Das Mikrofon konnte nicht gestartet werden.', 'Bitte versucht es noch einmal oder nutzt den Demo-Modus.']
  };
  function showError(kind) {
    var e = ERR[kind] || ERR.other; phase = phase === 'running' ? 'paused' : phase; refreshUI();
    card(e[0], '<p>' + esc(e[1]) + '</p>', [{ label: 'Erneut versuchen', primary: true, fn: function () { hideCard(); begin(); } }, { label: 'Demo-Modus nutzen', ghost: true, fn: function () { hideCard(); setDemo(true); begin(); } }]);
  }
  function toast(t, ms) { var el = $('toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, ms || 3500); }

  /* ---------- Messung starten/stoppen ---------- */
  function begin() {
    if (demo) { startLoop(); phase = 'running'; refreshUI(); return; }
    meter.on.lost = function () { if (phase === 'running' || phase === 'paused') { showError('lost'); } };
    meter.on.state = function (st) { if (st !== 'running' && phase === 'running' && document.visibilityState === 'visible') meter.resume(); };
    meter.start(S.deviceId || undefined).then(function () {
      fillDevices(); phase = 'running'; startLoop(); refreshUI(); wake();
    }).catch(function (err) {
      if (err && err.kind === 'device' && S.deviceId) { S.deviceId = ''; save(); }
      showError(err && err.kind || 'other');
    });
  }
  function stopMeasuring() { stopLoop(); meter.stop(); }
  function startLoop() { stopLoop(); lastT = performance.now(); timer = setInterval(tick, 50); }
  function stopLoop() { if (timer) { clearInterval(timer); timer = null; } }
  function setDemo(on) {
    demo = !!on; engine.timeScale = demo && S.demoFast ? 6 : 1;
    if (demo) { meter.stop(); } $('demo').checked = demo; $('demoBox').hidden = !demo; refreshUI();
  }

  function currentDb() {
    if (demo) return E.DB_MIN + S.demoV / 100 * 60;
    return meter.isLive() ? meter.read() : null;
  }
  function tick() {
    var now = performance.now(), dt = (now - lastT) / 1000; lastT = now;
    if (dt > 1) dt = 0.05;                              // Tab war im Hintergrund: keine Sprünge
    var db = currentDb();
    if (db === null) { if (phase === 'running' && !demo && !meter.active) { /* Meldung kam schon über 'lost' */ } return; }
    if (phase === 'running' || calibrating) {
      var keep = engine.count, ev = engine.update(dt, db);
      if (calibrating) { engine.count = keep; calibSample(db, dt); }
      else if (ev.length) { view.set(engine.count, false); }
    }
    drawRibbon(); refreshStatus();
  }
  function drawRibbon() {
    var r = $('ribbon'); if (r.hidden) return;
    $('dot').style.left = (E.norm(engine.level) * 100) + '%';
    if (r.getAttribute('data-zone') !== engine.zone) r.setAttribute('data-zone', engine.zone);
    $('okzone').style.width = (E.norm(engine.upper()) * 100) + '%';
  }

  /* ---------- Kalibrierung ---------- */
  var CAL_S = 5;
  function startCalib() {
    if (phase === 'ready' || phase === 'start') { toast('Bitte zuerst starten.'); return; }
    if (!demo && !meter.isLive()) { toast('Das Mikrofon ist noch nicht aktiv.'); return; }
    closeDrawer();
    var C = 2 * Math.PI * 52;
    card('So klingt unsere passende Arbeitslautstärke.', '<p>Bitte arbeitet jetzt <b>' + CAL_S + ' Sekunden</b> so, wie es für eure Aufgabe passend ist.</p><svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" id="calfg" cx="60" cy="60" r="52" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/><text id="caltx" x="60" y="62">' + CAL_S + '</text></svg>',
      [{ label: 'Abbrechen', ghost: true, fn: function () { hideCard(); refreshUI(); } }]);
    calibrating = { t: 0, samples: [], C: C };
  }
  function calibSample(db, dt) {
    var c = calibrating; if (!c) return;
    c.t += dt; c.samples.push(engine.level);
    var fg = $('calfg'); if (fg) fg.setAttribute('stroke-dashoffset', c.C * (1 - Math.min(1, c.t / CAL_S)));
    var tx = $('caltx'); if (tx) tx.textContent = Math.max(0, Math.ceil(CAL_S - c.t));
    if (c.t >= CAL_S) finishCalib(c);
  }
  function finishCalib(c) {
    calibrating = null;
    var measured = E.percentile(c.samples, 0.7);
    if (measured < -70) { hideCard(); card('Es war ganz still.', '<p>Bitte arbeitet beim Einstellen in der Lautstärke, die für eure Aufgabe passend ist, und versucht es noch einmal.</p>', [{ label: 'Noch einmal', primary: true, fn: function () { hideCard(); startCalib(); } }, { label: 'Schließen', ghost: true, fn: function () { hideCard(); } }]); return; }
    S.calib = engine.calibrate(measured); save(); hideCard(); refreshUI(); toast('Gespeichert: Die passende Arbeitslautstärke ist eingestellt.');
  }

  /* ---------- Steuerung ---------- */
  function togglePlay() {
    if (phase === 'ready') { hideCard(); begin(); return; }
    if (phase === 'running') { phase = 'paused'; refreshUI(); return; }
    if (phase === 'paused') {
      if (!demo && !meter.isLive()) { meter.resume().then(function () { if (meter.isLive()) { phase = 'running'; lastT = performance.now(); refreshUI(); } else showError('interrupted'); }); return; }
      phase = 'running'; lastT = performance.now(); refreshUI();
    }
  }
  function restart() {
    engine.reset(); engine.timeScale = demo && S.demoFast ? 6 : 1; view.set(engine.count, true);
    if (phase === 'paused' || phase === 'ready') { /* bleibt */ } refreshUI(); toast('Neustart: Wir fangen ruhig von vorn an.', 2500);
  }
  function setFullscreen() {
    var d = document, de = d.documentElement;
    try {
      if (d.fullscreenElement) { d.exitFullscreen(); }
      else if (de.requestFullscreen) { de.requestFullscreen().catch(function () { toast('Vollbild ist hier nicht möglich.'); }); }
      else toast('Dieser Browser bietet kein Vollbild.');
    } catch (e) { toast('Vollbild ist hier nicht möglich.'); }
  }
  document.addEventListener('fullscreenchange', function () { $('fullLbl').textContent = document.fullscreenElement ? 'Vollbild beenden' : 'Vollbild'; fit(); });

  function buildSeasonMenu() {
    var m = $('seasonmenu'); m.innerHTML = '';
    JZ.KEYS.forEach(function (k) {
      var d = JZ.worlds[k], b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitem');
      b.innerHTML = esc(d.name) + '<small>' + esc(d.short) + '</small>'; if (k === worldKey) b.setAttribute('aria-current', 'true');
      b.onclick = function () { closeMenu(); if (k !== worldKey) { mount(k, engine.count, true); refreshUI(); } };
      m.appendChild(b);
    });
    var all = document.createElement('button'); all.type = 'button'; all.className = 'full'; all.textContent = 'Zur Auswahl aller Welten'; all.onclick = function () { closeMenu(); toStart(); }; m.appendChild(all);
  }
  function openMenu() { closeDrawer(); buildSeasonMenu(); $('seasonmenu').hidden = false; $('bSeason').setAttribute('aria-expanded', 'true'); var f = $('seasonmenu').querySelector('button[aria-current]') || $('seasonmenu button'); f && f.focus(); }
  function closeMenu() { $('seasonmenu').hidden = true; $('bSeason').setAttribute('aria-expanded', 'false'); }
  function openDrawer() { closeMenu(); fillDevices(); $('drawer').classList.add('open'); $('bSet').setAttribute('aria-expanded', 'true'); $('closeDrawer').focus(); }
  function closeDrawer() { $('drawer').classList.remove('open'); $('bSet').setAttribute('aria-expanded', 'false'); }
  function closeAll() { closeMenu(); closeDrawer(); hideCard(); }

  function fillDevices() {
    JZ.Meter.devices().then(function (list) {
      var sel = $('mic'), cur = S.deviceId || (meter.deviceId || '');
      sel.innerHTML = '<option value="">Standard-Mikrofon</option>';
      list.forEach(function (d, i) { if (!d.deviceId) return; var o = document.createElement('option'); o.value = d.deviceId; o.textContent = d.label || ('Mikrofon ' + (i + 1)); sel.appendChild(o); });
      sel.value = S.deviceId; if (sel.value !== S.deviceId) sel.value = '';
    });
  }

  function buildSettings() {
    var fm = $('fsMode'); Object.keys(E.MODES).forEach(function (k) {
      var m = E.MODES[k], l = document.createElement('label'); l.className = 'opt';
      l.innerHTML = '<input type="radio" name="mode" value="' + k + '"><span><b>' + m.label + '</b><small>' + m.hint + '</small></span>'; fm.appendChild(l);
    });
    var ft = $('fsTempo'); var desc = { langsam: 'Eine Figur kommt nach etwa 60 s passender Ruhe, geht nach etwa 30 s Lautstärke.', normal: 'Eine Figur kommt nach etwa 30 s passender Ruhe, geht nach etwa 20 s Lautstärke.', schnell: 'Eine Figur kommt nach etwa 15 s passender Ruhe, geht nach etwa 12 s Lautstärke.' };
    Object.keys(E.TEMPOS).forEach(function (k) {
      var l = document.createElement('label'); l.className = 'opt'; l.innerHTML = '<input type="radio" name="tempo" value="' + k + '"><span><b>' + E.TEMPOS[k].label + '</b><small>' + desc[k] + '</small></span>'; ft.appendChild(l);
    });
    document.querySelector('input[name=mode][value=' + S.mode + ']').checked = true;
    document.querySelector('input[name=tempo][value=' + S.tempo + ']').checked = true;
    $('sens').value = S.sens; $('showBar').checked = S.showBar; $('demoV').value = S.demoV; $('demoFast').checked = S.demoFast;
    document.querySelectorAll('input[name=mode]').forEach(function (r) { r.onchange = function () { S.mode = r.value; engine.setMode(S.mode); engine.calmT = engine.loudT = 0; save(); refreshUI(); }; });
    document.querySelectorAll('input[name=tempo]').forEach(function (r) { r.onchange = function () { S.tempo = r.value; engine.setTempo(S.tempo); save(); }; });
    $('sens').oninput = function () { S.sens = +this.value; engine.setSens(S.sens); save(); refreshUI(); };
    $('showBar').onchange = function () { S.showBar = this.checked; save(); refreshUI(); };
    $('demo').onchange = function () { if (this.checked) { setDemo(true); if (phase === 'ready') { hideCard(); begin(); } else if (phase !== 'start') { if (!timer) startLoop(); if (phase === 'paused') { /* bleibt pausiert */ } } } else { demo = false; refreshUI(); $('demoBox').hidden = true; if (phase === 'running' || phase === 'paused') { phase = 'paused'; begin(); } } };
    $('demoV').oninput = function () { S.demoV = +this.value; save(); };
    $('demoFast').onchange = function () { S.demoFast = this.checked; engine.timeScale = demo && S.demoFast ? 6 : 1; save(); refreshUI(); };
    $('bCalib').onclick = startCalib;
    $('bCalibReset').onclick = function () { engine.clearCalibration(); S.calib = null; save(); refreshUI(); toast('Standardwerte sind wieder aktiv.'); };
    $('mic').onchange = function () { S.deviceId = this.value; save(); };
    $('bMic').onclick = function () { if (demo) { toast('Der Demo-Modus nutzt kein Mikrofon.'); return; } closeDrawer(); stopLoop(); if (phase === 'running') phase = 'paused'; begin(); };
    $('closeDrawer').onclick = function () { closeDrawer(); $('bSet').focus(); };
  }

  /* ---------- Steuerleiste verstecken bei Ruhe ---------- */
  function poke() {
    var st = $('stage'); if (st.hidden) return; st.classList.remove('idle'); clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (phase !== 'running' || $('drawer').classList.contains('open') || !$('seasonmenu').hidden || !$('veil').hidden) return;
      if ($('dock').contains(document.activeElement) && document.activeElement.matches(':focus-visible')) return;
      st.classList.add('idle');
    }, 6000);
  }
  ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'].forEach(function (n) { window.addEventListener(n, poke, { passive: true }); });

  function wake() { try { if (navigator.wakeLock && !wakeLock) navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; l.addEventListener('release', function () { wakeLock = null; }); }).catch(function () {}); } catch (e) {} }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      lastT = performance.now(); wake();
      if (phase === 'running' && !demo && !meter.isLive()) {
        meter.resume().then(function () { if (!meter.isLive()) { showError(meter.active ? 'interrupted' : 'lost'); } }).catch(function () { showError('interrupted'); });
      }
    }
  });

  window.addEventListener('keydown', function (e) {
    if ($('stage').hidden) return;
    var t = e.target, typing = t && (t.tagName === 'INPUT' && t.type !== 'radio' && t.type !== 'checkbox' || t.tagName === 'SELECT');
    if (e.key === 'Escape') { if ($('drawer').classList.contains('open')) { closeDrawer(); $('bSet').focus(); } else if (!$('seasonmenu').hidden) { closeMenu(); $('bSeason').focus(); } else if (!$('veil').hidden && phase !== 'ready') { hideCard(); } return; }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k === ' ' && t.tagName !== 'BUTTON') { e.preventDefault(); togglePlay(); }
    else if (k === 'f') setFullscreen();
    else if (k === 's') ($('drawer').classList.contains('open') ? closeDrawer() : openDrawer());
  });

  window.addEventListener('resize', fit);

  $('bPlay').onclick = togglePlay;
  $('bRestart').onclick = restart;
  $('bSeason').onclick = function () { $('seasonmenu').hidden ? openMenu() : closeMenu(); };
  $('bFull').onclick = setFullscreen;
  $('bSet').onclick = function () { $('drawer').classList.contains('open') ? closeDrawer() : openDrawer(); };
  $('startDemo').onclick = function () { setDemo(true); S.demoFast = S.demoFast; $('demo').checked = true; openWorld(JZ.KEYS[0], false); hideCard(); phase = 'ready'; togglePlay(); };
  document.addEventListener('click', function (e) { if (!$('seasonmenu').hidden && !e.target.closest('#seasonmenu') && !e.target.closest('#bSeason')) closeMenu(); });

  buildStart(); buildSettings();
  if (!('fullscreenEnabled' in document) || !document.fullscreenEnabled) { /* Knopf bleibt, meldet beim Klick */ }

  /* Nur für automatische Tests (unsichtbar, ohne Wirkung für Nutzer) */
  window.__jz = { engine: engine, meter: meter, get view() { return view; }, get phase() { return phase; }, get demo() { return demo; }, setDemoV: function (v) { S.demoV = v; $('demoV').value = v; }, S: S };
})();
