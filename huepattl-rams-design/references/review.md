# Reviewing a UI

Use this after building or changing UI, and whenever asked to review a
design, screenshot, component or diff.

## Steps

1. **State the primary job** of the screen or flow in one sentence.
2. **Look at the real thing** where possible: run it, take a screenshot,
   click through states (empty, error, loading, long text, dark mode,
   keyboard-only, narrow width). A review of code alone misses most of
   principle 8.
3. **Check the project's design doc** and its recorded deviations; don't
   flag a documented deviation.
4. **Rate each principle** Strong / Adequate / Weak using the "Ask" line
   and smells in principles.md. Skip a principle only if it truly doesn't
   apply, and say so.
5. **Check the visual system**: raw colors or off-scale values, more than
   one accent element, status by color alone, shadows at rest, missing
   focus ring, contrast (run `scripts/contrast.py` for doubtful pairs).
6. **Pick the fixes**: at most three, most impactful first. Prefer fixes
   that remove something.

## Output format

```
Primary job: <one sentence>

| # | Principle | Rating | Note |
|---|---|---|---|
| 1 | Innovative | Adequate | … |
… (all ten)

Top fixes
1. <what to change> — <principle(s)> — <why it matters to the user>
2. …
3. …

Keep: <what already works and must survive the fixes>
Not checked: <states or platforms not looked at>
```

Keep notes to one line each. "Not checked" is required — an honest review
names its gaps (principle 6).
