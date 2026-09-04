# Dusk Ladder — Daily Planner

A printable one-page daily planner, US Letter (8.5 × 11 in).

| File | What it is |
| --- | --- |
| `daily-planner.html` | Source. Open in a browser and print at **100% scale, margins: none**. Fonts load from Google Fonts. |
| `daily-planner.pdf` | Print-ready export with fonts embedded — works offline, no browser setup. |

## Sections

Date + day-of-week chips · Schedule 6 AM–10 PM (hour rows, dotted half-hour ticks, banded
morning / afternoon / evening) · Today's Priorities (ranked 1–3) · Tasks (8 rows with a
to do / started / done / moved key) · Meals · Mood (5-point scale + three words) ·
Gratitude · Tomorrow's first move.

## Design notes

- **Type:** Bodoni Moda for the display line and the priority numerals; Barlow Condensed for
  tracked uppercase labels; IBM Plex Sans with tabular numerals for the hour ladder.
- **Color:** black ink on white paper, with one accent — a dusk ramp (amber → coral → rose →
  violet) running top to bottom of the schedule rail, so the gradient reports time of day
  rather than decorating. Band dots reuse the ramp's stops.
- **Print:** `@page { size: 8.5in 11in; margin: 0 }` with `print-color-adjust: exact`, so the
  rail and swatches survive the printer. Everything else is hairline rules — light on ink.
