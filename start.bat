@echo off
echo Jahreszeiten-Zauber: http://localhost:8080  (Beenden mit Strg+C)
start "" http://localhost:8080
python -m http.server 8080
