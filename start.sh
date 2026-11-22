#!/bin/sh
cd "$(dirname "$0")"
echo "Jahreszeiten-Zauber: http://localhost:8080  (Beenden mit Strg+C)"
python3 -m http.server 8080
