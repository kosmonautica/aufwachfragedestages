# Aufwachfrage des Tages - Archiv

Eine minimalistische statische Website, die zufällige Aufwachfragen aus dem [Aufwachfrage-Archiv](https://www.aufwachfrage.de) anzeigt.

## Features

### Hauptseite
- Zeigt eine zufällige Aufwachfrage beim Laden der Seite
- Button zum Laden einer neuen zufälligen Frage
- Keine Wiederholung der gleichen Frage unmittelbar hintereinander
- Dunkles, minimalistisches Design
- Vollständig responsiv für Mobile und Desktop

### History-Lane
Eine separate Seite zur Anzeige aller Fragen, die an einem bestimmten Tag (Tag + Monat) über alle Jahre hinweg veröffentlicht wurden.

**Funktionen:**
- Zeigt standardmäßig Fragen des aktuellen Datums
- Datumsauswahl via manuelle Eingabe im Format DD.MM (Tag + Monat, ohne Jahr)
- Navigation:
  - "Früher" / "Später" Links für tageweise Navigation
  - "Heute" Button zum Zurücksetzen auf aktuelles Datum
  - "Aktualisieren" Button zum Laden des gewählten Datums
- Chronologische Sortierung (neueste zuerst)
- Automatische Validierung ungültiger Datumsangaben (z.B. 31.02)

## Tech Stack

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Keine Frameworks oder Libraries**
- **Keine Build-Tools erforderlich**
- **Datenquelle:** GitHub Raw API (Markdown-Tabelle aus README.md)

## Projekt-Struktur

```
/
├── index.html          # Hauptseite
├── historylane.html    # History-Lane Seite
├── style.css           # Gemeinsames Styling
├── script.js           # Hauptseiten-Logik
├── historylane.js      # History-Lane Logik
├── test.html           # Unit Tests
├── requirements.md     # Funktionale Anforderungen
├── CLAUDE.md          # Entwicklungs-Workflow
└── README.md          # Dieses Dokument
```

## Installation & Deployment

### Lokale Entwicklung

1. Repository klonen:
```bash
git clone <repository-url>
cd aufwachfragedestages
```

2. Lokalen Server starten:
```bash
python3 -m http.server 8000
```

3. Browser öffnen: `http://localhost:8000`

### Tests ausführen

**Unit Tests:**
- Öffne `http://localhost:8000/test.html` im Browser
- Alle 35 Tests sollten bestehen (12 für Hauptseite, 23 für History-Lane)

**Manuelle Tests:**
- Siehe detaillierte Testcheckliste in `CLAUDE.md`

### Production Deployment

1. Dateien via FTP auf Webserver hochladen:
   - `index.html`
   - `historylane.html`
   - `style.css`
   - `script.js`
   - `historylane.js`
   - Optional: `test.html` (für Testing)

2. Keine Build-Steps erforderlich
3. Stelle sicher, dass die Domain auf das Root-Verzeichnis zeigt

## Browser-Kompatibilität

- Chrome (neueste Version)
- Firefox (neueste Version)
- Safari (neueste Version)
- Edge (neueste Version)

## Versioning

Aktuell: **v1.3.0**

Versionsnummern werden in `script.js` und `historylane.js` gepflegt und folgen [Semantic Versioning](https://semver.org/):
- **Major** (vX.0.0): Breaking Changes, große Redesigns
- **Minor** (v1.X.0): Neue Features, Design-Änderungen
- **Patch** (v1.0.X): Bugfixes, kleine Textänderungen

## Entwicklung

### Workflow

Detaillierte Entwicklungs-Workflows und Guidelines sind in `CLAUDE.md` dokumentiert.

**Wichtige Regeln:**
- Alle Tests müssen vor Code-Commits bestehen
- Keine Commits ohne vollständige Test-Durchführung
- Beide Versionsnummern (`script.js` + `historylane.js`) synchron halten

### Code-Style

- Clean, lesbarer Code
- Kommentare für wichtige Logik-Abschnitte
- Deutsche Variablen-/Funktionsnamen sind akzeptabel
- Originalwortlaut der Fragen muss exakt erhalten bleiben (keine Übersetzung)

## Lizenz

Dieses Projekt ist für die öffentliche Anzeige der Aufwachfragen von [www.aufwachfrage.de](https://www.aufwachfrage.de) entwickelt.

**Autor der Aufwachfragen:** Udo Wiegärtner
**Quelle:** www.aufwachfrage.de

## Changelog

### v1.3.0 (2026-01-07)
- History-Lane: Klickbares Kalender-Icon für nativen Date Picker
- History-Lane: Datumsformat DD.MM.YYYY mit Validierung
- History-Lane: Tageweise Navigation via "Früher"/"Später" Links
- History-Lane: "Heute" Button immer sichtbar
- History-Lane: Horizontales Layout für Input-Feld und Buttons
- Kompakteres Layout mit reduziertem Whitespace

### v1.2.0
- History-Lane Feature implementiert
- Datumsfilterung nach Tag/Monat über alle Jahre
- Unit Tests erweitert

### v1.0.0
- Initiales Release
- Zufällige Fragenauswahl
- Minimalistisches Design
