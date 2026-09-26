# Porting to other platforms

The values in visual-system.md are the source. When porting, keep the token
names (as constants, theme keys or resources) so every product speaks the
same vocabulary.

## Web

Use [tokens.css](tokens.css). Vanilla CSS works directly; for Tailwind or
CSS-in-JS, map the theme to the CSS variables rather than duplicating hex
values. Self-host fonts. Theme via `data-theme` on `<html>` plus the OS
preference.

## Native desktop and mobile (macOS, iOS, Android, Windows, GTK/Qt)

Principle 7 outweighs the visual system here: **use the platform's native
controls, navigation patterns and system font** where the platform has a
strong convention (menus, sheets, back navigation, switches, pickers). Apply
the huepattl-rams-design layer on top:
- Neutral palette and the four signal meanings (tint the platform accent to
  `accent` only if the platform allows a single accent).
- One primary action per screen, flat surfaces, the spacing scale, voice
  rules, state completeness.
- Keep the platform's system font unless the product is document- or
  data-heavy and benefits from IBM Plex Mono for data.

## Embedded and small displays (LVGL, microcontroller TFT/OLED)

- Put every value in one theme header (`Theme.h` or similar) as named
  constants; UI code never uses raw colors.
- **Judge colors on the physical panel**, not on a monitor or screenshot.
  RGB565 panels round subtle neutrals and may shift hue; adjust the neutral
  token on the device and record it as a deviation.
- Prefer light-on-dark or dark-on-light with strong contrast; low-cost
  panels have narrow viewing angles.
- Energy: no perpetual animation; stop animations when the screen is off or
  the element is hidden; dim/sleep the display when idle.
- Pre-render fonts at the few sizes the scale actually uses; restrict the
  glyph range consciously and cover the languages the content uses.
- Hit targets ≥ 44 px equivalent on touch; physical controls (knobs,
  buttons) should have one obvious, consistent meaning per screen.
- Non-rectangular displays: keep content and controls inside the visible
  area; check every screen's edges on the device.

## Terminal / TUI

- Neutrals map to the terminal's default foreground/background; do not
  force a background color.
- Signal colors map to ANSI: accent → yellow/bright yellow or orange where
  256 colors exist; confirm → green; warning → red. Never rely on color
  alone (prefix with a word or symbol).
- Honor `NO_COLOR`. Keep output quiet by default; details behind
  `--verbose`.

## Documents, slides, email

Same palette, IBM Plex Sans/Mono, the type scale, one accent use per page,
no decorative imagery.
