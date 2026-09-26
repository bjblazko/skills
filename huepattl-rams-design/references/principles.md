# The ten principles, translated to software

Rams formulated these around 1975–80 for physical products. The headings are
his; the explanations below are paraphrases, followed by what each means for
software interfaces. Each principle ends with the question to ask of a design
and the smells that show it is being violated.

---

## 1. Good design is innovative

**Meaning.** Innovation comes from new technical possibilities, and design
develops alongside them — never as novelty for its own sake.

**In software**
- Innovate where the platform or hardware offers something genuinely new
  (a knob, a sensor, offline-first, a faster engine) and the user benefits.
- A new interaction pattern must beat the conventional one on the user's
  task, measurably or obviously. Otherwise use the convention.
- Novel visuals are not innovation.

**Ask:** What does this make possible that wasn't before — for the user?
**Smells:** custom scrollbars, reinvented form controls, gesture-only
navigation without a visible alternative, "unique" layouts that hurt scanning.

## 2. Good design makes a product useful

**Meaning.** A product exists to be used; it has to satisfy functional,
psychological and aesthetic needs, and design removes everything that
detracts from that.

**In software**
- The core task is the shortest, clearest path. Count clicks/taps for it.
- Every feature needs a real usage scenario; unused features are cost.
- Defaults are the design for most users — choose them carefully.
- Design for the real context (one hand, bright sunlight, keyboard-only,
  small window, slow network).

**Ask:** What is this screen's one job, and is it the easiest thing to do?
**Smells:** dashboards that show everything, settings for undecided
questions, primary task buried in a menu.

## 3. Good design is aesthetic

**Meaning.** Things we use every day affect our well-being; only
well-executed objects can be beautiful. Aesthetic quality is part of
usefulness, not an addition to it.

**In software**
- Beauty comes from order: one grid, one type scale, one spacing scale,
  one shape vocabulary, consistently applied.
- Alignment and rhythm matter more than ornament.
- Visual quality is part of "done", not a later polish pass.

**Ask:** Does everything sit on the same system, or does something look
improvised?
**Smells:** off-scale font sizes, one-off paddings, mixed icon styles,
inconsistent corner radii.

## 4. Good design makes a product understandable

**Meaning.** Good design clarifies how a product is structured; at best it
explains itself.

**In software**
- Where am I, what can I do, what just happened — always answerable at a
  glance.
- Exactly one visually dominant action per screen.
- Visible state over remembered modes. If a mode is unavoidable, show it
  persistently.
- Controls look like controls; text looks like text. Labels over icons
  when in doubt.
- Consistent placement: the same thing is always in the same place.

**Ask:** Could a first-time user explain this screen after five seconds?
**Smells:** mystery-meat icons, hidden gestures as the only path,
hover-only affordances, two buttons of equal weight for unequal actions.

## 5. Good design is unobtrusive

**Meaning.** Useful products are tools, neither decorative objects nor
works of art. Their design should be neutral and restrained so the user can
express themselves.

**In software**
- Content and task in the foreground; chrome recedes (quiet colors, thin
  lines, secondary controls drawn as outlines or text).
- Don't interrupt: no modal, toast, badge or notification without a real
  reason the user would agree with.
- Leave room for the user's own content (their photos, their text).

**Ask:** What here is asking for attention it hasn't earned?
**Smells:** onboarding carousels, "What's new" popups, attention badges on
everything, brand color flooding the chrome.

## 6. Good design is honest

**Meaning.** It does not make a product appear more innovative, powerful or
valuable than it is, and it does not manipulate with promises it can't keep.

**In software**
- Show only what is known: hide a progress bar if duration is unknown;
  say "estimating…" rather than inventing a number.
- No dark patterns: confirm-shaming, pre-checked consent, hidden costs,
  disguised ads, fake urgency, roach-motel cancellation.
- Loading/error states tell the truth, including whose fault it is.
- Copy states what the tool does, in specifics, without superlatives.
- Skeuomorphic affordances only where they behave like the real thing.

**Ask:** Would this still be acceptable if the user saw exactly how it works?
**Smells:** indeterminate spinners hiding a failure, "Oops!", fake
countdowns, success toasts before the save completed.

## 7. Good design is long-lasting

**Meaning.** It avoids being fashionable and therefore never looks
antiquated; it lasts many years, in contrast to throwaway fashion.

**In software**
- Prefer platform conventions and native controls; they age with the
  platform instead of against it.
- No trend effects: gradients, glassmorphism, neumorphism, glows, oversized
  rounded everything.
- A small, stable token set outlives a large, fashionable one.
- Stable information architecture: don't reshuffle navigation between
  versions without a real reason.

**Ask:** Will this look deliberate in ten years, or dated in two?
**Smells:** "2020s look", effect-driven redesigns, UI that needs a
refresh every major version.

## 8. Good design is thorough down to the last detail

**Meaning.** Nothing is arbitrary or left to chance; care and precision
show respect for the user.

**In software**
- Every state is designed: empty, loading, error, partial, offline, first
  run, very long strings, zero/one/many, huge numbers, RTL/i18n, umlauts.
- Keyboard access, visible focus, screen-reader names, reduced motion,
  contrast, touch target size.
- Pixel-level alignment, consistent truncation, tabular numerals in
  tables and counters.
- Edge of the canvas: clipping, safe areas, round or odd-shaped displays.

**Ask:** Which state or input have I not actually looked at?
**Smells:** "Lorem ipsum" still in an empty state, clipped text, focus ring
removed, jumping layout when numbers change.

## 9. Good design is environmentally friendly

**Meaning.** Design contributes to preserving the environment: it conserves
resources and minimizes physical and visual pollution over the product's
life.

**In software**
- Energy: no perpetual animation, no polling where events exist, dark
  surfaces where OLED benefits, animations stop when off-screen.
- Weight: small bundles, few web fonts (self-hosted, subsetted), optimized
  images, no unnecessary network requests or third-party trackers.
- Longevity: works on older hardware and browsers; no forced upgrades.
- Attention is a resource too: no engagement tricks.

**Ask:** What does this cost in energy, bandwidth and attention, and is it
worth it?
**Smells:** autoplay video backgrounds, 2 MB of fonts, a spinner that
animates forever in a background tab.

## 10. Good design is as little design as possible

**Meaning.** Less, but better — concentrate on the essential aspects so the
product isn't burdened with non-essentials. Back to purity, back to
simplicity.

**In software**
- Delete before you add. The best fix is often removing an element.
- One reusable mechanism instead of several one-off effects.
- Fewer screens, fewer options, fewer colors, fewer type sizes.
- Prefer an ordinary list over a new widget.

**Ask:** What can be removed without losing function?
**Smells:** three ways to do the same thing, bespoke component where a
standard one fits, decoration with no job.
