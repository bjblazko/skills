---
name: huepattl-rams-design
description: Use when building a new user interface or changing an existing one — screens, pages, components, layouts, colors, typography, icons, UI copy, interaction flows — in any stack (web, desktop, mobile, embedded displays, TUI), and when reviewing UI for quality. Also use when choosing or replacing a design system or design tokens.
---

# Rams design

## Overview

A design system and review method derived from Dieter Rams' ten principles
of good design and the functional visual language of mid-century German
industrial design. Core idea: *Weniger, aber besser* — less, but better.
The interface is a tool that recedes behind the user's task; every element
must earn its place, and color is a signal, never decoration.

## Precedence

1. **Project design doc wins.** Before designing, look for one
   (`docs/design/*`, `DESIGN.md`, a design ADR, a tokens file, the
   project's CLAUDE.md/AGENTS.md). Where it deliberately deviates from this
   skill, follow the project.
2. **Deviations are deliberate and written down.** When the project needs
   something this skill rules out, record it in the project's design doc
   under "Deviations from huepattl-rams-design" with the reason. An unrecorded
   deviation is a defect, not a choice.
3. **This skill beats generic aesthetic skills.** If another skill (e.g.
   `frontend-design`) asks for bold, distinctive or surprising aesthetics,
   this skill decides on every conflict.

## Workflow

**Building or changing UI**

1. Name the screen's **one primary job** in one sentence. If you can't, the
   screen does too much.
2. Read [principles.md](references/principles.md) once per session; apply its
   "In software" rules as constraints while you design, not afterwards.
3. Use the tokens and component rules in
   [visual-system.md](references/visual-system.md). The web reference
   implementation is [tokens.css](references/tokens.css). For non-web
   stacks, port the same values into the platform's theme file and read
   [platforms.md](references/platforms.md).
4. Before you add anything, try removing something. Prefer extending one
   existing mechanism over adding a new one.
5. Design every state, not just the happy path: empty, loading, error,
   partial, long text, huge numbers, first run, offline, disabled, focus.
6. Write UI copy with the voice rules in visual-system.md.
7. Finish with a short review (below) of what you built.

**Reviewing UI** — follow [review.md](references/review.md); its output
format is fixed.

## Quick reference

| Rule | Detail |
|---|---|
| One primary action per screen | The only element in the accent color. Everything else is secondary or quiet. |
| Color = meaning | Neutral 90 % · structure 9 % · signal 1 %. The UI must still work in grayscale. |
| Signal colors | Orange: the primary action · Green: active/confirmed · Yellow: time passing · Red: needs attention. Never decorative. |
| Type | IBM Plex Sans for UI and text; IBM Plex Mono only for numbers, data, code. Tabular numerals. Weights 400/500/600. |
| Depth | Flat. Separate with surface steps and hairlines. One shadow, only for floating layers (popover, menu, modal). |
| Shape | Radii 2/4/8 px; full circle only for round controls. No pills except toggles and badges. |
| Motion | 120–240 ms ease-out, state changes only. No bounce, no ambient or looping animation, honor reduced motion. |
| Spacing | 4 px base scale, no magic numbers. Generous whitespace. |
| Honesty | Show only what is known. No fake progress, no dark patterns, no inflated claims. |
| Buttons vs. navigation | Every action has a frame; rank = color and order. Navigation entries are links (`<a href>`, `aria-current`), frameless. Frameless otherwise only for links in running text. |
| Control height | Everything in one row shares one height: 36 px default, 30 px small (`--control-h`, `--control-h-sm`). Borders count inside it. |
| Detail | Focus ring always visible, 44 px touch targets, labels above inputs, contrast ≥ 4.5:1 for text. |

## Never

Gradients · glassmorphism / backdrop blur · glows · decorative shadows ·
colored left-border "accent stripes" · emoji in UI · placeholder-as-label ·
removed focus outlines · icon-only buttons without accessible name ·
frameless action buttons that read as text · navigation built from `<button>` ·
confirm-shaming or pre-checked opt-ins · spinners without a reason to wait ·
auto-playing or perpetual animation · a second accent color competing with
the first.

## Common mistakes

| Mistake | Fix |
|---|---|
| Accent used for links, headings, icons and the primary button at once | Accent only on the primary action; links use `--fg` underlined or `--accent-ink`. |
| Card grid with shadows and hover lift | Hairline border or surface step; no lift. Hover changes background only. |
| Status shown by color alone | Pair color with a word or icon. |
| "Modernizing" with a trend effect | Trends date; the platform's own conventions last (principle 7). |
| Designing only the filled, happy state | Empty/error/loading states are part of the design, not polish. |
| Porting tokens by eye | Copy exact values; verify contrast with `scripts/contrast.py`. |

Sources and licensing notes: [sources.md](references/sources.md).
