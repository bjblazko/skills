# Visual system

Platform-neutral values. The web reference implementation is
[tokens.css](tokens.css); other stacks port the same numbers (see
[platforms.md](platforms.md)). Token names below are the canonical names —
keep them when porting so projects stay comparable.

## Color

Color exists to signal function and state. A screen must read correctly with
every accent removed; color then adds meaning, sparingly.

**Budget:** ~90 % neutral surface · ~9 % structure (text, lines, icons) ·
~1 % signal.

### Neutrals

Slightly warm, like a matte housing — not clinical white, not beige.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#F4F4F0` | `#161718` | Page / screen background |
| `bg-2` | `#EAEAE5` | `#1E1F21` | Raised or inset areas: sidebars, wells, selected row (quiet) |
| `bg-3` | `#DFDFD9` | `#28292B` | Pressed state of quiet controls, code blocks |
| `line` | `#D2D3CD` | `#333538` | Hairline separators (decorative, no contrast requirement) |
| `line-strong` | `#80817C` | `#6E706C` | Borders of inputs and controls (≥ 3:1 on `bg`) |
| `fg-3` | `#686A65` | `#9C9E99` | Captions, metadata, placeholders (≥ 4.5:1) |
| `fg-2` | `#4A4C4E` | `#C2C3BE` | Secondary text, quiet icons |
| `fg` | `#1E1F21` | `#EDEDE8` | Primary text, strong selection fill |

### Signal colors

Each has exactly one meaning, fixed across all products.

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `accent` | `#E85D04` | `#F07A2A` | **The** primary action on a screen; the current value of something the user is actively adjusting |
| `accent-fg` | `#1E1F21` | `#1E1F21` | Text/icon on an `accent` fill (white fails contrast) |
| `accent-ink` | `#B84A00` | `#F07A2A` | Accent used as text or thin mark on `bg` |
| `confirm` | `#2A8C4A` | `#3FB765` | Active, on, confirmed, success (fill or mark) |
| `confirm-ink` | `#1A6E37` | `#3FB765` | Confirm as text |
| `time` | `#F5AA1C` | `#F5AA1C` | Time passing: progress, elapsed, timers — only |
| `time-ink` | `#8A5A00` | `#F5AA1C` | Time as text or thin mark on light `bg` |
| `warning` | `#D62828` | `#F0605A` | Needs attention: errors, destructive actions, critical levels |
| `warning-ink` | `#B91C1C` | `#F0605A` | Warning as small text on a tint |

**Rules**
- **One permanently visible accent element per screen.** A transient
  indicator of an ongoing user adjustment is the only exception.
- **Yellow is not a second call-to-action color.** On a light background it
  is only a fill with `fg` text on it, or `time-ink` for thin marks.
- **Similar-looking indicators get different signal colors by meaning**,
  never by taste.
- **Status is never color alone** — pair with a word or an icon.
- **Soft tints** (for badges, inline status backgrounds): the signal color at
  ~12 % over `bg`, e.g. `color-mix(in oklch, var(--confirm) 12%, var(--bg))`,
  with the `*-ink` color for its text.
- **A project may swap the accent hue** (e.g. to a brand orange) if it keeps
  the ≥ 4.5:1 contrast with `accent-fg` and records it as a deviation.
- New colors are added to the token file first, then used. Never raw values
  in components.

## Typography

**Families** (both SIL Open Font License — free to embed and self-host):

| Token | Stack | Use |
|---|---|---|
| `font-sans` | `"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | All UI text, headings, body |
| `font-mono` | `"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace` | Numbers in data, file names, code, IDs, technical metadata |

- Numerals are tabular (`font-variant-numeric: tabular-nums`) in tables,
  counters, timers, prices — anywhere digits change or align.
- Weights: 400 regular, 500 medium (labels, buttons), 600 semibold
  (headings). No light, no bold-black.
- Self-host subsetted WOFF2; no font CDN unless the project already
  depends on one.

**Scale** (px; line-height in parentheses):

| Token | Size | Use |
|---|---|---|
| `text-xs` | 11 (1.3) | Meta labels, uppercase + 0.06 em tracking allowed here only |
| `text-sm` | 13 (1.4) | Dense UI, captions, buttons in toolbars |
| `text-base` | 15 (1.45) | Default UI text, buttons, inputs |
| `text-md` | 17 (1.55) | Long-form body |
| `text-lg` | 20 (1.4) | Lead text, section headings in apps |
| `text-xl` | 26 (1.2) | Page title in apps |
| `text-2xl` | 34 (1.15) | Marketing section heading |
| `text-3xl` | 48 (1.1) | Marketing page title (one per page) |

- Sentence case for headings, buttons, menu items. Title case only for
  proper nouns.
- Reading column max ~70 characters (`--container-text: 42rem`).

## Spacing and layout

4 px base: `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 ·
`space-5` 20 · `space-6` 24 · `space-8` 32 · `space-10` 40 · `space-12` 48 ·
`space-16` 64 · `space-24` 96.

- No values off the scale. Group by proximity: related things closer than
  unrelated ones — spacing is the first tool for structure, before lines and
  boxes.
- Gutter `space-6`. App content max width is the window; marketing
  container `75rem`.
- Align to a column grid; left edges line up.

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 2 px | Inputs, tags, table cells if any |
| `radius-md` | 4 px | Buttons, cards, menus |
| `radius-lg` | 8 px | Large panels, modals |
| `radius-full` | 50 % / 999 px | Round controls only (knobs, radio, avatar, toggle, badge) |

- Flat. Separate areas with a surface step (`bg` → `bg-2`) or a `line`
  hairline, not both.
- `shadow-float` exists only for layers that float above content: popover,
  menu, dropdown, modal, drag preview. Nothing at rest has a shadow.
- Modal scrim: solid `fg` at 40 % (light) / black at 60 % (dark). No blur.

## Motion

| Token | Value | Use |
|---|---|---|
| `dur-quick` | 120 ms | Color, opacity changes |
| `dur` | 160 ms | Default |
| `dur-slow` | 240 ms | Panels, route changes |
| `ease` | `cubic-bezier(0.2, 0, 0, 1)` | Ease-out, everywhere |

Animate only to explain a state change (where something came from / went).
Animate opacity, color, small translations. Never bounce, spring, overshoot,
page-load fade-ins, parallax or looping ambient motion. With
`prefers-reduced-motion: reduce`, durations go to 0.

## Interactive states

Every control implements the same state contract:

| State | Treatment |
|---|---|
| Hover (pointer only) | Background overlay: `fg` at 5 % (light) / `fg` at 8 % (dark). No movement. |
| Pressed | Overlay 10 % / 14 %; optional 1 px translate down. |
| Focus-visible | 2 px `accent` ring, 2 px offset from the control. Never removed. |
| Selected | `fg` fill with `bg` text (strong) or `bg-2` fill (quiet). |
| Disabled | 40 % opacity, no pointer events; explain why nearby if not obvious. |

Minimum hit area: 44 × 44 px on touch, 24 × 24 px with a pointer.

### Control height

Controls that sit in one row share one height — buttons, selects, inputs,
segment groups and switches are cut from the same stock.

| Token | Value | Use |
|---|---|---|
| `control-h` | 36 px | Default buttons, selects, inputs, segment groups |
| `control-h-sm` | 30 px | Toolbars and dense headers: the small variant of every control, and switches |

- Set `height`, not `min-height` plus vertical padding, with
  `box-sizing: border-box` — a border counts inside the height, never on top
  (a segment group's outline must not make it 2 px taller).
- A select styled as a button drops its native look (`appearance: none`)
  and draws its own arrow, so it matches the buttons beside it.
- A switch row gets the control height too, not just its track height.
- Never mix default and small controls in one row.
- On touch layouts both sizes grow to the 44 px target.

## Components

**Buttons** — three roles, one helper. Every action is recognizably a
button: it always has a frame. Rank comes from color and order, never from
a missing frame.
- *Primary*: `accent` fill, `accent-fg` label, medium weight. One per screen.
- *Secondary*: `bg` fill, `line-strong` 1 px border, `fg` label.
- *Quiet*: `bg` fill, `line-strong` 1 px border, `fg-2` label or icon; for
  utilities and low-priority actions.
- Controls are neutral grey, like the housing; a green, olive or other
  colored button would dilute that color's signal meaning.

**Actions vs. navigation** — a button changes something (adds, exports,
deletes); navigation only changes where you are and is always reversible.
- Navigation entries are links (`<a href>`), so back, deep links and "open
  in new tab" work. Full-row, icon + label, no frame; the current place is
  marked with a strong fill and `aria-current="page"`.
- Only two things are frameless: navigation entries and links inside running
  text (underlined).
- Never style an action as plain text, and never make a navigation entry a
  `<button>`.
- *Destructive*: secondary styling with `warning` label; confirm with a
  second, explicit step naming the object ("Delete 3 photos").
- Label is a verb + object ("Export album"), not "OK"/"Submit". Icon-only
  buttons carry an accessible name and a tooltip.

**Inputs** — label always visible above the field (`text-sm`, `fg-2`),
hint below in `fg-3`; an error replaces the hint in the same slot in
`warning`. Border `line-strong`; focus = accent ring. Placeholder shows an
example, never the label.

**Switches** — the state is readable without color: label the two positions
("On/Off", "List/Grid") or show the current state in words next to it. On =
`confirm` fill.

**Lists and tables** — hairline separators or zebra via `bg-2`, not both.
Numbers right-aligned, tabular, mono. Row height fits a 44 px target on
touch. Selected row: `fg` fill (strong) when it drives the rest of the
screen, `bg-2` otherwise.

**Cards** — use only when items are truly independent objects. Surface
step or hairline border; no shadow, no hover lift.

**Badges** — `text-xs`, medium, soft tint background, `*-ink` text,
`radius-full`. For state, not for counts that aren't actionable.

**Empty states** — one sentence saying what goes here and one action to get
there. No illustration unless it explains something.

**Progress** — determinate when the total is known; otherwise say what is
happening in words. Never fake a percentage.

## Iconography

- Line icons, 1.5 px stroke (at 24 px), round caps and joins,
  `currentColor`. Lucide (ISC license) is the default set.
- Sizes 16 / 20 / 24 px. One set per product; no mixing.
- An icon supports a label; it replaces one only for universally known
  actions (close, search, back, play/pause) and then has an accessible name.
- No emoji. Allowed typographic glyphs: ← → ↑ ↓ · × ✓ — ⌘ ⌥ ⇧ ⌃.

## Imagery

Real content over illustration. Photos without frames, shadows or rounded
decoration beyond `radius-md`. Placeholder for missing images: a flat
`bg-2` block, or better, something useful in its place.

## Voice (UI copy)

- Plain declarative sentences. Say what the tool does, not what it is.
- Specifics over superlatives: numbers, units, names ("Saved 12 photos",
  not "Success!").
- Errors: what happened, why if known, what to do next. No "Oops".
- Address the reader as "you". Never "users" in the UI.
- No exclamation marks, no emoji, no jokes in errors.
- Sentence case everywhere.
- Same term for the same thing throughout the product.
