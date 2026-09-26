# JavaScript / TypeScript

Prefer the project's eslint/biome/prettier config. Check tools with `command -v`/`npx --no-install`; ask before installing.

- Lint: `npx eslint <paths>`; rules `complexity`, `max-lines-per-function`, `max-depth`, `max-params` if not configured (propose, don't write config unasked)
- Types: `npx tsc --noEmit`
- Format: `npx prettier --check <paths>` (or biome)
- Dead code/unused deps: `npx knip`
- Duplicates: `npx jscpd <paths>`
- Cycles/layering: `npx dependency-cruiser --validate`, `npx madge --circular <src>`
- Outdated/vulns: `npm outdated`, `npm audit` (or pnpm/yarn equivalents)
- Licenses: `npx license-checker --summary`
- Deprecated packages: `npm view <pkg> deprecated`
- Tests: the project's `test` script

## No-install fallback
A brace-counting scan finds long functions without a parser, but regex and template literals containing `//` or braces break it (a 7-line method can show as 460). Treat its numbers as hotspot hints only; open each hit and verify before reporting it.
- Function length + complexity without a parser package: `node ~/.claude/skills/huepattl-code-quality/scripts/jsfuncmetrics/jsfuncmetrics.mjs <dir|file> | sort -rn | head` (a tokenizer that knows strings, templates, comments and regex literals; skips vendor/ and *.min.js). Long functions with low complexity are usually markup templates — declarative, not the target.

## Refactoring browser code without unit tests
Classic `<script>` files (no modules) can still be checked old-against-new in Node:
- Load the file and its helper scripts into `vm.createContext` with a stub `document`/`window`, stub the methods that wire events or touch the DOM, call the render method on a fake container, and compare `innerHTML` byte for byte across many inputs (every state, empty fields, HTML to escape). Do the same for form readers with a fake `form.querySelector`, comparing `JSON.stringify` with `undefined` made visible.
- Split a big template by moving each section verbatim into its own function, cut at line starts so indentation travels with it; the rendered string then stays identical.
- Cache-busted script tags (`app.js?v=N`) need the version bumped for every changed file.
- Behaviour no e2e spec presses (keyboard shortcuts, rare branches) gets a spec first, run against the old code.
