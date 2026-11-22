# Jahreszeiten-Zauber – Vier magische Welten für eine angenehme Arbeitslautstärke

Ein Smartboard-Werkzeug für Klasse 1–4: Das Mikrofon misst die Arbeitslautstärke der Klasse. Bleibt sie passend, erscheinen nach und nach bis zu 20 Figuren (Blumen, Sonnen, Kürbisse, Schneemänner). Wird es anhaltend laut, ziehen sie sich langsam zurück – ohne Punkte, Töne oder Bewertung. Statisch, ohne Build, ohne externe Dienste.

## Starten
**Lokal (empfohlen):** Ordner öffnen und `start.bat` (Windows) bzw. `./start.sh` (Mac/Linux) ausführen, dann `http://localhost:8080` im Browser öffnen. Voraussetzung: Python 3. Alternativ jeder andere lokale Webserver.
**Direkt per Doppelklick (`file://`):** Die Oberfläche startet, aber Browser erlauben das Mikrofon bei Dateien nicht zuverlässig. Dann hilft der Demo-Modus oder der lokale Server.
**Online:** Ordner auf GitHub legen und mit Netlify verbinden (Build-Befehl leer, Publish-Verzeichnis `/`). Netlify liefert HTTPS, das für das Mikrofon nötig ist.

## Browser
Aktuelle Versionen von Chrome, Edge, Firefox, Safari (Mikrofon nur über HTTPS oder localhost). Fürs Smartboard empfiehlt sich Chrome oder Edge.

## Bedienung
Jahreszeit wählen → **Start** → Mikrofon im Browser erlauben. Steuerleiste: Start/Pause, Neustart, Jahreszeit wechseln, Vollbild (nie automatisch), Einstellungen. Die Leiste blendet sich nach 6 s Ruhe aus und erscheint bei Maus, Touch oder Taste wieder. Tasten: Leertaste = Start/Pause, F = Vollbild, S = Einstellungen, Esc = schließen.

**Arbeitsformen** (verändern die Schwellen wirklich): Stillarbeit (strengste), Partnerarbeit, Gruppenarbeit (großzügigste).
**Kalibrierung:** „Passende Lautstärke einstellen“ – 5 Sekunden so arbeiten, wie es für die Aufgabe passt. Die passende Obergrenze liegt dann 5 dB über dem Gemessenen; der Abstand zwischen den Arbeitsformen bleibt erhalten. „Zurücksetzen“ stellt die Standardwerte wieder her.
**Empfindlichkeit** 1–9 (verschiebt die Obergrenze um 1,5 dB je Stufe). **Tempo:** langsam / normal / schnell.

| Tempo | Figur kommt nach … Ruhe | Figur geht nach … Lautstärke |
|---|---|---|
| langsam | ca. 60 s | ca. 30 s |
| normal | ca. 30 s | ca. 20 s |
| schnell | ca. 15 s | ca. 12 s |

Start mit 2 Figuren, maximal 20, minimal 0.

## Wie gemessen wird
Web Audio API (`getUserMedia` + `AnalyserNode`), Effektivwert (RMS) in dBFS, logarithmisch. Anzeige geglättet (schnell hoch, langsam runter); Entscheidungen auf dem Median der letzten 3 s (kurze Spitzen wie ein fallender Stift zählen nicht); Hysterese um die Grenze; Dauergeräusche (Lüfter) heben die Grenze höchstens um 8 dB an. **Der Pegel ist ein relativer Wert und kein geeichter Schalldruckpegel (kein dB(A)).** Er ist eine Orientierung, kein Messgerät.

## Datenschutz
Der Ton wird nur im Arbeitsspeicher ausgewertet, nicht aufgenommen, gespeichert, abgespielt oder gesendet. Es gibt keine externen Anfragen, Schriften, Tracker oder Bibliotheken. Im Browser (`localStorage`) werden nur Einstellungen und Kalibrierwert gespeichert. Das Mikrofon bleibt bei „Pause“ geöffnet (Browser zeigt das Symbol); beim Zurück zur Auswahl wird es beendet.

## Demo-Modus
Ohne Mikrofon: Der Regler steuert die Lautstärke, ein „DEMO“-Hinweis ist dauerhaft sichtbar, optional im Zeitraffer (6-fach).

## Hinweise bei Problemen
Freundliche Meldungen erscheinen bei: Zugriff verweigert, kein Mikrofon, Mikrofon belegt, Browser nicht unterstützt/unsichere Adresse, Mikrofon getrennt, Messung unterbrochen (Tab-Wechsel, Bildschirmsperre).

## Dateien
`index.html`, `style.css`, `app.js` (Steuerung), `engine.js` (Messlogik), `audio.js` (Mikrofon), `worlds.js` + `world-*.js` (Illustrationen, selbst gezeichnetes SVG). `tests/` enthält die Prüfskripte (Node/Playwright, optional).

## Bekannte Einschränkungen
- Getestet wurde mit Chromium und simuliertem Mikrofon-Audio. **Ein Test mit echter Mikrofon-Hardware und im Klassenzimmer steht noch aus**; die Standardschwellen sind Startwerte – bitte einmal kalibrieren.
- Raumhall, Mikrofonposition und Verstärkung beeinflussen den Pegel; deshalb die Kalibrierung.
- Hoch- und sehr breite Bildschirme (unter 1,55:1 bzw. über 2:1) zeigen die Welt vollständig, aber mit Rand/kleiner.
- Vollbild und Bildschirm-Wachhalten hängen vom Browser ab.

## Veröffentlichen (GitHub + Netlify)
1. Auf github.com ein neues Repository anlegen (z. B. `jahreszeiten-zauber`), „Add file → Upload files“, **alle Dateien dieses Ordners** hineinziehen (auch `.gitignore`, `netlify.toml`), „Commit changes“.
2. Auf netlify.com: „Add new site → Import an existing project“ → GitHub → Repository wählen. **Build command leer lassen, Publish directory `.`** (steht schon in `netlify.toml`) → „Deploy“.
3. Die Netlify-Adresse (HTTPS) öffnen: Dort funktioniert das Mikrofon. Schneller Test ohne GitHub: den Ordner per Drag & Drop auf app.netlify.com/drop ziehen.
