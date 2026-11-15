---
name: kanso-rezept
description: Extrahiert Rezepte aus URLs in ein einheitliches Markdown-Format. Empfängt eine URL zu einem Rezept und gibt Titel, Zutaten, Schritte, Koch-/Backzeit, Portionsgröße, Nährwerte (falls verfügbar), Titelbild (falls verfügbar), Copyright-Hinweis und Quell-URL zurück.
---

# kanso-rezept

## Overview

Rezept-Extraktion aus URLs mit dem Prinzip Kanso (K simplicity). Klartext-Markdown, keine Dekoration, keine Farben. Jedes Rezept folgt demselben Schema — konsistent, lesbar, privat nutzbar.

## Workflow

### Eingabe

1. Der User gibt eine URL zu einem Rezept (z.B. `https://beispiel.de/rezept/hackfleischpfanne`).
2. Die URL ist gültig und zeigt auf eine Rezepteite.

### Extraktion

1. Seite als HTML laden, dann als Text rendern (`webfetch` mit `format=text`).
2. Strukturierte Daten (JSON-LD `Recipe`) priorisieren — dort stehen Zutaten, Schritte, Zeiten, Nährwerte am zuverlässigsten.
3. Fallback: Textinhalt parsen (Zutatenlisten, nummerierte/schrittweise Anleitungen).
4. Titelbild extrahieren aus `<img>` Tags oder Open Graph Bildern (`og:image`).

### Ausgabe — fixes Format

```markdown
# [Rezept-Titel]

[Kurzbeschreibung, 1 Satz]

- **Quelle:** [URL](url) · [Autor, falls verfügbar]
- **Kochzeit:** [X Min.] · **Backzeit:** [Y Min.] · **Gesamt:** [Z Min.]
- **Portionen:** [Anzahl, falls verfügbar]

## Zutaten

- **[Menge]** [Zutat]
- **[Menge]** [Zutat]
- ...

## Schritte

1. [Schritt 1]
2. [Schritt 2]
3. ...

## Nährwerte (falls verfügbar)

- **Kalorien:** [X kcal] pro Portion
- **Eiweiß:** [X g]
- **Fett:** [X g]
- **Kohlenhydrate:** [X g]

## Titelbild

![Rezept](bild-url)

---

© Quelle: [URL](url). Für den privaten Sammler extrahiert.
```

### Regeln

- **Kein Bild verfügbar:** Diese Sektion weglassen.
- **Keine Nährwerte verfügbar:** Diese Sektion weglassen.
- **Keine Portionen/Zeiten verfügbar:** Die entsprechende Zeile ausmetadaten weglassen.
- **Copyright:** Immer die Quell-URL mit ©-Hinweis am Ende aufnehmen — privat, nicht publizieren.
- **Neutrales Markdown:** Keine Emojis im Rezeptkörper (nur im Skill-Kontext). Kein Farben, keine HTML.

### Fehlerbehandlung

Wenn die URL ungültig ist oder das Scraping fehlschlägt:

```markdown
## ❌ Fehler

Konnte Rezept nicht extrahieren.

- **URL:** [url](url)
- **Grund:** [Fehlerbeschreibung]

Versuch es bitte mit einer anderen URL oder prüfe, ob die Seite erreichbar ist.
```

## Never

- Rezepte vollständig kopieren (fair-use: Zutaten + kompakte Schritte)
-_publikation_ der extrahierten Rezepte (privat sammler nur)
- Decorative emojis im Rezeptkörper
- HTML / farbige Formatierung
- Passwordschutzete bypassen
